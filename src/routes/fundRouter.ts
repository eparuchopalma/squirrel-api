import express from 'express';
import FundService from '../services/fundService';
import { validateSchema } from '../middleware/requestValidator';
import { createFundSchema } from '../utils/fundRequestSchema';

const router = express.Router();
const { read, update, create } = new FundService();

router.get('/', (req, res, next) => {
  const payload = req.body;
  read(payload)
    .then((data) => res.json(data))
    .catch((error) => next(error))
});

router.patch('/:id', (req, res, next) => {
  const payload = { ...req.body, id: req.params.id };
  update(payload)
    .then((data) => res.sendStatus(204))
    .catch((error) => next(error))
});

router.post('/', validateSchema(createFundSchema), (req, res, next) => {
  const payload = req.body;
  create(payload)
    .then((data) => res.status(201).json(data))
    .catch((error) => next(error))
});

export default router;