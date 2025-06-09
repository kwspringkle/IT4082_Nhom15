export const getFeeTypeLabel = (type: string): string => {
  switch (type) {
    case "MONTHLY":
      return "Phí hàng tháng";
    case "YEARLY":
      return "Phí hàng năm";
    case "OTHER":
      return "Phí khác";
    default:
      return type;
  }
};

export const getFeeTypeColor = (type: string): string => {
  switch (type) {
    case "MONTHLY":
      return "bg-blue-100 text-blue-800";
    case "YEARLY":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusLabel = (status: string): string => {
  return status === "ACTIVE" ? "Hoạt động" : "Không hoạt động";
};

export const getStatusColor = (status: string): string => {
  return status === "ACTIVE"
    ? "bg-green-100 text-green-800"
    : "bg-gray-100 text-gray-800";
};