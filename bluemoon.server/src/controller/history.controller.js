import CitizenHistory from '../model/CitizenHistory.js';
import Citizen from '../model/Citizen.js';
import mongoose from 'mongoose';

export const getCitizenHistory = async (req, res) => {
  try {
    const citizenId = req.params.id;

    // Kiểm tra định dạng ObjectId
    if (!mongoose.Types.ObjectId.isValid(citizenId)) {
      return res.status(400).json({
        success: false,
        message: 'ID không hợp lệ'
      });
    }

    // Tìm nhân khẩu theo ID
    const citizen = await Citizen.findById(citizenId);
    if (!citizen) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhân khẩu'
      });
    }

    // Tìm lịch sử thay đổi theo citizenId
    const history = await CitizenHistory.find({ citizenId }).sort({ changedAt: -1 });

    const response = {
      citizen,
      history
    };

    if (history.length === 0) {
      return res.status(200).json({
        success: true,
        data: response,
        message: 'Nhân khẩu chưa có lịch sử thay đổi'
      });
    }

    res.status(200).json({
      success: true,
      data: response,
      message: 'Lấy lịch sử thay đổi nhân khẩu thành công'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy lịch sử thay đổi nhân khẩu',
      error: error.message
    });
  }
};
