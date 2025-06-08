// utils/validation.ts
import { ResidentFormData } from '../types/resident';


export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateHouseholdForm = (formData: {
  apartment: string;
  floor: string;
  area: string;
  head: string;
  phone: string;
}): ValidationResult => {
  // Chỉ bắt buộc 3 trường đầu
  if (!formData.apartment || !formData.floor || !formData.area) {
    return {
      isValid: false,
      error: "Vui lòng điền đầy đủ thông tin bắt buộc"
    };
  }

  const floor = parseInt(formData.floor);
  if (isNaN(floor) || floor <= 0) {
    return {
      isValid: false,
      error: "Tầng phải là số dương"
    };
  }

  const area = parseFloat(formData.area);
  if (isNaN(area) || area <= 0) {
    return {
      isValid: false,
      error: "Diện tích phải là số dương"
    };
  }

  // Các kiểm tra còn lại có thể giữ nguyên hoặc bỏ tùy yêu cầu
  if (formData.phone && !/^[0][0-9]{9}$/.test(formData.phone)) {
    return {
      isValid: false,
      error: "Số điện thoại phải là 10 số, bắt đầu bằng 0"
    };
  }

  if (!/^[0-9A-Za-z-]+$/.test(formData.apartment)) {
    return {
      isValid: false,
      error: "Số căn hộ chỉ chứa chữ, số hoặc dấu gạch ngang"
    };
  }

  return { isValid: true };
};



export interface ValidationError {
  field: string;
  message: string;
}

export const validateResidentForm = (formData: ResidentFormData): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Check required fields
  if (!formData.name.trim()) {
    errors.push({ field: 'name', message: 'Họ tên là bắt buộc' });
  }

  if (!formData.citizenId.trim()) {
    errors.push({ field: 'citizenId', message: 'Căn cước công dân là bắt buộc' });
  } else if (!/^\d{12}$/.test(formData.citizenId)) {
    errors.push({ field: 'citizenId', message: 'Căn cước công dân phải là 12 số' });
  }

  if (!formData.gender) {
    errors.push({ field: 'gender', message: 'Giới tính là bắt buộc' });
  }

  if (!formData.dob) {
    errors.push({ field: 'dob', message: 'Ngày sinh là bắt buộc' });
  } else {
    const dobDate = new Date(formData.dob);
    if (dobDate > new Date()) {
      errors.push({ field: 'dob', message: 'Ngày sinh không thể là ngày trong tương lai' });
    }
  }

  if (!formData.relation.trim()) {
    errors.push({ field: 'relation', message: 'Quan hệ với chủ hộ là bắt buộc' });
  }

  if (!formData.householdId) {
    errors.push({ field: 'householdId', message: 'Căn hộ là bắt buộc' });
  }

  return errors;
};

export const getFirstValidationError = (formData: ResidentFormData): string | null => {
  const errors = validateResidentForm(formData);
  return errors.length > 0 ? errors[0].message : null;
};