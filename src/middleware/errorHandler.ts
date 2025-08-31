import { Request, Response, NextFunction } from 'express';

function errorLogger(error: Error, req: Request, res: Response, next: NextFunction) {
  console.error(error.message);
  next(error);
}

function serverErrorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  return res.sendStatus(500);
}

export default [errorLogger, serverErrorHandler];
