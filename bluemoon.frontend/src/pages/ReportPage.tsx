import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PieChart } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Định nghĩa interface cho type safety
interface FeeStats {
  name: string;
  count: number;
  paid: number;
  unpaid: number;
  expected: number;
  rate: number;
}

interface ReportData {
  paymentRate: number;
  totalPaid: number;
  unpaidAmount: number;
  totalExpected: number;
  totalHouseholds: number;
  feeStats?: FeeStats[]; // Optional vì API hiện tại không trả về
}

const ReportPage = () => {
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [periodFilter, setPeriodFilter] = useState("current");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get("http://localhost:3000/api/statistics/report");
        
        // Kiểm tra và validate dữ liệu trước khi set state
        const data = res.data;
        if (!data) {
          throw new Error("Không có dữ liệu từ API");
        }
        
        // Đảm bảo các trường số tồn tại và có giá trị hợp lệ
        const validatedData: ReportData = {
          paymentRate: data.paymentRate || 0,
          totalPaid: data.totalPaid || 0,
          unpaidAmount: data.unpaidAmount || 0, // Đổi từ totalUnpaid sang unpaidAmount
          totalExpected: data.totalExpected || 0,
          totalHouseholds: data.totalHouseholds || 0,
          feeStats: Array.isArray(data.feeStats) ? data.feeStats.map((fee: any) => ({
            name: fee.name || '',
            count: fee.count || 0,
            paid: fee.paid || 0,
            unpaid: fee.unpaid || 0,
            expected: fee.expected || 0,
            rate: fee.rate || 0
          })) : [] // Sẽ là mảng rỗng vì API hiện tại không có feeStats
        };
        
        setReport(validatedData);
      } catch (err) {
        console.error("Lỗi khi fetch báo cáo:", err);
        setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  // Helper function để format số tiền an toàn
  const formatCurrency = (amount: number | undefined | null): string => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return "0 VND";
    }
    return `${amount.toLocaleString("vi-VN")} VND`;
  };

  // Helper function để format tỷ lệ phần trăm an toàn
  const formatPercentage = (rate: number | undefined | null): string => {
    if (rate === undefined || rate === null || isNaN(rate)) {
      return "0%";
    }
    return `${Math.round(rate)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-2">Lỗi: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Không có dữ liệu</p>
      </div>
    );
  }

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
              <SelectItem value="current">Hiện tại</SelectItem>
              {/* Thêm các kỳ nếu cần */}
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
              <p className="text-2xl font-bold">
                {formatPercentage(report.paymentRate)}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Đã thu</p>
                <p className="text-xs font-semibold">
                  {formatCurrency(report.totalPaid)}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Chưa thu</p>
                <p className="text-xs font-semibold">
                  {formatCurrency(report.unpaidAmount)}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Tổng dự kiến</p>
                <p className="text-xs font-semibold">
                  {formatCurrency(report.totalExpected)}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Tổng hộ gia đình</p>
                <p className="text-xs font-semibold">
                  {report.totalHouseholds}
                </p>
              </div>
            </div>
            <div className="w-full h-4 bg-blue-100 rounded-full mt-4 overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${Math.max(0, Math.min(100, report.paymentRate || 0))}%` }}
              ></div>
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
              {report.feeStats && report.feeStats.length > 0 ? (
                report.feeStats.map((fee: FeeStats, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{fee.name || 'N/A'}</TableCell>
                    <TableCell>{fee.count || 0}</TableCell>
                    <TableCell>{formatCurrency(fee.paid)}</TableCell>
                    <TableCell>{formatCurrency(fee.unpaid)}</TableCell>
                    <TableCell>{formatCurrency(fee.expected)}</TableCell>
                    <TableCell>{formatPercentage(fee.rate)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    Dữ liệu chi tiết theo loại phí chưa có sẵn
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportPage;