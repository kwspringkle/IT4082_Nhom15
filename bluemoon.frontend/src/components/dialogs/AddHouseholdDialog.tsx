// components/dialogs/AddHouseholdDialog.tsx
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { HouseholdFormData } from "../../types/household";
import { validateHouseholdForm } from "../../utils/validation";

interface AddHouseholdDialogProps {
  onAddHousehold: (household: HouseholdFormData) => Promise<void>;
  children: React.ReactNode;
}

const AddHouseholdDialog = ({ onAddHousehold, children }: AddHouseholdDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    apartment: "",
    floor: "",
    area: "",
    head: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateHouseholdForm(formData); // cần sửa lại hàm này nếu hiện đang check tất cả
    if (!validation.isValid) {
      toast({
        title: "Lỗi",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await onAddHousehold({
        apartment: formData.apartment,
        floor: parseInt(formData.floor),
        area: parseFloat(formData.area),
        head: formData.head,
        phone: formData.phone,
      });

      setOpen(false);
      setFormData({
        apartment: "",
        floor: "",
        area: "",
        head: "",
        phone: "",
      });

      toast({
        title: "Thành công",
        description: `Đã thêm hộ khẩu ${formData.apartment}`,
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể thêm hộ khẩu",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm hộ khẩu mới</DialogTitle>
          <DialogDescription>Nhập thông tin hộ khẩu để thêm vào hệ thống.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Số căn hộ</Label>
            <Input
              value={formData.apartment}
              onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Tầng</Label>
            <Input
              type="number"
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Diện tích (m²)</Label>
            <Input
              type="number"
              step="0.1"
              value={formData.area}
              onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          {/* <div>
            <Label>Chủ hộ</Label>
            <Input
              value={formData.head}
              onChange={(e) => setFormData({ ...formData, head: e.target.value })}
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Số điện thoại</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={isLoading}
            />
          </div> */}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Thêm hộ khẩu"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHouseholdDialog;