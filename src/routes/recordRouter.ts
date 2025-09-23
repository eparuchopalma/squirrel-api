import express from 'express';
import RecordService from '../services/recordService';
import { validateSchema } from '../middleware/requestValidator';
import recordReqSchemas from '../utils/recordRequestSchema';

const router = express.Router();
const { read, update, create, destroy } = new RecordService();

router.get('/', validateSchema(recordReqSchemas.read), (req, res, next) => {
  const payload = req.body;
  read(payload)
    .then((data) => res.json(data))
    .catch((error) => next(error))
});

router.patch('/:id', validateSchema(recordReqSchemas.update), (req, res, next) => {
  const payload = { ...req.body, id: req.params.id };
  update(payload)
    .then(() => res.sendStatus(204))
    .catch((error) => next(error))
});

router.post('/', validateSchema(recordReqSchemas.create), (req, res, next) => {
  const payload = req.body;
  create(payload)
    .then(() => res.status(201).json())
    .catch((error) => next(error))
});

router.delete('/:id', validateSchema(recordReqSchemas.destroy), (req, res, next) => {
  const payload = { ...req.body, id: req.params.id };
  destroy(payload)
    .then(() => res.sendStatus(204))
    .catch((error) => next(error))
});

export default router;