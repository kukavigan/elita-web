import { Decimal } from '@prisma/client/runtime/library';
import { prisma } from '../config/prisma';
import { AppError } from '../middleware/errorHandler';

const FREE_SHIPPING_THRESHOLD = 60;
const STANDARD_SHIPPING = 3;
const TAX_RATE = 0.18;

function calcShipping(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
}

async function validateDiscount(code: string, subtotal: number) {
  const discount = await prisma.discountCode.findUnique({ where: { code: code.toUpperCase() } });
  if (!discount || !discount.active) {
    throw new AppError(400, 'Kodi i zbritjes nuk është i vlefshëm.', 'INVALID_DISCOUNT');
  }

  const now = new Date();
  if (discount.startsAt && discount.startsAt > now) {
    throw new AppError(400, 'Kodi i zbritjes nuk është aktiv ende.', 'DISCOUNT_NOT_STARTED');
  }
  if (discount.expiresAt && discount.expiresAt < now) {
    throw new AppError(400, 'Kodi i zbritjes ka skaduar.', 'DISCOUNT_EXPIRED');
  }
  if (discount.usageLimit !== null && discount.usageCount >= discount.usageLimit) {
    throw new AppError(400, 'Kodi i zbritjes ka arritur limitin e përdorimit.', 'DISCOUNT_EXHAUSTED');
  }
  if (discount.minOrderAmount && subtotal < Number(discount.minOrderAmount)) {
    throw new AppError(
      400,
      `Kodi i zbritjes kërkon një porosi minimale prej €${discount.minOrderAmount}.`,
      'DISCOUNT_MIN_NOT_MET',
    );
  }

  return discount;
}

interface OrderItemInput {
  productId: string;
  variantId?: string;
  quantity: number;
}

export const orderService = {
  async create(data: {
    userId?: string;
    customerEmail: string;
    customerPhone?: string;
    customerNotes?: string;
    shippingFirstName: string;
    shippingLastName: string;
    shippingCountry: string;
    shippingCity: string;
    shippingPostalCode: string;
    shippingAddress1: string;
    shippingAddress2?: string;
    shippingPhone?: string;
    paymentMethod: 'CASH_ON_DELIVERY' | 'BANK_TRANSFER';
    discountCode?: string;
    items: OrderItemInput[];
  }) {
    if (!data.items.length) {
      throw new AppError(400, 'Shporta juaj është bosh.', 'EMPTY_CART');
    }

    // ── Fetch products & validate inventory ──────────────────────────────
    const resolvedItems = await Promise.all(
      data.items.map(async item => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId, active: true },
          include: {
            images: { orderBy: { sortOrder: 'asc' }, take: 1 },
            variants: true,
          },
        });
        if (!product) {
          throw new AppError(400, `Produkti nuk u gjet.`, 'PRODUCT_NOT_FOUND');
        }

        let variantSku: string | undefined;
        let size: string | undefined;
        let color: string | undefined;
        let stockToCheck: number;

        if (item.variantId) {
          const variant = product.variants.find(v => v.id === item.variantId);
          if (!variant || !variant.active) {
            throw new AppError(400, `Varianti i produktit "${product.name}" nuk është i disponueshëm.`, 'VARIANT_UNAVAILABLE');
          }
          if (variant.stockQuantity < item.quantity) {
            throw new AppError(
              400,
              `Nuk ka stok të mjaftueshëm për "${product.name}". Disponueshëm: ${variant.stockQuantity}.`,
              'INSUFFICIENT_STOCK',
            );
          }
          variantSku = variant.sku;
          size = variant.size ?? undefined;
          color = variant.color ?? undefined;
          stockToCheck = variant.stockQuantity;
        } else {
          const totalStock = product.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
          if (totalStock < item.quantity) {
            throw new AppError(
              400,
              `Nuk ka stok të mjaftueshëm për "${product.name}". Disponueshëm: ${totalStock}.`,
              'INSUFFICIENT_STOCK',
            );
          }
          stockToCheck = totalStock;
        }

        const unitPrice = Number(product.price);
        return {
          productId: item.productId,
          variantId: item.variantId,
          productName: product.name,
          productSku: product.sku,
          variantSku,
          size,
          color,
          quantity: item.quantity,
          unitPrice,
          totalPrice: unitPrice * item.quantity,
          productImage: product.images[0]?.imageUrl,
          stockToCheck,
        };
      }),
    );

    // ── Server-side price calculation ─────────────────────────────────────
    const subtotal = resolvedItems.reduce((sum, i) => sum + i.totalPrice, 0);
    let discountAmount = 0;
    let discountCodeRecord: { id: string; usageCount: number } | null = null;

    if (data.discountCode) {
      const discount = await validateDiscount(data.discountCode, subtotal);
      discountCodeRecord = discount;
      discountAmount =
        discount.type === 'PERCENTAGE'
          ? (subtotal * Number(discount.value)) / 100
          : Math.min(subtotal, Number(discount.value));
    }

    const shippingCost = calcShipping(subtotal - discountAmount);
    const taxableAmount = subtotal - discountAmount;
    const tax = taxableAmount * TAX_RATE;
    const total = taxableAmount + shippingCost + tax;

    // ── Generate order number ─────────────────────────────────────────────
    const year = new Date().getFullYear();
    const countToday = await prisma.order.count();
    const orderNumber = `EL5-${year}-${String(countToday + 1).padStart(6, '0')}`;

    // ── Create order + reduce inventory in a transaction ─────────────────
    const order = await prisma.$transaction(async tx => {
      // Reduce stock
      for (const item of resolvedItems) {
        if (item.variantId) {
          const updated = await tx.productVariant.updateMany({
            where: {
              id: item.variantId,
              stockQuantity: { gte: item.quantity },
            },
            data: { stockQuantity: { decrement: item.quantity } },
          });
          if (updated.count === 0) {
            throw new AppError(400, `Stoku i "${item.productName}" ndryshoi gjatë checkout. Ju lutemi provoni përsëri.`, 'STOCK_CONFLICT');
          }
        }
      }

      // Increment discount usage
      if (discountCodeRecord) {
        await tx.discountCode.update({
          where: { id: discountCodeRecord.id },
          data: { usageCount: { increment: 1 } },
        });
      }

      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: data.userId ?? null,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          customerNotes: data.customerNotes,
          shippingFirstName: data.shippingFirstName,
          shippingLastName: data.shippingLastName,
          shippingCountry: data.shippingCountry,
          shippingCity: data.shippingCity,
          shippingPostalCode: data.shippingPostalCode,
          shippingAddress1: data.shippingAddress1,
          shippingAddress2: data.shippingAddress2,
          shippingPhone: data.shippingPhone,
          paymentMethod: data.paymentMethod,
          discountCode: data.discountCode?.toUpperCase(),
          subtotal,
          discount: discountAmount,
          shippingCost,
          tax,
          total,
          items: {
            create: resolvedItems.map(item => ({
              productId: item.productId,
              productName: item.productName,
              productSku: item.productSku,
              variantSku: item.variantSku,
              size: item.size,
              color: item.color,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.totalPrice,
              productImage: item.productImage,
            })),
          },
        },
        include: { items: true },
      });

      // Clear authenticated user's cart
      if (data.userId) {
        const cart = await tx.cart.findUnique({ where: { userId: data.userId } });
        if (cart) {
          await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
      }

      return newOrder;
    });

    return order;
  },

  async getById(id: string, userId?: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!order) throw new AppError(404, 'Porosia nuk u gjet.', 'NOT_FOUND');

    // Customers can only view their own orders
    if (userId && order.userId && order.userId !== userId) {
      throw new AppError(403, 'Qasja është e ndaluar.', 'FORBIDDEN');
    }

    return order;
  },

  async getByOrderNumber(orderNumber: string, userId?: string) {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });
    if (!order) throw new AppError(404, 'Porosia nuk u gjet.', 'NOT_FOUND');
    if (userId && order.userId && order.userId !== userId) {
      throw new AppError(403, 'Qasja është e ndaluar.', 'FORBIDDEN');
    }
    return order;
  },

  async getUserOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: { items: { take: 3 } },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getAdminOrders(query: {
    search?: string;
    orderStatus?: string;
    paymentStatus?: string;
    paymentMethod?: string;
    page?: string;
    limit?: string;
  }) {
    const page = Math.max(1, parseInt(query.page ?? '1', 10));
    const limit = Math.min(100, parseInt(query.limit ?? '20', 10));
    const skip = (page - 1) * limit;

    const where: import('@prisma/client').Prisma.OrderWhereInput = {};
    if (query.search) {
      where.OR = [
        { orderNumber: { contains: query.search, mode: 'insensitive' } },
        { customerEmail: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.orderStatus) where.orderStatus = query.orderStatus as never;
    if (query.paymentStatus) where.paymentStatus = query.paymentStatus as never;
    if (query.paymentMethod) where.paymentMethod = query.paymentMethod as never;

    const [total, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        include: { items: { take: 3 } },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },

  async updateStatus(orderId: string, data: {
    orderStatus?: string;
    paymentStatus?: string;
    trackingNumber?: string;
  }) {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new AppError(404, 'Porosia nuk u gjet.', 'NOT_FOUND');

    return prisma.order.update({
      where: { id: orderId },
      data: {
        ...(data.orderStatus ? { orderStatus: data.orderStatus as never } : {}),
        ...(data.paymentStatus ? { paymentStatus: data.paymentStatus as never } : {}),
        ...(data.trackingNumber !== undefined ? { trackingNumber: data.trackingNumber } : {}),
      },
      include: { items: true },
    });
  },

  async getDashboardStats() {
    const [totalOrders, totalRevenue, pendingOrders, confirmedOrders, recentOrders, lowStockVariants] =
      await Promise.all([
        prisma.order.count(),
        prisma.order.aggregate({
          _sum: { total: true },
          where: { paymentStatus: 'PAID' },
        }),
        prisma.order.count({ where: { orderStatus: 'PENDING' } }),
        prisma.order.count({ where: { orderStatus: 'CONFIRMED' } }),
        prisma.order.findMany({
          take: 10,
          orderBy: { createdAt: 'desc' },
          include: { items: { take: 1 } },
        }),
        prisma.productVariant.findMany({
          where: { stockQuantity: { lte: 5 }, active: true },
          include: { product: { select: { name: true, sku: true } } },
          orderBy: { stockQuantity: 'asc' },
          take: 10,
        }),
      ]);

    const totalCustomers = await prisma.user.count({ where: { role: 'CUSTOMER' } });

    return {
      totalOrders,
      totalRevenue: Number(totalRevenue._sum.total ?? 0),
      pendingOrders,
      confirmedOrders,
      totalCustomers,
      recentOrders,
      lowStockVariants,
    };
  },
};
