export interface Payment {
  id: string;
  household: string;
  feeName: string;
  period: string;
  amount: number;
  status: "PAID" | "UNPAID" | "LATE" | "UNKNOWN";
  dueDate: string | null;
  paidAt: string | null;
  note: string;
}

export interface PaymentFormData {
  householdId: string;
  feeId: string;
  amount: string | number;
  status: "PAID" | "PARTIAL" | "UNPAID";
  paidDate: string;
  note: string;
}

export interface HouseholdOption {
  id: string;
  label: string;
}