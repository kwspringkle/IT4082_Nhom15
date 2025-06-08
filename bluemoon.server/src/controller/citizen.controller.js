import Citizen from '../model/Citizen.js';
import Household from '../model/Household.js';
import mongoose from 'mongoose';
import History from '../model/History.js';

export const getAllCitizens = async (req, res) => {
  try {
    const { householdId } = req.query;

    const matchConditions = {
      status: { $in: ['Thường trú', 'Tạm vắng'] }
    };

    if (householdId) {
      matchConditions.householdId = new mongoose.Types.ObjectId(householdId);
    }

    const pipeline = [
      { $match: matchConditions },
      {
        $lookup: {
          from: 'households',
          localField: 'householdId',
          foreignField: '_id',
          as: 'household',
        },
      },
      {
        $unwind: {
          path: '$household',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          statusOrder: {
            $switch: {
              branches: [
                { case: { $eq: ['$status', 'Thường trú'] }, then: 1 },
                { case: { $eq: ['$status', 'Tạm vắng'] }, then: 2 },
                { case: { $eq: ['$status', 'Đã chuyển đi'] }, then: 3 },
              ],
              default: 4,
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          citizenId: 1,
          gender: 1,
          dob: 1,
          relation: 1,
          householdId: 1,
          apartment: '$household.apartment',
          status: 1,
          statusOrder: 1,
        },
      },
      {
        $sort: {
          statusOrder: 1,
          apartment: 1,
        },
      },
    ];

    const result = await Citizen.aggregate(pipeline);

    res.json(result);
  } catch (error) {
    console.error(error);
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
    const {
      name,
      citizenId,
      gender,
      dob,
      relation,
      householdId,
      phone, // ← Lấy thêm phone từ body
    } = req.body;

    // Tạo nhân khẩu mới
    const newCitizen = new Citizen({
      name,
      citizenId,
      gender,
      dob,
      relation,
      householdId,
      phone, // ← Thêm phone vào Citizen
    });

    const savedCitizen = await newCitizen.save();
    console.log("✅ Thêm nhân khẩu:", name);

    let updatedHousehold;

    if (relation === "Chủ hộ") {
      // Nếu là Chủ hộ thì cập nhật tên + phone + tăng members
      updatedHousehold = await Household.findByIdAndUpdate(
        householdId,
        {
          head: name,
          phone: phone, // ← Cập nhật phone cho household
          $inc: { members: 1 },
          updatedAt: Date.now(),
        },
        { new: true }
      );
    } else {
      // Nếu không phải chủ hộ thì chỉ tăng members
      updatedHousehold = await Household.findByIdAndUpdate(
        householdId,
        {
          $inc: { members: 1 },
          updatedAt: Date.now(),
        },
        { new: true }
      );
    }

    if (!updatedHousehold) {
      return res.status(404).json({
        message: "Không tìm thấy hộ khẩu để cập nhật",
      });
    }

    return res.status(201).json({
      message: "Thêm nhân khẩu thành công và cập nhật hộ khẩu",
      data: savedCitizen,
      household: updatedHousehold,
    });
  } catch (error) {
    console.error("❌ Lỗi khi thêm nhân khẩu:", error);
    res.status(500).json({
      message: "Lỗi máy chủ khi thêm nhân khẩu",
      error: error.message || "Không xác định",
    });
  }
};



// Cập nhật nhân khẩu
export const updateCitizen = async (req, res) => {
  try {
    const { name, citizenId, gender, dob, apartment, relation, status, householdId } = req.body;

    const updatedCitizen = await Citizen.findByIdAndUpdate(
      req.params.id,
      { name, citizenId, gender, dob, apartment, relation, status, householdId },
      {
        new: true,
        context: { userId: req.user?.id || 'unknown' }  // 👈 Truyền userId vào để log
      }
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

    // 👇 Ghi log thủ công vào History
    await History.create({
      collectionName: 'Citizen',
      documentId: deletedCitizen._id,
      operation: 'delete',
      modifiedBy: req.user?.id || 'unknown',
      changes: { deletedData: deletedCitizen.toObject() }
    });

    res.json({ message: 'Xóa nhân khẩu thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

