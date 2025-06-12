'use client';

import { api } from './api';
import { jwtDecode } from 'jwt-decode';
import { API_CONFIG } from './config';
import type { AxiosResponse } from 'axios/index';

export interface LoginCredentials {
  username: string;
  password: string;
  userType?: string;
}

export interface User {
  id: string;
  username: string;
  role: string;
  fullName?: string;
  email?: string;
  phone?: string;
  identityNumber?: string;
  address?: string;
  customerCode?: string;
  staffCode?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user?: User;
}

interface LoginResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      username: string;
      email: string;
      role: string;
    };
  };
  errors: any;
}

export const login = async (username: string, password: string, userType?: string): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/Auth/login', { 
      username, 
      password,
      userType 
    });
    console.log('Login response:', response);

    if (response.data?.success && response.data?.data?.token) {
      const token = response.data.data.token;
      
      // Decode token để lấy thông tin user
      const decodedToken: any = jwtDecode(token);

      const userToStore: User = {
        id: decodedToken.sub, // Lấy ID từ 'sub' của token
        username: decodedToken.name,
        role: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        email: response.data.data.user?.email, // Giữ lại email từ response
      };
      
      // Lưu token vào sessionStorage
      sessionStorage.setItem('token', token);
      
      // Lưu thông tin user đã được chuẩn hóa vào sessionStorage
      sessionStorage.setItem('user', JSON.stringify(userToStore));
      sessionStorage.setItem('userRole', userToStore.role);

      // Lưu token vào cookie với các options phù hợp và thời gian hết hạn
      const expiryDate = new Date();
      expiryDate.setTime(expiryDate.getTime() + (24 * 60 * 60 * 1000)); // 24 giờ
      document.cookie = `token=${token}; path=/; expires=${expiryDate.toUTCString()}; secure; samesite=strict`;
    }

    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = () => {
  try {
    // Xóa tất cả dữ liệu xác thực từ sessionStorage
    sessionStorage.clear();
    
    // Xóa cookie với các options phù hợp
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; secure; samesite=strict';
    
    // Xóa các dữ liệu khác liên quan đến người dùng
    localStorage.removeItem('saved_rooms');
    localStorage.removeItem('saved_services');
    
    // Chuyển hướng về trang login
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout error:', error);
    // Vẫn chuyển hướng về trang login ngay cả khi có lỗi
    window.location.href = '/login';
  }
};

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  
  // Kiểm tra token trước
  if (!isAuthenticated()) {
    // Xóa user data nếu token không hợp lệ
    sessionStorage.removeItem('user');
    return null;
  }

  const userStr = sessionStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    sessionStorage.removeItem('user');
    return null;
  }
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Ưu tiên lấy token từ sessionStorage
  const token = sessionStorage.getItem('token');
  if (token) return token;
  
  // Fallback to cookie if not in sessionStorage
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
  if (tokenCookie) {
    const token = tokenCookie.split('=')[1];
    // Sync token to sessionStorage
    sessionStorage.setItem('token', token);
    return token;
  }
  
  return null;
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    const exp = (decoded as any).exp;
    if (!exp) return false;

    // Kiểm tra token hết hạn
    const currentTime = Math.floor(Date.now() / 1000);
    return exp > currentTime;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

export const getUserType = (): string | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    const user = JSON.parse(userStr);
    return user.role;
  } catch {
    return null;
  }
};

export const getRoleFromToken = (token?: string): string | null => {
  try {
    const tokenToDecode = token || getToken();
    if (!tokenToDecode) return null;

    const decoded = jwtDecode(tokenToDecode);
    console.log('Decoded token:', decoded); // Debug log

    // Kiểm tra tất cả các khả năng có thể chứa role
    const role = (decoded as any).role || 
                (decoded as any).Role || 
                (decoded as any).userRole || 
                (decoded as any).UserRole ||
                (decoded as any)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    if (!role) {
      console.error('No role found in token payload');
      return null;
    }

    // Lưu role vào sessionStorage để dễ truy cập
    sessionStorage.setItem('userRole', role);
    console.log('Role from token:', role);
    
    return role;
  } catch (error) {
    console.error('Error getting role from token:', error);
    return null;
  }
};

export const hasRole = (requiredRole: string | string[]): boolean => {
  const role = getRoleFromToken();
  if (!role) return false;

  const roleLower = role.toLowerCase();
  if (Array.isArray(requiredRole)) {
    return requiredRole.some(r => r.toLowerCase() === roleLower);
  }
  return requiredRole.toLowerCase() === roleLower;
};
