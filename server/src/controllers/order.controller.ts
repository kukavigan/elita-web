import { Request, Response, NextFunction } from 'express';
import { orderService } from '../services/order.service';
import { AuthenticatedRequest } from '../middleware/auth';
import { param } from '../utils/helpers';

export const orderController = {
  async createOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      let items: { productId: string; variantId?: string; quantity: number }[] = [];

      if (userId) {
        const { cartService } = await import('../services/cart.service');
        const cart = await cartService.getOrCreate(userId);
        items = cart.items.map(i => ({
          productId: i.productId,
          variantId: i.variantId ?? undefined,
          quantity: i.quantity,
        }));
      } else {
        items = req.body.guestItems ?? [];
      }

      const order = await orderService.create({ ...req.body, userId, items });
      res.status(201).json(order);
    } catch (err) { next(err); }
  },

  async getOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const order = await orderService.getById(param(req.params.id), req.user?.id);
      res.json(order);
    } catch (err) { next(err); }
  },

  async getOrderByNumber(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const order = await orderService.getByOrderNumber(param(req.params.orderNumber), req.user?.id);
      res.json(order);
    } catch (err) { next(err); }
  },

  async getMyOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const orders = await orderService.getUserOrders(req.user!.id);
      res.json(orders);
    } catch (err) { next(err); }
  },

  async validateDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, subtotal } = req.body;
      const { prisma } = await import('../config/prisma');
      const { AppError } = await import('../middleware/errorHandler');

      const discount = await prisma.discountCode.findUnique({ where: { code: String(code).toUpperCase() } });
      if (!discount || !discount.active) throw new AppError(400, 'Kodi i zbritjes nuk është i vlefshëm.', 'INVALID_DISCOUNT');

      const now = new Date();
      if (discount.startsAt && discount.startsAt > now) throw new AppError(400, 'Kodi nuk është aktiv ende.', 'DISCOUNT_NOT_STARTED');
      if (discount.expiresAt && discount.expiresAt < now) throw new AppError(400, 'Kodi ka skaduar.', 'DISCOUNT_EXPIRED');
      if (discount.usageLimit !== null && discount.usageCount >= discount.usageLimit) throw new AppError(400, 'Kodi ka arritur limitin.', 'DISCOUNT_EXHAUSTED');
      if (discount.minOrderAmount && Number(subtotal) < Number(discount.minOrderAmount)) {
        throw new AppError(400, `Kodi kërkon porosi minimale prej €${discount.minOrderAmount}.`, 'DISCOUNT_MIN_NOT_MET');
      }

      const discountAmount = discount.type === 'PERCENTAGE'
        ? (Number(subtotal) * Number(discount.value)) / 100
        : Math.min(Number(subtotal), Number(discount.value));

      res.json({ valid: true, code: discount.code, type: discount.type, value: Number(discount.value), discountAmount, description: discount.description });
    } catch (err) { next(err); }
  },

  async adminGetOrders(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await orderService.getAdminOrders(req.query as Record<string, string>);
      res.json(result);
    } catch (err) { next(err); }
  },

  async adminUpdateOrder(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const order = await orderService.updateStatus(param(req.params.id), req.body);
      res.json(order);
    } catch (err) { next(err); }
  },

  async getDashboardStats(_req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const stats = await orderService.getDashboardStats();
      res.json(stats);
    } catch (err) { next(err); }
  },
};
