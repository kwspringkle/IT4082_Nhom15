import express from 'express';
import {
  getAllHouseholds,
  getHouseholdById,
  createHousehold,
  updateHousehold,
  deleteHousehold
} from '../controller/household.controller.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllHouseholds);
router.get('/:id', getHouseholdById);

// Áp dụng middleware auth
router.post('/', authenticate, createHousehold);
router.put('/:id', authenticate, updateHousehold);
router.delete('/:id', authenticate, deleteHousehold);

export default router;
