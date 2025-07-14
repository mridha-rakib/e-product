import { ErrorRequestHandler, Response } from 'express';
import z, { ZodError } from 'zod';
import { logger } from './pino-logger';
import status from 'http-status';
import { ErrorCodeEnum } from '@/enums/error-code.enum';
import { AppError } from '@/utils/error-handler.utils';

const formatZodError = (res: Response, error: z.ZodError) => {
  const errors = error?.issues?.map((err: any) => ({
    field: err.path.join('.'),
    message: err.message,
  }));
  return res.status(status.BAD_REQUEST).json({
    message: 'Validation failed',
    errors: errors,
    errorCode: ErrorCodeEnum.VALIDATION_ERROR,
  });
};

export const errorHandler: ErrorRequestHandler = (error, req, res, next): any => {
  logger.error(`Error Occurred on PATH: ${req.path} `, error);

  if (error instanceof SyntaxError) {
    return res.status(status.BAD_REQUEST).json({
      message: 'Invalid JSON format. Please check your request body.',
    });
  }
  if (error instanceof ZodError) {
    return formatZodError(res, error);
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      errorCode: error.errorCode,
    });
  }

  return res.status(status.INTERNAL_SERVER_ERROR).json({
    message: 'Internal Server Error',
    error: error?.message || 'Unknown error occurred',
  });
};
