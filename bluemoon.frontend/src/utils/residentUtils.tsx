import { Resident } from "../types";
import { Badge } from "@/components/ui/badge";

// Thêm vào residentUtils.ts hoặc tạo function mới để debug

export const getStatusBadge = (status: string) => {
  // Debug: Log để xem giá trị thực tế
  console.log("getStatusBadge received:", status, "Type:", typeof status);
  
  // Normalize status string (loại bỏ khoảng trắng thừa)
  const normalizedStatus = status?.toString().trim();
  console.log("Normalized status:", normalizedStatus);
  
  switch (normalizedStatus) {
    case "Thường trú":
    case "PERMANENT":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Thường trú
        </span>
      );
    case "Tạm vắng":
    case "TEMPORARY_AWAY":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Tạm vắng
        </span>
      );
    case "Đã chuyển đi":
    case "MOVED_OUT":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Đã chuyển đi
        </span>
      );
    default:
      console.warn("Unknown status:", normalizedStatus);
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {normalizedStatus || "Không xác định"}
        </span>
      );
  }
};

export const getAuthToken = () => localStorage.getItem("token");