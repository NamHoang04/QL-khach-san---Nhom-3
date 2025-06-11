// Configuration settings for the application

// API Configuration
export const API_CONFIG = {
  // Sử dụng relative URL để Next.js có thể proxy requests
  baseUrl: 'http://localhost:5217/api',
  endpoints: {
    login: '/Auth/login',
  },
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000,
  tokenKey: 'hotel_management_auth_token'
};

// Authentication Configuration
export const AUTH_CONFIG = {
  // Cookie/LocalStorage key for auth token
  tokenKey: 'token',
  userKey: 'user',
  roleKey: 'userRole',
  
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

// Route Configuration
export const ROUTE_CONFIG: Record<string, string> = {
  admin: '/admin/dashboard',
  administrator: '/admin/dashboard',
  staff: '/staff/dashboard',
  customer: '/customer/dashboard',
  login: '/login'
};