import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { prisma } from '../config/prisma';
import { AppError } from './errorHandler';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export async function authenticate(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new AppError(401, 'Qasja është e ndaluar. Ju lutemi kyçuni.', 'UNAUTHORIZED');
    }

    const token = authHeader.substring(7);
    const payload = jwt.verify(token, config.jwt.secret) as JwtPayload;

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true },
    });

    if (!user) {
      throw new AppError(401, 'Sesioni juaj ka skaduar. Ju lutemi kyçuni përsëri.', 'SESSION_EXPIRED');
    }

    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (err) {
    if (err instanceof AppError) return next(err);
    if (err instanceof jwt.TokenExpiredError) {
      return next(new AppError(401, 'Sesioni juaj ka skaduar.', 'TOKEN_EXPIRED'));
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return next(new AppError(401, 'Token i pavlefshëm.', 'INVALID_TOKEN'));
    }
    next(err);
  }
}

export function requireAdmin(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return next(new AppError(403, 'Qasja është e ndaluar. Kërkohen të drejta administratori.', 'FORBIDDEN'));
  }
  next();
}

export function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return next();

  try {
    const token = authHeader.substring(7);
    const payload = jwt.verify(token, config.jwt.secret) as JwtPayload;
    req.user = { id: payload.userId, email: payload.email, role: payload.role };
  } catch {
    // silently ignore invalid token for optional auth
  }
  next();
}
