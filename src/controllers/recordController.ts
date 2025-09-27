import { Request, Response, NextFunction } from 'express';
import RecordService from '../services/recordService';

const { read, update, create, destroy } = new RecordService();

function readRecordHandler(req: Request, res: Response, next: NextFunction) {
  const payload = req.body;
  read(payload)
    .then((data) => res.json(data))
    .catch((error: Error) => next(error))
}

function updateRecordHandler(req: Request, res: Response, next: NextFunction) {
  const payload = { ...req.body, id: req.params.id };
  update(payload)
    .then(() => res.sendStatus(204))
    .catch((error) => next(error))
}

function createRecordHandler(req: Request, res: Response, next: NextFunction) {
  const payload = req.body;
  create(payload)
    .then(() => res.sendStatus(201))
    .catch((error) => next(error))
}

function deleteRecordHandler(req: Request, res: Response, next: NextFunction) {
  const payload = { ...req.body, id: req.params.id };
  destroy(payload)
    .then(() => res.sendStatus(204))
    .catch((error) => next(error))
}

export default {
  read: readRecordHandler,
  update: updateRecordHandler,
  create: createRecordHandler,
  destroy: deleteRecordHandler
}