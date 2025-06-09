export type FeeType = "MONTHLY" | "YEARLY"|"OTHER";
export type FeeStatus = "ACTIVE" | "INACTIVE";

export interface Fee {
  _id: string;
  name: string;
  amount?: number;
  ratePerSqm?: number;
  type: FeeType;
  description?: string;
  mandatory: boolean;
  status: FeeStatus;
  deadline?: string | null;
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