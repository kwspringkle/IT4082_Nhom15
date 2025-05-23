export const citizenHistory = [
  {
    id: 1,
    citizenId: 1, // ID của nhân khẩu
    changeType: 'UPDATE_INFO',
    oldData: {
      name: "Nguyễn Văn An",
      apartment: "101",
      relation: "Chủ hộ",
      phone: "0901234567"
    },
    newData: {
      name: "Nguyễn Văn An",
      apartment: "201",
      relation: "Chủ hộ",
      phone: "0901234567"
    },
    changedAt: "2024-01-15",
    changedBy: "Admin",
    reason: "Chuyển hộ khẩu"
  },
  {
    id: 2,
    citizenId: 3,
    changeType: 'UPDATE_INFO',
    oldData: {
      name: "Nguyễn Minh Đức",
      relation: "Con"
    },
    newData: {
      name: "Nguyễn Minh Đức",
      relation: "Con",
      job: "Học sinh"
    },
    changedAt: "2024-02-20",
    changedBy: "Admin",
    reason: "Cập nhật thông tin nghề nghiệp"
  },
  {
    id: 3,
    citizenId: 5,
    changeType: 'TEMPORARY_ABSENT',
    oldData: {
      status: "Thường trú"
    },
    newData: {
      status: "Tạm vắng",
      reason: "Du học",
      temporaryAddress: "123 ABC Street, Tokyo, Japan",
      duration: "2 năm"
    },
    changedAt: "2024-03-01",
    changedBy: "Admin",
    reason: "Đăng ký tạm vắng"
  }
];
