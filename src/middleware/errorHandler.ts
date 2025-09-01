import { Request, Response, NextFunction } from 'express';

function errorLogger(error: Error, req: Request, res: Response, next: NextFunction) {
  console.error(error.message);
  next(error);
}

function dbErrorHandler(error : Error, req: Request, res: Response, next: NextFunction) {
  const { ConnectionError, ValidationError, DatabaseError } = require('sequelize');
  if (error instanceof ConnectionError) return res.sendStatus(503);
  else if (error instanceof ValidationError) return res.sendStatus(409);
  else if (error instanceof DatabaseError) return res.sendStatus(500);
  else next(error);
}

function serverErrorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  return res.sendStatus(500);
}

export default [errorLogger, dbErrorHandler, serverErrorHandler];
