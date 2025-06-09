import { useState } from "react";
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
import { AddFeeDialogProps, Fee } from "@/types/fee";

const AddFeeDialog: React.FC<AddFeeDialogProps> = ({ onAddFee, children }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Fee>>({
    name: "",
    type: "MONTHLY",
    amount: undefined,
    ratePerSqm: undefined,
    deadline: undefined,
    mandatory: false,
    description: "",
    status: "ACTIVE",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name) {
      toast({
        title: "Lỗi",
        description: "Tên khoản phí là bắt buộc",
        variant: "destructive",
      });
      return;
    }
    if (!formData.type) {
      toast({
        title: "Lỗi",
        description: "Loại phí là bắt buộc",
        variant: "destructive",
      });
      return;
    }
    if (!formData.amount && !formData.ratePerSqm) {
      toast({
        title: "Lỗi",
        description: "Phải cung cấp ít nhất một trong hai: số tiền cố định hoặc đơn giá theo m²",
        variant: "destructive",
      });
      return;
    }
    if (formData.amount && formData.amount < 0) {
      toast({
        title: "Lỗi",
        description: "Số tiền cố định không được âm",
        variant: "destructive",
      });
      return;
    }
    if (formData.ratePerSqm && formData.ratePerSqm < 0) {
      toast({
        title: "Lỗi",
        description: "Đơn giá theo m² không được âm",
        variant: "destructive",
      });
      return;
    }
    if (formData.deadline && isNaN(new Date(formData.deadline).getTime())) {
      toast({
        title: "Lỗi",
        description: "Hạn nộp không hợp lệ",
        variant: "destructive",
      });
      return;
    }

    try {
      await onAddFee({
        ...formData,
        amount: formData.amount !== undefined ? Number(formData.amount) : undefined,
        ratePerSqm: formData.ratePerSqm !== undefined ? Number(formData.ratePerSqm) : undefined,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
        type: formData.type?.toUpperCase() as "MONTHLY" | "YEARLY" | "OTHER",
      });
      setOpen(false);
      setFormData({
        name: "",
        type: "MONTHLY",
        amount: undefined,
        ratePerSqm: undefined,
        deadline: undefined,
        mandatory: false,
        description: "",
        status: "ACTIVE",
      });
    } catch (error: any) {
      console.error("Add fee error:", error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể thêm khoản phí",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm khoản phí mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Tên khoản phí</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="type">Loại phí</Label>
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
                <SelectItem value="OTHER">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="amount">Số tiền cố định (VND)</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  amount: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              min="0"
            />
          </div>
          <div>
            <Label htmlFor="ratePerSqm">Đơn giá theo m² (VND/m²)</Label>
            <Input
              id="ratePerSqm"
              type="number"
              value={formData.ratePerSqm ?? ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  ratePerSqm: e.target.value ? Number(e.target.value) : undefined,
                })
              }
              min="0"
            />
          </div>
          <div>
            <Label htmlFor="deadline">Hạn nộp</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline ? new Date(formData.deadline).toISOString().split("T")[0] : ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  deadline: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                })
              }
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="mandatory"
              checked={formData.mandatory}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, mandatory: !!checked })
              }
            />
            <Label htmlFor="mandatory">Bắt buộc</Label>
          </div>
          <div>
            <Label htmlFor="status">Trạng thái</Label>
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
            <Label htmlFor="description">Mô tả</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <Button type="submit">Thêm khoản phí</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFeeDialog;