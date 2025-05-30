import { Household, Resident, Fee, Payment, User } from '@/types';

// Mock data for households
export const mockHouseholds: Household[] = [
  {
    id: '1',
    apartmentNumber: '201',
    floor: 2,
    area: 75,
    numberOfMembers: 3,
    owner: 'Nguyễn Văn An',
    phoneNumber: '0901234567',
  },
  {
    id: '2',
    apartmentNumber: '202',
    floor: 2,
    area: 65,
    numberOfMembers: 2,
    owner: 'Trần Thị Bình',
    phoneNumber: '0912345678',
  },
  {
    id: '3',
    apartmentNumber: '301',
    floor: 3,
    area: 80,
    numberOfMembers: 4,
    owner: 'Lê Hoàng Chung',
    phoneNumber: '0923456789',
  },
  {
    id: '4',
    apartmentNumber: '302',
    floor: 3,
    area: 70,
    numberOfMembers: 3,
    owner: 'Phạm Minh Dương',
    phoneNumber: '0934567890',
  },
  {
    id: '5',
    apartmentNumber: '401',
    floor: 4,
    area: 85,
    numberOfMembers: 5,
    owner: 'Hoàng Thị Lan',
    phoneNumber: '0945678901',
  },
];

// Mock data for residents
export const mockResidents: Resident[] = [
  {
    id: '1',
    name: 'Nguyễn Văn An',
    idNumber: '001201000001',
    gender: 'male',
    dateOfBirth: '1980-05-15',
    phoneNumber: '0901234567',
    householdId: '1',
    relation: 'Chủ hộ',
  },
  {
    id: '2',
    name: 'Nguyễn Thị Ánh',
    idNumber: '001201000002',
    gender: 'female',
    dateOfBirth: '1982-08-20',
    phoneNumber: '0901234568',
    householdId: '1',
    relation: 'Vợ',
  },
  {
    id: '3',
    name: 'Nguyễn Minh Đức',
    idNumber: '001201000003',
    gender: 'male',
    dateOfBirth: '2010-03-10',
    phoneNumber: '',
    householdId: '1',
    relation: 'Con',
  },
  {
    id: '4',
    name: 'Trần Thị Bình',
    idNumber: '001201000004',
    gender: 'female',
    dateOfBirth: '1975-11-05',
    phoneNumber: '0912345678',
    householdId: '2',
    relation: 'Chủ hộ',
  },
  {
    id: '5',
    name: 'Trần Văn Cường',
    idNumber: '001201000005',
    gender: 'male',
    dateOfBirth: '1975-12-15',
    phoneNumber: '0912345679',
    householdId: '2',
    relation: 'Chồng',
  },
];

// Mock data for fees
export const mockFees: Fee[] = [
  {
    id: '1',
    name: 'Phí dịch vụ chung cư',
    type: 'service',
    amount: null,
    ratePerSqm: 16500,
    description: 'Phí dịch vụ tính theo diện tích căn hộ',
    mandatory: true,
    deadline: new Date('2025-06-30'),
    repeat: true,
  },
  {
    id: '2',
    name: 'Phí quản lý',
    type: 'management',
    amount: null,
    ratePerSqm: 7000,
    description: 'Phí quản lý tính theo diện tích căn hộ',
    mandatory: true,
    deadline: new Date('2025-06-30'),
    repeat: true,
  },
  {
    id: '3',
    name: 'Quỹ vì người nghèo',
    type: 'contribution',
    amount: 50000,
    ratePerSqm: null,
    description: 'Đóng góp tự nguyện',
    mandatory: false,
    deadline: new Date('2025-06-30'),
    repeat: true,
  },
  {
    id: '4',
    name: 'Phí gửi xe máy',
    type: 'parking',
    amount: 70000,
    ratePerSqm: null,
    description: 'Phí gửi xe máy hàng tháng',
    mandatory: true,
    deadline: new Date('2025-06-30'),
    repeat: true,
  },
  {
    id: '5',
    name: 'Phí gửi ô tô',
    type: 'parking',
    amount: 1200000,
    ratePerSqm: null,
    description: 'Phí gửi ô tô hàng tháng',
    mandatory: true,
    deadline: new Date('2025-06-30'),
    repeat: true,
  },
];

// Mock data for users
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin1',
    name: 'Nguyễn Văn Admin',
    role: 'admin',
    email: 'admin1@bluemoon.com',
    phone: '0901234567',
    status: 'active',
    createdAt: '2023-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    username: 'staff1',
    name: 'Trần Thị Nhân Viên',
    role: 'staff',
    email: 'staff1@bluemoon.com',
    phone: '0912345678',
    status: 'active',
    createdAt: '2023-02-01T00:00:00.000Z',
  },
  {
    id: '3',
    username: 'superadmin1',
    name: 'Lê Hoàng Quản Trị',
    role: 'superadmin',
    email: 'superadmin1@bluemoon.com',
    phone: '0923456789',
    status: 'active',
    createdAt: '2023-03-01T00:00:00.000Z',
  },
];

// Generate mock payments based on households and fees
export const generateMockPayments = (): Payment[] => {
  const payments: Payment[] = [];
  const currentDate = new Date();
  const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const previousMonth = currentDate.getMonth() === 0
    ? `${currentDate.getFullYear() - 1}-12`
    : `${currentDate.getFullYear()}-${String(currentDate.getMonth()).padStart(2, '0')}`;

  // For each household and each fee, create payments for current and previous months
  mockHouseholds.forEach(household => {
    mockFees.forEach(fee => {
      // Calculate amount based on ratePerSqm or fixed amount
      const amount = fee.ratePerSqm ? fee.ratePerSqm * household.area : fee.amount || 0;

      // Use fee.deadline for dueDate, or fallback to end of month if undefined
      const dueDate = fee.deadline
        ? new Date(fee.deadline)
        : new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0); // Last day of current month

      // For current month
      payments.push({
        id: `${household.id}-${fee.id}-${currentMonth}`,
        householdId: household.id,
        feeId: fee.id,
        amount,
        period: currentMonth,
        status: Math.random() > 0.3 ? 'paid' : 'unpaid',
        paidAt: Math.random() > 0.3
          ? new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              Math.floor(Math.random() * (dueDate.getDate() || 28)) + 1
            ).toISOString()
          : null,
        dueDate: dueDate.toISOString(),
      });

      // For previous month
      const prevDueDate = fee.deadline
        ? new Date(fee.deadline.getFullYear(), fee.deadline.getMonth() - 1, fee.deadline.getDate())
        : new Date(currentDate.getFullYear(), currentDate.getMonth(), 0); // Last day of previous month

      payments.push({
        id: `${household.id}-${fee.id}-${previousMonth}`,
        householdId: household.id,
        feeId: fee.id,
        amount,
        period: previousMonth,
        status: 'paid',
        paidAt: new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() - 1,
          Math.floor(Math.random() * (prevDueDate.getDate() || 28)) + 1
        ).toISOString(),
        dueDate: prevDueDate.toISOString(),
      });
    });
  });

  return payments;
};

export const mockPayments = generateMockPayments();

export const calculatePaymentStats = () => {
  const currentDate = new Date();
  const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

  const currentMonthPayments = mockPayments.filter(payment => payment.period === currentMonth);

  const totalExpected = currentMonthPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalPaid = currentMonthPayments
    .filter(payment => payment.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const paidCount = currentMonthPayments.filter(payment => payment.status === 'paid').length;
  const unpaidCount = currentMonthPayments.filter(payment => payment.status === 'unpaid').length;

  return {
    totalExpected,
    totalPaid,
    paidCount,
    unpaidCount,
    paymentRate: totalExpected > 0 ? (totalPaid / totalExpected) * 100 : 0,
  };
};