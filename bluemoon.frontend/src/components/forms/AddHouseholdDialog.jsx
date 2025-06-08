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
import { Plus, X } from "lucide-react";
import { toast } from "../../hooks/use-toast";

const AddHouseholdDialog = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [householdData, setHouseholdData] = useState({
    apartmentNumber: "",
    floor: "",
    area: "",
    owner: "",
    phoneNumber: "",
  });
  
  const [members, setMembers] = useState([
    {
      name: "",
      idNumber: "",
      gender: "male",
      dateOfBirth: "",
      relation: "Chủ hộ",
      phoneNumber: "",
    }
  ]);

  const addMember = () => {
    setMembers([...members, {
      name: "",
      idNumber: "",
      gender: "male",
      dateOfBirth: "",
      relation: "",
      phoneNumber: "",
    }]);
  };

  const removeMember = (index) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const updateMember = (index, field, value) => {
    const updatedMembers = [...members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setMembers(updatedMembers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/households/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...householdData,
          members: members,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Đã xảy ra lỗi khi thêm hộ khẩu.");
      }

      toast({
        title: "Thành công",
        description: `Đã thêm hộ khẩu ${householdData.apartmentNumber} với ${members.length} thành viên`,
      });

      setOpen(false);

      // Reset form
      setHouseholdData({
        apartmentNumber: "",
        floor: "",
        area: "",
        owner: "",
        phoneNumber: "",
      });

      setMembers([
        {
          name: "",
          idNumber: "",
          gender: "male",
          dateOfBirth: "",
          relation: "Chủ hộ",
          phoneNumber: "",
        },
      ]);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể thêm hộ khẩu.",
        variant: "destructive",
      });
    }
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Thêm hộ khẩu mới</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Household Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Thông tin hộ khẩu</h3>
            <div className="grid grid-cols-2 gap-4">
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
            </div>
          </div>

          {/* Members Information */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Thông tin thành viên</h3>
              <Button type="button" onClick={addMember} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Thêm thành viên
              </Button>
            </div>
            
            {members.map((member, index) => (
              <div key={index} className="border rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Thành viên {index + 1}</h4>
                  {members.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeMember(index)}
                      variant="ghost"
                      size="sm"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Họ tên</Label>
                    <Input
                      value={member.name}
                      onChange={(e) => updateMember(index, 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Số căn cước</Label>
                    <Input
                      value={member.idNumber}
                      onChange={(e) => updateMember(index, 'idNumber', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Giới tính</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={member.gender}
                      onChange={(e) => updateMember(index, 'gender', e.target.value)}
                    >
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                  <div>
                    <Label>Ngày sinh</Label>
                    <Input
                      type="date"
                      value={member.dateOfBirth}
                      onChange={(e) => updateMember(index, 'dateOfBirth', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Quan hệ với chủ hộ</Label>
                    <Input
                      value={member.relation}
                      onChange={(e) => updateMember(index, 'relation', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label>Số điện thoại</Label>
                    <Input
                      value={member.phoneNumber}
                      onChange={(e) => updateMember(index, 'phoneNumber', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit">Thêm hộ khẩu</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHouseholdDialog;
