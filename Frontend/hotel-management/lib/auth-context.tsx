'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, isAuthenticated, getRoleFromToken } from './auth-service';

interface User {
  id: string;
  username: string;
  role: string;
  fullName?: string;
  email?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  user: User | null;
  canAccess: (feature: string) => boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Kiểm tra xác thực khi component mount
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      
      // Lấy thông tin user từ sessionStorage
      const userStr = sessionStorage.getItem('user');
      if (userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setUser(null);
        }
      }
    };

    checkAuth();
  }, []);

  const login = (token: string, userData: User) => {
    setIsAuth(true);
    setUser(userData);
  };

  const logout = () => {
    setIsAuth(false);
    setUser(null);
    sessionStorage.clear();
    // Xóa cookie token
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  };

  const isAdmin = user?.role?.toLowerCase() === 'admin';

  const canAccess = (feature: string): boolean => {
    if (!user) return false;
    // Admin có quyền truy cập tất cả các tính năng
    if (isAdmin) {
      return true;
    }
    // TODO: Thêm logic kiểm tra quyền chi tiết cho các vai trò khác ở đây
    // Ví dụ: return user.permissions.includes(feature);
    // Hiện tại, mặc định cho phép nếu không phải admin (cần điều chỉnh sau)
    return true; 
  };

  const value = {
    isAuthenticated: isAuth,
    isAdmin,
    user,
    canAccess,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 