import express from 'express';
import recordRouter from './recordRouter';

const router = express.Router();

router.use('/record', recordRouter);
router.use('/', (req, res) => res.send('Hello_World'));

export default router;