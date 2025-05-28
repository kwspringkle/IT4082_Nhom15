
import { useState } from "react";
import { mockFees } from "@/data/mockData";
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
import AddFeeDialog from "@/components/forms/AddFeeDialog";
import ViewFeeDialog from "@/components/dialogs/ViewFeeDialog";
import EditFeeDialog from "@/components/dialogs/EditFeeDialog";
import { toast } from "@/hooks/use-toast";

const FeeList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFees = mockFees.filter(
    (fee) =>
      fee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleDelete = (fee) => {
    toast({
      title: "Đã xóa",
      description: `Đã xóa khoản phí ${fee.name}`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Quản lý khoản phí</h1>
          <p className="text-muted-foreground">
            Quản lý các loại phí và khoản đóng góp tại chung cư BlueMoon
          </p>
        </div>
        <AddFeeDialog>
          <Button className="bg-accent">
            <Plus className="mr-2 h-4 w-4" />
            Thêm khoản phí mới
          </Button>
        </AddFeeDialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Danh sách các khoản phí</CardTitle>
          <CardDescription>
            Tổng số khoản phí: {mockFees.length}
          </CardDescription>
          <div className="flex items-center py-2">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, mô tả, loại phí..."
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
                <TableHead>Tên khoản phí</TableHead>
                <TableHead>Loại phí</TableHead>
                <TableHead>Đơn giá</TableHead>
                <TableHead>Ngày đến hạn</TableHead>
                <TableHead>Bắt buộc</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell className="font-medium">
                    {fee.name}
                  </TableCell>
                  <TableCell>
                    <Badge className={getFeeTypeColor(fee.type)}>
                      {getFeeTypeLabel(fee.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {fee.amount 
                      ? new Intl.NumberFormat('vi-VN').format(fee.amount) + ' VND'
                      : fee.ratePerSqm 
                        ? new Intl.NumberFormat('vi-VN').format(fee.ratePerSqm) + ' VND/m²'
                        : 'N/A'
                    }
                  </TableCell>
                  <TableCell>Ngày {fee.dueDay} hàng tháng</TableCell>
                  <TableCell>
                    {fee.mandatory 
                      ? <span className="text-green-600 font-medium">Có</span> 
                      : <span className="text-amber-600">Không</span>}
                  </TableCell>
                  <TableCell>{fee.description}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <ViewFeeDialog fee={fee}>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </DropdownMenuItem>
                        </ViewFeeDialog>
                        <EditFeeDialog fee={fee}>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Edit className="mr-2 h-4 w-4" />
                            Sửa khoản phí
                          </DropdownMenuItem>
                        </EditFeeDialog>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDelete(fee)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa khoản phí
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

export default FeeList;
