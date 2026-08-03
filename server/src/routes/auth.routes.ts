import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  addressSchema,
  newsletterSchema,
} from '../schemas/auth.schema';
import { prisma } from '../config/prisma';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// Public
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

// Protected
router.get('/me', authenticate, authController.getMe as never);
router.put('/me', authenticate, validate(updateProfileSchema), authController.updateProfile as never);
router.put('/me/password', authenticate, validate(changePasswordSchema), authController.changePassword as never);

// Addresses
router.get('/me/addresses', authenticate, authController.getAddresses as never);
router.post('/me/addresses', authenticate, validate(addressSchema), authController.createAddress as never);
router.put('/me/addresses/:addressId', authenticate, authController.updateAddress as never);
router.delete('/me/addresses/:addressId', authenticate, authController.deleteAddress as never);

// Newsletter (public)
router.post('/newsletter', validate(newsletterSchema), async (req, res, next) => {
  try {
    const { email } = req.body;
    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      if (existing.active) {
        return res.status(409).json({ error: 'Ky email është tashmë i abonuar.', code: 'ALREADY_SUBSCRIBED' });
      }
      await prisma.newsletterSubscriber.update({ where: { email }, data: { active: true } });
    } else {
      await prisma.newsletterSubscriber.create({ data: { email } });
    }
    res.json({ message: 'Faleminderit! Jeni abonuar me sukses.' });
  } catch (err) {
    next(err);
  }
});

export default router;
