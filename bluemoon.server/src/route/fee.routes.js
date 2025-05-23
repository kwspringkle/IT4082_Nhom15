import express from 'express';
import { getAllFees, getFeeById } from '../controller/fee.controller.js';

const router = express.Router();

// GET /api/fees - Lấy danh sách khoản thu
// Query params: 
// - type: Loại khoản thu (MONTHLY/YEARLY)
// - status: Trạng thái khoản thu (ACTIVE/INACTIVE)
router.get('/', getAllFees);

// GET /api/fees/:id - Lấy chi tiết một khoản thu
router.get('/:id', getFeeById);

export default router;
