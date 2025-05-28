import { useState } from "react";
import { mockPayments, mockHouseholds, mockFees } from "@/data/mockData";
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
import { Search, MoreHorizontal, Check, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

const PaymentList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("current");
  const [feeFilter, setFeeFilter] = useState("all");
  const [payments, setPayments] = useState(mockPayments);

  const currentDate = new Date();
  const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const previousMonth = currentDate.getMonth() === 0
    ? `${currentDate.getFullYear() - 1}-12`
    : `${currentDate.getFullYear()}-${String(currentDate.getMonth()).padStart(2, '0')}`;

  const filteredPayments = payments.filter(payment => {
    // Period filter
    if (periodFilter === "current" && payment.period !== currentMonth) return false;
    if (periodFilter === "previous" && payment.period !== previousMonth) return false;
    
    // Status filter
    if (statusFilter !== "all" && payment.status !== statusFilter) return false;
    
    // Fee filter
    if (feeFilter !== "all" && payment.feeId !== feeFilter) return false;
    
    // Text search
    const household = mockHouseholds.find(h => h.id === payment.householdId);
    const fee = mockFees.find(f => f.id === payment.feeId);
    
    if (!household || !fee) return false;
    
    return (
      household.apartmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      household.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const getHouseholdInfo = (householdId) => {
    const household = mockHouseholds.find(h => h.id === householdId);
    return household 
      ? `${household.apartmentNumber} - ${household.owner}`
      : 'N/A';
  };

  const getFeeName = (feeId) => {
    const fee = mockFees.find(f => f.id === feeId);
    return fee ? fee.name : 'N/A';
  };

  const formatPeriod = (period) => {
    const [year, month] = period.split('-');
    return `Tháng ${month}/${year}`;
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Đã nộp</Badge>;
      case 'unpaid':
        return <Badge className="bg-amber-100 text-amber-800">Chưa nộp</Badge>;
      case 'late':
        return <Badge className="bg-red-100 text-red-800">Trễ hạn</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const handleMarkAsPaid = (payment) => {
    setPayments(prevPayments => 
      prevPayments.map(p => 
        p.id === payment.id 
          ? { ...p, status: 'paid', paidAt: new Date().toISOString() }
          : p
      )
    );
    toast({
      title: "Thành công",
      description: "Đã đánh dấu khoản phí đã nộp",
    });
  };

  const handleEdit = (payment) => {
    toast({
      title: "Chức năng đang phát triển",
      description: "Chức năng sửa khoản thu đang được phát triển",
    });
  };

  const handleDelete = (payment) => {
    setPayments(prevPayments => prevPayments.filter(p => p.id !== payment.id));
    toast({
      title: "Đã xóa",
      description: "Đã xóa khoản thu phí",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Quản lý thu phí</h1>
          <p className="text-muted-foreground">
            Quản lý các khoản thu phí của các hộ gia đình
          </p>
        </div>
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
                    {mockFees.map((fee) => (
                      <SelectItem key={fee.id} value={fee.id}>
                        {fee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    {getHouseholdInfo(payment.householdId)}
                  </TableCell>
                  <TableCell>{getFeeName(payment.feeId)}</TableCell>
                  <TableCell>{formatPeriod(payment.period)}</TableCell>
                  <TableCell>{new Intl.NumberFormat('vi-VN').format(payment.amount)} VND</TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>
                    {payment.paidAt 
                      ? new Date(payment.paidAt).toLocaleDateString('vi-VN') 
                      : '-'}
                  </TableCell>
                  <TableCell>{new Date(payment.dueDate).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {payment.status === 'unpaid' && (
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
    </div>
  );
};

export default PaymentList;
