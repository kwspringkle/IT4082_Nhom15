import Fee from '../model/Fee.js';
import Household from '../model/Household.js';
import Payment from '../model/Payment.js';

// Lấy danh sách tất cả các khoản thu, hỗ trợ filter type và status
export const getAllFees = async (req, res) => {
  try {
    const { type, status } = req.query;

    // Lấy tất cả khoản thu từ MongoDB
    const allFees = await Fee.find();
    let results = [...allFees];

    if (type) {
      results = results.filter(fee => fee.type.toLowerCase() === type.toLowerCase());
    }
    if (status) {
      results = results.filter(fee => fee.status.toLowerCase() === status.toLowerCase());
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khoản thu nào'
      });
    }

    // Ẩn trường description
    const feesListResult = results.map(fee => {
      const { description, ...rest } = fee.toObject();
      return rest;
    });

    res.status(200).json({
      success: true,
      data: feesListResult,
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

// Lấy chi tiết một khoản thu theo ID
export const getFeeById = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khoản thu'
      });
    }
    res.status(200).json({
      success: true,
      data: fee,
      message: 'Lấy chi tiết khoản thu thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy chi tiết khoản thu',
      error: error.message
    });
  }
};

// Thêm mới khoản thu
export const createFee = async (req, res) => {
  try {
    const { name, amount, ratePerSqm, type, description, mandatory, deadline } = req.body;

    // Kiểm tra đầu vào 
    if (!name || (!amount && !ratePerSqm) || !type) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc (name, amount hoặc ratePerSqm, type)'
      });
    }
    const normalizedType = type.toUpperCase();
    if (!['MONTHLY', 'YEARLY', 'OTHER'].includes(normalizedType)) {
      return res.status(400).json({
        success: false,
        message: 'Loại khoản thu không hợp lệ (MONTHLY/YEARLY/OTHER)'
      });
    }

    const fee = new Fee({
      name,
      amount,
      ratePerSqm,
      type: normalizedType,
      description: description || '',
      mandatory: mandatory || false,
      deadline: deadline ? new Date(deadline) : null,
      status: 'ACTIVE'
    });

    const savedFee = await fee.save();

    // Nếu tạo phí bắt buộc ==> toàn bộ hộ dân đc set là chưa nộp
    if (mandatory) {
      const households = await Household.find({ head: { $ne: '' } });
      
      const payments = households.map(household => ({
        householdId: household._id,
        feeId: savedFee._id,
        amount: savedFee.amount || (savedFee.ratePerSqm && household.area ? savedFee.ratePerSqm * household.area : 0),
        status: 'UNPAID',
        paidDate: null,
        note: '',
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      if (payments.length > 0) {
        try {
          await Payment.insertMany(payments);
        } catch (paymentError) {
          console.error('Error creating payments:', paymentError.message);
        }
      }
    }

    res.status(201).json({
      success: true,
      data: savedFee,
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

// Cập nhật khoản thu
export const updateFee = async (req, res) => {
  try {
    const { name, amount, ratePerSqm, type, description, mandatory, status, deadline } = req.body;

    // Kiểm tra loại khoản thu
    if (type && !['MONTHLY', 'YEARLY', 'OTHER'].includes(type.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Loại khoản thu không hợp lệ (MONTHLY/YEARLY/OTHER)'
      });
    }

    const updatedData = {};
    if (name !== undefined) updatedData.name = name;
    if (amount !== undefined) updatedData.amount = amount;
    if (ratePerSqm !== undefined) updatedData.ratePerSqm = ratePerSqm;
    if (type !== undefined) updatedData.type = type.toUpperCase();
    if (description !== undefined) updatedData.description = description;
    if (mandatory !== undefined) updatedData.mandatory = mandatory;
    if (status !== undefined) updatedData.status = status.toUpperCase();
    if (deadline !== undefined) updatedData.deadline = deadline ? new Date(deadline) : null;

    const currentFee = await Fee.findById(req.params.id);
    if (!currentFee) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khoản thu'
      });
    }

    const updatedFee = await Fee.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );
    // Nếu amount hoặc ratePerSqm thay đổi, cập nhật amount trong Payment (chỉ vs các khoản thu vẫn có trạng thái là Unpaid)
    if (amount !== undefined || ratePerSqm !== undefined) {
      try {
        const payments = await Payment.find({ feeId: updatedFee._id, status: 'UNPAID'  }).populate('householdId', 'area');
        const updatePromises = payments.map(async (payment) => {
          const householdArea = payment.householdId?.area || 0;
          const newAmount = updatedFee.amount || (updatedFee.ratePerSqm && householdArea ? updatedFee.ratePerSqm * householdArea : 0);
          payment.amount = newAmount;
          payment.updatedAt = new Date();
          return payment.save();
        });
        await Promise.all(updatePromises);
      } catch (paymentError) {
        console.error('Error updating payments:', paymentError.message);
      }
    }
    // Nếu chuyển thành phí bắt buộc và trước đó không phải bắt buộc 
    if (mandatory === true && !currentFee.mandatory) {
      const households = await Household.find({ head: { $ne: '' } });
      const existingPayments = await Payment.find({ feeId: updatedFee._id });
      const existingHouseholdIds = new Set(existingPayments.map(p => p.householdId.toString()));

      // Tạo bản ghi Payment cho các hộ chưa có
      const payments = households
        .filter(household => !existingHouseholdIds.has(household._id.toString()))
        .map(household => ({
          householdId: household._id,
          feeId: updatedFee._id,
          amount: updatedFee.amount || (updatedFee.ratePerSqm && household.area ? updatedFee.ratePerSqm * household.area : 0),
          status: 'UNPAID',
          paidDate: null,
          note: '',
          createdAt: new Date(),
          updatedAt: new Date()
        }));

      if (payments.length > 0) {
        try {
          await Payment.insertMany(payments);
        } catch (paymentError) {
          console.error('Error creating payments:', paymentError.message);
        }
      }
    }

    res.status(200).json({
      success: true,
      data: updatedFee,
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

// Xóa khoản thu
export const deleteFee = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khoản thu'
      });
    }

    if (fee.status === 'ACTIVE') {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa khoản thu đang hoạt động'
      });
    }

    await Fee.findByIdAndDelete(req.params.id);

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