import Household from '../model/Household.js';
import Citizen from '../model/Citizen.js';

// Tìm kiếm hộ khẩu theo tiêu chí
export const searchHouseholds = async (req, res) => {
  try {
    const { apartment, floor, head, phone, members } = req.query;

    const filter = {};

    if (apartment) filter.apartment = { $regex: apartment, $options: 'i' };
    if (floor) filter.floor = parseInt(floor);
    if (head) filter.head = { $regex: head, $options: 'i' };
    if (phone) filter.phone = { $regex: phone };
    if (members) filter.members = parseInt(members);

    // Tìm hộ khẩu theo filter
    const households = await Household.find(filter);

    if (households.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hộ khẩu nào'
      });
    }

    // Tìm thành viên trong từng hộ khẩu
    const detailedResults = await Promise.all(
      households.map(async (household) => {
        const memberDetails = await Citizen.find({ householdId: household._id });
        return {
          ...household.toObject(),
          memberDetails
        };
      })
    );

    res.status(200).json({
      success: true,
      data: detailedResults,
      message: 'Tìm kiếm hộ khẩu thành công'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tìm kiếm hộ khẩu',
      error: error.message
    });
  }
};

// Tìm kiếm nhân khẩu theo tiêu chí
export const searchCitizens = async (req, res) => {
  try {
    const { name, citizenId, gender, apartment, dob, relation, householdId } = req.query;

    const filter = {};

    if (name) filter.name = { $regex: name, $options: 'i' };
    if (citizenId) filter.citizenId = { $regex: citizenId };
    if (gender) filter.gender = gender.toLowerCase();
    if (apartment) filter.apartment = apartment;
    if (dob) filter.dob = dob;
    if (relation) filter.relation = { $regex: relation, $options: 'i' };
    if (householdId) filter.householdId = householdId;

    // Tìm nhân khẩu theo filter
    const citizens = await Citizen.find(filter);

    if (citizens.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhân khẩu nào'
      });
    }

    res.status(200).json({
      success: true,
      data: citizens,
      message: 'Tìm kiếm nhân khẩu thành công'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tìm kiếm nhân khẩu',
      error: error.message
    });
  }
};
