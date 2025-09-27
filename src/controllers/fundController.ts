import { Request, Response, NextFunction } from 'express';
import FundService from '../services/fundService';

const { read, update, create } = new FundService();

function readFundHandler(req: Request, res: Response, next: NextFunction) {
  const payload = req.body;
  read(payload)
    .then((data) => res.json(data))
    .catch((error: Error) => next(error))
}

function updateFundHandler(req: Request, res: Response, next: NextFunction) {
  const payload = { ...req.body, id: req.params.id };
  update(payload)
    .then(() => res.sendStatus(204))
    .catch((error) => next(error))
}

function createFundHandler(req: Request, res: Response, next: NextFunction) {
  const payload = req.body;
  create(payload)
    .then(() => res.sendStatus(201))
    .catch((error) => next(error))
}

export default {
  read: readFundHandler,
  update: updateFundHandler,
  create: createFundHandler,
}