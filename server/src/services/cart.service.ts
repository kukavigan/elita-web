import { prisma } from '../config/prisma';
import { AppError } from '../middleware/errorHandler';

export const cartService = {
  async getOrCreate(userId: string) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { orderBy: { sortOrder: 'asc' }, take: 1 },
                variants: { where: { active: true } },
              },
            },
            variant: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { orderBy: { sortOrder: 'asc' }, take: 1 },
                  variants: { where: { active: true } },
                },
              },
              variant: true,
            },
          },
        },
      });
    }

    return cart;
  },

  async addItem(userId: string, productId: string, variantId: string | undefined, quantity: number) {
    const cart = await this.getOrCreate(userId);

    // Validate product
    const product = await prisma.product.findUnique({
      where: { id: productId, active: true },
      include: { variants: { where: { active: true } } },
    });
    if (!product) throw new AppError(404, 'Produkti nuk u gjet.', 'NOT_FOUND');

    // Validate variant + stock
    if (variantId) {
      const variant = product.variants.find(v => v.id === variantId);
      if (!variant) throw new AppError(400, 'Varianti nuk u gjet.', 'VARIANT_NOT_FOUND');
      if (variant.stockQuantity < quantity) {
        throw new AppError(400, `Nuk ka stok të mjaftueshëm. Disponueshëm: ${variant.stockQuantity}.`, 'INSUFFICIENT_STOCK');
      }
    }

    const price = product.price;

    // Check if item already in cart
    const existing = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId, variantId: variantId ?? null },
    });

    if (existing) {
      return prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity, price },
        include: { product: { include: { images: { take: 1, orderBy: { sortOrder: 'asc' } }, variants: true } }, variant: true },
      });
    }

    return prisma.cartItem.create({
      data: { cartId: cart.id, productId, variantId: variantId ?? null, quantity, price },
      include: { product: { include: { images: { take: 1, orderBy: { sortOrder: 'asc' } }, variants: true } }, variant: true },
    });
  },

  async updateItem(userId: string, itemId: string, quantity: number) {
    const cart = await this.getOrCreate(userId);
    const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
    if (!item) throw new AppError(404, 'Artikulli nuk u gjet në shportë.', 'NOT_FOUND');

    if (item.variantId) {
      const variant = await prisma.productVariant.findUnique({ where: { id: item.variantId } });
      if (variant && variant.stockQuantity < quantity) {
        throw new AppError(400, `Nuk ka stok të mjaftueshëm. Disponueshëm: ${variant.stockQuantity}.`, 'INSUFFICIENT_STOCK');
      }
    }

    return prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
  },

  async removeItem(userId: string, itemId: string) {
    const cart = await this.getOrCreate(userId);
    const item = await prisma.cartItem.findFirst({ where: { id: itemId, cartId: cart.id } });
    if (!item) throw new AppError(404, 'Artikulli nuk u gjet në shportë.', 'NOT_FOUND');
    return prisma.cartItem.delete({ where: { id: itemId } });
  },

  async clear(userId: string) {
    const cart = await this.getOrCreate(userId);
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  },

  async syncGuestCart(userId: string, guestItems: { productId: string; variantId?: string; quantity: number }[]) {
    for (const item of guestItems) {
      try {
        await this.addItem(userId, item.productId, item.variantId, item.quantity);
      } catch {
        // Skip items that fail (out of stock, not found)
      }
    }
    return this.getOrCreate(userId);
  },
};
