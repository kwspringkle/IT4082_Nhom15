import Payment from '../model/Payment.js';
import Household from '../model/Household.js';
import Fee from '../model/Fee.js';

import mongoose from 'mongoose';

export const getAllPayments = async (req, res) => {
  try {
    const { householdId, feeId, status, startDate, endDate, search } = req.query;

    // Build filter object
    let filter = {};

    if (householdId && mongoose.Types.ObjectId.isValid(householdId)) {
      filter.householdId = householdId;
    }

    if (feeId && mongoose.Types.ObjectId.isValid(feeId)) {
      filter.feeId = feeId;
    }

    if (status) {
      filter.status = status.toUpperCase();
    }

    if (startDate && endDate) {
      filter.createdAt = { 
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Query payments with populate household and fee info
    let payments = await Payment.find(filter)
      .populate('householdId', 'apartment head floor')
      .populate('feeId', 'name type mandatory')
      .exec();

    // If search filter is given, filter in JS
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

    // Format results
    const formattedResults = payments.map(p => ({
      id: p._id,
      household: `${p.householdId?.apartment} - ${p.householdId?.head}`,
      feeName: p.feeId?.name,
      amount: p.amount,
      status: p.status,
      note: p.note
    }));

    const totalAmount = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);

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
      return res.status(400).json({ success: false, message: 'ID khoản thu không hợp lệ' });
    }

    const payment = await Payment.findById(id)
      .populate('householdId', 'apartment head floor')
      .populate('feeId', 'name type mandatory')
      .exec();

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khoản thu' });
    }

    res.status(200).json({
      success: true,
      data: {
        id: payment._id,
        amount: payment.amount,
        dueDate: payment.dueDate,
        status: payment.status,
        paidDate: payment.paidDate,
        paidAmount: payment.paidAmount,
        note: payment.note,
        householdInfo: payment.householdId,
        feeInfo: payment.feeId
      },
      message: 'Lấy thông tin khoản thu thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin khoản thu',
      error: error.message
    });
  }
};

export const createPayment = async (req, res) => {
  try {
    const { householdId, feeId, amount, dueDate, note } = req.body;

    if (!householdId || !feeId || !amount || !dueDate) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    if (!mongoose.Types.ObjectId.isValid(householdId) || !mongoose.Types.ObjectId.isValid(feeId)) {
      return res.status(400).json({
        success: false,
        message: 'ID hộ dân hoặc khoản thu không hợp lệ'
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Số tiền phải lớn hơn 0'
      });
    }

    if (new Date(dueDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Ngày hết hạn không được trong quá khứ'
      });
    }

    // Kiểm tra tồn tại household và fee
    const household = await Household.findById(householdId);
    const fee = await Fee.findById(feeId);

    if (!household || !fee) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hộ dân hoặc khoản thu'
      });
    }

    // Kiểm tra trùng khoản thu chưa thanh toán cùng hộ và khoản phí
    const existingPayment = await Payment.findOne({
      householdId,
      feeId,
      status: { $ne: 'PAID' },
      dueDate: { $gt: new Date() }
    });

    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: 'Đã tồn tại khoản thu chưa thanh toán cho hộ dân này'
      });
    }

    // Tạo payment mới
    const payment = new Payment({
      householdId,
      feeId,
      amount,
      dueDate,
      status: 'UNPAID',
      paidDate: null,
      paidAmount: 0,
      note: note || ''
    });

    await payment.save();

    res.status(201).json({
      success: true,
      data: payment,
      message: 'Tạo khoản thu mới thành công'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo khoản thu mới',
      error: error.message
    });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, dueDate, status, paidDate, paidAmount, note } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID khoản thu không hợp lệ' });
    }

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy khoản thu' });
    }

    if (status && !['PAID', 'UNPAID', 'PARTIAL'].includes(status.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ'
      });
    }

    if (status === 'PAID' && (!paidAmount || paidAmount < payment.amount)) {
      return res.status(400).json({
        success: false,
        message: 'Số tiền thanh toán không hợp lệ'
      });
    }

    if (status === 'PAID' && !paidDate) {
      return res.status(400).json({
        success: false,
        message: 'Yêu cầu ngày thanh toán khi trạng thái là PAID'
      });
    }

    payment.amount = amount || payment.amount;
    payment.dueDate = dueDate || payment.dueDate;
    payment.status = status ? status.toUpperCase() : payment.status;
    payment.paidDate = paidDate || payment.paidDate;
    payment.paidAmount = paidAmount !== undefined ? paidAmount : payment.paidAmount;
    payment.note = note || payment.note;
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
