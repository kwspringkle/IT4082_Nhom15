export interface Payment {
  id: string; 
  householdId: string;
  household: string;
  feeName: string;
  feeId: string; 
  period: string;
  amount: number;
  status: "PAID" | "UNPAID" | "PARTIAL" ;
  dueDate: string | null;
  paidAt: string | null;
  note: string;
}

export interface PaymentFormData {
  id?: string; 
  householdId: string;
  feeId: string;
  amount: string | number;
  status: "PAID" | "PARTIAL" | "UNPAID" | "LATE"; // Align with Payment
  paidDate: string;
  note?: string;
  household?: string; 
  feeName?: string; 
}

export interface HouseholdOption {
  id: string;
  label: string;
}

export interface FeeOption {
  id: string;
  name: string;
  amount?: number;
}