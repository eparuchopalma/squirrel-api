import express from 'express';
import FundService from '../services/fundService';
import requestValidator from '../middleware/requestValidator';
import fundReqSchemas from '../utils/fundRequestSchema';
import fundHandler from '../controllers/fundController';

const router = express.Router();

router.get('/', requestValidator(fundReqSchemas.read), fundHandler.read);

router.patch('/:id', requestValidator(fundReqSchemas.update), fundHandler.update);

router.post('/', requestValidator(fundReqSchemas.create), fundHandler.create);

export default router;