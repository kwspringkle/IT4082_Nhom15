export interface Resident {
  _id: string;
  name: string;
  citizenId: string;
  gender: "Nam" | "Nữ" | "Khác";
  dob: string; // Assuming ISO date string, you might want to specify that in comments or JSDoc
  relation: string;
  householdId: string;
  status?: "Tạm trú" | "Tạm vắng" | "Đã chuyển đi" |"Thường trú"; // optional, since it's added later
}

export interface Household {
  _id: string;
  apartment: string;
}

export interface CitizenHistory {
  changeType: "UPDATE_INFO" | "TEMPORARY_ABSENT" | "TEMPORARY_RESIDENCE" | "DELETE" | "OTHER";
  changedAt: string; // ISO date string of the change timestamp
}
