import express from 'express';
import requestValidator from '../middleware/requestValidator';
import fundReqSchemas from '../utils/fundRequestSchema';
import fundHandler from '../controllers/fundController';

const router = express.Router();

router.delete('/:id', requestValidator(fundReqSchemas.destroy), fundHandler.destroy);

router.get('/', requestValidator(fundReqSchemas.read), fundHandler.read);

router.patch('/:id', requestValidator(fundReqSchemas.update), fundHandler.update);

router.post('/', requestValidator(fundReqSchemas.create), fundHandler.create);

export default router;