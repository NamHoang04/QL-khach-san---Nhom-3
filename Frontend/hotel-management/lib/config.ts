// Configuration settings for the application

// API Configuration
export const API_CONFIG = {
  // Thay đổi baseUrl để phù hợp với địa chỉ backend
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  tokenKey: 'hotel_management_auth_token'
};

// Authentication Configuration
export const AUTH_CONFIG = {
  // Cookie/LocalStorage key for auth token
  tokenKey: 'hotel_management_auth_token',
  
  // Token expiry time in minutes
  tokenExpiryMinutes: 60,
};

// Application Configuration
export const APP_CONFIG = {
  // Application name
  appName: 'Hotel Management System',
  
  // Default language
  defaultLanguage: 'vi',
  
  // Default currency
  defaultCurrency: 'VND',
  
  // Date format
  dateFormat: 'DD/MM/YYYY',
  
  // Time format
  timeFormat: 'HH:mm',
  
  // Number of items per page for pagination
  pageSize: 10,
};