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
import { toast } from "../../hooks/use-toast";
import { mockHouseholds } from "../../data/mockData";

const EditResidentDialog = ({ children, resident }) => {
  const [open, setOpen] = useState(false);
  const [residentData, setResidentData] = useState({
    name: resident?.name || "",
    idNumber: resident?.idNumber || "",
    gender: resident?.gender || "male",
    dateOfBirth: resident?.dateOfBirth || "",
    phoneNumber: resident?.phoneNumber || "",
    relation: resident?.relation || "",
    householdId: resident?.householdId || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Thành công",
      description: `Đã cập nhật thông tin ${residentData.name}`,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Sửa thông tin nhân khẩu</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Họ tên</Label>
            <Input
              id="name"
              value={residentData.name}
              onChange={(e) => setResidentData({...residentData, name: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="idNumber">Số căn cước</Label>
            <Input
              id="idNumber"
              value={residentData.idNumber}
              onChange={(e) => setResidentData({...residentData, idNumber: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="gender">Giới tính</Label>
            <select
              id="gender"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={residentData.gender}
              onChange={(e) => setResidentData({...residentData, gender: e.target.value})}
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
          
          <div>
            <Label htmlFor="dateOfBirth">Ngày sinh</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={residentData.dateOfBirth}
              onChange={(e) => setResidentData({...residentData, dateOfBirth: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phoneNumber">Số điện thoại</Label>
            <Input
              id="phoneNumber"
              value={residentData.phoneNumber}
              onChange={(e) => setResidentData({...residentData, phoneNumber: e.target.value})}
            />
          </div>
          
          <div>
            <Label htmlFor="relation">Quan hệ với chủ hộ</Label>
            <Input
              id="relation"
              value={residentData.relation}
              onChange={(e) => setResidentData({...residentData, relation: e.target.value})}
              placeholder="Chủ hộ, Con, Vợ/Chồng, hoặc - (tạm trú/vắng)"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="householdId">Căn hộ</Label>
            <select
              id="householdId"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={residentData.householdId}
              onChange={(e) => setResidentData({...residentData, householdId: e.target.value})}
              required
            >
              <option value="">Chọn căn hộ</option>
              {mockHouseholds.map((household) => (
                <option key={household.id} value={household.id}>
                  {household.apartmentNumber} - {household.owner}
                </option>
              ))}
            </select>
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

export default EditResidentDialog;
