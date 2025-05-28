import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Badge } from "../ui/badge";

const ViewFeeDialog = ({ children, fee }) => {
  const getFeeTypeLabel = (type) => {
    switch (type) {
      case 'service':
        return 'Phí dịch vụ';
      case 'management':
        return 'Phí quản lý';
      case 'contribution':
        return 'Đóng góp';
      case 'parking':
        return 'Phí gửi xe';
      case 'utility':
        return 'Tiện ích';
      default:
        return type;
    }
  };

  const getFeeTypeColor = (type) => {
    switch (type) {
      case 'service':
        return 'bg-blue-100 text-blue-800';
      case 'management':
        return 'bg-purple-100 text-purple-800';
      case 'contribution':
        return 'bg-yellow-100 text-yellow-800';
      case 'parking':
        return 'bg-green-100 text-green-800';
      case 'utility':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Chi tiết khoản phí</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Tên khoản phí</p>
            <p className="font-medium">{fee?.name}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Loại phí</p>
            <Badge className={getFeeTypeColor(fee?.type)}>
              {getFeeTypeLabel(fee?.type)}
            </Badge>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Cách tính phí</p>
            <p>
              {fee?.amount 
                ? `Cố định: ${new Intl.NumberFormat('vi-VN').format(fee.amount)} VND`
                : fee?.ratePerSqm 
                  ? `Theo diện tích: ${new Intl.NumberFormat('vi-VN').format(fee.ratePerSqm)} VND/m²`
                  : 'Chưa xác định'
              }
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Ngày đến hạn</p>
            <p>Ngày {fee?.dueDay} hàng tháng</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Tính chất</p>
            <p>{fee?.mandatory ? 'Bắt buộc' : 'Tự nguyện'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground">Mô tả</p>
            <p className="text-sm">{fee?.description || 'Không có mô tả'}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewFeeDialog;
