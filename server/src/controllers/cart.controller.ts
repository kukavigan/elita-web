import { Response, NextFunction } from 'express';
import { cartService } from '../services/cart.service';
import { AuthenticatedRequest } from '../middleware/auth';
import { param } from '../utils/helpers';

export const cartController = {
  async getCart(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const cart = await cartService.getOrCreate(req.user!.id);
      res.json(cart);
    } catch (err) { next(err); }
  },

  async addItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { productId, variantId, quantity } = req.body;
      const item = await cartService.addItem(req.user!.id, productId, variantId, quantity);
      res.status(201).json(item);
    } catch (err) { next(err); }
  },

  async updateItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const item = await cartService.updateItem(req.user!.id, param(req.params.itemId), req.body.quantity);
      res.json(item);
    } catch (err) { next(err); }
  },

  async removeItem(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await cartService.removeItem(req.user!.id, param(req.params.itemId));
      res.status(204).end();
    } catch (err) { next(err); }
  },

  async clearCart(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await cartService.clear(req.user!.id);
      res.status(204).end();
    } catch (err) { next(err); }
  },

  async syncCart(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const cart = await cartService.syncGuestCart(req.user!.id, req.body.items);
      res.json(cart);
    } catch (err) { next(err); }
  },
};
