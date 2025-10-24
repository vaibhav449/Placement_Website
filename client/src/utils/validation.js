export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateRequired = (value) => {
  return value && value.toString().trim() !== '';
};

export const validateFile = (file, maxSize = 5242880) => { // 5MB default
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }

  if (file.type !== 'application/pdf') {
    return { isValid: false, error: 'Only PDF files are allowed' };
  }

  if (file.size > maxSize) {
    return { isValid: false, error: `File size must be less than ${maxSize / 1024 / 1024}MB` };
  }

  return { isValid: true };
};

export const validateForm = (values, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const value = values[field];
    const rule = rules[field];

    if (rule.required && !validateRequired(value)) {
      errors[field] = `${field} is required`;
    } else if (rule.email && value && !validateEmail(value)) {
      errors[field] = 'Please enter a valid email';
    } else if (rule.password && value && !validatePassword(value)) {
      errors[field] = 'Password must be at least 6 characters';
    } else if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `${field} must be at least ${rule.minLength} characters`;
    }
  });

  return errors;
};
