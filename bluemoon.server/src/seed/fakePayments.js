
import fs from "fs";
import path from "path";

export const payments = [
  {
    "id": 1,
    "householdId": 1,
    "feeId": 1,
    "amount": 100000,
    "dueDate": "2025-06-15",
    "status": "PAID",
    "paidDate": "2025-12-05",
    "paidAmount": 100000,
    "note": "Đã thanh toán bằng tiền mặt",
    "createdAt": "2025-05-01",
    "updatedAt": "2025-05-29"
  },
  {
    "id": 2,
    "householdId": 1,
    "feeId": 2,
    "amount": 500000,
    "dueDate": "2025-06-15",
    "status": "PAID",
    "paidDate": "2025-05-10",
    "paidAmount": 500000,
    "note": "Phí gửi xe quý 2",
    "createdAt": "2025-05-01",
    "updatedAt": "2025-05-10"
  },
  {
    "id": 3,
    "householdId": 2,
    "feeId": 1,
    "amount": 100000,
    "dueDate": "2025-06-15",
    "status": "PARTIAL",
    "paidDate": "2025-12-05",
    "paidAmount": 50000,
    "note": "Phí vệ sinh tháng 5, đã thanh toán một phần",
    "createdAt": "2025-05-01",
    "updatedAt": "2025-05-29"
  },
  {
    "id": 4,
    "householdId": 3,
    "feeId": 3,
    "amount": 2000000,
    "dueDate": "2025-12-31",
    "status": "UNPAID",
    "paidDate": null,
    "paidAmount": 0,
    "note": "Phí bảo trì năm 2025",
    "createdAt": "2025-05-01",
    "updatedAt": "2025-05-01"
  },
  {
    "id": 5,
    "householdId": 2,
    "feeId": 2,
    "amount": 500000,
    "dueDate": "2025-06-15",
    "status": "UNPAID",
    "paidDate": null,
    "paidAmount": 0,
    "note": "Phí gửi xe quý 2",
    "createdAt": "2025-05-01",
    "updatedAt": "2025-05-01"
  },
  {
    "id": 6,
    "householdId": 4,
    "feeId": 1,
    "amount": 100000,
    "dueDate": "2025-06-15",
    "status": "PAID",
    "paidDate": "2025-05-20",
    "paidAmount": 100000,
    "note": "Phí vệ sinh tháng 5",
    "createdAt": "2025-05-01",
    "updatedAt": "2025-05-20"
  },
  {
    "id": 7,
    "householdId": 4,
    "feeId": 2,
    "amount": 500000,
    "dueDate": "2025-06-15",
    "status": "UNPAID",
    "paidDate": null,
    "paidAmount": 0,
    "note": "Phí gửi xe quý 2",
    "createdAt": "2025-05-01",
    "updatedAt": "2025-05-01"
  },
  {
    "id": 8,
    "householdId": 4,
    "feeId": 3,
    "amount": 2000000,
    "dueDate": "2025-12-31",
    "status": "UNPAID",
    "paidDate": null,
    "paidAmount": 0,
    "note": "Phí bảo trì năm 2025",
    "createdAt": "2025-05-01",
    "updatedAt": "2025-05-01"
  },
  {
    "id": 9,
    "householdId": 5,
    "feeId": 1,
    "amount": 100000,
    "dueDate": "2025-06-15",
    "status": "PAID",
    "paidDate": "2025-05-25",
    "paidAmount": 100000,
    "note": "Phí vệ sinh tháng 5",
    "createdAt": "2025-05-01",
    "updatedAt": "2025-05-25"
  },
  {
    "id": 10,
    "householdId": 5,
    "feeId": 2,
    "amount": 500000,
    "dueDate": "2025-06-15",
    "status": "UNPAID",
    "paidDate": null,
    "paidAmount": 0,
    "note": "Phí gửi xe quý 2",
    "createdAt": "2025-05-01",
    "updatedAt": "2025-05-01"
  },
  {
    "id": 11,
    "householdId": 5,
    "feeId": 3,
    "amount": 2000000,
    "dueDate": "2025-12-31",
    "status": "UNPAID",
    "paidDate": null,
    "paidAmount": 0,
    "note": "Phí bảo trì năm 2025",
    "createdAt": "2025-05-01",
    "updatedAt": "2025-05-01"
  },
  {
    "id": 12,
    "householdId": 1,
    "feeId": 3,
    "amount": 2000000,
    "dueDate": "2025-12-31",
    "status": "UNPAID",
    "paidDate": null,
    "paidAmount": 0,
    "note": "Phí bảo trì năm 2025",
    "createdAt": "2025-05-01",
    "updatedAt": "2025-05-01"
  }
];

// Hàm lưu dữ liệu vào file
export const savePayments = (updatedPayments) => {
    try {
        const filePath = path.join(process.cwd(), 'src/seed/fakePayments.js');
        const fileContent = `
import fs from "fs";
import path from "path";

export const payments = ${JSON.stringify(updatedPayments, null, 2)};

// Hàm lưu dữ liệu vào file
export const savePayments = ${savePayments.toString()};
`;
        fs.writeFileSync(filePath, fileContent);
        return true;
    } catch (error) {
        console.error('Lỗi khi lưu dữ liệu payments:', error);
        throw error;
    }
};
