import express from 'express';
import { bodyValidator } from '../middleware/requestValidator';
import authenticator from '../middleware/authenticator';
import fundRouter from './fundRouter';
import recordRouter from './recordRouter';

const router = express.Router();

router.use('/', bodyValidator, authenticator);
router.use('{/public}/fund', fundRouter);
router.use('{/public}/record', recordRouter);
router.use('/', (req, res) => res.sendStatus(404));

export default router;