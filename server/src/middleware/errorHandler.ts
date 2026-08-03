import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function notFound(req: Request, _res: Response, next: NextFunction) {
  next(new AppError(404, `Rruga '${req.originalUrl}' nuk u gjet.`));
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  // Zod validation errors
  if (err instanceof ZodError) {
    const messages = err.errors.map(e => e.message);
    return res.status(400).json({
      error: 'Të dhënat e dhëna janë të pavlefshme.',
      messages,
      code: 'VALIDATION_ERROR',
    });
  }

  // App-level errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
  }

  // Prisma unique constraint violations
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const fields = (err.meta?.target as string[]) ?? [];
      if (fields.includes('email')) {
        return res.status(409).json({
          error: 'Kjo adresë emaili është tashmë e regjistruar.',
          code: 'EMAIL_EXISTS',
        });
      }
      if (fields.includes('sku')) {
        return res.status(409).json({
          error: 'Ky SKU ekziston tashmë.',
          code: 'SKU_EXISTS',
        });
      }
      return res.status(409).json({
        error: 'Ky rekord ekziston tashmë.',
        code: 'DUPLICATE',
      });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({
        error: 'Rekordi nuk u gjet.',
        code: 'NOT_FOUND',
      });
    }
  }

  // Generic server error — never leak internals
  console.error('[Server Error]', err);
  return res.status(500).json({
    error: 'Gabim i brendshëm i serverit. Ju lutemi provoni përsëri.',
    code: 'SERVER_ERROR',
  });
}
