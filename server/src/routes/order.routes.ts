import { Router } from 'express';
import { orderController } from '../controllers/order.controller';
import { authenticate, requireAdmin, optionalAuth } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createOrderSchema, updateOrderStatusSchema } from '../schemas/order.schema';

const router = Router();

// Public: validate discount code
router.post('/discount/validate', orderController.validateDiscount);

// Authenticated order creation (uses DB cart for auth users, guestItems for guests)
router.post('/', optionalAuth, validate(createOrderSchema), orderController.createOrder as never);

// Auth required: get own orders
router.get('/my', authenticate, orderController.getMyOrders as never);
router.get('/number/:orderNumber', optionalAuth, orderController.getOrderByNumber as never);
router.get('/:id', optionalAuth, orderController.getOrder as never);

// Admin only
router.get('/admin/all', authenticate, requireAdmin, orderController.adminGetOrders as never);
router.get('/admin/stats', authenticate, requireAdmin, orderController.getDashboardStats as never);
router.put('/admin/:id', authenticate, requireAdmin, validate(updateOrderStatusSchema), orderController.adminUpdateOrder as never);

export default router;
