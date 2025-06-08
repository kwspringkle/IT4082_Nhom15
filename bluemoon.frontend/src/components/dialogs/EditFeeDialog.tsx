import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { EditFeeDialogProps } from "@/types/fee";

const EditFeeDialog: React.FC<EditFeeDialogProps> = ({ fee, onUpdateFee, children }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: fee.name || "",
    type: fee.type || "MONTHLY",
    amount: fee.amount?.toString() || "",
    ratePerSqm: fee.ratePerSqm?.toString() || "",
    deadline: fee.deadline ? new Date(fee.deadline).toISOString().split("T")[0] : "",
    mandatory: fee.mandatory || false,
    description: fee.description || "",
    status: fee.status || "ACTIVE",
  });

  useEffect(() => {
    setFormData({
      name: fee.name || "",
      type: fee.type || "MONTHLY",
      amount: fee.amount?.toString() || "",
      ratePerSqm: fee.ratePerSqm?.toString() || "",
      deadline: fee.deadline ? new Date(fee.deadline).toISOString().split("T")[0] : "",
      mandatory: fee.mandatory || false,
      description: fee.description || "",
      status: fee.status || "ACTIVE",
    });
  }, [fee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Kiểm tra dữ liệu trước khi gửi
    if (!formData.name) {
      toast({
        title: "Lỗi",
        description: "Tên khoản phí là bắt buộc",
        variant: "destructive",
      });
      return;
    }
    if (formData.amount && Number(formData.amount) < 0) {
      toast({
        title: "Lỗi",
        description: "Đơn giá không được âm",
        variant: "destructive",
      });
      return;
    }
    if (formData.ratePerSqm && Number(formData.ratePerSqm) < 0) {
      toast({
        title: "Lỗi",
        description: "Đơn giá theo m² không được âm",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Updating fee:", formData);
      await onUpdateFee({
        ...formData,
        amount: formData.amount ? Number(formData.amount) : undefined,
        ratePerSqm: formData.ratePerSqm ? Number(formData.ratePerSqm) : undefined,
        deadline: formData.deadline || undefined,
        status: formData.status,
      });
      setOpen(false);
    } catch (error: any) {
      console.error("Update fee error:", error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật khoản phí",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa khoản phí</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Tên khoản phí</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Loại phí</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại phí" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MONTHLY">Phí hàng tháng</SelectItem>
                <SelectItem value="YEARLY">Phí hàng năm</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Đơn giá (VND)</Label>
            <Input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>
          <div>
            <Label>Đơn giá theo m² (VND/m²)</Label>
            <Input
              type="number"
              value={formData.ratePerSqm}
              onChange={(e) => setFormData({ ...formData, ratePerSqm: e.target.value })}
            />
          </div>
          <div>
            <Label>Deadline</Label>
            <Input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.mandatory}
              onCheckedChange={(checked) => setFormData({ ...formData, mandatory: checked as boolean })}
            />
            <Label>Bắt buộc</Label>
          </div>
          <div>
            <Label>Trạng thái</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as "ACTIVE" | "INACTIVE" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Mô tả</Label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <Button type="submit">Cập nhật khoản phí</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFeeDialog;