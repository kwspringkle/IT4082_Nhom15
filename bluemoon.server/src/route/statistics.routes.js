import express from 'express';
import { getCollectionRoundsStatistics, getPaymentStatusStatistics } from '../controller/statistics.controller.js';

const router = express.Router();

// GET /api/statistics/collection-rounds
router.get('/collection-rounds', getCollectionRoundsStatistics);

// GET /api/statistics/payment-status
router.get('/payment-status', getPaymentStatusStatistics);

export default router;
