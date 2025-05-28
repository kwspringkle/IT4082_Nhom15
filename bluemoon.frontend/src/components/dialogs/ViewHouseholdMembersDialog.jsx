import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { mockResidents } from "../../data/mockData";
import { Badge } from "../ui/badge";

const ViewHouseholdMembersDialog = ({ children, householdId, apartmentNumber }) => {
  const householdMembers = mockResidents.filter(
    resident => resident.householdId === householdId
  );

  const getStatusBadge = (relation) => {
    if (relation === "-") {
      return <Badge variant="secondary">Tạm trú/vắng</Badge>;
    }
    return null;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Thành viên căn hộ {apartmentNumber}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Tổng số thành viên: {householdMembers.length}
          </p>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên</TableHead>
                <TableHead>Căn cước</TableHead>
                <TableHead>Giới tính</TableHead>
                <TableHead>Ngày sinh</TableHead>
                <TableHead>Quan hệ</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {householdMembers.map((resident) => (
                <TableRow key={resident.id}>
                  <TableCell className="font-medium">{resident.name}</TableCell>
                  <TableCell>{resident.idNumber}</TableCell>
                  <TableCell>
                    {resident.gender === 'male' ? 'Nam' : resident.gender === 'female' ? 'Nữ' : 'Khác'}
                  </TableCell>
                  <TableCell>{new Date(resident.dateOfBirth).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell>{resident.relation}</TableCell>
                  <TableCell>{getStatusBadge(resident.relation)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewHouseholdMembersDialog;
