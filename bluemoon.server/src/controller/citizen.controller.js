import Citizen from '../model/Citizen.js';

// Lấy danh sách nhân khẩu
export const getAllCitizens = async (req, res) => {
  try {
    const citizens = await Citizen.find().populate('householdId');
    res.json(citizens);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

// Lấy chi tiết nhân khẩu theo ID
export const getCitizenById = async (req, res) => {
  try {
    const citizen = await Citizen.findById(req.params.id).populate('householdId');
    if (!citizen) {
      return res.status(404).json({ message: 'Không tìm thấy nhân khẩu' });
    }
    res.json(citizen);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

// Thêm mới nhân khẩu
export const createCitizen = async (req, res) => {
  try {
    const { name, citizenId, gender, dob, apartment, relation, householdId } = req.body;

    const newCitizen = new Citizen({
      name,
      citizenId,
      gender,
      dob,
      apartment,
      relation,
      householdId
    });

    const savedCitizen = await newCitizen.save();
    res.status(201).json({ message: 'Thêm nhân khẩu thành công', data: savedCitizen });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

// Cập nhật nhân khẩu
export const updateCitizen = async (req, res) => {
  try {
    const { name, citizenId, gender, dob, apartment, relation, householdId } = req.body;

    const updatedCitizen = await Citizen.findByIdAndUpdate(
      req.params.id,
      { name, citizenId, gender, dob, apartment, relation, householdId },
      { new: true }
    );

    if (!updatedCitizen) {
      return res.status(404).json({ message: 'Không tìm thấy nhân khẩu' });
    }

    res.json({ message: 'Cập nhật nhân khẩu thành công', data: updatedCitizen });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

// Xóa nhân khẩu
export const deleteCitizen = async (req, res) => {
  try {
    const deletedCitizen = await Citizen.findByIdAndDelete(req.params.id);
    if (!deletedCitizen) {
      return res.status(404).json({ message: 'Không tìm thấy nhân khẩu' });
    }
    res.json({ message: 'Xóa nhân khẩu thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};
