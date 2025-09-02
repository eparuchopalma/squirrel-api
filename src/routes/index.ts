import express from 'express';
import { bodyValidator } from '../middleware/requestValidator';
import authenticator from '../middleware/authenticator';
import fundRouter from './fundRouter';

const router = express.Router();

router.use('/', bodyValidator, authenticator);

router.use('{/public}/fund', fundRouter);

router.use('/', (req, res) => res.sendStatus(404));

export default router;