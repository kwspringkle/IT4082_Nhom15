import express from 'express';
import { getCitizenHistory } from '../controller/history.controller.js';

const router = express.Router();

// GET /api/citizens/:id/history - Lấy lịch sử thay đổi của nhân khẩu
router.get('/:id/history', getCitizenHistory);

export default router;
