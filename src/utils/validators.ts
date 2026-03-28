export const validateEmail = (value: string): string => {
  if (!value) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
  return '';
};

export const validatePassword = (value: string): string => {
  if (!value) return 'Password is required';
  if (value.length < 5) return 'Password must be at least 5 characters';
  return '';
};

export const validateUsername = (value: string): string => {
  if (!value) return 'Username is required';
  if (value.length < 5) return 'Username must be at least 5 characters';
  if (/\s/.test(value)) return 'Username cannot contain spaces';
  return '';
};

export const validateConfirmPassword = (value: string, password: string): string => {
  if (!value) return 'Please confirm your password';
  if (value !== password) return 'Passwords do not match';
  return '';
};

export const validateProfileImage = (value: File | null): string => {
  if (!value) return 'Profile image is required';
  return '';
}
