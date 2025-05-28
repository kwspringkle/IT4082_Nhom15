export const payments = [
  {
    id: 1,
    householdId: 1,
    feeId: 1,
    amount: 100000,
    dueDate: '2025-06-15',
    status: 'UNPAID',
    paidDate: null,
    paidAmount: 0,
    note:   'Phí vệ sinh tháng 5',
    createdAt: '2025-05-01',
    updatedAt: '2025-05-01'
  },
  {
    id: 2,
    householdId: 1,
    feeId: 2,
    amount: 500000,
    dueDate: '2025-06-15',
    status: 'PAID',
    paidDate: '2025-05-10',
    paidAmount: 500000,
    note: 'Phí gửi xe quý 2',
    createdAt: '2025-05-01',
    updatedAt: '2025-05-10'
  },
  {
    id: 3,
    householdId: 2,
    feeId: 1,
    amount: 100000,
    dueDate: '2025-06-15',
    status: 'PARTIAL',
    paidDate: '2025-05-15',
    paidAmount: 50000,
    note: 'Phí vệ sinh tháng 5 - đã dùng một phần',
    createdAt: '2025-05-01',
    updatedAt: '2025-05-15'
  },
  {
    id: 4,
    householdId: 3,
    feeId: 3,
    amount: 2000000,
    dueDate: '2025-12-31',
    status: 'UNPAID',
    paidDate: null,
    paidAmount: 0,
    note: 'Phí bảo trì năm 2025',
    createdAt: '2025-05-01',
    updatedAt: '2025-05-01'
  },
  {
    id: 5,
    householdId: 2,
    feeId: 2,
    amount: 500000,
    dueDate: '2025-06-15',
    status: 'UNPAID',
    paidDate: null,
    paidAmount: 0,
    note: 'Phí gửi xe quý 2',
    createdAt: '2025-05-01',
    updatedAt: '2025-05-01'
  }
];


