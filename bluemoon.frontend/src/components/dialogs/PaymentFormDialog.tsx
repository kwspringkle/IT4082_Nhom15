import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentFormData } from "@/types/payment";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Lỗi bị bắt bởi Error Boundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Có gì đó đã sai.</h1>;
    }
    return this.props.children;
  }
}

interface HouseholdOption {
  id: string;
  label: string;
}

interface FeeOption {
  id: string;
  name: string;
}

interface PaymentFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: PaymentFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (value: string) => void;
  onSubmit: () => void;
  title: string;
  description: string;
  isEditMode?: boolean;
  households: HouseholdOption[];
  fees: FeeOption[];
}

const PaymentFormDialog: React.FC<PaymentFormDialogProps> = ({
  isOpen,
  onOpenChange,
  formData,
  onInputChange,
  onStatusChange,
  onSubmit,
  title,
  description,
  isEditMode = false,
  households,
  fees,
}) => {
  const [selectedHouseholdId, setSelectedHouseholdId] = useState("");
  const [selectedFeeId, setSelectedFeeId] = useState("");

  // Effect để set giá trị mặc định khi mở dialog
  useEffect(() => {
    if (isOpen) {
      // Tự động chọn household nếu có dữ liệu
      if (formData.householdId) {
        setSelectedHouseholdId(formData.householdId);
      } else if (formData.household && households.length > 0) {
        // Tìm household dựa trên tên nếu không có householdId
        const foundHousehold = households.find(h => 
          h.label === formData.household || 
          h.label.includes(formData.household)
        );
        if (foundHousehold) {
          setSelectedHouseholdId(foundHousehold.id);
          // Cập nhật lại formData với householdId
          onInputChange({ target: { name: "householdId", value: foundHousehold.id } });
        }
      }

      // Tự động chọn fee nếu có dữ liệu
      if (formData.feeId) {
        setSelectedFeeId(formData.feeId);
      } else if (formData.feeName && fees.length > 0) {
        // Tìm fee dựa trên tên nếu không có feeId
        const foundFee = fees.find(f => 
          f.name === formData.feeName || 
          f.name.includes(formData.feeName)
        );
        if (foundFee) {
          setSelectedFeeId(foundFee.id);
          // Cập nhật lại formData với feeId
          onInputChange({ target: { name: "feeId", value: foundFee.id } });
        }
      }
    } else {
      // Reset khi đóng dialog
      setSelectedHouseholdId("");
      setSelectedFeeId("");
    }
  }, [isOpen, formData, households, fees, onInputChange]);

  // Effect để set ngày mặc định nếu chưa có
  useEffect(() => {
    if (isOpen && !formData.paidDate) {
      onInputChange({ target: { name: "paidDate", value: new Date().toISOString().split("T")[0] } });
    }
  }, [isOpen, formData.paidDate, onInputChange]);

  const handleHouseholdChange = (value: string) => {
    setSelectedHouseholdId(value);
    onInputChange({ target: { name: "householdId", value } });
  };

  const handleFeeChange = (value: string) => {
    setSelectedFeeId(value);
    onInputChange({ target: { name: "feeId", value } });
    
    // Tự động điền số tiền nếu fee có amount
    const selectedFee = fees.find(f => f.id === value);
    if (selectedFee && selectedFee.amount && !formData.amount) {
      onInputChange({ target: { name: "amount", value: selectedFee.amount.toString() } });
    }
  };

  useEffect(() => {
    console.log("Households:", households);
    console.log("Fees:", fees);
    console.log("Form Data:", formData);
    console.log("Selected Household ID:", selectedHouseholdId);
    console.log("Selected Fee ID:", selectedFeeId);
  }, [households, fees, formData, selectedHouseholdId, selectedFeeId]);

  return (
    <ErrorBoundary>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="householdId">Hộ gia đình</Label>
              <Select
                value={selectedHouseholdId}
                onValueChange={handleHouseholdChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn hộ gia đình" />
                </SelectTrigger>
                <SelectContent>
                  {households.map((household) => (
                    <SelectItem key={household.id} value={household.id}>
                      {household.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="feeId">Khoản phí</Label>
              <Select
                value={selectedFeeId}
                onValueChange={handleFeeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn khoản phí" />
                </SelectTrigger>
                <SelectContent>
                  {fees.map((fee) => (
                    <SelectItem key={fee.id} value={fee.id}>
                      {fee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Số tiền</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={onInputChange}
                  placeholder="Nhập số tiền"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paidDate">Ngày nộp</Label>
                <Input
                  id="paidDate"
                  name="paidDate"
                  type="date"
                  value={formData.paidDate}
                  onChange={onInputChange}
                  placeholder="Chọn ngày nộp"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={onStatusChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PAID">Đã nộp</SelectItem>
                  <SelectItem value="PARTIAL">Đã nộp một phần</SelectItem>
                  <SelectItem value="UNPAID">Chưa nộp</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="note">Ghi chú</Label>
              <Input
                id="note"
                name="note"
                value={formData.note}
                onChange={onInputChange}
                placeholder="Nhập ghi chú (nếu có)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button onClick={onSubmit}>
              {isEditMode ? "Lưu thay đổi" : "Tạo khoản thu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  );
};

export default PaymentFormDialog;