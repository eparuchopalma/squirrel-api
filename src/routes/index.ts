import express from 'express';

const router = express.Router();

router.use('/', (req, res) => res.send('Hello_World'));

export default router;