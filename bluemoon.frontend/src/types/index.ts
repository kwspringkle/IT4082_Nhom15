export interface Household {
  id: string;
  apartmentNumber: string;
  floor: number;
  area: number;
  numberOfMembers: number;
  owner: string;
  phoneNumber: string;
}

export interface Resident {
  id: string;
  name: string;
  idNumber: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  phoneNumber: string;
  householdId: string;
  relation: string;
}

export interface Fee {
  id: string;
  name: string;
  type: 'service' | 'management' | 'contribution' | 'parking' | 'utility';
  amount: number | null;
  ratePerSqm: number | null;
  description: string;
  mandatory: boolean;
  deadline?: Date;
  repeat: boolean;
}

export interface Payment {
  id: string;
  householdId: string;
  feeId: string;
  amount: number;
  period: string; // e.g., "2023-05"
  status: 'paid' | 'unpaid' | 'late';
  paidAt: string | null;
  dueDate: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'staff' | 'superadmin';
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}
