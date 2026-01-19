// lib/validation.ts
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export class Validator {
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static validatePhone(phone: string): boolean {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  static validateURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static validateJob(data: any): ValidationResult {
    const errors: Record<string, string> = {};

    // Required fields
    if (!data.title?.trim()) {
      errors.title = 'Job title is required';
    } else if (data.title.length < 5) {
      errors.title = 'Job title must be at least 5 characters';
    }

    if (!data.description?.trim()) {
      errors.description = 'Job description is required';
    } else if (data.description.length < 20) {
      errors.description = 'Job description must be at least 20 characters';
    }

    if (!data.category) {
      errors.category = 'Category is required';
    }

    if (!data.jobType) {
      errors.jobType = 'Job type is required';
    }

    // Optional field validation
    if (data.payAmount) {
      const amount = parseFloat(data.payAmount);
      if (isNaN(amount) || amount < 0) {
        errors.payAmount = 'Pay amount must be a positive number';
      }
    }

    if (data.startTime && data.endTime) {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      
      if (start >= end) {
        errors.endTime = 'End time must be after start time';
      }
      
      if (start < new Date()) {
        errors.startTime = 'Start time cannot be in the past';
      }
    }

    // Location validation if provided
    if (data.location?.address) {
      if (!data.location.latitude || !data.location.longitude) {
        errors.location = 'Please select a valid location from the map';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  static validateProfile(data: any): ValidationResult {
    const errors: Record<string, string> = {};

    if (data.bio && data.bio.length > 500) {
      errors.bio = 'Bio cannot exceed 500 characters';
    }

    if (data.skills && data.skills.length > 20) {
      errors.skills = 'Maximum 20 skills allowed';
    }

    if (data.experience && data.experience.length > 50) {
      errors.experience = 'Maximum 50 experience items allowed';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  static validatePortfolio(data: any): ValidationResult {
    const errors: Record<string, string> = {};

    if (!data.title?.trim()) {
      errors.title = 'Title is required';
    }

    if (!data.description?.trim()) {
      errors.description = 'Description is required';
    }

    if (!data.category) {
      errors.category = 'Category is required';
    }

    if (data.mediaUrls && data.mediaUrls.length > 10) {
      errors.mediaUrls = 'Maximum 10 media files allowed';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  static validatePost(data: any): ValidationResult {
    const errors: Record<string, string> = {};

    if (!data.title?.trim()) {
      errors.title = 'Title is required';
    } else if (data.title.length < 5) {
      errors.title = 'Title must be at least 5 characters';
    }

    if (!data.content?.trim()) {
      errors.content = 'Content is required';
    } else if (data.content.length < 10) {
      errors.content = 'Content must be at least 10 characters';
    }

    if (!data.category) {
      errors.category = 'Category is required';
    }

    if (data.mediaUrls && data.mediaUrls.length > 5) {
      errors.mediaUrls = 'Maximum 5 media files allowed';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  static validateApplication(data: any): ValidationResult {
    const errors: Record<string, string> = {};

    if (!data.jobId) {
      errors.jobId = 'Job ID is required';
    }

    if (data.message && data.message.length > 500) {
      errors.message = 'Message cannot exceed 500 characters';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  static sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove HTML tags
      .replace(/[&<>"']/g, '') // Remove special characters
      .substring(0, 10000); // Limit length
  }

  static sanitizeHTML(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }

  static formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
    }
    
    return phone;
  }

  static validateFile(file: File, options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
    allowedExtensions?: string[];
  } = {}): ValidationResult {
    const { maxSize = 5 * 1024 * 1024, allowedTypes = [], allowedExtensions = [] } = options;
    const errors: Record<string, string> = {};

    // Check file size
    if (file.size > maxSize) {
      errors.size = `File size exceeds ${maxSize / 1024 / 1024}MB limit`;
    }

    // Check file type
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      errors.type = `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`;
    }

    // Check file extension
    if (allowedExtensions.length > 0) {
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!extension || !allowedExtensions.includes(extension)) {
        errors.extension = `File extension not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`;
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  static validateLocation(data: any): ValidationResult {
    const errors: Record<string, string> = {};

    if (!data.address?.trim()) {
      errors.address = 'Address is required';
    }

    if (!data.city?.trim()) {
      errors.city = 'City is required';
    }

    if (!data.state?.trim()) {
      errors.state = 'State is required';
    }

    if (!data.country?.trim()) {
      errors.country = 'Country is required';
    }

    if (typeof data.latitude !== 'number' || typeof data.longitude !== 'number') {
      errors.coordinates = 'Valid coordinates are required';
    } else {
      if (data.latitude < -90 || data.latitude > 90) {
        errors.latitude = 'Latitude must be between -90 and 90';
      }
      if (data.longitude < -180 || data.longitude > 180) {
        errors.longitude = 'Longitude must be between -180 and 180';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
}

// Helper functions
export const validateRequired = (value: any, fieldName: string): string => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return '';
};

export const validateLength = (value: string, fieldName: string, min: number, max?: number): string => {
  if (value.length < min) {
    return `${fieldName} must be at least ${min} characters`;
  }
  if (max && value.length > max) {
    return `${fieldName} cannot exceed ${max} characters`;
  }
  return '';
};

export const validateNumber = (value: any, fieldName: string, min?: number, max?: number): string => {
  const num = parseFloat(value);
  if (isNaN(num)) {
    return `${fieldName} must be a number`;
  }
  if (min !== undefined && num < min) {
    return `${fieldName} must be at least ${min}`;
  }
  if (max !== undefined && num > max) {
    return `${fieldName} cannot exceed ${max}`;
  }
  return '';
};

export const validateArray = (value: any[], fieldName: string, min?: number, max?: number): string => {
  if (!Array.isArray(value)) {
    return `${fieldName} must be an array`;
  }
  if (min !== undefined && value.length < min) {
    return `${fieldName} must have at least ${min} items`;
  }
  if (max !== undefined && value.length > max) {
    return `${fieldName} cannot have more than ${max} items`;
  }
  return '';
};