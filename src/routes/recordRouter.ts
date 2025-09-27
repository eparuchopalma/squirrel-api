import express from 'express';
import requestValidator from '../middleware/requestValidator';
import recordSchemas from '../utils/recordRequestSchema';
import recordHandler from '../controllers/recordController';

const router = express.Router();

router.get('/', requestValidator(recordSchemas.read), recordHandler.read);

router.patch('/:id', requestValidator(recordSchemas.update), recordHandler.update);

router.post('/', requestValidator(recordSchemas.create), recordHandler.create);

router.delete('/:id', requestValidator(recordSchemas.destroy), recordHandler.destroy);

export default router;