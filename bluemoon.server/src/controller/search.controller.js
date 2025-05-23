import { citizens } from '../seed/fakeCitizens.js';
import { households } from '../seed/fakeHouseholds.js';

// Hàm tìm kiếm hộ khẩu theo tiêu chí
export const searchHouseholds = async (req, res) => {
  try {
    const {
      apartment,
      floor,
      head,
      phone,
      members
    } = req.query;

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

    res.status(200).json({
      success: true,
      data: results,
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
    const {
      name,
      citizenId,
      gender,
      apartment,
      dob,
      relation,
      householdId
    } = req.query;

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

    res.status(200).json({
      success: true,
      data: results,
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