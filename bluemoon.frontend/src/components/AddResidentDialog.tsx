import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Household } from "../types";

interface AddResidentDialogProps {
  onAddResident: (resident: {
    name: string;
    citizenId: string;
    gender: "Nam" | "Nữ" | "Khác";
    dob: string;
    relation: string;
    householdId: string;
    phone?: string;
    status: "Thường trú" | "Tạm vắng" | "Tạm trú";
  }) => Promise<void>;
  households: Household[];
  children: React.ReactNode;
}

export const AddResidentDialog = ({
  onAddResident,
  households,
  children,
}: AddResidentDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    citizenId: "",
    gender: "Nam" as "Nam" | "Nữ" | "Khác",
    dob: "",
    phone: "",
    relation: "",
    householdId: "",
    status: "Thường trú" as "Thường trú" | "Tạm vắng" | "Tạm trú",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.citizenId ||
      !formData.gender ||
      !formData.dob ||
      !formData.relation ||
      !formData.householdId ||
      !formData.status
    ) {
      toast({
        title: "Lỗi",
        description: "Vui lòng cung cấp đầy đủ thông tin bắt buộc",
        variant: "destructive",
      });
      return;
    }

    if (!/^\d{12}$/.test(formData.citizenId)) {
      toast({
        title: "Lỗi",
        description: "Căn cước công dân phải là 12 số",
        variant: "destructive",
      });
      return;
    }

    const dobDate = new Date(formData.dob);
    if (isNaN(dobDate.getTime())) {
      toast({
        title: "Lỗi",
        description: "Ngày sinh không hợp lệ",
        variant: "destructive",
      });
      return;
    }
    if (dobDate > new Date()) {
      toast({
        title: "Lỗi",
        description: "Ngày sinh không thể là ngày trong tương lai",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/api/citizens?citizenId=${formData.citizenId}`);
      if (!response.ok) {
        throw new Error("Không thể kiểm tra căn cước công dân");
      }
      const data = await response.json();
      if (data?.data?.length > 0) {
        toast({
          title: "Lỗi",
          description: "Căn cước công dân đã được đăng ký",
          variant: "destructive",
        });
        return;
      }
    } catch (error: any) {
      console.warn("Error checking citizenId:", error);
      toast({
        title: "Lỗi",
        description: error.message || "Lỗi khi kiểm tra CCCD",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await onAddResident({
        ...formData,
        dob: dobDate.toISOString(),
      });

      setOpen(false);
      setFormData({
        name: "",
        citizenId: "",
        gender: "Nam",
        dob: "",
        phone: "",
        relation: "",
        householdId: "",
        status: "Thường trú",
      });

      toast({
        title: "Thành công",
        description: `Đã thêm nhân khẩu ${formData.name}`,
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error.message || "Không thể thêm nhân khẩu",
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
          <DialogTitle>Thêm nhân khẩu mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Họ tên</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Căn cước công dân</Label>
            <Input
              value={formData.citizenId}
              onChange={(e) => setFormData({ ...formData, citizenId: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Giới tính</Label>
            <Select
              value={formData.gender}
              onValueChange={(value: "Nam" | "Nữ" | "Khác") =>
                setFormData({ ...formData, gender: value })
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn giới tính" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Nam">Nam</SelectItem>
                <SelectItem value="Nữ">Nữ</SelectItem>
                <SelectItem value="Khác">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Ngày sinh</Label>
            <Input
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <Label>Số điện thoại</Label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={isLoading}
              placeholder="VD: 0912345678"
            />
          </div>
          <div>
            <Label>Quan hệ với chủ hộ</Label>
            <Select
              value={formData.relation}
              onValueChange={(value: string) => setFormData({ ...formData, relation: value })}
              disabled={isLoading}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn quan hệ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Chủ hộ">Chủ hộ</SelectItem>
                <SelectItem value="Vợ / Chồng">Vợ / Chồng</SelectItem>
                <SelectItem value="Con">Con</SelectItem>
                <SelectItem value="Cháu">Cháu</SelectItem>
                <SelectItem value="Anh / Chị / Em">Anh / Chị / Em</SelectItem>
                <SelectItem value="Cha / Mẹ">Cha / Mẹ</SelectItem>
                <SelectItem value="Người thuê">Người thuê</SelectItem>
                <SelectItem value="Khác">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Tình trạng cư trú</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "Thường trú" | "Tạm vắng" | "Tạm trú") =>
                setFormData({ ...formData, status: value })
              }
              disabled={isLoading}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn tình trạng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Thường trú">Thường trú</SelectItem>
                <SelectItem value="Tạm trú">Tạm trú</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Căn hộ</Label>
            <Select
              value={formData.householdId}
              onValueChange={(value) => setFormData({ ...formData, householdId: value })}
              disabled={isLoading || !households.length}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn căn hộ" />
              </SelectTrigger>
              <SelectContent>
                {households.map((household) => (
                  <SelectItem key={household._id} value={household._id}>
                    {household.apartment}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isLoading || !households.length}>
            {isLoading ? "Đang xử lý..." : "Thêm nhân khẩu"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};