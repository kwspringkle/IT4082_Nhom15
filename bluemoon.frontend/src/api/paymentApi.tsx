import axios from "axios";
import { API_BASE_URL } from "@/utils/paymentUtils";
import { Payment, PaymentFormData } from "@/types/payment";

// Lấy danh sách các khoản thu
export const fetchPayments = async (): Promise<Payment[]> => {
  const response = await axios.get(`${API_BASE_URL}/payments`);
  return response.data.data || response.data;
};

// Cập nhật thông tin khoản thu
export const updatePayment = async (
  id: string,
  updatedData: Partial<Payment>
): Promise<Payment> => {
  const response = await axios.put(`${API_BASE_URL}/payments/${id}`, updatedData);
  return response.data;
};

// Tạo khoản thu mới
export const createPayment = async (
  newPaymentData: PaymentFormData
): Promise<Payment> => {
  const paymentData = {
    householdId: newPaymentData.householdId,
    feeId: newPaymentData.feeId,
    amount: newPaymentData.amount || 0,
    status: newPaymentData.status.toUpperCase(),
    paidDate: newPaymentData.paidDate || null,
    note: newPaymentData.note || "",
  };
  const response = await axios.post(`${API_BASE_URL}/payments`, paymentData);
  return response.data;
};

// Xóa khoản thu
export const deletePayment = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/payments/${id}`);
};

// Lấy danh sách hộ gia đình
export const fetchHouseholds = async () => {
  const response = await axios.get(`${API_BASE_URL}/households`);
  return response.data.data || response.data;
};