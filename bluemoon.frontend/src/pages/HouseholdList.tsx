import { useState } from "react";
import { mockHouseholds } from "@/data/mockData";
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
import AddHouseholdDialog from "@/components/forms/AddHouseholdDialog";
import ViewHouseholdMembersDialog from "@/components/dialogs/ViewHouseholdMembersDialog";
import EditHouseholdDialog from "@/components/dialogs/EditHouseholdDialog";
import { toast } from "@/hooks/use-toast";

const HouseholdList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredHouseholds = mockHouseholds.filter(
    (household) =>
      household.apartmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      household.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      household.phoneNumber.includes(searchTerm)
  );

  const handleDelete = (household) => {
    toast({
      title: "Đã xóa",
      description: `Đã xóa hộ khẩu ${household.apartmentNumber}`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Quản lý hộ khẩu</h1>
          <p className="text-muted-foreground">
            Quản lý thông tin hộ khẩu trong chung cư BlueMoon
          </p>
        </div>
        <AddHouseholdDialog>
          <Button className="bg-accent">
            <Plus className="mr-2 h-4 w-4" />
            Thêm hộ mới
          </Button>
        </AddHouseholdDialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Danh sách hộ khẩu</CardTitle>
          <CardDescription>
            Tổng số hộ khẩu: {mockHouseholds.length}
          </CardDescription>
          <div className="flex items-center py-2">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo căn hộ, chủ hộ, số điện thoại..."
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
                <TableHead>Căn hộ</TableHead>
                <TableHead>Tầng</TableHead>
                <TableHead>Diện tích (m²)</TableHead>
                <TableHead>Chủ hộ</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Số thành viên</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHouseholds.map((household) => (
                <TableRow key={household.id}>
                  <TableCell className="font-medium">
                    {household.apartmentNumber}
                  </TableCell>
                  <TableCell>{household.floor}</TableCell>
                  <TableCell>{household.area}</TableCell>
                  <TableCell>{household.owner}</TableCell>
                  <TableCell>{household.phoneNumber}</TableCell>
                  <TableCell>{household.numberOfMembers}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <ViewHouseholdMembersDialog 
                          householdId={household.id} 
                          apartmentNumber={household.apartmentNumber}
                        >
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem thành viên
                          </DropdownMenuItem>
                        </ViewHouseholdMembersDialog>
                        <EditHouseholdDialog household={household}>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Edit className="mr-2 h-4 w-4" />
                            Sửa thông tin
                          </DropdownMenuItem>
                        </EditHouseholdDialog>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDelete(household)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa hộ khẩu
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

export default HouseholdList;

