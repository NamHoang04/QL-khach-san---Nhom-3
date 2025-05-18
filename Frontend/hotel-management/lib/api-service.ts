import { API_CONFIG } from './config';

// Base API service for communicating with the .NET backend
const API_URL = API_CONFIG.baseUrl;

// Function to get auth headers - will be replaced by the actual implementation
// from auth-service, but avoiding circular dependency
function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('hotel_management_auth_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

// Utility function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  
  // Parse the response body
  let responseBody;
  try {
    responseBody = isJson ? await response.json() : await response.text();
    console.log('API Response:', response.status, responseBody);
  } catch (error) {
    console.error('Error parsing response:', error);
    responseBody = await response.text();
  }
  
  if (!response.ok) {
    // If it's a JSON error response with a specific message
    if (isJson && responseBody.message) {
      throw new Error(responseBody.message);
    }
    
    // If it's a JSON error response with errors array
    if (isJson && responseBody.errors) {
      throw new Error(Array.isArray(responseBody.errors)
        ? responseBody.errors.join(', ')
        : typeof responseBody.errors === 'object'
          ? Object.values(responseBody.errors).flat().join(', ')
          : String(responseBody.errors));
    }
    
    // Otherwise fall back to simple error message
    throw new Error(
      typeof responseBody === 'string' 
        ? responseBody 
        : `API request failed with status ${response.status}`
    );
  }
  
  // Return null for 204 No Content responses
  if (response.status === 204) {
    return null as T;
  }
  
  return responseBody;
}

// Generic GET request
export async function get<T>(endpoint: string): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
  
  const url = `${API_URL}/${endpoint}`;
  console.log(`Making GET request to: ${url}`);
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      signal: controller.signal,
      mode: 'cors',
    });
    
    clearTimeout(timeoutId);
    return handleResponse<T>(response);
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`GET request to ${url} failed:`, error);
    
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(`Request timed out after ${API_CONFIG.timeout}ms`);
    }
    throw error;
  }
}

// Generic POST request
export async function post<T>(endpoint: string, data: any): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
  
  const url = `${API_URL}/${endpoint}`;
  console.log(`Making POST request to: ${url}`, data);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
      signal: controller.signal,
      mode: 'cors',
    });
    
    clearTimeout(timeoutId);
    return handleResponse<T>(response);
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`POST request to ${url} failed:`, error);
    
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(`Request timed out after ${API_CONFIG.timeout}ms`);
    }
    throw error;
  }
}

// Generic PUT request
export async function put<T>(endpoint: string, data: any): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
  
  const url = `${API_URL}/${endpoint}`;
  console.log(`Making PUT request to: ${url}`, data);
  
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
      signal: controller.signal,
      mode: 'cors',
    });
    
    clearTimeout(timeoutId);
    return handleResponse<T>(response);
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`PUT request to ${url} failed:`, error);
    
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(`Request timed out after ${API_CONFIG.timeout}ms`);
    }
    throw error;
  }
}

// Generic DELETE request
export async function del<T>(endpoint: string): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
  
  const url = `${API_URL}/${endpoint}`;
  console.log(`Making DELETE request to: ${url}`);
  
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      signal: controller.signal,
      mode: 'cors',
    });
    
    clearTimeout(timeoutId);
    return handleResponse<T>(response);
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`DELETE request to ${url} failed:`, error);
    
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(`Request timed out after ${API_CONFIG.timeout}ms`);
    }
    throw error;
  }
}

// API configuration
export const apiConfig = {
  baseUrl: API_URL,
}; 