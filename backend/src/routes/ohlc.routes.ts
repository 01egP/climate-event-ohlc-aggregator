import { Router } from 'express';
import { getAllOhlc, getCityOhlc } from '../controllers/ohlc.controller';

const router = Router();

router.get('/', getAllOhlc);
router.get('/:city', getCityOhlc);

export default router;
