export const fees = [
  {
    id: 1,
    name: "Phí quản lý chung cư",
    amount: 5000, // VND/m2
    type: "MONTHLY", // Định kỳ hàng tháng
    description: "Phí quản lý và vận hành chung cư hàng tháng",
    mandatory: true, // Bắt buộc
    status: "ACTIVE",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: 2,
    name: "Phí gửi xe máy",
    amount: 100000, // VND/xe/tháng
    type: "MONTHLY",
    description: "Phí gửi xe máy tại hầm để xe",
    mandatory: false,
    status: "ACTIVE",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: 3,
    name: "Phí gửi ô tô",
    amount: 1200000, // VND/xe/tháng
    type: "MONTHLY",
    description: "Phí gửi ô tô tại hầm để xe",
    mandatory: false,
    status: "ACTIVE",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: 4,
    name: "Phí bảo trì",
    amount: 25000, // VND/m2
    type: "YEARLY", // Định kỳ hàng năm
    description: "Phí bảo trì cơ sở hạ tầng chung cư",
    mandatory: true,
    status: "ACTIVE",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  },
  {
    id: 5,
    name: "Phí dịch vụ bể bơi",
    amount: 200000, // VND/người/tháng
    type: "MONTHLY",
    description: "Phí sử dụng bể bơi",
    mandatory: false,
    status: "ACTIVE",
    createdAt: "2024-01-01",
    updatedAt: "2024-01-01"
  }
];
