// src/seed/fakeHouseholds.js
export const households = [
  {
    id: 1,
    apartment: '201',
    floor: 2,
    area: 75,
    head: 'Nguyễn Văn An',
    phone: '0901234567',
    members: 3,
    userId: 1, // <-- tham chiếu đến users[0]
  },
  {
    id: 2,
    apartment: '202',
    floor: 2,
    area: 65,
    head: 'Trần Thị Bình',
    phone: '0912345678',
    members: 2,
    userId: 2,
  },
  {
    id: 3,
    apartment: '301',
    floor: 3,
    area: 80,
    head: 'Lê Hoàng Chung',
    phone: '0923456789',
    members: 4,
    userId: 3,
  },
  {
    id: 4,
    apartment: '302',
    floor: 3,
    area: 70,
    head: 'Phạm Minh Dương',
    phone: '0934567890',
    members: 3,
    userId: 4,
  },
  {
    id: 5,
    apartment: '401',
    floor: 4,
    area: 85,
    head: 'Hoàng Thị Lan',
    phone: '0945678901',
    members: 5,
    userId: 5,
  }
];
