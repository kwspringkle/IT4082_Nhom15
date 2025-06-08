import { Badge } from "@/components/ui/badge";
import { Payment } from "@/types/payment";
import React from "react";

export const API_BASE_URL = "http://localhost:3000/api";

export const getHouseholdInfo = (household: string | undefined): string =>
  household || "N/A";

export const getFeeName = (feeName: string | undefined): string =>
  feeName || "N/A";

export const formatPeriod = (period: string | undefined): string => {
  if (!period) return "N/A";
  const [year, month] = period.split("-");
  return `Tháng ${month}/${year}`;
};

export const getStatusBadge = (status: string | undefined): JSX.Element => {
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

export const normalizePaymentData = (data: any[]): Payment[] => {
  const currentDate = new Date();
  const currentMonth = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}`;

  return data.map((payment) => ({
    ...payment,
    id: payment.id, // Đảm bảo id có mặt
    amount: parseFloat(payment.amount) || 0,
    status: payment.status ? payment.status.toUpperCase() : "UNKNOWN",
    period: payment.period || currentMonth,
    dueDate: payment.dueDate || null,
    paidAt: payment.paidAt || null,
    note: payment.note || "", // Đảm bảo note có mặt
  }));
};

export const getCurrentAndPreviousMonth = () => {
  const currentDate = new Date();
  const currentMonth = `${currentDate.getFullYear()}-${String(
    currentDate.getMonth() + 1
  ).padStart(2, "0")}`;
  const previousMonth =
    currentDate.getMonth() === 0
      ? `${currentDate.getFullYear() - 1}-12`
      : `${currentDate.getFullYear()}-${String(currentDate.getMonth()).padStart(2, "0")}`;
  return { currentMonth, previousMonth };
};