import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { LogFactory } from '../utils/log-factory';
import ApiError from './api-error';

const errors: Record<number, string> = {
  400: 'Bad Request',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  500: 'Internal Server Error',
};

export const errorConverter = (err: any, _req: Request, _res: Response, next: NextFunction) => {
  let error = err;
  const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  const message: string = error.message || 'Some error occurred';
  error = new ApiError(statusCode, message, err.stack);
  next(error);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: ApiError, _req: Request, res: Response, _next: NextFunction) => {
  const { statusCode, message } = err;
  res.locals['errorMessage'] = err.message;

  const response = {
    error: errors[statusCode] ?? '',
    message,
    ...(process.env.ENV !== 'prod' && { stack: err.stack }),
  };

  LogFactory.error(`ERROR::: ${err.message}\n${err.statusCode}\n${err.stack}`);
  res.status(statusCode).json(response);
};