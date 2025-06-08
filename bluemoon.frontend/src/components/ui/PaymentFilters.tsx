import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface PaymentFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  periodFilter: string;
  setPeriodFilter: (period: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  feeFilter: string;
  setFeeFilter: (fee: string) => void;
  allFeeNames: string[];
}

const PaymentFilters: React.FC<PaymentFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  periodFilter,
  setPeriodFilter,
  statusFilter,
  setStatusFilter,
  feeFilter,
  setFeeFilter,
  allFeeNames,
}) => {
  return (
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
              {allFeeNames
                .filter(name => name !== null && name !== undefined && name !== "")
                .map((feeName) => (
                  <SelectItem key={feeName} value={feeName}>
                    {feeName}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default PaymentFilters;