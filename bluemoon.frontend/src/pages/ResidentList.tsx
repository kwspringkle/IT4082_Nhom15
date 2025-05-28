import { useState } from "react";
import { mockResidents, mockHouseholds } from "@/data/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AddResidentDialog from "@/components/forms/AddResidentDialog";
import ViewResidentDialog from "@/components/dialogs/ViewResidentDialog";
import EditResidentDialog from "@/components/dialogs/EditResidentDialog";
import { toast } from "@/hooks/use-toast";

const ResidentList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredResidents = mockResidents.filter(
    (resident) =>
      resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.idNumber.includes(searchTerm) ||
      resident.phoneNumber.includes(searchTerm)
  );

  const getHouseholdApartment = (householdId) => {
    const household = mockHouseholds.find(h => h.id === householdId);
    return household ? household.apartmentNumber : 'N/A';
  };

  const getStatusBadge = (relation) => {
    if (relation === "-") {
      return <Badge variant="secondary">Tạm trú/vắng</Badge>;
    }
    return null;
  };

  const handleDelete = (resident) => {
    toast({
      title: "Đã xóa",
      description: `Đã xóa nhân khẩu ${resident.name}`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Quản lý nhân khẩu</h1>
          <p className="text-muted-foreground">
            Quản lý thông tin nhân khẩu trong chung cư BlueMoon
          </p>
        </div>
        <AddResidentDialog>
          <Button className="bg-accent">
            <Plus className="mr-2 h-4 w-4" />
            Thêm nhân khẩu mới
          </Button>
        </AddResidentDialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Danh sách nhân khẩu</CardTitle>
          <CardDescription>
            Tổng số nhân khẩu: {mockResidents.length}
          </CardDescription>
          <div className="flex items-center py-2">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, căn cước, số điện thoại..."
              className="flex-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên</TableHead>
                <TableHead>Căn cước</TableHead>
                <TableHead>Giới tính</TableHead>
                <TableHead>Ngày sinh</TableHead>
                <TableHead>Căn hộ</TableHead>
                <TableHead>Quan hệ</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResidents.map((resident) => (
                <TableRow key={resident.id}>
                  <TableCell className="font-medium">
                    {resident.name}
                  </TableCell>
                  <TableCell>{resident.idNumber}</TableCell>
                  <TableCell>
                    {resident.gender === 'male' ? 'Nam' : resident.gender === 'female' ? 'Nữ' : 'Khác'}
                  </TableCell>
                  <TableCell>{new Date(resident.dateOfBirth).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell>{getHouseholdApartment(resident.householdId)}</TableCell>
                  <TableCell>{resident.relation}</TableCell>
                  <TableCell>{getStatusBadge(resident.relation)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <ViewResidentDialog resident={resident}>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                        </ViewResidentDialog>
                        <EditResidentDialog resident={resident}>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Edit className="mr-2 h-4 w-4" />
                            Sửa thông tin
                          </DropdownMenuItem>
                        </EditResidentDialog>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDelete(resident)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa nhân khẩu
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResidentList;
