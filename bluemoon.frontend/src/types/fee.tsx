// Định nghĩa interface cho Fee
export interface Fee {
  _id: string;
  name: string;
  type: string;
  amount?: number;
  ratePerSqm?: number;
  deadline?: string;
  mandatory: boolean;
  description?: string;
  status: "ACTIVE" | "INACTIVE";
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