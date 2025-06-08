// types/household.ts
export interface Household {
  _id: string;
  apartment?: string;
  floor?: number;
  area?: number;
  head?: string;
  phone?: string;
  members?: number;
  userId?: string;
}

export interface HouseholdFormData {
  apartment: string;
  floor: number;
  area: number;
  head: string;
  phone: string;
  members: number;
}