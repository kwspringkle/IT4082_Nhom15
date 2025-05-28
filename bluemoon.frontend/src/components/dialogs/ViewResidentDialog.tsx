import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { mockHouseholds } from "../../data/mockData";

const ViewResidentDialog = ({ children, resident }) => {
  const household = mockHouseholds.find(h => h.id === resident?.householdId);

  const getStatusBadge = (relation) => {
    if (relation === "-") {
      return <Badge variant="secondary">Tạm trú/vắng</Badge>;
    }
    return <Badge className="bg-green-100 text-green-800">Thường trú</Badge>;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chi tiết nhân khẩu</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Họ tên</p>
              <p className="font-medium">{resident?.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Căn cước</p>
              <p>{resident?.idNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Giới tính</p>
              <p>{resident?.gender === 'male' ? 'Nam' : resident?.gender === 'female' ? 'Nữ' : 'Khác'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Ngày sinh</p>
              <p>{resident?.dateOfBirth ? new Date(resident.dateOfBirth).toLocaleDateString('vi-VN') : 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Căn hộ</p>
              <p>{household?.apartmentNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Quan hệ</p>
              <p>{resident?.relation}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Số điện thoại</p>
              <p>{resident?.phoneNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Trạng thái</p>
              {getStatusBadge(resident?.relation)}
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Lịch sử chỉnh sửa</p>
            <div className="border rounded p-3 text-sm text-muted-foreground">
              <p>• Tạo mới: 15/01/2024</p>
              <p>• Cập nhật thông tin: 20/02/2024</p>
              <p>• Thay đổi trạng thái: 01/03/2024</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewResidentDialog;
