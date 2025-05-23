
import fs from "fs";
import path from "path";

export const fees = [
  {
    "id": 1,
    "name": "Phí quản lý chung cư",
    "amount": 50000,
    "type": "MONTHLY",
    "description": "Phí quản lý và vận hành chung cư hàng tháng (đã cập nhật)",
    "mandatory": true,
    "status": "ACTIVE",
    "createdAt": "2024-01-01",
    "updatedAt": "2025-05-23"
  },
  {
    "id": 2,
    "name": "Phí gửi xe máy",
    "amount": 100000,
    "type": "MONTHLY",
    "description": "Phí gửi xe máy tại hầm để xe",
    "mandatory": false,
    "status": "ACTIVE",
    "createdAt": "2024-01-01",
    "updatedAt": "2024-01-01"
  },
  {
    "id": 3,
    "name": "Phí gửi ô tô",
    "amount": 1200000,
    "type": "MONTHLY",
    "description": "Phí gửi ô tô tại hầm để xe",
    "mandatory": false,
    "status": "ACTIVE",
    "createdAt": "2024-01-01",
    "updatedAt": "2024-01-01"
  },
  {
    "id": 4,
    "name": "Phí bảo trì",
    "amount": 25000,
    "type": "YEARLY",
    "description": "Phí bảo trì cơ sở hạ tầng chung cư",
    "mandatory": true,
    "status": "ACTIVE",
    "createdAt": "2024-01-01",
    "updatedAt": "2024-01-01"
  },
  {
    "id": 5,
    "name": "Phí dịch vụ bể bơi",
    "amount": 200000,
    "type": "MONTHLY",
    "description": "Phí sử dụng bể bơi",
    "mandatory": false,
    "status": "ACTIVE",
    "createdAt": "2024-01-01",
    "updatedAt": "2024-01-01"
  },
  {
    "id": 6,
    "name": "Phí vệ sinh",
    "amount": 100000,
    "type": "MONTHLY",
    "description": "Phí cho các dịch vệ sinh chung cư, thu dọn và xử lí rác",
    "mandatory": true,
    "status": "ACTIVE",
    "createdAt": "2025-05-23",
    "updatedAt": "2025-05-23"
  }
];

// Hàm lưu dữ liệu vào file
export const saveFees = (updatedFees) => {
    try {
        const filePath = path.join(process.cwd(), 'src/seed/fakeFees.js');
        const fileContent = `
import fs from "fs";
import path from "path";

export const fees = ${JSON.stringify(updatedFees, null, 2)};

// Hàm lưu dữ liệu vào file
export const saveFees = ${saveFees.toString()};
`;
        fs.writeFileSync(filePath, fileContent);
        return true;
    } catch (error) {
        console.error('Lỗi khi lưu dữ liệu:', error);
        throw error;
    }
};
