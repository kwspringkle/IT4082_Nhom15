// api/residents.ts
import { Resident, CitizenHistory, ResidentFormData } from '../types/resident';
import { Household } from '../types/household';

const API_BASE_URL = 'http://localhost:3000/api';

export const getAuthToken = (): string | null => localStorage.getItem("token");

export const residentsApi = {
  async getResidents(): Promise<Resident[]> {
    const response = await fetch(`${API_BASE_URL}/citizens`, {
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Dữ liệu nhân khẩu không hợp lệ");
    return data;
  },

  async getResidentHistory(residentId: string): Promise<CitizenHistory[]> {
    const response = await fetch(`${API_BASE_URL}/citizens/${residentId}/history`, {
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      console.warn(`History not found for citizen ID: ${residentId}`);
      return [];
    }
    const data = await response.json();
    return data?.data || [];
  },

  async checkCitizenIdExists(citizenId: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/citizens?citizenId=${citizenId}`);
      const data = await response.json();
      return data?.data?.length > 0;
    } catch (error) {
      console.warn("Error checking citizenId:", error);
      return false;
    }
  },

  async createResident(residentData: ResidentFormData): Promise<Resident> {
    const token = getAuthToken();
    if (!token) throw new Error("Vui lòng đăng nhập để thực hiện thao tác này");

    const response = await fetch(`${API_BASE_URL}/citizens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(residentData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data?.data;
  },

  async updateResident(residentId: string, residentData: ResidentFormData): Promise<Resident> {
    const token = getAuthToken();
    if (!token) throw new Error("Vui lòng đăng nhập để thực hiện thao tác này");

    const response = await fetch(`${API_BASE_URL}/citizens/${residentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(residentData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || `HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data?.data;
  },

  async deleteResident(residentId: string): Promise<void> {
    const token = getAuthToken();
    if (!token) throw new Error("Vui lòng đăng nhập để thực hiện thao tác này");

    const response = await fetch(`${API_BASE_URL}/citizens/${residentId}`, {
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
};

export const householdsApi = {
  async getHouseholds(): Promise<Household[]> {
    const response = await fetch(`${API_BASE_URL}/households`, {
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    return Array.isArray(data) ? data : data?.data || [];
  }
};