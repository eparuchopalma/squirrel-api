import express from 'express';
import FundService from '../services/fundService';

const router = express.Router();
const fundService = new FundService();


router.get('/api/demo', (req, res, next) => {
  const user_id = process.env.DEMO_USER;
  fundService.read({ user_id })
    .then((data) => res.json(data))
    .catch((error) => next(error))
});

router.use('/', (req, res) => res.send('Hello_World'));

export default router;