// api/household.ts
import { Household, HouseholdFormData } from '../types/household';

const API_BASE_URL = 'http://localhost:3000/api';

// Lấy token từ localStorage
const getAuthToken = () => localStorage.getItem("token");

// Lấy headers với token
const getAuthHeaders = (): HeadersInit => {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// Fetch all households
export const fetchHouseholds = async (): Promise<Household[]> => {
  const response = await fetch(`${API_BASE_URL}/households`, {
    headers: getAuthHeaders(),
  });

  // Tạm dùng text() để debug
  const responseText = await response.text();
  console.log("📦 Response text from /households:", responseText);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  let data: any;
  try {
    data = JSON.parse(responseText);
  } catch (e) {
    console.error("❌ JSON parse failed:", e);
    throw new Error("Phản hồi từ server không phải JSON hợp lệ");
  }

  const householdsData = Array.isArray(data) ? data : data?.data || [];

  if (!Array.isArray(householdsData)) {
    throw new Error("Dữ liệu hộ khẩu không hợp lệ");
  }

  const validHouseholds = householdsData.filter((household: Household) => {
    if (!household._id) {
      console.warn("⚠️ Invalid household, missing _id:", household);
      return false;
    }
    return true;
  });

  return validHouseholds;
};


// Add new household
export const addHousehold = async (householdData: HouseholdFormData): Promise<Household> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Vui lòng đăng nhập để thực hiện thao tác này");
  }

  console.log("📤 Sending POST request to:", `${API_BASE_URL}/households/add`);
  console.log("📦 Payload:", householdData);

  const response = await fetch(`${API_BASE_URL}/households/add`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(householdData),
    credentials: 'include',  // Gửi cookie (token) kèm theo request
  });

  const responseText = await response.text();
  console.log("📥 Response text from /households/add:", responseText);
  console.log("📶 HTTP Status:", response.status);

  if (!response.ok) {
    try {
      const errorData = JSON.parse(responseText);
      console.error("❌ Server returned error JSON:", errorData);
      throw new Error(errorData?.message || `HTTP error! Status: ${response.status}`);
    } catch (e) {
      console.error("❌ Failed to parse error response as JSON:", e);
      throw new Error(`Phản hồi lỗi không phải JSON hợp lệ. Status: ${response.status}`);
    }
  }

  let data: any;
  try {
    data = JSON.parse(responseText);
    console.log("✅ Parsed JSON response:", data);
  } catch (e) {
    console.error("❌ Failed to parse success response as JSON:", e);
    throw new Error("Phản hồi thành công không phải JSON hợp lệ");
  }

  return data?.data;
};



// Update household
export const updateHousehold = async (householdId: string, householdData: HouseholdFormData): Promise<Household> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Vui lòng đăng nhập để thực hiện thao tác này");
  }

  const response = await fetch(`${API_BASE_URL}/households/${householdId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(householdData),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || `HTTP error! Status: ${response.status}`);
  }
  
  const data = await response.json();
  return data?.data;
};

// Delete household
export const deleteHousehold = async (householdId: string): Promise<void> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Vui lòng đăng nhập để thực hiện thao tác này");
  }

  const response = await fetch(`${API_BASE_URL}/households/${householdId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.message || `HTTP error! Status: ${response.status}`);
  }
};

// Fetch household by ID
export const fetchHouseholdById = async (householdId: string): Promise<Household> => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Vui lòng đăng nhập để thực hiện thao tác này");
  }

  const response = await fetch(`${API_BASE_URL}/households/${householdId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const responseText = await response.text();
  console.log("📥 Response text from /households/:id:", responseText);
  console.log("📶 HTTP Status:", response.status);

  if (!response.ok) {
    try {
      const errorData = JSON.parse(responseText);
      throw new Error(errorData?.message || `HTTP error! Status: ${response.status}`);
    } catch (e) {
      throw new Error("Phản hồi lỗi không phải JSON hợp lệ");
    }
  }

  let data: any;
  try {
    data = JSON.parse(responseText);
  } catch (e) {
    throw new Error("Phản hồi thành công không phải JSON hợp lệ");
  }

  return data?.data;
};


export const resetHouseholdInfo = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/households/delete/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Đặt lại thông tin hộ khẩu thất bại");
  }
  return true;
};

