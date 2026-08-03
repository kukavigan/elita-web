import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/product.service';
import { AuthenticatedRequest } from '../middleware/auth';
import { param } from '../utils/helpers';

export const productController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await productService.getAll(req.query as Record<string, string>);
      res.json(result);
    } catch (err) { next(err); }
  },

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await productService.getBySlug(param(req.params.slug));
      res.json(product);
    } catch (err) { next(err); }
  },

  async getFeatured(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(param(req.query.limit as string | undefined), 10) || 8;
      res.json(await productService.getFeatured(limit));
    } catch (err) { next(err); }
  },

  async getBestSellers(_req: Request, res: Response, next: NextFunction) {
    try { res.json(await productService.getBestSellers()); } catch (err) { next(err); }
  },

  async getNewArrivals(_req: Request, res: Response, next: NextFunction) {
    try { res.json(await productService.getNewArrivals()); } catch (err) { next(err); }
  },

  async getLimited(_req: Request, res: Response, next: NextFunction) {
    try { res.json(await productService.getLimited()); } catch (err) { next(err); }
  },

  async getRelated(req: Request, res: Response, next: NextFunction) {
    try {
      const { productId, categoryId } = req.params;
      res.json(await productService.getRelated(param(productId), param(categoryId) === 'none' ? null : param(categoryId)));
    } catch (err) { next(err); }
  },

  async adminGetAll(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await productService.getAdminAll(req.query as Record<string, string>);
      res.json(result);
    } catch (err) { next(err); }
  },

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const product = await productService.create(req.body);
      res.status(201).json(product);
    } catch (err) { next(err); }
  },

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const product = await productService.update(param(req.params.id), req.body);
      res.json(product);
    } catch (err) { next(err); }
  },

  async addImage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { imageUrl, altText, sortOrder } = req.body;
      const image = await productService.addImage(param(req.params.productId), imageUrl, altText, sortOrder);
      res.status(201).json(image);
    } catch (err) { next(err); }
  },

  async deleteImage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await productService.deleteImage(param(req.params.imageId));
      res.status(204).end();
    } catch (err) { next(err); }
  },

  async addVariant(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const variant = await productService.addVariant(param(req.params.productId), req.body);
      res.status(201).json(variant);
    } catch (err) { next(err); }
  },

  async updateVariant(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const variant = await productService.updateVariant(param(req.params.variantId), req.body);
      res.json(variant);
    } catch (err) { next(err); }
  },

  async deleteVariant(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await productService.deleteVariant(param(req.params.variantId));
      res.status(204).end();
    } catch (err) { next(err); }
  },

  async getCategories(_req: Request, res: Response, next: NextFunction) {
    try {
      const { prisma } = await import('../config/prisma');
      const categories = await prisma.category.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
      res.json(categories);
    } catch (err) { next(err); }
  },

  async getCollections(_req: Request, res: Response, next: NextFunction) {
    try {
      const { prisma } = await import('../config/prisma');
      const collections = await prisma.collection.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
      res.json(collections);
    } catch (err) { next(err); }
  },
};
