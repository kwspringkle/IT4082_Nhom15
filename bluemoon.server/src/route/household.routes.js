import express from 'express';
import {
  getAllHouseholds,
  getHouseholdById,
  createHousehold,
  updateHousehold,
  deleteHousehold,
  getPaymentsByHousehold
} from '../controller/household.controller.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllHouseholds);
router.get('/:id', getHouseholdById);

// GET /api/households/:id/payments - Khoản nộp của một hộ cụ thể
router.get('/:id/payments', getPaymentsByHousehold);

// Áp dụng middleware auth
router.post('/', authenticate, createHousehold);
router.put('/:id', authenticate, updateHousehold);
router.delete('/:id', authenticate, deleteHousehold);

export default router;
