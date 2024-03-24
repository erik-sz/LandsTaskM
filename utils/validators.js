// utils/validators.js
export const emailValidator = (formState) => {
  let errors = {};
  let isValid = true;

  if (!formState.email) {
    errors.email = 'Email is required';
    isValid = false;
  } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
    errors.email = 'Email is invalid';
    isValid = false;
  }
  return { isValid, errors };
};

// Password Validator for Sign Up Form with Password Strength Check and Confirm Password Check
export const passwordStrengthValidator = (password) => {
  let errors = [];
  let isValid = true;

  if (!password) {
    errors.push('Password is required');
    isValid = false;
  } else {
    if (password.length < 8) {
      errors.push('Password should be at least 8 characters');
      isValid = false;
    }
    if (!/\d/.test(password)) {
      errors.push('Should include a number');
      isValid = false;
    }
  }

  return { isValid, errors };
};

// Confirm Password Validator for Sign Up Form with Password Match Check 
export const confirmPasswordValidator = (password, confirmPassword) => {
  let errors = {};
  let isValid = true;

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
    isValid = false;
  }

  return { isValid, errors };
};

// Simplified Password Validator for Login
export const simplePasswordValidator = (password) => {
  let errors = {};
  let isValid = true;
  if (!password) {
    errors.password = 'Password is required';
    isValid = false;
  }
  return { isValid, errors };
};