import { fees } from '../seed/fakeFees.js';

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
