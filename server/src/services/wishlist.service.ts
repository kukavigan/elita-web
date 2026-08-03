import { prisma } from '../config/prisma';
import { AppError } from '../middleware/errorHandler';

export const wishlistService = {
  async getOrCreate(userId: string) {
    let wishlist = await prisma.wishlist.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { orderBy: { sortOrder: 'asc' }, take: 1 },
                variants: { where: { active: true } },
                category: { select: { name: true, slug: true } },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!wishlist) {
      wishlist = await prisma.wishlist.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { orderBy: { sortOrder: 'asc' }, take: 1 },
                  variants: { where: { active: true } },
                  category: { select: { name: true, slug: true } },
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    }

    return wishlist;
  },

  async addItem(userId: string, productId: string) {
    const product = await prisma.product.findUnique({ where: { id: productId, active: true } });
    if (!product) throw new AppError(404, 'Produkti nuk u gjet.', 'NOT_FOUND');

    const wishlist = await this.getOrCreate(userId);

    const existing = await prisma.wishlistItem.findUnique({
      where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
    });
    if (existing) return this.getOrCreate(userId);

    await prisma.wishlistItem.create({ data: { wishlistId: wishlist.id, productId } });
    return this.getOrCreate(userId);
  },

  async removeItem(userId: string, productId: string) {
    const wishlist = await this.getOrCreate(userId);
    await prisma.wishlistItem.deleteMany({
      where: { wishlistId: wishlist.id, productId },
    });
    return this.getOrCreate(userId);
  },

  async sync(userId: string, productIds: string[]) {
    for (const productId of productIds) {
      try {
        await this.addItem(userId, productId);
      } catch {
        // Skip items not found
      }
    }
    return this.getOrCreate(userId);
  },
};
