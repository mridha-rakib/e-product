import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { MongoServerError } from 'mongodb';
import { Error as MongooseError } from 'mongoose';
import { EHttpStatus } from '@/enums/http-status.enum';
import process from 'process';

interface CustomError extends Error {
  status?: number;
  statusCode?: number;
  code?: number;
  keyValue?: Record<string, any>;
  errors?: Record<string, any>;
}

export const errorLogger = (err: CustomError, req: Request, res: Response) => {
  const error = {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    status: EHttpStatus.INTERNAL_SERVER_ERROR,
    success: false,
    errorMessages: [] as Array<{ path: string; message: string }>,
  };

  if (err instanceof ZodError) {
    error.status = EHttpStatus.BAD_REQUEST;
    error.name = 'ValidationError';
    error.message = 'Validation failed';
    error.errorMessages = err.issues.map(issue => ({
      path: issue.path.join('.') || 'unknown',
      message: issue.message,
    }));
  } else if (err.code === 11000) {
    error.status = EHttpStatus.CONFLICT;
    error.name = 'DuplicateError';
    const field = Object.keys(err.keyValue || {})[0];
    error.message = `${field} already exists`;
    error.errorMessages = [
      {
        path: field || 'unknown',
        message: `${field} must be unique`,
      },
    ];
  } else if (err instanceof MongoServerError) {
    error.status = EHttpStatus.BAD_REQUEST;
    error.message = "Query don't match";
    error.errorMessages = [
      {
        path: '/api/v1/category',
        message: err.message,
      },
    ];
  } else if (err instanceof MongooseError.ValidationError) {
    error.status = EHttpStatus.BAD_REQUEST;
    error.name = 'ValidationError';
    error.message = 'Validation failed';
    error.errorMessages = Object.values(err.errors).map((val: any) => ({
      path: val.path,
      message: val.message,
    }));
  } else if (err instanceof MongooseError.CastError) {
    error.status = EHttpStatus.BAD_REQUEST;
    error.name = 'CastError';
    error.message = `Invalid ${err.path}: ${err.value}`;
    error.errorMessages = [
      {
        path: err.path,
        message: `Invalid ${err.path}`,
      },
    ];
  } else if (err.status || err.statusCode) {
    error.status = err.status || err.statusCode || EHttpStatus.INTERNAL_SERVER_ERROR;
    error.errorMessages = [
      {
        path: req.originalUrl,
        message: err.message,
      },
    ];
  } else {
    error.errorMessages = [
      {
        path: req.originalUrl,
        message: err.message || 'Internal server error',
      },
    ];
  }

  req.log.error({
    error: {
      name: error.name,
      message: error.message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method,
    },
  });

  if (process.env.NODE_ENV === 'production' && error.status >= 500) {
    error.message = 'Internal server error';
    error.errorMessages = [
      {
        path: req.originalUrl,
        message: 'Something went wrong',
      },
    ];
  }

  return res.status(error.status).json({
    success: error.success,
    message: error.message,
    errorMessages: error.errorMessages,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
  });
};
