import type { NextFunction, Request, Response } from 'express';
import { logger } from './pino-logger';
import { ZodError } from 'zod';
import status from 'http-status';

type AsyncControllerType = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export function asyncHandler(controller: AsyncControllerType): AsyncControllerType {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue: any) => ({
          message: `${issue.path.join('.')} is ${issue.message}`,
        }));
        res
          .status(status.BAD_REQUEST)
          .json({ error: 'Invalid data', details: errorMessages });
      } else {
        next(error);
      }
      logger.error(error);
    }
  };
}
