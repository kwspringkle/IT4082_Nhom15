import Household from '../model/Household.js';
import Payment from '../model/Payment.js';
import Citizen from '../model/Citizen.js';
import History from '../model/History.js';

// Lấy tất cả hộ khẩu (không populate user)
export const getAllHouseholds = async (req, res) => {
  try {
    const households = await Household.find().sort({ apartment: 1 }); // Sắp xếp tăng dần theo apartment
    res.status(200).json({
      success: true,
      data: households,
      message: 'Lấy danh sách hộ khẩu thành công',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách hộ khẩu',
      error: error.message,
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
    const { apartment, floor, area, head, phone } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Không xác thực được người dùng",
      });
    }

    const userId = req.user.id;

    // Chỉ bắt buộc 3 trường apartment, floor, area
    if (!apartment || !floor || !area) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc: apartment, floor hoặc area',
      });
    }

    // Chuyển floor và area về số nếu cần
    const floorNum = parseInt(floor);
    const areaNum = parseFloat(area);

    if (isNaN(floorNum) || floorNum <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Tầng phải là số dương',
      });
    }

    if (isNaN(areaNum) || areaNum <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Diện tích phải là số dương',
      });
    }

    // Nếu có phone thì kiểm tra định dạng
    if (phone && !/^0\d{9}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Số điện thoại phải là 10 số và bắt đầu bằng 0',
      });
    }

    const newHousehold = new Household({
      apartment,
      floor: floorNum,
      area: areaNum,
      head: head || "",  // nếu không truyền thì mặc định chuỗi rỗng
      phone: phone || "",
    });

    const savedHousehold = await newHousehold.save();
    console.log("✅ Hộ khẩu đã lưu:", savedHousehold);

    res.status(201).json({
      success: true,
      data: savedHousehold,
      message: 'Tạo hộ khẩu thành công',
    });

  } catch (error) {
    console.error("🔥 Lỗi khi tạo hộ khẩu:", error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo hộ khẩu',
      error: error.message || 'Lỗi không xác định',
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

    updatedData.updatedAt = Date.now();

    const updatedHousehold = await Household.findOneAndUpdate(
      { _id: req.params.id },
      updatedData,
      {
        new: true,
        context: { userId: req.user?.id || 'unknown' } // ✅ để middleware biết ai cập nhật
      }
    );

    if (!updatedHousehold) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hộ khẩu'
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedHousehold,
      message: 'Cập nhật hộ khẩu thành công'
    });
  } catch (error) {
    console.error("Error in updateHousehold:", error);
    return res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật hộ khẩu',
      error: error.message
    });
  }
};



// Xóa hộ khẩu
// Xóa hộ khẩu (reset thông tin)
export const deleteHousehold = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedHousehold = await Household.findOneAndUpdate(
      { _id: id },
      {
        head: "",
        phone: "",
        members: 0,
        updatedAt: Date.now(),
      },
      {
        new: true,
        context: { userId: req.user?.id || 'unknown' } // ✅ để middleware log lại
      }
    );

    if (!updatedHousehold) {
      return res.status(404).json({ success: false, message: "Không tìm thấy hộ khẩu" });
    }

    const updatedCitizens = await Citizen.updateMany(
      { householdId: id },
      { $set: { status: "Đã chuyển đi" } }
    );

    return res.status(200).json({
      success: true,
      data: updatedHousehold,
      updatedCitizensCount: updatedCitizens.modifiedCount,
      message: "Đặt lại thông tin hộ khẩu thành công và cập nhật trạng thái nhân khẩu"
    });
  } catch (error) {
    console.error("Error in deleteHousehold:", error);
    return res.status(500).json({ success: false, message: "Lỗi khi đặt lại thông tin hộ khẩu", error: error.message });
  }
};


// Lấy danh sách khoản nộp của một hộ khẩu
export const getPaymentsByHousehold = async (req, res) => {
  try {
    const householdId = req.params.id;
    const payments = await Payment.find({ householdId }).populate('feeId', 'name type');
    
    // map lại để dễ dùng
    const result = payments.map(p => ({
      id: p._id,
      householdId: p.householdId,
      feeId: p.feeId._id,
      feeName: p.feeId.name,
      feeType: p.feeId.type,
      amount: p.amount,
      dueDate: p.dueDate,
      status: p.status,
      paidDate: p.paidDate,
      paidAmount: p.paidAmount,
      note: p.note,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt
    }));

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
