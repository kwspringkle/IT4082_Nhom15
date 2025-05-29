import Fee from '../model/Fee.js';

// Lấy danh sách tất cả các khoản thu, hỗ trợ filter type và status
export const getAllFees = async (req, res) => {
  try {
    const { type, status } = req.query;
    let results = [...fees];

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

    // Ẩn trường description khi trả về danh sách
    const feesListResult = results.map(fee => {
      const { description, ...rest } = fee;
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
    const { name, amount, type, description, mandatory } = req.body;

    if (!name || !amount || !type) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc (name, amount, type)'
      });
    }

    if (!['MONTHLY', 'YEARLY'].includes(type.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Loại khoản thu không hợp lệ (MONTHLY/YEARLY)'
      });
    }

    const fee = new Fee({
      name,
      amount,
      type: type.toUpperCase(),
      description: description || '',
      mandatory: mandatory || false,
      status: 'ACTIVE',
      // createdAt, updatedAt sẽ tự động thêm
    });

    const savedFee = await fee.save();

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
    const { name, amount, type, description, mandatory, status } = req.body;

    if (type && !['MONTHLY', 'YEARLY'].includes(type.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Loại khoản thu không hợp lệ (MONTHLY/YEARLY)'
      });
    }

    const updatedData = {};

    if (name !== undefined) updatedData.name = name;
    if (amount !== undefined) updatedData.amount = amount;
    if (type !== undefined) updatedData.type = type.toUpperCase();
    if (description !== undefined) updatedData.description = description;
    if (mandatory !== undefined) updatedData.mandatory = mandatory;
    if (status !== undefined) updatedData.status = status;

    const updatedFee = await Fee.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updatedFee) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khoản thu'
      });
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
