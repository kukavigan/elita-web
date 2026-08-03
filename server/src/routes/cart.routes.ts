import { Router } from 'express';
import { cartController } from '../controllers/cart.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', cartController.getCart as never);
router.post('/items', cartController.addItem as never);
router.put('/items/:itemId', cartController.updateItem as never);
router.delete('/items/:itemId', cartController.removeItem as never);
router.delete('/', cartController.clearCart as never);
router.post('/sync', cartController.syncCart as never);

export default router;
