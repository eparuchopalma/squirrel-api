import { Request, Response, NextFunction } from 'express-serve-static-core';

function privateAuth(req: Request, res: Response, next: NextFunction) {
  return res.sendStatus(401);
};

function publicAuth(req: Request, res: Response, next: NextFunction) {
  req.body = { ...req.body, user_id: process.env.DEMO_USER! };
  next();
};

export default function authenticator(req: Request, res: Response, next: NextFunction) {
  if (req.path.includes('public')) return publicAuth(req, res, next);
  else return privateAuth(req, res, next);
}