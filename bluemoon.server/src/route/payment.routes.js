import express from 'express';
import {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment
} from '../controller/payment.controller.js';

const router = express.Router();

// GET /api/payments - Lấy danh sách khoản nộp
router.get('/', getAllPayments);

// GET /api/payments/:id - Lấy chi tiết khoản nộp
router.get('/:id', getPaymentById);

// POST /api/payments - Thêm khoản nộp mới
router.post('/', createPayment);

// PUT /api/payments/:id - Cập nhật khoản nộp
router.put('/:id', updatePayment);

// DELETE /api/payments/:id - Xóa khoản nộp
router.delete('/:id', deletePayment);

export default router;
