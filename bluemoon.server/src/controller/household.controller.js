import Household from '../model/Household.js';

// Lấy tất cả hộ khẩu
export const getAllHouseholds = async (req, res) => {
  try {
    const households = await Household.find().populate('userId', 'username email'); // populate nếu cần thông tin user
    res.status(200).json({
      success: true,
      data: households,
      message: 'Lấy danh sách hộ khẩu thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách hộ khẩu',
      error: error.message
    });
  }
};

// Lấy chi tiết 1 hộ khẩu theo ID
export const getHouseholdById = async (req, res) => {
  try {
    const household = await Household.findById(req.params.id).populate('userId', 'username email');
    if (!household) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hộ khẩu'
      });
    }
    res.status(200).json({
      success: true,
      data: household,
      message: 'Lấy chi tiết hộ khẩu thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy chi tiết hộ khẩu',
      error: error.message
    });
  }
};

// Tạo mới hộ khẩu
export const createHousehold = async (req, res) => {
  try {
    const { apartment, floor, area, head, phone, members } = req.body;
    const userId = req.user.id; // Giả sử userId có trong req.user sau khi auth

    if (!apartment || !floor || !area || !head || !phone || !members) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    const newHousehold = new Household({
      apartment,
      floor,
      area,
      head,
      phone,
      members,
      userId,
    });

    const savedHousehold = await newHousehold.save();

    res.status(201).json({
      success: true,
      data: savedHousehold,
      message: 'Tạo hộ khẩu thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo hộ khẩu',
      error: error.message
    });
  }
};

// Cập nhật hộ khẩu
export const updateHousehold = async (req, res) => {
  try {
    const { apartment, floor, area, head, phone, members } = req.body;
    const updatedData = {};

    if (apartment !== undefined) updatedData.apartment = apartment;
    if (floor !== undefined) updatedData.floor = floor;
    if (area !== undefined) updatedData.area = area;
    if (head !== undefined) updatedData.head = head;
    if (phone !== undefined) updatedData.phone = phone;
    if (members !== undefined) updatedData.members = members;

    const updatedHousehold = await Household.findByIdAndUpdate(req.params.id, updatedData, { new: true });

    if (!updatedHousehold) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hộ khẩu'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedHousehold,
      message: 'Cập nhật hộ khẩu thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật hộ khẩu',
      error: error.message
    });
  }
};

// Xóa hộ khẩu
export const deleteHousehold = async (req, res) => {
  try {
    const household = await Household.findById(req.params.id);

    if (!household) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hộ khẩu'
      });
    }

    await Household.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Xóa hộ khẩu thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa hộ khẩu',
      error: error.message
    });
  }
};
