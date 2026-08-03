import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { AuthenticatedRequest } from '../middleware/auth';
import { param } from '../utils/helpers';

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { firstName, lastName, email, password, phone } = req.body;
      const result = await authService.register({ firstName, lastName, email, password, phone });
      res.status(201).json(result);
    } catch (err) { next(err); }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json(result);
    } catch (err) { next(err); }
  },

  async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = await authService.getMe(req.user!.id);
      res.json(user);
    } catch (err) { next(err); }
  },

  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { firstName, lastName, phone } = req.body;
      const user = await authService.updateProfile(req.user!.id, { firstName, lastName, phone });
      res.json(user);
    } catch (err) { next(err); }
  },

  async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { currentPassword, newPassword } = req.body;
      await authService.changePassword(req.user!.id, currentPassword, newPassword);
      res.json({ message: 'Fjalëkalimi u ndryshua me sukses.' });
    } catch (err) { next(err); }
  },

  async getAddresses(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { prisma } = await import('../config/prisma');
      const addresses = await prisma.address.findMany({
        where: { userId: req.user!.id },
        orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
      });
      res.json(addresses);
    } catch (err) { next(err); }
  },

  async createAddress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { prisma } = await import('../config/prisma');
      if (req.body.isDefault) {
        await prisma.address.updateMany({ where: { userId: req.user!.id }, data: { isDefault: false } });
      }
      const address = await prisma.address.create({ data: { ...req.body, userId: req.user!.id } });
      res.status(201).json(address);
    } catch (err) { next(err); }
  },

  async updateAddress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { prisma } = await import('../config/prisma');
      const { AppError } = await import('../middleware/errorHandler');
      const addressId = param(req.params.addressId);
      const existing = await prisma.address.findFirst({ where: { id: addressId, userId: req.user!.id } });
      if (!existing) throw new AppError(404, 'Adresa nuk u gjet.', 'NOT_FOUND');
      if (req.body.isDefault) {
        await prisma.address.updateMany({ where: { userId: req.user!.id }, data: { isDefault: false } });
      }
      const address = await prisma.address.update({ where: { id: addressId }, data: req.body });
      res.json(address);
    } catch (err) { next(err); }
  },

  async deleteAddress(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { prisma } = await import('../config/prisma');
      const { AppError } = await import('../middleware/errorHandler');
      const addressId = param(req.params.addressId);
      const existing = await prisma.address.findFirst({ where: { id: addressId, userId: req.user!.id } });
      if (!existing) throw new AppError(404, 'Adresa nuk u gjet.', 'NOT_FOUND');
      await prisma.address.delete({ where: { id: addressId } });
      res.status(204).end();
    } catch (err) { next(err); }
  },
};
