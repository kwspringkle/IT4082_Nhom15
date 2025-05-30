import { useState, useEffect } from "react";
import axios from "axios";
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
  CardHeader,
  CardTitle,
  CardDescription,
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, MoreHorizontal, Check, Edit, Trash2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = "http://localhost:3000/api";

const PaymentList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [feeFilter, setFeeFilter] = useState("all");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [editFormData, setEditFormData] = useState({
    household: "",
    feeName: "",
    period: "",
    amount: "",
    status: "",
    dueDate: "",
    paidAt: "",
    note: "",
  });
  const [newPayment, setNewPayment] = useState({
    household: "",
    feeName: "",
    period: "",
    amount: "",
    status: "unpaid",
    dueDate: "",
    paidAt: "",
    note: "",
  });

  const currentDate = new Date();
  const currentMonth = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}`;
  const previousMonth =
    currentDate.getMonth() === 0
      ? `${currentDate.getFullYear() - 1}-12`
      : `${currentDate.getFullYear()}-${String(currentDate.getMonth()).padStart(2, "0")}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const paymentsRes = await axios.get(`${API_BASE_URL}/payments`);
        console.log("Payments response:", paymentsRes.data);
        const paymentData = (paymentsRes.data.data || paymentsRes.data).map(payment => ({
          ...payment,
          amount: parseFloat(payment.amount) || 0,
          status: payment.status ? payment.status.toUpperCase() : "UNKNOWN",
          period: payment.period || currentMonth,
          dueDate: payment.dueDate || null,
          paidAt: payment.paidAt || null,
        }));
        console.log("Normalized payment data:", paymentData);
        setPayments(paymentData);
      } catch (error) {
        console.error("Fetch error details:", error.response?.data || error.message);
        toast({
          title: "Lỗi",
          description: `Không thể tải dữ liệu: ${error.response?.data?.message || error.message}`,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPayments = payments.filter((payment) => {
    console.log("Processing payment:", payment);
    const periodMatch =
      periodFilter === "all" ||
      (payment.period && payment.period === (periodFilter === "current" ? currentMonth : previousMonth));
    const statusMatch =
      statusFilter === "all" ||
      (payment.status && payment.status.toLowerCase() === statusFilter);
    const feeMatch =
      feeFilter === "all" ||
      (payment.feeName && payment.feeName === feeFilter);
    const searchMatch =
      !searchTerm ||
      (payment.household &&
        payment.household.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (payment.feeName &&
        payment.feeName.toLowerCase().includes(searchTerm.toLowerCase()));

    console.log("Payment filter results:", {
      id: payment.id,
      periodMatch,
      statusMatch,
      feeMatch,
      searchMatch,
    });

    return periodMatch && statusMatch && feeMatch && searchMatch;
  });

  console.log("Filtered payments:", filteredPayments);

  const getHouseholdInfo = (household) => household || "N/A";
  const getFeeName = (feeName) => feeName || "N/A";

  const formatPeriod = (period) => {
    if (!period) return "N/A";
    const [year, month] = period.split("-");
    return `Tháng ${month}/${year}`;
  };

  const getStatusBadge = (status) => {
    if (!status) return <Badge className="bg-gray-100 text-gray-800">N/A</Badge>;
    switch (status.toLowerCase()) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Đã nộp</Badge>;
      case "unpaid":
        return <Badge className="bg-amber-100 text-amber-800">Chưa nộp</Badge>;
      case "late":
        return <Badge className="bg-red-100 text-red-800">Trễ hạn</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const handleMarkAsPaid = async (payment) => {
    try {
      const updatedPayment = {
        ...payment,
        status: "PAID",
        paidAt: new Date().toISOString(),
      };
      const response = await axios.put(
        `${API_BASE_URL}/payments/${payment.id}`,
        updatedPayment
      );
      setPayments((prevPayments) =>
        prevPayments.map((p) => (p.id === payment.id ? { ...response.data, amount: parseFloat(response.data.amount) || 0 } : p))
      );
      toast({
        title: "Thành công",
        description: "Đã đánh dấu khoản phí đã nộp",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: `Không thể cập nhật trạng thái: ${error.response?.data?.message || error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (payment) => {
    setSelectedPayment(payment);
    setEditFormData({
      household: payment.household || "",
      feeName: payment.feeName || "",
      period: payment.period || "",
      amount: payment.amount ? payment.amount.toString() : "",
      status: payment.status ? payment.status.toLowerCase() : "",
      dueDate: payment.dueDate ? payment.dueDate.split("T")[0] : "",
      paidAt: payment.paidAt ? payment.paidAt.split("T")[0] : "",
      note: payment.note || "",
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      const updatedPayment = {
        ...editFormData,
        amount: parseFloat(editFormData.amount) || 0,
        status: editFormData.status.toUpperCase(),
        paidAt: editFormData.paidAt || null,
      };
      const response = await axios.put(
        `${API_BASE_URL}/payments/${selectedPayment.id}`,
        updatedPayment
      );
      setPayments((prevPayments) =>
        prevPayments.map((p) => (p.id === selectedPayment.id ? { ...response.data, amount: parseFloat(response.data.amount) || 0 } : p))
      );
      setIsEditModalOpen(false);
      toast({
        title: "Thành công",
        description: "Đã cập nhật khoản thu phí",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: `Không thể cập nhật khoản thu: ${error.response?.data?.message || error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (payment) => {
    try {
      await axios.delete(`${API_BASE_URL}/payments/${payment.id}`);
      setPayments((prevPayments) => prevPayments.filter((p) => p.id !== payment.id));
      toast({
        title: "Đã xóa",
        description: "Đã xóa khoản thu phí",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: `Không thể xóa khoản thu: ${error.response?.data?.message || error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPayment({ ...newPayment, [name]: value });
  };

  const handleStatusChange = (value) => {
    setNewPayment({ ...newPayment, status: value });
  };

  const handleCreatePayment = async () => {
    try {
      const paymentData = {
        household: newPayment.household,
        feeName: newPayment.feeName,
        period: newPayment.period || currentMonth,
        amount: parseFloat(newPayment.amount) || 0,
        status: newPayment.status.toUpperCase(),
        dueDate: newPayment.dueDate || null,
        paidAt: newPayment.paidAt || null,
        note: newPayment.note || "",
      };

      const response = await axios.post(`${API_BASE_URL}/payments`, paymentData);
      setPayments((prevPayments) => [
        ...prevPayments,
        { ...response.data, amount: parseFloat(response.data.amount) || 0 },
      ]);
      setOpenCreateDialog(false);
      toast({
        title: "Thành công",
        description: "Tạo khoản thu phí mới thành công",
      });

      // Reset form
      setNewPayment({
        household: "",
        feeName: "",
        period: "",
        amount: "",
        status: "unpaid",
        dueDate: "",
        paidAt: "",
        note: "",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: `Không thể tạo khoản thu: ${error.response?.data?.message || error.message}`,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Quản lý thu phí</h1>
          <p className="text-muted-foreground">
            Quản lý các khoản thu phí của các hộ gia đình
          </p>
        </div>
        <Dialog open={openCreateDialog} onOpenChange={setOpenCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600">
              <Plus className="mr-2 h-4 w-4" />
              Tạo khoản thu phí mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Tạo khoản thu phí mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin để tạo khoản thu phí mới trong hệ thống.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="household">Hộ gia đình</Label>
                  <Input
                    id="household"
                    name="household"
                    value={newPayment.household}
                    onChange={handleInputChange}
                    placeholder="Nhập tên hộ gia đình"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Trạng thái</Label>
                  <Select
                    value={newPayment.status}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Đã nộp</SelectItem>
                      <SelectItem value="unpaid">Chưa nộp</SelectItem>
                      <SelectItem value="late">Trễ hạn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="feeName">Khoản phí</Label>
                <Input
                  id="feeName"
                  name="feeName"
                  value={newPayment.feeName}
                  onChange={handleInputChange}
                  placeholder="Nhập tên khoản phí"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="period">Kỳ thu</Label>
                  <Input
                    id="period"
                    name="period"
                    type="month"
                    value={newPayment.period}
                    onChange={handleInputChange}
                    placeholder="Chọn kỳ thu"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Số tiền</Label>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    value={newPayment.amount}
                    onChange={handleInputChange}
                    placeholder="Nhập số tiền"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Hạn nộp</Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={newPayment.dueDate}
                    onChange={handleInputChange}
                    placeholder="Chọn hạn nộp"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paidAt">Ngày nộp</Label>
                  <Input
                    id="paidAt"
                    name="paidAt"
                    type="date"
                    value={newPayment.paidAt}
                    onChange={handleInputChange}
                    placeholder="Chọn ngày nộp"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="note">Ghi chú</Label>
                <Input
                  id="note"
                  name="note"
                  value={newPayment.note}
                  onChange={handleInputChange}
                  placeholder="Nhập ghi chú (nếu có)"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenCreateDialog(false)}>
                Hủy
              </Button>
              <Button onClick={handleCreatePayment}>Tạo khoản thu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Danh sách khoản thu phí</CardTitle>
          <CardDescription>
            Quản lý việc thu phí từ các hộ gia đình
          </CardDescription>
          <div className="flex flex-wrap gap-4 py-2">
            <div className="flex items-center flex-1 min-w-[280px]">
              <Search className="mr-2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo căn hộ, chủ hộ, khoản phí..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="w-[160px]">
                <Select value={periodFilter} onValueChange={setPeriodFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kỳ thu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả kỳ</SelectItem>
                    <SelectItem value="current">Tháng hiện tại</SelectItem>
                    <SelectItem value="previous">Tháng trước</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[160px]">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="paid">Đã nộp</SelectItem>
                    <SelectItem value="unpaid">Chưa nộp</SelectItem>
                    <SelectItem value="late">Trễ hạn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[180px]">
                <Select value={feeFilter} onValueChange={setFeeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Loại phí" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả phí</SelectItem>
                    {[...new Set(payments.map(p => p.feeName))].map(feeName => (
                      <SelectItem key={feeName} value={feeName}>
                        {feeName || "N/A"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPayments.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              Không có dữ liệu phù hợp với bộ lọc.
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hộ gia đình</TableHead>
                <TableHead>Khoản phí</TableHead>
                <TableHead>Kỳ thu</TableHead>
                <TableHead>Số tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày nộp</TableHead>
                <TableHead>Hạn nộp</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    {getHouseholdInfo(payment.household)}
                  </TableCell>
                  <TableCell>{getFeeName(payment.feeName)}</TableCell>
                  <TableCell>{formatPeriod(payment.period)}</TableCell>
                  <TableCell>
                    {payment.amount
                      ? new Intl.NumberFormat("vi-VN").format(payment.amount) + " VND"
                      : "N/A"}
                  </TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>
                    {payment.paidAt
                      ? new Date(payment.paidAt).toLocaleDateString("vi-VN")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {payment.dueDate
                      ? new Date(payment.dueDate).toLocaleDateString("vi-VN")
                      : "-"}
                  </TableCell>
                  <TableCell>{payment.note || "-"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {payment.status.toLowerCase() === "unpaid" && (
                          <DropdownMenuItem onClick={() => handleMarkAsPaid(payment)}>
                            <Check className="mr-2 h-4 w-4" />
                            Đánh dấu đã nộp
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleEdit(payment)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handleDelete(payment)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa
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

      {/* Edit Payment Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa khoản thu phí</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin khoản thu phí cho hộ gia đình.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-household">Hộ gia đình</Label>
                <Input
                  id="edit-household"
                  value={editFormData.household}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, household: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Trạng thái</Label>
                <Select
                  value={editFormData.status}
                  onValueChange={(value) =>
                    setEditFormData({ ...editFormData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Đã nộp</SelectItem>
                    <SelectItem value="unpaid">Chưa nộp</SelectItem>
                    <SelectItem value="late">Trễ hạn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-feeName">Khoản phí</Label>
              <Input
                id="edit-feeName"
                value={editFormData.feeName}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, feeName: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-period">Kỳ thu</Label>
                <Input
                  id="edit-period"
                  type="month"
                  value={editFormData.period}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, period: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-amount">Số tiền</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  value={editFormData.amount}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, amount: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-dueDate">Hạn nộp</Label>
                <Input
                  id="edit-dueDate"
                  type="date"
                  value={editFormData.dueDate}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, dueDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-paidAt">Ngày nộp</Label>
                <Input
                  id="edit-paidAt"
                  type="date"
                  value={editFormData.paidAt}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, paidAt: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-note">Ghi chú</Label>
              <Input
                id="edit-note"
                value={editFormData.note}
                onChange={(e) =>
                  setEditFormData({ ...editFormData, note: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleEditSubmit}>Lưu thay đổi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PaymentList;