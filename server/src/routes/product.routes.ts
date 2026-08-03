import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { authenticate, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createProductSchema, updateProductSchema, createVariantSchema, updateVariantSchema } from '../schemas/product.schema';

const router = Router();

// Public product routes
router.get('/', productController.getAll);
router.get('/featured', productController.getFeatured);
router.get('/best-sellers', productController.getBestSellers);
router.get('/new-arrivals', productController.getNewArrivals);
router.get('/limited', productController.getLimited);
router.get('/categories', productController.getCategories);
router.get('/collections', productController.getCollections);
router.get('/related/:productId/:categoryId', productController.getRelated);
router.get('/:slug', productController.getBySlug);

// Admin product routes
router.get('/admin/all', authenticate, requireAdmin, productController.adminGetAll);
router.post('/', authenticate, requireAdmin, validate(createProductSchema), productController.create);
router.put('/:id', authenticate, requireAdmin, validate(updateProductSchema), productController.update);

// Admin image routes
router.post('/:productId/images', authenticate, requireAdmin, productController.addImage);
router.delete('/images/:imageId', authenticate, requireAdmin, productController.deleteImage);

// Admin variant routes
router.post('/:productId/variants', authenticate, requireAdmin, validate(createVariantSchema), productController.addVariant);
router.put('/variants/:variantId', authenticate, requireAdmin, validate(updateVariantSchema), productController.updateVariant);
router.delete('/variants/:variantId', authenticate, requireAdmin, productController.deleteVariant);

export default router;
