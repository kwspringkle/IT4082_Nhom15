import express from 'express';
import { getAllFees, getFeeById, createFee, updateFee, deleteFee } from '../controller/fee.controller.js';

const router = express.Router();

// GET /api/fees - Lấy danh sách khoản thu
// Query params: 
// - type: Loại khoản thu (MONTHLY/YEARLY)
// - status: Trạng thái khoản thu (ACTIVE/INACTIVE)
router.get('/', getAllFees);

// GET /api/fees/:id - Lấy chi tiết một khoản thu
router.get('/:id', getFeeById);

// POST /api/fees - Thêm mới khoản thu
router.post('/', createFee);

// PUT /api/fees/:id - Cập nhật khoản thu
router.put('/:id', updateFee);

// DELETE /api/fees/:id - Xóa khoản thu
router.delete('/:id', deleteFee);

export default router;
