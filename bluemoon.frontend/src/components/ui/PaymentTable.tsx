import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Check, Edit, Trash2 } from "lucide-react";
import { Payment } from "@/types/payment";
import {
  getHouseholdInfo,
  getFeeName,
  getStatusBadge,
} from "@/utils/paymentUtils";

interface PaymentTableProps {
  payments: Payment[];
  onMarkAsPaid: (payment: Payment) => void;
  onEdit: (payment: Payment) => void;
  onDelete: (payment: Payment) => void;
}

const PaymentTable: React.FC<PaymentTableProps> = ({
  payments,
  onMarkAsPaid,
  onEdit,
  onDelete,
}) => {
  return (
    <>
      {payments.length === 0 && (
        <div className="text-center text-gray-500 py-4">
          Không có dữ liệu phù hợp với bộ lọc.
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Hộ gia đình</TableHead>
            <TableHead>Khoản phí</TableHead>
            <TableHead>Số tiền</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Ngày nộp</TableHead>
            <TableHead>Ghi chú</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell className="font-medium">
                {getHouseholdInfo(payment.household)}
              </TableCell>
              <TableCell>{getFeeName(payment.feeName)}</TableCell>
              <TableCell>
                {payment.amount
                  ? new Intl.NumberFormat("vi-VN").format(payment.amount) + " VND"
                  : "N/A"}
              </TableCell>
              <TableCell>{getStatusBadge(payment.status)}</TableCell>
              <TableCell>
                {payment.paidDate
                  ? new Date(payment.paidDate).toLocaleDateString("vi-VN")
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
                    {payment.status?.toLowerCase() === "unpaid" && (
                      <DropdownMenuItem onClick={() => onMarkAsPaid(payment)}>
                        <Check className="mr-2 h-4 w-4" />
                        Đánh dấu đã nộp
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => onEdit(payment)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => onDelete(payment)}
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
    </>
  );
};

export default PaymentTable;