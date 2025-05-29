import Household from '../model/Household.js';
import Citizen from '../model/Citizen.js';
import Fee from '../model/Fee.js';

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

    const households = await Household.find(filter);

    if (households.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hộ khẩu nào'
      });
    }

    const householdIds = households.map(hh => hh._id);
    const memberList = await Citizen.find({ householdId: { $in: householdIds } });

    const detailedResults = households.map(hh => {
      const memberDetails = memberList.filter(m => m.householdId.toString() === hh._id.toString());
      return {
        ...hh.toObject(),
        memberDetails
      };
    });

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

// Tìm kiếm khoản thu theo tiêu chí
export const searchFees = async (req, res) => {
  try {
    const { 
      name, type, status, minAmount, maxAmount, mandatory, startDate, endDate, description 
    } = req.query;

    const filter = {};

    if (name) filter.name = { $regex: name, $options: 'i' };
    if (description) filter.description = { $regex: description, $options: 'i' };
    if (type) {
      const types = type.split(',').map(t => t.trim().toUpperCase());
      filter.type = { $in: types };
    }
    if (status) {
      const statuses = status.split(',').map(s => s.trim().toUpperCase());
      filter.status = { $in: statuses };
    }
    if (minAmount || maxAmount) {
      filter.amount = {};
      if (minAmount) filter.amount.$gte = parseInt(minAmount);
      if (maxAmount) filter.amount.$lte = parseInt(maxAmount);
    }
    if (mandatory === 'true' || mandatory === 'false') {
      filter.mandatory = mandatory === 'true';
    }
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const results = await Fee.find(filter);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khoản thu nào phù hợp',
        searchCriteria: req.query
      });
    }

    // Tính summary đơn giản
    const summary = {
      total: results.length,
      totalAmount: results.reduce((sum, fee) => sum + fee.amount, 0),
      byType: results.reduce((acc, fee) => {
        acc[fee.type] = (acc[fee.type] || 0) + 1;
        return acc;
      }, {}),
      byStatus: results.reduce((acc, fee) => {
        acc[fee.status] = (acc[fee.status] || 0) + 1;
        return acc;
      }, {}),
      mandatoryCount: results.filter(fee => fee.mandatory).length
    };

    res.status(200).json({
      success: true,
      data: results,
      summary,
      message: 'Tìm kiếm khoản thu thành công'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tìm kiếm khoản thu',
      error: error.message
    });
  }
};
