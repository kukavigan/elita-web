import { Response, NextFunction } from 'express';
import { wishlistService } from '../services/wishlist.service';
import { AuthenticatedRequest } from '../middleware/auth';
import { param } from '../utils/helpers';

export const wishlistController = {
  async getWishlist(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const wishlist = await wishlistService.getOrCreate(req.user!.id);
      res.json(wishlist);
    } catch (err) { next(err); }
  },

  async addItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const wishlist = await wishlistService.addItem(req.user!.id, req.body.productId);
      res.status(201).json(wishlist);
    } catch (err) { next(err); }
  },

  async removeItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const wishlist = await wishlistService.removeItem(req.user!.id, param(req.params.productId));
      res.json(wishlist);
    } catch (err) { next(err); }
  },

  async sync(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const wishlist = await wishlistService.sync(req.user!.id, req.body.productIds);
      res.json(wishlist);
    } catch (err) { next(err); }
  },
};
