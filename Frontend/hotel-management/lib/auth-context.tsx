'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, isAuthenticated } from './auth-service';

interface User {
  id: string;
  username: string;
  role: string;
  fullName?: string;
  email?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = getToken();
    const userStr = sessionStorage.getItem('user');
    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setIsAuthenticated(true);
      } catch {
        sessionStorage.clear();
      }
    }
  }, []);

  const login = (token: string, userData: User) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    try {
      // Xóa tất cả dữ liệu từ sessionStorage
      sessionStorage.clear();
      
      // Xóa cookie
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; secure; samesite=strict';
      
      // Reset state
      setUser(null);
      setIsAuthenticated(false);
      
      // Chuyển hướng về trang login
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Vẫn chuyển hướng về trang login ngay cả khi có lỗi
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 