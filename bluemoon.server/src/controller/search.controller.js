import { citizens } from '../seed/fakeCitizens.js';
import { households } from '../seed/fakeHouseholds.js';
import { fees } from '../seed/fakeFees.js';

// Hàm tìm kiếm hộ khẩu theo tiêu chí
export const searchHouseholds = async (req, res) => {
  try {
    const { apartment, floor, head, phone, members } = req.query;

    let results = [...households];

    if (apartment) {
      results = results.filter(h => 
        h.apartment.toLowerCase().includes(apartment.toLowerCase())
      );
    }

    if (floor) {
      results = results.filter(h => 
        h.floor === parseInt(floor)
      );
    }

    if (head) {
      results = results.filter(h => 
        h.head.toLowerCase().includes(head.toLowerCase())
      );
    }

    if (phone) {
      results = results.filter(h => 
        h.phone.includes(phone)
      );
    }

    if (members) {
      results = results.filter(h => 
        h.members === parseInt(members)
      );
    }
    // Nếu không có kết quả nào, trả về thông báo
    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy hộ khẩu nào'
      });
    }

    // Thêm thông tin chi tiết về các thành viên trong hộ
    const detailedResults = results.map(household => {
      const householdMembers = citizens.filter(c => c.householdId === household.id);
      return {
        ...household,
        memberDetails: householdMembers
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

// Hàm tìm kiếm nhân khẩu theo tiêu chí
export const searchCitizens = async (req, res) => {
  try {
    const { name, citizenId, gender, apartment, dob, relation, householdId } = req.query;

    let results = [...citizens];

    if (name) {
      results = results.filter(c => 
        c.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    if (citizenId) {
      results = results.filter(c => 
        c.citizenId.includes(citizenId)
      );
    }

    if (gender) {
      results = results.filter(c => 
        c.gender.toLowerCase() === gender.toLowerCase()
      );
    }

    if (apartment) {
      results = results.filter(c => 
        c.apartment === apartment
      );
    }

    if (dob) {
      results = results.filter(c => 
        c.dob === dob
      );
    }

    if (relation) {
      results = results.filter(c =>
        c.relation.toLowerCase().includes(relation.toLowerCase())
      );
    }

    if (householdId) {
      results = results.filter(c =>
        c.householdId === parseInt(householdId)
      );
    }

 
    const detailedResults = results.map(citizen => {
      const household = households.find(h => h.id === citizen.householdId);
      return {
        ...citizen,
      };
    });
    // Nếu không có kết quả nào, trả về thông báo
    if (detailedResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy nhân khẩu nào'
      });
    }

    res.status(200).json({
      success: true,
      data: detailedResults,
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
    const { name, type, status, minAmount, maxAmount, mandatory } = req.query;

    let results = [...fees];

    // Tìm theo tên
    if (name) {
      results = results.filter(fee => 
        fee.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    // Tìm theo loại (MONTHLY/YEARLY)
    if (type) {
      results = results.filter(fee => 
        fee.type.toLowerCase() === type.toLowerCase()
      );
    }

    // Tìm theo trạng thái
    if (status) {
      results = results.filter(fee => 
        fee.status.toLowerCase() === status.toLowerCase()
      );
    }

    // Tìm theo khoảng tiền
    if (minAmount) {
      results = results.filter(fee => 
        fee.amount >= parseInt(minAmount)
      );
    }

    if (maxAmount) {
      results = results.filter(fee => 
        fee.amount <= parseInt(maxAmount)
      );
    }

    // Tìm theo tính bắt buộc
    if (mandatory !== undefined) {
      const isMandatory = mandatory === 'true';
      results = results.filter(fee => 
        fee.mandatory === isMandatory
      );
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khoản thu nào phù hợp với tiêu chí tìm kiếm'
      });
    }

    res.status(200).json({
      success: true,
      data: results,
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