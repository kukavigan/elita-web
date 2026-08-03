import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../middleware/errorHandler';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[äáâàã]/g, 'a')
    .replace(/[ëéêè]/g, 'e')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const productInclude = {
  images: { orderBy: { sortOrder: 'asc' as const } },
  variants: { where: { active: true }, orderBy: { sku: 'asc' as const } },
  category: { select: { id: true, name: true, slug: true } },
  collection: { select: { id: true, name: true, slug: true } },
} satisfies Prisma.ProductInclude;

export const productService = {
  async getAll(query: {
    search?: string;
    category?: string;
    collection?: string;
    size?: string;
    color?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: string;
    page?: string;
    limit?: string;
    featured?: string;
    bestSeller?: string;
    newArrival?: string;
    limitedEdition?: string;
    badge?: string;
  }) {
    const page = Math.max(1, parseInt(query.page ?? '1', 10));
    const limit = Math.min(48, Math.max(1, parseInt(query.limit ?? '24', 10)));
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = { active: true };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { shortDescription: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.category) {
      where.category = { slug: query.category };
    }

    if (query.collection) {
      where.collection = { slug: query.collection };
    }

    if (query.minPrice || query.maxPrice) {
      where.price = {};
      if (query.minPrice) where.price.gte = parseFloat(query.minPrice);
      if (query.maxPrice) where.price.lte = parseFloat(query.maxPrice);
    }

    if (query.badge) {
      switch (query.badge) {
        case 'new': where.newArrival = true; break;
        case 'bestseller': where.bestSeller = true; break;
        case 'limited': where.limitedEdition = true; break;
        case 'featured': where.featured = true; break;
      }
    }

    if (query.featured === 'true') where.featured = true;
    if (query.bestSeller === 'true') where.bestSeller = true;
    if (query.newArrival === 'true') where.newArrival = true;
    if (query.limitedEdition === 'true') where.limitedEdition = true;

    if (query.size) {
      const sizeEnum = query.size.toUpperCase() as never;
      where.variants = { some: { size: sizeEnum, active: true, stockQuantity: { gt: 0 } } };
    }

    if (query.color) {
      const colorFilter = { some: { color: { contains: query.color, mode: 'insensitive' as const }, active: true } };
      if (where.variants && 'some' in where.variants) {
        // merge — already filtered by size, add color
      } else {
        where.variants = colorFilter;
      }
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    switch (query.sort) {
      case 'price_asc': orderBy = { price: 'asc' }; break;
      case 'price_desc': orderBy = { price: 'desc' }; break;
      case 'newest': orderBy = { createdAt: 'desc' }; break;
      case 'oldest': orderBy = { createdAt: 'asc' }; break;
      case 'name_asc': orderBy = { name: 'asc' }; break;
      case 'name_desc': orderBy = { name: 'desc' }; break;
    }

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: productInclude,
        orderBy,
        skip,
        take: limit,
      }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    };
  },

  async getBySlug(slug: string) {
    const product = await prisma.product.findFirst({
      where: { slug, active: true },
      include: {
        ...productInclude,
        reviews: {
          where: { status: 'APPROVED' },
          include: {
            user: { select: { firstName: true, lastName: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });
    if (!product) throw new AppError(404, 'Produkti nuk u gjet.', 'NOT_FOUND');
    return product;
  },

  async getRelated(productId: string, categoryId: string | null, limit = 4) {
    return prisma.product.findMany({
      where: {
        active: true,
        id: { not: productId },
        ...(categoryId ? { categoryId } : {}),
      },
      include: productInclude,
      take: limit,
      orderBy: { bestSeller: 'desc' },
    });
  },

  async getFeatured(limit = 8) {
    return prisma.product.findMany({
      where: { active: true, featured: true },
      include: productInclude,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  async getBestSellers(limit = 8) {
    return prisma.product.findMany({
      where: { active: true, bestSeller: true },
      include: productInclude,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  async getNewArrivals(limit = 8) {
    return prisma.product.findMany({
      where: { active: true, newArrival: true },
      include: productInclude,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  async getLimited(limit = 8) {
    return prisma.product.findMany({
      where: { active: true, limitedEdition: true },
      include: productInclude,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  },

  async create(data: {
    name: string;
    slug?: string;
    shortDescription?: string;
    description?: string;
    price: number;
    originalPrice?: number;
    sku: string;
    categoryId?: string;
    collectionId?: string;
    featured?: boolean;
    bestSeller?: boolean;
    newArrival?: boolean;
    limitedEdition?: boolean;
    active?: boolean;
    materials?: string;
    careInstructions?: string;
  }) {
    const slug = data.slug ?? generateSlug(data.name);
    return prisma.product.create({
      data: {
        ...data,
        slug,
        price: data.price,
        originalPrice: data.originalPrice ?? null,
      },
      include: productInclude,
    });
  },

  async update(id: string, data: Partial<{
    name: string;
    shortDescription: string;
    description: string;
    price: number;
    originalPrice: number | null;
    categoryId: string | null;
    collectionId: string | null;
    featured: boolean;
    bestSeller: boolean;
    newArrival: boolean;
    limitedEdition: boolean;
    active: boolean;
    materials: string;
    careInstructions: string;
  }>) {
    await this.findById(id);
    return prisma.product.update({
      where: { id },
      data,
      include: productInclude,
    });
  },

  async findById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: productInclude,
    });
    if (!product) throw new AppError(404, 'Produkti nuk u gjet.', 'NOT_FOUND');
    return product;
  },

  async addImage(productId: string, imageUrl: string, altText?: string, sortOrder = 0) {
    await this.findById(productId);
    return prisma.productImage.create({
      data: { productId, imageUrl, altText, sortOrder },
    });
  },

  async deleteImage(imageId: string) {
    return prisma.productImage.delete({ where: { id: imageId } });
  },

  async addVariant(productId: string, data: {
    size?: string;
    color?: string;
    colorHex?: string;
    sku: string;
    stockQuantity: number;
    active?: boolean;
  }) {
    await this.findById(productId);
    return prisma.productVariant.create({
      data: {
        productId,
        size: data.size as never,
        color: data.color,
        colorHex: data.colorHex,
        sku: data.sku,
        stockQuantity: data.stockQuantity,
        active: data.active ?? true,
      },
    });
  },

  async updateVariant(variantId: string, data: {
    stockQuantity?: number;
    active?: boolean;
    color?: string;
    colorHex?: string;
  }) {
    return prisma.productVariant.update({
      where: { id: variantId },
      data,
    });
  },

  async deleteVariant(variantId: string) {
    return prisma.productVariant.delete({ where: { id: variantId } });
  },

  async getAdminAll(query: { search?: string; category?: string; active?: string; page?: string; limit?: string }) {
    const page = Math.max(1, parseInt(query.page ?? '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(query.limit ?? '20', 10)));
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { sku: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.category) where.category = { slug: query.category };
    if (query.active !== undefined) where.active = query.active === 'true';

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: productInclude,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      products,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  },
};
