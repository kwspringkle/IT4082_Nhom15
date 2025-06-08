export type FeeType = "MONTHLY" | "YEARLY";
export type FeeStatus = "ACTIVE" | "INACTIVE";

export interface Fee {
  _id: string;
  name: string;
  amount: number;
  type: FeeType;
  description?: string;
  mandatory: boolean;
  status: FeeStatus;
  createdAt: string;
  updatedAt: string;
}


// Định nghĩa interface cho props của AddFeeDialog
export interface AddFeeDialogProps {
  onAddFee: (newFee: Partial<Fee>) => Promise<void>;
  children: React.ReactNode;
}

// Định nghĩa interface cho props của EditFeeDialog
export interface EditFeeDialogProps {
  fee: Fee;
  onUpdateFee: (updatedFee: Partial<Fee>) => Promise<void>;
  children: React.ReactNode;
}