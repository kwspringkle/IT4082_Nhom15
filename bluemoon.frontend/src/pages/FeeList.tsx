import { useState, useEffect, useMemo } from "react";
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
import ViewFeeDialog from "@/components/dialogs/ViewFeeDialog";
import AddFeeDialog from "@/components/dialogs/AddFeeDialog";
import EditFeeDialog from "@/components/dialogs/EditFeeDialog";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Fee } from "@/types/fee";
import { getFeeTypeLabel, getFeeTypeColor, getStatusLabel, getStatusColor } from "@/utils/feeUtils";

const FeeList: React.FC = () => {
  const [fees, setFees] = useState<Fee[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/fees");
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        if (!data.success || !Array.isArray(data.data)) {
          throw new Error("Invalid response format");
        }
        setFees(data.data);
      } catch (error: any) {
        console.error("Fetch fees error:", error);
        toast({
          title: "Lỗi",
          description: error.message || "Không thể tải danh sách khoản phí",
          variant: "destructive",
        });
      }
    };

    fetchFees();
  }, []);

  const filteredFees = useMemo(() => {
    return fees.filter((fee) =>
      (
        fee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (fee.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        fee.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (fee.ratePerSqm?.toString().includes(searchTerm.toLowerCase()) ?? false) ||
        (fee.deadline && format(new Date(fee.deadline), "dd/MM/yyyy").includes(searchTerm.toLowerCase()))
      )
    );
  }, [fees, searchTerm]);

  const handleDelete = async (feeId: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa khoản phí này?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/fees/${feeId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! Status: ${res.status}`);
      }
      setFees(fees.filter((fee) => fee._id !== feeId));
      toast({
        title: "Thành công",
        description: "Đã xóa khoản phí",
      });
    } catch (error: any) {
      console.error("Delete fee error:", error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể xóa khoản phí",
        variant: "destructive",
      });
    }
  };

  const handleAddFee = async (newFee: Partial<Fee>) => {
    try {
      const res = await fetch("http://localhost:3000/api/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newFee,
          type: newFee.type?.toUpperCase(),
          deadline: newFee.deadline ? new Date(newFee.deadline).toISOString() : null,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      if (!data.success || !data.data) {
        throw new Error("Invalid response format");
      }
      setFees([...fees, data.data]);
      toast({
        title: "Thành công",
        description: `Đã thêm khoản phí ${data.data.name}`,
      });
    } catch (error: any) {
      console.error("Add fee error:", error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể thêm khoản phí",
        variant: "destructive",
      });
    }
  };

  const handleUpdateFee = async (fee: Fee, updatedFee: Partial<Fee>) => {
    try {
      const res = await fetch(`http://localhost:3000/api/fees/${fee._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...updatedFee,
          type: updatedFee.type?.toUpperCase(),
          deadline: updatedFee.deadline ? new Date(updatedFee.deadline).toISOString() : null,
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `HTTP error! Status: ${res.status}`);
      }
      const data = await res.json();
      if (!data.success || !data.data) {
        throw new Error("Invalid response format");
      }
      setFees(fees.map((f) => (f._id === fee._id ? data.data : f)));
      toast({
        title: "Thành công",
        description: `Đã cập nhật khoản phí ${data.data.name}`,
      });
    } catch (error: any) {
      console.error("Update fee error:", error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể cập nhật khoản phí",
        variant: "destructive",
      });
    }
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
        <AddFeeDialog onAddFee={handleAddFee}>
          <Button className="bg-accent">
            <Plus className="mr-2 h-4 w-4" />
            Thêm khoản phí mới
          </Button>
        </AddFeeDialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Danh sách các khoản phí</CardTitle>
          <CardDescription>Tổng số khoản phí: {fees.length}</CardDescription>
          <div className="flex items-center py-2">
            <Search className="mr-2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm theo tên, mô tả, loại phí, đơn giá, deadline..."
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
                <TableHead>Deadline</TableHead>
                <TableHead>Bắt buộc</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFees.map((fee) => (
                <TableRow key={fee._id}>
                  <TableCell className="font-medium">{fee.name}</TableCell>
                  <TableCell>
                    <Badge className={getFeeTypeColor(fee.type)}>
                      {getFeeTypeLabel(fee.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {fee.amount
                      ? new Intl.NumberFormat("vi-VN").format(fee.amount) + " VND"
                      : fee.ratePerSqm
                      ? new Intl.NumberFormat("vi-VN").format(fee.ratePerSqm) + " VND/m²"
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {fee.deadline
                      ? format(new Date(fee.deadline), "dd/MM/yyyy")
                      : "Chưa đặt"}
                  </TableCell>
                  <TableCell>
                    {fee.mandatory ? (
                      <span className="text-green-600 font-medium">Có</span>
                    ) : (
                      <span className="text-amber-600">Không</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(fee.status)}>
                      {getStatusLabel(fee.status)}
                    </Badge>
                  </TableCell>
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
                        <EditFeeDialog
                          fee={fee}
                          onUpdateFee={(updatedFee) => handleUpdateFee(fee, updatedFee)}
                        >
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Edit className="mr-2 h-4 w-4" />
                            Sửa khoản phí
                          </DropdownMenuItem>
                        </EditFeeDialog>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(fee._id)}
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