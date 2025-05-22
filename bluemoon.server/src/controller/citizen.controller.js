import { citizens } from '../seed/fakeCitizens.js';

// Lấy danh sách nhân khẩu
export const getAllCitizens = (req, res) => {
  res.json(citizens);
};

// Lấy chi tiết nhân khẩu theo id
export const getCitizenById = (req, res) => {
  const id = parseInt(req.params.id);
  const citizen = citizens.find(c => c.id === id);
  if (!citizen) {
    return res.status(404).json({ message: 'Không tìm thấy nhân khẩu' });
  }
  res.json(citizen);
};

// Thêm mới nhân khẩu
export const createCitizen = (req, res) => {
  const { name, citizenId, gender, dob, apartment, relation } = req.body;

  // Bạn có thể thêm kiểm tra hợp lệ dữ liệu ở đây

  const newId = citizens.length ? citizens[citizens.length - 1].id + 1 : 1;
  const newCitizen = { id: newId, name, citizenId, gender, dob, apartment, relation };
  citizens.push(newCitizen);

  res.status(201).json({ message: 'Thêm nhân khẩu thành công', data: newCitizen });
};

// Cập nhật nhân khẩu
export const updateCitizen = (req, res) => {
  const id = parseInt(req.params.id);
  const index = citizens.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Không tìm thấy nhân khẩu' });
  }

  const { name, citizenId, gender, dob, apartment, relation } = req.body;
  citizens[index] = { id, name, citizenId, gender, dob, apartment, relation };

  res.json({ message: 'Cập nhật nhân khẩu thành công', data: citizens[index] });
};

// Xóa nhân khẩu
export const deleteCitizen = (req, res) => {
  const id = parseInt(req.params.id);
  const index = citizens.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Không tìm thấy nhân khẩu' });
  }

  citizens.splice(index, 1);
  res.json({ message: 'Xóa nhân khẩu thành công' });
};
