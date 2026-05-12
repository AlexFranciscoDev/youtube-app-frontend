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

export const validateUploadTitle = (value: string): string => {
  if (!value.trim()) return 'Title is required'
  if (value.trim().length < 3) return 'Title must contain more than 3 characters'
  return ''
}

export const validateUploadDescription = (value: string): string => {
  if (!value.trim()) return 'Description is required'
  if (value.trim().length < 10) return 'Description must contaein more than 10 characters'
  return ''
}

export const validateUploadUrl = (value: string):string => {
  if (!value.trim()) return 'URL is required'
  try {
    new URL(value)
    return ''
  } catch {
    return 'Invalid URL'
  }
}

export const validateUploadPlatform = (value: string): string => {
  if (!value) return 'Platform is required'
  return ''
}

export const validateUploadCategory = (value: string): string => {
  if (!value) return 'Category is required'
  return ''
} 

export const validateUploadImage = (value: File | null): string => {
  if (!value) return 'Thumbnail is required'
  if (!value.type.startsWith('image/')) return 'File must be an image'
  if (value.size > 5 * 1024 * 1024) return 'Image must be 5MB or smaller'
  return ''
}