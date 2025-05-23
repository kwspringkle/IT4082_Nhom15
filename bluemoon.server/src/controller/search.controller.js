// Hàm tìm kiếm hộ khẩu theo tiêu chí
export const searchHouseholds = async (req, res) => {
  try {
    const {
      apartmentNumber,  // Số căn hộ
      ownerName,       // Tên chủ hộ
      registrationDate // Ngày đăng ký
    } = req.query;

    // Xây dựng điều kiện tìm kiếm
    let searchConditions = {};
    
    if (apartmentNumber) {
      searchConditions.apartmentNumber = { $regex: apartmentNumber, $options: 'i' };
    }
    
    if (ownerName) {
      searchConditions['owner.name'] = { $regex: ownerName, $options: 'i' };
    }
    
    if (registrationDate) {
      searchConditions.registrationDate = registrationDate;
    }

    // Thực hiện tìm kiếm trong database
    const households = await Household.find(searchConditions);

    res.status(200).json({
      success: true,
      data: households,
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
      name,           // Họ tên
      citizenId,      // CCCD/CMT
      gender,         // Giới tính
      apartment,      // Số căn hộ
      dob            // Ngày sinh
    } = req.query;

    // Xây dựng điều kiện tìm kiếm
    let searchConditions = {};
    
    if (name) {
      searchConditions.name = { $regex: name, $options: 'i' };
    }
    
    if (citizenId) {
      searchConditions.citizenId = { $regex: citizenId, $options: 'i' };
    }
    
    if (gender) {
      searchConditions.gender = gender;
    }
    
    if (apartment) {
      searchConditions.apartment = apartment;
    }
    
    if (dob) {
      searchConditions.dob = dob;
    }

    // Thực hiện tìm kiếm trong database
    const citizens = await Citizen.find(searchConditions);

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
