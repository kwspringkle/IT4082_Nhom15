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

const EditHouseholdDialog = ({ children, household }) => {
  const [open, setOpen] = useState(false);
  const [householdData, setHouseholdData] = useState({
    apartmentNumber: household?.apartmentNumber || "",
    floor: household?.floor || "",
    area: household?.area || "",
    owner: household?.owner || "",
    phoneNumber: household?.phoneNumber || "",
    numberOfMembers: household?.numberOfMembers || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({
      title: "Thành công",
      description: `Đã cập nhật thông tin căn hộ ${householdData.apartmentNumber}`,
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
          <DialogTitle>Sửa thông tin hộ khẩu</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="apartmentNumber">Số căn hộ</Label>
            <Input
              id="apartmentNumber"
              value={householdData.apartmentNumber}
              onChange={(e) => setHouseholdData({...householdData, apartmentNumber: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="floor">Tầng</Label>
            <Input
              id="floor"
              type="number"
              value={householdData.floor}
              onChange={(e) => setHouseholdData({...householdData, floor: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="area">Diện tích (m²)</Label>
            <Input
              id="area"
              type="number"
              value={householdData.area}
              onChange={(e) => setHouseholdData({...householdData, area: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="owner">Chủ hộ</Label>
            <Input
              id="owner"
              value={householdData.owner}
              onChange={(e) => setHouseholdData({...householdData, owner: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phoneNumber">Số điện thoại</Label>
            <Input
              id="phoneNumber"
              value={householdData.phoneNumber}
              onChange={(e) => setHouseholdData({...householdData, phoneNumber: e.target.value})}
              required
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

export default EditHouseholdDialog;
