
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { calculatePaymentStats, mockFees, mockPayments } from "@/data/mockData";
import { BarChart, FileText, PieChart } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ReportPage = () => {
  const [periodFilter, setPeriodFilter] = useState("current");
  const stats = calculatePaymentStats();
  
  // Get unique periods from payments
  const periods = Array.from(new Set(mockPayments.map(p => p.period))).sort().reverse();
  
  const formatPeriod = (period: string) => {
    const [year, month] = period.split('-');
    return `Tháng ${month}/${year}`;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Báo cáo & Thống kê</h1>
          <p className="text-muted-foreground">
            Xem báo cáo và thống kê về tình hình thu phí
          </p>
        </div>
        <div className="w-[180px]">
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Kỳ báo cáo" />
            </SelectTrigger>
            <SelectContent>
              {periods.map(period => (
                <SelectItem key={period} value={period}>
                  {formatPeriod(period)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ thu phí</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{Math.round(stats.paymentRate)}%</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Đã thu</p>
                <p className="text-xs font-semibold">{new Intl.NumberFormat('vi-VN').format(stats.totalPaid)} VND</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Chưa thu</p>
                <p className="text-xs font-semibold">{new Intl.NumberFormat('vi-VN').format(stats.totalExpected - stats.totalPaid)} VND</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Tổng dự kiến</p>
                <p className="text-xs font-semibold">{new Intl.NumberFormat('vi-VN').format(stats.totalExpected)} VND</p>
              </div>
            </div>
            <div className="w-full h-4 bg-blue-100 rounded-full mt-4 overflow-hidden">
              <div 
                className="h-full bluemoon-gradient" 
                style={{ width: `${Math.round(stats.paymentRate)}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Thống kê số lượng</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Đã thu</p>
                  <p className="text-lg font-bold text-bluemoon-600">{stats.paidCount}</p>
                  <p className="text-xs text-muted-foreground">khoản</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Chưa thu</p>
                  <p className="text-lg font-bold text-amber-600">{stats.unpaidCount}</p>
                  <p className="text-xs text-muted-foreground">khoản</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Tổng số khoản thu</p>
                <p className="text-xs font-semibold">{stats.paidCount + stats.unpaidCount}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Đã hoàn thành</p>
                <p className="text-xs font-semibold">{Math.round((stats.paidCount / (stats.paidCount + stats.unpaidCount)) * 100)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Báo cáo chi tiết</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-2">
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Xuất Excel
              </Button>
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                Xuất PDF
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              <p>Báo cáo đầy đủ bao gồm:</p>
              <ul className="list-disc pl-4 mt-1 space-y-1">
                <li>Chi tiết khoản thu theo hộ</li>
                <li>Thống kê theo loại phí</li>
                <li>Danh sách nợ phí</li>
                <li>Biểu đồ phân tích</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Thống kê theo loại phí</CardTitle>
          <CardDescription>
            Tổng hợp tình hình thu phí theo từng loại
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loại phí</TableHead>
                <TableHead>Số khoản</TableHead>
                <TableHead>Đã thu</TableHead>
                <TableHead>Chưa thu</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Tỷ lệ thu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Phí dịch vụ</TableCell>
                <TableCell>10</TableCell>
                <TableCell>{new Intl.NumberFormat('vi-VN').format(6187500)} VND</TableCell>
                <TableCell>{new Intl.NumberFormat('vi-VN').format(1237500)} VND</TableCell>
                <TableCell>{new Intl.NumberFormat('vi-VN').format(7425000)} VND</TableCell>
                <TableCell>83%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Phí quản lý</TableCell>
                <TableCell>10</TableCell>
                <TableCell>{new Intl.NumberFormat('vi-VN').format(2625000)} VND</TableCell>
                <TableCell>{new Intl.NumberFormat('vi-VN').format(525000)} VND</TableCell>
                <TableCell>{new Intl.NumberFormat('vi-VN').format(3150000)} VND</TableCell>
                <TableCell>83%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Phí gửi xe</TableCell>
                <TableCell>15</TableCell>
                <TableCell>{new Intl.NumberFormat('vi-VN').format(4270000)} VND</TableCell>
                <TableCell>{new Intl.NumberFormat('vi-VN').format(910000)} VND</TableCell>
                <TableCell>{new Intl.NumberFormat('vi-VN').format(5180000)} VND</TableCell>
                <TableCell>82%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Đóng góp</TableCell>
                <TableCell>5</TableCell>
                <TableCell>{new Intl.NumberFormat('vi-VN').format(200000)} VND</TableCell>
                <TableCell>{new Intl.NumberFormat('vi-VN').format(50000)} VND</TableCell>
                <TableCell>{new Intl.NumberFormat('vi-VN').format(250000)} VND</TableCell>
                <TableCell>80%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportPage;