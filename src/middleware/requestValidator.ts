import { Request, Response, NextFunction } from 'express';

export function bodyValidator(req: Request, res: Response, next: NextFunction) {
  if (JSON.stringify(req.body)?.includes("<script>")) return res.sendStatus(400);
  else next();
};