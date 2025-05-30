import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/base-components";
import { Calendar } from "../ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "../../lib/utils";
import { toast } from "../../hooks/use-toast";

const EditFeeDialog = ({ children, fee, onUpdateFee }) => {
  const [open, setOpen] = useState(false);
  const [feeData, setFeeData] = useState({
    name: fee?.name || "",
    description: fee?.description || "",
    type: fee?.type || "service",
    amount: fee?.amount || "",
    ratePerSqm: fee?.ratePerSqm || "",
    deadline: fee?.deadline ? new Date(fee.deadline) : undefined,
    mandatory: fee?.mandatory || true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateFee(feeData);
    toast({
      title: "Thành công",
      description: `Đã cập nhật khoản phí ${feeData.name}`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Sửa khoản phí</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Tên khoản phí</Label>
            <Input
              id="name"
              value={feeData.name}
              onChange={(e) => setFeeData({ ...feeData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="type">Loại phí</Label>
            <select
              id="type"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={feeData.type}
              onChange={(e) => setFeeData({ ...feeData, type: e.target.value })}
            >
              <option value="service">Phí dịch vụ</option>
              <option value="management">Phí quản lý</option>
              <option value="contribution">Đóng góp</option>
              <option value="parking">Phí gửi xe</option>
              <option value="utility">Tiện ích</option>
            </select>
          </div>

          <div>
            <Label htmlFor="amount">Số tiền cố định (VND)</Label>
            <Input
              id="amount"
              type="number"
              value={feeData.amount}
              onChange={(e) => setFeeData({ ...feeData, amount: e.target.value })}
              placeholder="Để trống nếu tính theo m²"
            />
          </div>

          <div>
            <Label htmlFor="ratePerSqm">Đơn giá theo m² (VND/m²)</Label>
            <Input
              id="ratePerSqm"
              type="number"
              value={feeData.ratePerSqm}
              onChange={(e) =>
                setFeeData({ ...feeData, ratePerSqm: e.target.value })
              }
              placeholder="Để trống nếu là số tiền cố định"
            />
          </div>

          <div>
            <Label>Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !feeData.deadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {feeData.deadline
                    ? format(feeData.deadline, "dd/MM/yyyy")
                    : "Chọn ngày deadline"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={feeData.deadline}
                  onSelect={(date) => setFeeData({ ...feeData, deadline: date })}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="mandatory"
              checked={feeData.mandatory}
              onChange={(e) =>
                setFeeData({ ...feeData, mandatory: e.target.checked })
              }
            />
            <Label htmlFor="mandatory">Bắt buộc</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="repeat"
              checked={feeData.repeat}
              onChange={(e) => setFeeData({ ...feeData, repeat: e.target.checked })}
            />
            <Label htmlFor="repeat">Lặp lại hàng tháng</Label>
          </div>
          <div>
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={feeData.description}
              onChange={(e) =>
                setFeeData({ ...feeData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit">Cập nhật</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditFeeDialog;