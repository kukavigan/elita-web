import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export function validate(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const messages = err.errors.map(e => ({
          field: e.path.slice(1).join('.'),
          message: e.message,
        }));
        return res.status(400).json({
          error: 'Të dhënat e dhëna janë të pavlefshme.',
          messages,
          code: 'VALIDATION_ERROR',
        });
      }
      next(err);
    }
  };
}
