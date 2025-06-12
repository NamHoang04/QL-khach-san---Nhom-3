'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
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
  loading: boolean;
  canAccess: (feature: string) => boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra xác thực khi component mount
    const checkAuth = () => {
      try {
      const authenticated = isAuthenticated();
      setIsAuth(authenticated);
      
      // Lấy thông tin user từ sessionStorage
      const userStr = sessionStorage.getItem('user');
      if (userStr) {
          const userData = JSON.parse(userStr);
          setUser(userData);
        }
        } catch (error) {
        console.error('Error during auth check:', error);
          setUser(null);
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback((token: string, userData: User) => {
    // Save token to sessionStorage
    sessionStorage.setItem('token', token);
    
    // Save user info to sessionStorage
    sessionStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('userRole', userData.role);

    // Save token to cookie with expiry
    const expiryDate = new Date();
    expiryDate.setTime(expiryDate.getTime() + (24 * 60 * 60 * 1000)); // 24 hours
    document.cookie = `token=${token}; path=/; expires=${expiryDate.toUTCString()}; secure; samesite=strict`;

    setIsAuth(true);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    setIsAuth(false);
    setUser(null);
    sessionStorage.clear();
    // Xóa cookie token
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }, []);

  const isAdmin = user?.role?.toLowerCase() === 'admin';

  const canAccess = useCallback((feature: string): boolean => {
    if (!user) return false;
    // Admin có quyền truy cập tất cả các tính năng
    if (isAdmin) {
      return true;
    }
    // TODO: Thêm logic kiểm tra quyền chi tiết cho các vai trò khác ở đây
    // Ví dụ: return user.permissions.includes(feature);
    // Hiện tại, mặc định cho phép nếu không phải admin (cần điều chỉnh sau)
    return true; 
  }, [isAdmin]);

  const value = useMemo(() => ({
    isAuthenticated: isAuth,
    isAdmin,
    user,
    loading,
    canAccess,
    login,
    logout,
  }), [isAuth, isAdmin, user, loading, login, logout, canAccess]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 