import express from 'express';
import RecordService from '../services/recordService';

const recordService = new RecordService();

const router = express.Router();

router.get('/', async (req, res) => {
  const records = await recordService.read(process.env.DEMO_USER!);
  res.json({ records });
})

export default router;