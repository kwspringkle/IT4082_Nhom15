import { citizenHistory } from '../seed/fakeCitizenHistory.js';
import { citizens } from '../seed/fakeCitizens.js';

export const getCitizenHistory = async (req, res) => {
  try {
    const citizenId = parseInt(req.params.id);

    // Kiểm tra xem nhân khẩu có tồn tại không
    const citizen = citizens.find(c => c.id === citizenId);
    if (!citizen) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhân khẩu'
      });
    }

    // Lấy lịch sử thay đổi của nhân khẩu
    const history = citizenHistory.filter(h => h.citizenId === citizenId);

    // Thêm thông tin chi tiết về nhân khẩu
    const response = {
      citizen: citizen,
      history: history
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
