import express from 'express';
import FundService from '../services/fundService';

const router = express.Router();
const fundService = new FundService();

router.get('/', (req, res, next) => {
  const payload = req.body;
  fundService.read(payload)
    .then((data) => res.json(data))
    .catch((error) => next(error))
});

export default router;