import express from 'express';
import { bodyValidator } from '../middleware/requestValidator';
import fundRouter from './fundRouter';

const router = express.Router();

router.use('/', bodyValidator);

router.use('/api{/public}/fund', fundRouter);

router.use('/', (req, res) => res.sendStatus(404));

export default router;