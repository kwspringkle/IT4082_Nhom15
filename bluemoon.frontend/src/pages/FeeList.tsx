import { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, Plus, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ViewFeeDialog from "@/components/dialogs/ViewFeeDialog";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

// Định nghĩa interface cho Fee
interface Fee {
  _id: string;
  name: string;
  type: string;
  amount?: number;
  ratePerSqm?: number;
  deadline?: string;
  mandatory: boolean;
  description?: string;
  status: "ACTIVE" | "INACTIVE";
}

// Định nghĩa interface cho props của AddFeeDialog
interface AddFeeDialogProps {
  onAddFee: (newFee: Partial<Fee>) => Promise<void>;
  children: React.ReactNode;
}

// Định nghĩa interface cho props của EditFeeDialog
interface EditFeeDialogProps {
  fee: Fee;
  onUpdateFee: (updatedFee: Partial<Fee>) => Promise<void>;
  children: React.ReactNode;
}

// Component AddFeeDialog
const AddFeeDialog: React.FC<AddFeeDialogProps> = ({ onAddFee, children }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "MONTHLY",
    amount: "",
    ratePerSqm: "",
    deadline: "",
    mandatory: false,
    description: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Kiểm tra dữ liệu trước khi gửi
    if (!formData.name) {
      toast({
        title: "Lỗi",
        description: "Tên khoản phí là bắt buộc",
        variant: "destructive",
      });
      return;
    }
    if (formData.amount && Number(formData.amount) < 0) {
      toast({
        title: "Lỗi",
        description: "Đơn giá không được âm",
        variant: "destructive",
      });
      return;
    }
    if (formData.ratePerSqm && Number(formData.ratePerSqm) < 0) {
      toast({
        title: "Lỗi",
        description: "Đơn giá theo m² không được âm",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Adding new fee:", formData);
      await onAddFee({
        ...formData,
        amount: formData.amount ? Number(formData.amount) : undefined,
        ratePerSqm: formData.ratePerSqm ? Number(formData.ratePerSqm) : undefined,
        deadline: formData.deadline || undefined,
      });
      setOpen(false);
      setFormData({
        name: "",
        type: "MONTHLY",
        amount: "",
        ratePerSqm: "",
        deadline: "",
        mandatory: false,
        description: "",
        status: "ACTIVE",
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm khoản phí mới</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Tên khoản phí</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Loại phí</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại phí" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MONTHLY">Phí hàng tháng</SelectItem>
                <SelectItem value="YEARLY">Phí hàng năm</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Đơn giá (VND)</Label>
            <Input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>
          <div>
            <Label>Đơn giá theo m² (VND/m²)</Label>
            <Input
              type="number"
              value={formData.ratePerSqm}
              onChange={(e) => setFormData({ ...formData, ratePerSqm: e.target.value })}
            />
          </div>
          <div>
            <Label>Deadline</Label>
            <Input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.mandatory}
              onCheckedChange={(checked) => setFormData({ ...formData, mandatory: checked as boolean })}
            />
            <Label>Bắt buộc</Label>
          </div>
          <div>
            <Label>Trạng thái</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as "ACTIVE" | "INACTIVE" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Mô tả</Label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <Button type="submit">Thêm khoản phí</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Component EditFeeDialog
const EditFeeDialog: React.FC<EditFeeDialogProps> = ({ fee, onUpdateFee, children }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: fee.name || "",
    type: fee.type || "MONTHLY",
    amount: fee.amount?.toString() || "",
    ratePerSqm: fee.ratePerSqm?.toString() || "",
    deadline: fee.deadline ? new Date(fee.deadline).toISOString().split("T")[0] : "",
    mandatory: fee.mandatory || false,
    description: fee.description || "",
    status: fee.status || "ACTIVE",
  });

  useEffect(() => {
    setFormData({
      name: fee.name || "",
      type: fee.type || "MONTHLY",
      amount: fee.amount?.toString() || "",
      ratePerSqm: fee.ratePerSqm?.toString() || "",
      deadline: fee.deadline ? new Date(fee.deadline).toISOString().split("T")[0] : "",
      mandatory: fee.mandatory || false,
      description: fee.description || "",
      status: fee.status || "ACTIVE",
    });
  }, [fee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Kiểm tra dữ liệu trước khi gửi
    if (!formData.name) {
      toast({
        title: "Lỗi",
        description: "Tên khoản phí là bắt buộc",
        variant: "destructive",
      });
      return;
    }
    if (formData.amount && Number(formData.amount) < 0) {
      toast({
        title: "Lỗi",
        description: "Đơn giá không được âm",
        variant: "destructive",
      });
      return;
    }
    if (formData.ratePerSqm && Number(formData.ratePerSqm) < 0) {
      toast({
        title: "Lỗi",
        description: "Đơn giá theo m² không được âm",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Updating fee:", formData);
      await onUpdateFee({
        ...formData,
        amount: formData.amount ? Number(formData.amount) : undefined,
        ratePerSqm: formData.ratePerSqm ? Number(formData.ratePerSqm) : undefined,
        deadline: formData.deadline || undefined,
        status: formData.status,
      });
      setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa khoản phí</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Tên khoản phí</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label>Loại phí</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại phí" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MONTHLY">Phí hàng tháng</SelectItem>
                <SelectItem value="YEARLY">Phí hàng năm</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Đơn giá (VND)</Label>
            <Input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
          </div>
          <div>
            <Label>Đơn giá theo m² (VND/m²)</Label>
            <Input
              type="number"
              value={formData.ratePerSqm}
              onChange={(e) => setFormData({ ...formData, ratePerSqm: e.target.value })}
            />
          </div>
          <div>
            <Label>Deadline</Label>
            <Input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.mandatory}
              onCheckedChange={(checked) => setFormData({ ...formData, mandatory: checked as boolean })}
            />
            <Label>Bắt buộc</Label>
          </div>
          <div>
            <Label>Trạng thái</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value as "ACTIVE" | "INACTIVE" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Mô tả</Label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <Button type="submit">Cập nhật khoản phí</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Component chính FeeList
const FeeList: React.FC = () => {
  const [fees, setFees] = useState<Fee[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetch("http://localhost:3000/api/fees")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Fetched fees:", data);
        setFees(data.data || []);
      })
      .catch((error) => {
        console.error("Fetch fees error:", error);
        toast({
          title: "Lỗi",
          description: error.message || "Không thể tải danh sách khoản phí",
          variant: "destructive",
        });
      });
  }, []);

  const filteredFees = fees.filter(
    (fee) =>
      fee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (fee.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      fee.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFeeTypeLabel = (type: string): string => {
    switch (type) {
      case "MONTHLY":
        return "Phí hàng tháng";
      case "YEARLY":
        return "Phí hàng năm";
      default:
        return type;
    }
  };

  const getFeeTypeColor = (type: string): string => {
    switch (type) {
      case "MONTHLY":
        return "bg-blue-100 text-blue-800";
      case "YEARLY":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string): string => {
    return status === "ACTIVE" ? "Hoạt động" : "Không hoạt động";
  };

  const getStatusColor = (status: string): string => {
    return status === "ACTIVE"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  const handleDelete = async (feeId: string) => {
    if (!window.confirm("Bạn có chắc muốn xóa khoản phí này?")) return;
    try {
      console.log("Deleting fee with ID:", feeId);
      const res = await fetch(`http://localhost:3000/api/fees/${feeId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        let errorMessage = `HTTP error! Status: ${res.status}`;
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (jsonError) {
          console.error("Failed to parse error response:", jsonError);
        }
        throw new Error(errorMessage);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Quản lý khoản phí</h1>
          <p className="text-muted-foreground">
            Quản lý các loại phí và khoản đóng góp tại chung cư BlueMoon
          </p>
        </div>
        <AddFeeDialog
          onAddFee={async (newFee) => {
            try {
              console.log("Adding new fee:", newFee);
              const res = await fetch("http://localhost:3000/api/fees", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newFee),
              });
              if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `HTTP error! Status: ${res.status}`);
              }
              const data = await res.json();
              console.log("Add fee response:", data);
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
          }}
        >
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
                          onUpdateFee={async (updatedFee) => {
                            try {
                              console.log("Updating fee:", updatedFee);
                              const res = await fetch(`http://localhost:3000/api/fees/${fee._id}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(updatedFee),
                              });
                              if (!res.ok) {
                                const errorData = await res.json();
                                throw new Error(errorData.message || `HTTP error! Status: ${res.status}`);
                              }
                              const data = await res.json();
                              console.log("Update fee response:", data);
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
                          }}
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