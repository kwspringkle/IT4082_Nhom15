import express from 'express';
import { getCollectionRoundsStatistics, getPaymentStatusStatistics, getDashBoardStatistics } from '../controller/statistics.controller.js';

const router = express.Router();

// GET /api/statistics/dashboard

router.get('/dashboard', getDashBoardStatistics);

// GET /api/statistics/collection-rounds

router.get('/collection-rounds', getCollectionRoundsStatistics);

// GET /api/statistics/payment-status
router.get('/payment-status', getPaymentStatusStatistics);

export default router;
