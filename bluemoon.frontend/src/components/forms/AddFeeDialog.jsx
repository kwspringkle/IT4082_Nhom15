import React, { useState } from "react";
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
import { toast } from "../../hooks/use-toast";

const AddFeeDialog = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [feeData, setFeeData] = useState({
    name: "",
    description: "",
    type: "service",
    amount: "",
    ratePerSqm: "",
    dueDay: "15",
    mandatory: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Thành công",
      description: `Đã thêm khoản phí ${feeData.name}`,
    });
    setOpen(false);
    setFeeData({
      name: "",
      description: "",
      type: "service",
      amount: "",
      ratePerSqm: "",
      dueDay: "15",
      mandatory: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm khoản phí mới</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Tên khoản phí</Label>
            <Input
              id="name"
              value={feeData.name}
              onChange={(e) => setFeeData({...feeData, name: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="type">Loại phí</Label>
            <select
              id="type"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={feeData.type}
              onChange={(e) => setFeeData({...feeData, type: e.target.value})}
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
              onChange={(e) => setFeeData({...feeData, amount: e.target.value})}
              placeholder="Để trống nếu tính theo m²"
            />
          </div>
          
          <div>
            <Label htmlFor="ratePerSqm">Đơn giá theo m² (VND/m²)</Label>
            <Input
              id="ratePerSqm"
              type="number"
              value={feeData.ratePerSqm}
              onChange={(e) => setFeeData({...feeData, ratePerSqm: e.target.value})}
              placeholder="Để trống nếu là số tiền cố định"
            />
          </div>
          
          <div>
            <Label htmlFor="dueDay">Ngày đến hạn (trong tháng)</Label>
            <Input
              id="dueDay"
              type="number"
              min="1"
              max="31"
              value={feeData.dueDay}
              onChange={(e) => setFeeData({...feeData, dueDay: e.target.value})}
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="mandatory"
              checked={feeData.mandatory}
              onChange={(e) => setFeeData({...feeData, mandatory: e.target.checked})}
            />
            <Label htmlFor="mandatory">Bắt buộc</Label>
          </div>
          
          <div>
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={feeData.description}
              onChange={(e) => setFeeData({...feeData, description: e.target.value})}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit">Thêm khoản phí</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFeeDialog;
