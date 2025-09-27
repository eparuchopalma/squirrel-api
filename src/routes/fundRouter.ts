import express from 'express';
import FundService from '../services/fundService';
import requestValidator from '../middleware/requestValidator';
import fundReqSchemas from '../utils/fundRequestSchema';

const router = express.Router();
const { read, update, create } = new FundService();

router.get('/', requestValidator(fundReqSchemas.read), (req, res, next) => {
  const payload = req.body;
  read(payload)
    .then((data) => res.json(data))
    .catch((error) => next(error))
});

router.patch('/:id', requestValidator(fundReqSchemas.update), (req, res, next) => {
  const payload = { ...req.body, id: req.params.id };
  update(payload)
    .then(() => res.sendStatus(204))
    .catch((error) => next(error))
});

router.post('/', requestValidator(fundReqSchemas.create), (req, res, next) => {
  const payload = req.body;
  create(payload)
    .then(() => res.status(201).json())
    .catch((error) => next(error))
});

export default router;