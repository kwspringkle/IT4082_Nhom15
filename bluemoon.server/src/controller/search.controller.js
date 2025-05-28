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
    const { 
      name,           // Tìm theo tên
      type,           // MONTHLY/YEARLY
      status,         // ACTIVE/INACTIVE
      minAmount,      // Số tiền tối thiểu
      maxAmount,      // Số tiền tối đa
      mandatory,      // Tính bắt buộc
      startDate,      // Ngày tạo từ
      endDate,        // Ngày tạo đến
      description     // Tìm trong mô tả
    } = req.query;

    let results = [...fees];

    // Tìm theo tên hoặc mô tả
    if (name || description) {
      results = results.filter(fee => {
        const matchName = name ? 
          fee.name.toLowerCase().includes(name.toLowerCase()) : true;
        const matchDesc = description ? 
          fee.description.toLowerCase().includes(description.toLowerCase()) : true;
        return matchName || matchDesc;
      });
    }

    // Tìm theo loại (MONTHLY/YEARLY)
    if (type) {      const validTypes = ['MONTHLY', 'YEARLY'];
      const types = type.split(',').map(t => t.trim().toUpperCase());
      const invalidTypes = types.filter(t => !validTypes.includes(t));
      
      if (invalidTypes.length > 0) {
        console.log('=== Fee Search: Invalid Parameter ===');
        console.log('Time:', new Date().toISOString());
        console.log('Invalid type parameter:', invalidTypes);
        console.log('Expected values:', validTypes);
        console.log('Request Query:', req.query);
        console.log('Client IP:', req.ip);
        console.log('==============================');

        return res.status(400).json({
          success: false,
          message: 'Giá trị type không hợp lệ',
          invalidParam: {
            type: invalidTypes,
            expected: validTypes
          }
        });
      }

      results = results.filter(fee => types.includes(fee.type));
    }

    // Tìm theo trạng thái (ACTIVE/INACTIVE)
    if (status) {
      const validStatuses = ['ACTIVE', 'INACTIVE'];
      const statuses = status.split(',').map(s => s.trim().toUpperCase());
      const invalidStatuses = statuses.filter(s => !validStatuses.includes(s));

      if (invalidStatuses.length > 0) {
        console.log('=== Fee Search: Invalid Parameter ===');
        console.log('Time:', new Date().toISOString());
        console.log('Invalid status parameter:', invalidStatuses);
        console.log('Expected values:', validStatuses);
        console.log('Request Query:', req.query);
        console.log('Client IP:', req.ip);
        console.log('==============================');

        return res.status(400).json({
          success: false,
          message: 'Giá trị status không hợp lệ',
          invalidParam: {
            status: invalidStatuses,
            expected: validStatuses
          }
        });
      }

      results = results.filter(fee => statuses.includes(fee.status));
    }

    // Tìm theo khoảng tiền
    if (minAmount || maxAmount) {
      results = results.filter(fee => {
        const amount = fee.amount;
        const meetsMin = minAmount ? amount >= parseInt(minAmount) : true;
        const meetsMax = maxAmount ? amount <= parseInt(maxAmount) : true;
        return meetsMin && meetsMax;
      });
    }    // Validate và tìm theo tính bắt buộc
    if (mandatory !== undefined) {
      if (mandatory !== 'true' && mandatory !== 'false') {
        console.log('=== Fee Search: Invalid Parameter ===');
        console.log('Time:', new Date().toISOString());
        console.log('Invalid mandatory parameter:', mandatory);
        console.log('Expected: "true" or "false"');
        console.log('Request Query:', req.query);
        console.log('Client IP:', req.ip);
        console.log('==============================');

        return res.status(400).json({
          success: false,
          message: 'Giá trị mandatory không hợp lệ. Chỉ chấp nhận "true" hoặc "false"',
          invalidParam: {
            mandatory: mandatory,
            expected: ['true', 'false']
          }
        });
      }
      const isMandatory = mandatory === 'true';
      results = results.filter(fee => 
        fee.mandatory === isMandatory
      );
    }// Tìm theo khoảng thời gian tạo
    if (startDate || endDate) {
      results = results.filter(fee => {
        const createdAt = new Date(fee.createdAt);
        const start = startDate ? new Date(startDate) : new Date(0);
        const end = endDate ? new Date(endDate) : new Date();
        return createdAt >= start && createdAt <= end;
      });
    }

    // Ghi log và trả về thông báo khi không tìm thấy kết quả
    if (results.length === 0) {
      console.log('=== Fee Search: No Results ===');
      console.log('Time:', new Date().toISOString());
      console.log('Search Criteria:', {
        name: name || 'Not specified',
        type: type || 'Not specified',
        status: status || 'Not specified',
        amount: minAmount || maxAmount ? `${minAmount || 0} - ${maxAmount || 'unlimited'}` : 'Not specified',
        mandatory: mandatory !== undefined ? mandatory : 'Not specified',
        dateRange: startDate || endDate ? `${startDate || 'any'} to ${endDate || 'any'}` : 'Not specified',
        description: description || 'Not specified'
      });
      console.log('Total fees in database:', fees.length);
      console.log('==============================');

      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy khoản thu nào phù hợp với tiêu chí tìm kiếm',
        searchCriteria: {
          name, type, status, minAmount, maxAmount,
          mandatory, startDate, endDate, description
        }
      });
    }

    // Add summary statistics to the response
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
      message: 'Fee search completed successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tìm kiếm khoản thu',
      error: error.message
    });
  }
};