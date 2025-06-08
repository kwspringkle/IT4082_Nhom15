// api/fees.ts
import { Fee } from "../types/fee";

const API_BASE_URL = "http://localhost:3000/api";

export const getAuthToken = (): string | null => localStorage.getItem("token");

// Hàm lấy danh sách phí (fetchFees)
export async function fetchFees(): Promise<Fee[]> {
  const response = await fetch(`${API_BASE_URL}/fees`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data : data?.data || [];
}

// Hàm tạo mới khoản phí
export async function createFee(feeData: Partial<Fee>): Promise<Fee> {
  const token = getAuthToken();
  if (!token) throw new Error("Vui lòng đăng nhập để thực hiện thao tác này");

  const response = await fetch(`${API_BASE_URL}/fees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(feeData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || `HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  return data?.data;
}

// Hàm cập nhật khoản phí
export async function updateFee(feeId: string, feeData: Partial<Fee>): Promise<Fee> {
  const token = getAuthToken();
  if (!token) throw new Error("Vui lòng đăng nhập để thực hiện thao tác này");

  const response = await fetch(`${API_BASE_URL}/fees/${feeId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(feeData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || `HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  return data?.data;
}

// Hàm xóa khoản phí
export async function deleteFee(feeId: string): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new Error("Vui lòng đăng nhập để thực hiện thao tác này");

  const response = await fetch(`${API_BASE_URL}/fees/${feeId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || `HTTP error! Status: ${response.status}`);
  }
}
