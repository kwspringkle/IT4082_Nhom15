import { households } from '../seed/fakeHouseholds.js'; // dữ liệu giả
import { payments } from '../seed/fakePayments.js';
import { fees } from '../seed/fakeFees.js';


// Lấy tất cả hộ khẩu
export const getAllHouseholds = (req, res) => {
  res.json(households);
};

// Lấy chi tiết 1 hộ khẩu
export const getHouseholdById = (req, res) => {
  const id = parseInt(req.params.id);
  const household = households.find(h => h.id === id);
  if (!household) return res.status(404).json({ message: 'Không tìm thấy hộ khẩu' });
  res.json(household);
};

// Tạo mới hộ khẩu
export const createHousehold = (req, res) => {
  const { apartment, floor, area, head, phone, members } = req.body;
  const userId = req.user.id;

  const newHousehold = {
    id: households.length + 1,
    apartment,
    floor,
    area,
    head,
    phone,
    members,
    userId
  };

  households.push(newHousehold);
  res.status(201).json({ message: 'Tạo hộ khẩu thành công', data: newHousehold });
};


// Cập nhật hộ khẩu
export const updateHousehold = (req, res) => {
  const id = parseInt(req.params.id);
  const household = households.find(h => h.id === id);
  if (!household) return res.status(404).json({ message: 'Không tìm thấy hộ khẩu' });

  const { apartment, floor, area, head, phone, members } = req.body;
  household.apartment = apartment ?? household.apartment;
  household.floor = floor ?? household.floor;
  household.area = area ?? household.area;
  household.head = head ?? household.head;
  household.phone = phone ?? household.phone;
  household.members = members ?? household.members;

  res.json({ message: 'Cập nhật thành công', data: household });
};

// Xóa hộ khẩu
export const deleteHousehold = (req, res) => {
  const id = parseInt(req.params.id);
  const index = households.findIndex(h => h.id === id);
  if (index === -1) return res.status(404).json({ message: 'Không tìm thấy hộ khẩu' });

  households.splice(index, 1);
  res.json({ message: 'Xóa hộ khẩu thành công' });
};

// Lấy danh sách khoản nộp của một hộ cụ thể
export const getPaymentsByHousehold = async (req, res) => {
  try {
    const householdId = parseInt(req.params.id);
    // Lọc các khoản nộp theo householdId
    const householdPayments = payments.filter(p => p.householdId === householdId);
    // Gắn thêm thông tin khoản phí
    const result = householdPayments.map(payment => {
      const fee = fees.find(f => f.id === payment.feeId);
      return {
        ...payment,
        feeName: fee ? fee.name : null,
        feeType: fee ? fee.type : null
      };
    });
    res.status(200).json({
      success: true,
      data: result,
      message: 'Lấy danh sách khoản nộp của hộ thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách khoản nộp của hộ',
      error: error.message
    });
  }
};
