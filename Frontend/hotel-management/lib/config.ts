// Configuration settings for the application

// API Configuration
export const API_CONFIG = {
  // Update this to your backend's actual port
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5217/api', // Check your ASP.NET Core Kestrel port
  
  // Timeout in milliseconds
  timeout: 30000,
  
  // Whether to use mock data instead of real API (for development/testing)
  // Set to true if backend API is not available yet
  useMockData: false,
  
  // Enable this to use mock data as a fallback when API calls fail
  useMockFallback: true,
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

// Function to determine if mock data should be used for a specific service
// Use this in each service file to check if mock data should be used
export function shouldUseMockData(): boolean {
  // Check if being forced to use mock data via config
  if (API_CONFIG.useMockData) {
    return true;
  }
  
  // Check if in development mode and configured to use mock data
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
    return true;
  }
  
  // Check if localStorage has a manual override
  try {
    if (typeof window !== 'undefined' && localStorage.getItem('use_mock_data') === 'true') {
      return true;
    }
  } catch (e) {
    // Ignore localStorage errors
  }
  
  return false;
}

// Enable the use of mock data (for UI control)
export function enableMockData(enabled: boolean): void {
  if (typeof window !== 'undefined') {
    if (enabled) {
      localStorage.setItem('use_mock_data', 'true');
    } else {
      localStorage.removeItem('use_mock_data');
    }
  }
} 