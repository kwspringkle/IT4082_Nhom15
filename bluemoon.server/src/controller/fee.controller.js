import { fees, saveFees } from '../seed/fakeFees.js';

// Lấy danh sách tất cả các khoản thu
export const getAllFees = async (req, res) => {
  try {
    const { type, status } = req.query;
    
    let results = [...fees];

    // Lọc theo loại khoản thu (MONTHLY/YEARLY)
    if (type) {
      results = results.filter(fee => 
        fee.type.toLowerCase() === type.toLowerCase()
      );
    }

    // Lọc theo trạng thái
    if (status) {
      results = results.filter(fee => 
        fee.status.toLowerCase() === status.toLowerCase()
      );
    }

    // Nếu không có kết quả
    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khoản thu nào'
      });
    }    // Chỉ trả về id và tên của khoản thu
    const simplifiedResults = results.map(fee => ({
      id: fee.id,
      name: fee.name
    }));

    res.status(200).json({
      success: true,
      data: simplifiedResults,
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

// Lấy chi tiết một khoản thu
export const getFeeById = async (req, res) => {
  try {
    const feeId = parseInt(req.params.id);
    const fee = fees.find(f => f.id === feeId);

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

    // Validate required fields
    if (!name || !amount || !type) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc (name, amount, type)'
      });
    }

    // Validate type
    if (!['MONTHLY', 'YEARLY'].includes(type.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Loại khoản thu không hợp lệ (MONTHLY/YEARLY)'
      });
    }

    // Create new fee with current timestamp
    const newFee = {
      id: fees.length + 1,
      name,
      amount,
      type: type.toUpperCase(),
      description: description || '',
      mandatory: mandatory || false,
      status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    // Add to fees array
    fees.push(newFee);
    // Save to file
    await saveFees(fees);
    // Return response

    res.status(201).json({
      success: true,
      data: newFee,
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
    const feeId = parseInt(req.params.id);
    const { name, amount, type, description, mandatory, status } = req.body;

    // Tìm khoản thu cần cập nhật
    const feeIndex = fees.findIndex(f => f.id === feeId);
    if (feeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khoản thu'
      });
    }

    // Validate type nếu có cập nhật
    if (type && !['MONTHLY', 'YEARLY'].includes(type.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: 'Loại khoản thu không hợp lệ (MONTHLY/YEARLY)'
      });
    }

    // Cập nhật thông tin
    const updatedFee = {
      ...fees[feeIndex],
      name: name || fees[feeIndex].name,
      amount: amount || fees[feeIndex].amount,
      type: type ? type.toUpperCase() : fees[feeIndex].type,
      description: description || fees[feeIndex].description,
      mandatory: mandatory !== undefined ? mandatory : fees[feeIndex].mandatory,
      status: status || fees[feeIndex].status,
      updatedAt: new Date().toISOString().split('T')[0]
    };

    // Cập nhật vào mảng
    fees[feeIndex] = updatedFee;
    
    // Lưu thay đổi
    await saveFees(fees);

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
    const feeId = parseInt(req.params.id);

    // Tìm khoản thu cần xóa
    const feeIndex = fees.findIndex(f => f.id === feeId);
    if (feeIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khoản thu'
      });
    }

    // Kiểm tra xem có đang được sử dụng không
    if (fees[feeIndex].status === 'ACTIVE') {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa khoản thu đang hoạt động'
      });
    }

    // Xóa khỏi mảng
    fees.splice(feeIndex, 1);
    
    // Lưu thay đổi
    await saveFees(fees);

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
