import Payment from '../model/Payment.js';
import Household from '../model/Household.js';
import Fee from '../model/Fee.js';

import mongoose from 'mongoose';

export const getAllPayments = async (req, res) => {
  try {
    const { householdId, feeId, status, startDate, endDate, search } = req.query;

    let filter = {};

    if (householdId && mongoose.Types.ObjectId.isValid(householdId)) {
      filter.householdId = householdId;
    }

    if (feeId && mongoose.Types.ObjectId.isValid(feeId)) {
      filter.feeId = feeId;
    }

    if (status) {
      const st = status.toUpperCase();
      if (['PAID', 'PARTIAL', 'UNPAID'].includes(st)) {
        filter.status = st;
      }
    }

    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    let payments = await Payment.find(filter)
      .populate('householdId', 'apartment head floor')
      .populate('feeId', 'name type mandatory')
      .exec();

    if (search) {
      const searchLower = search.toLowerCase();
      payments = payments.filter(p => {
        const h = p.householdId;
        const f = p.feeId;
        return (
          (h?.apartment?.toLowerCase().includes(searchLower)) ||
          (h?.head?.toLowerCase().includes(searchLower)) ||
          (f?.name?.toLowerCase().includes(searchLower)) ||
          (p.note?.toLowerCase().includes(searchLower))
        );
      });
    }

    const formattedResults = payments.map(p => ({
      id: p._id,
      household: `${p.householdId?.apartment} - ${p.householdId?.head}`,
      feeName: p.feeId?.name,
      amount: p.amount,
      status: p.status,
      paidDate: p.paidDate,
      note: p.note,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt
    }));

    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

    res.status(200).json({
      success: true,
      data: formattedResults,
      total: formattedResults.length,
      totalAmount,
      message: 'Lấy danh sách khoản thu thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách khoản thu',
      error: error.message
    });
  }
};

export const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID khoản thu không hợp lệ',
      });
    }

    const payment = await Payment.findById(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khoản thu',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        householdId: payment.householdId?.toString() || '',
        feeId: payment.feeId?.toString() || '',
        amount: payment.amount,
        status: payment.status,
        paidDate: payment.paidDate,
        note: payment.note,
      },
      message: 'Lấy thông tin khoản thu thành công',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin khoản thu',
      error: error.message,
    });
  }
};

export const createPayment = async (req, res) => {
  try {
    const { householdId, feeId, amount, status = 'UNPAID', paidDate, note = '' } = req.body;

    // Kiểm tra bắt buộc
    if (!householdId || !feeId || amount === undefined) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin bắt buộc" });
    }

    // Tạo bản ghi mới
    const payment = new Payment({
      householdId,
      feeId,
      amount,
      status: status.toUpperCase(),
      paidDate: paidDate ? new Date(paidDate) : null,
      note
    });

    await payment.save();

    return res.status(201).json({
      success: true,
      message: "Tạo khoản thu thành công",
      data: payment
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi khi tạo khoản thu",
      error: error.message
    });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, status, paidDate, note } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID khoản thu không hợp lệ' });
    }

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khoản thu' });
    }

    if (status && !['PAID', 'PARTIAL', 'UNPAID'].includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ'
      });
    }

    if (amount !== undefined && (typeof amount !== 'number' || amount <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'Số tiền phải là số dương'
      });
    }

    if ((status === 'PAID' || status === 'PARTIAL') && !paidDate) {
      return res.status(400).json({
        success: false,
        message: 'Cần ngày thanh toán khi trạng thái là PAID hoặc PARTIAL'
      });
    }

    payment.amount = amount !== undefined ? amount : payment.amount;
    payment.status = status ? status.toUpperCase() : payment.status;
    payment.paidDate =status && status.toUpperCase() === 'UNPAID' ? null : (paidDate ? new Date(paidDate) : payment.paidDate); 
    payment.note = note !== undefined ? note : payment.note;
    payment.updatedAt = new Date();

    await payment.save();

    res.status(200).json({
      success: true,
      data: payment,
      message: 'Cập nhật khoản thu thành công'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật khoản thu',
      error: error.message
    });
  }
};

export const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID khoản thu không hợp lệ' });
    }

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khoản thu' });
    }

    if (payment.status === 'PAID') {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa khoản thu đã thanh toán'
      });
    }

    await Payment.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: 'Xóa khoản thu thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa khoản thu',
      error: error.message
    });
  }
};
