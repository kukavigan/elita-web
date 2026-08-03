import { Router } from 'express';
import { wishlistController } from '../controllers/wishlist.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', wishlistController.getWishlist as never);
router.post('/items', wishlistController.addItem as never);
router.delete('/items/:productId', wishlistController.removeItem as never);
router.post('/sync', wishlistController.sync as never);

export default router;
