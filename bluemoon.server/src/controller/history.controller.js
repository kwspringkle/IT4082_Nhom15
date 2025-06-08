import History from '../model/History.js';
import Citizen from '../model/Citizen.js';
import Household from '../model/Household.js';
import mongoose from 'mongoose';

export const getCitizenHistory = async (req, res) => {
  try {
    const citizenId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(citizenId)) {
      return res.status(400).json({ success: false, message: 'ID không hợp lệ' });
    }

    const citizen = await Citizen.findById(citizenId);
    if (!citizen) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy nhân khẩu' });
    }

    const historyRecords = await History.find({
      collectionName: 'Citizen',
      documentId: citizenId
    }).sort({ createdAt: 1 });

    const result = {};
    const fieldLabels = {
      name: 'Họ tên',
      citizenId: 'CCCD',
      gender: 'Giới tính',
      dob: 'Năm sinh',
      relation: 'Quan hệ với chủ hộ',
      phone: 'Số điện thoại',
      status: 'Tình trạng cư trú',
      householdId: 'Hộ khẩu',
    };

    for (const record of historyRecords) {
      const date = new Date(record.createdAt);
      const formattedDate =
        date.toLocaleTimeString('vi-VN') + ' ' + date.toLocaleDateString('vi-VN');

      if (record.operation === 'create') {
        result['Khởi tạo'] = formattedDate;
      }

      if (record.operation === 'update') {
        const changeDescriptions = [];

        for (const key of Object.keys(record.changes)) {
          let { from, to } = record.changes[key];

          // Nếu giống nhau thì bỏ qua
          if (from === to) continue;

          let label = fieldLabels[key] || key;

          // Format ngày
          if (key === 'dob') {
            from = new Date(from).toLocaleDateString('vi-VN');
            to = new Date(to).toLocaleDateString('vi-VN');
          }

          // Format hộ khẩu
          if (key === 'householdId') {
            const [fromHousehold, toHousehold] = await Promise.all([
              Household.findById(from),
              Household.findById(to),
            ]);
            from = fromHousehold?.apartment || 'Không rõ';
            to = toHousehold?.apartment || 'Không rõ';

            // Nếu vẫn giống nhau sau khi format thì bỏ qua
            if (from === to) continue;
          }

          changeDescriptions.push(`${label}: ${from} → ${to}`);
        }

        if (changeDescriptions.length > 0) {
          const entry = `${formattedDate} - ${changeDescriptions.join(', ')}`;
          if (!result['Thay đổi thông tin']) result['Thay đổi thông tin'] = [];
          result['Thay đổi thông tin'].push(entry);
        }
      }
    }

    res.status(200).json({
      success: true,
      data: result,
      message: 'Lấy lịch sử thay đổi nhân khẩu thành công',
    });

  } catch (error) {
    console.error('❌ getCitizenHistory error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy lịch sử thay đổi nhân khẩu',
      error: error.message,
    });
  }
};


export const getHouseHoldHistory = async (req, res) => {
  try {
    const householdId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(householdId)) {
      return res.status(400).json({ success: false, message: 'ID không hợp lệ' });
    }

    const household = await Household.findById(householdId);
    if (!household) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hộ khẩu' });
    }

    const historyRecords = await History.find({
      collectionName: 'Household',
      documentId: householdId
    }).sort({ createdAt: 1 });

    const result = {};

    for (const record of historyRecords) {
      const date = new Date(record.createdAt);
      const formattedDate = date.toLocaleDateString('vi-VN'); // "dd/mm/yyyy"

      if (!result[formattedDate]) {
        result[formattedDate] = [];
      }

      if (record.operation === 'create') {
        result[formattedDate].push('Khởi tạo hộ khẩu');
      }

      if (record.operation === 'update') {
        const { head } = record.changes;

        if (head) {
          const from = head.from?.trim() || '';
          const to = head.to?.trim() || '';

          if (from === '' && to !== '') {
            result[formattedDate].push(`${to} nhập hộ khẩu`);
          }

          if (from !== '' && to === '') {
            result[formattedDate].push(`${from} chuyển đi`);
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      data: result,
      message: 'Lấy lịch sử thay đổi hộ khẩu thành công',
    });

  } catch (error) {
    console.error('❌ getHouseHoldHistory error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy lịch sử thay đổi hộ khẩu',
      error: error.message
    });
  }
};
