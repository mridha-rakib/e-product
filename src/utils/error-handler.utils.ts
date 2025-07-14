import { EHttpStatus } from '@/enums/http-status.enum';

export class AppError extends Error {
  public status: number;
  public isOperational: boolean;

  constructor(
    message: string,
    status: EHttpStatus = EHttpStatus.INTERNAL_SERVER_ERROR,
    isOperational = true
  ) {
    super(message);
    this.status = status;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleError = (
  message: string,
  status: EHttpStatus = EHttpStatus.INTERNAL_SERVER_ERROR
) => {
  throw new AppError(message, status);
};

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, EHttpStatus.BAD_REQUEST);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, EHttpStatus.NOT_FOUND);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(message, EHttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden access') {
    super(message, EHttpStatus.FORBIDDEN);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, EHttpStatus.CONFLICT);
  }
}
