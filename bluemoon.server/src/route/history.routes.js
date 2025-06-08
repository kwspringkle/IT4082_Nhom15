import express from 'express';
import { getCitizenHistory, getHouseHoldHistory } from '../controller/history.controller.js';

const router = express.Router();

// GET /api/history - Lấy lịch sử thay đổi của nhân khẩu, căn hộ
router.get('/citizen/:id', getCitizenHistory);
router.get('/household/:id', getHouseHoldHistory);


export default router;
