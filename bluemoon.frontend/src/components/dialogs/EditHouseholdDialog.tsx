// components/dialogs/EditHouseholdDialog.tsx
import { useState, useEffect } from "react";
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
import { Household, HouseholdFormData } from "../../types/household";
import { validateHouseholdForm } from "../../utils/validation";

interface EditHouseholdDialogProps {
  household: Household;
  onUpdateHousehold: (household: HouseholdFormData) => Promise<void>;
  children: React.ReactNode;
}

const EditHouseholdDialog = ({ household, onUpdateHousehold, children }: EditHouseholdDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    apartment: household.apartment || "",
    floor: household.floor?.toString() || "",
    area: household.area?.toString() || "",
    head: household.head || "",
    phone: household.phone || "",
    members: household.members?.toString() || "",
  });

  useEffect(() => {
    setFormData({
      apartment: household.apartment || "",
      floor: household.floor?.toString() || "",
      area: household.area?.toString() || "",
      head: household.head || "",
      phone: household.phone || "",
      members: household.members?.toString() || "",
    });
  }, [household]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateHouseholdForm(formData);
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
      await onUpdateHousehold({
        apartment: formData.apartment,
        floor: parseInt(formData.floor),
        area: parseFloat(formData.area),
        head: formData.head,
        phone: formData.phone,
        members: parseInt(formData.members),
      });
      
      setOpen(false);
      toast({
        title: "Thành công",
        description: `Đã cập nhật hộ khẩu ${formData.apartment}`,
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật hộ khẩu",
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
          <DialogTitle>Sửa thông tin hộ khẩu</DialogTitle>
          <DialogDescription>Cập nhật thông tin hộ khẩu trong hệ thống.</DialogDescription>
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
          <div>
            <Label>Chủ hộ</Label>
            <Input
              value={formData.head}
              onChange={(e) => setFormData({ ...formData, head: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Số điện thoại</Label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Số thành viên</Label>
            <Input
              type="number"
              value={formData.members}
              onChange={(e) => setFormData({ ...formData, members: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Cập nhật hộ khẩu"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditHouseholdDialog;