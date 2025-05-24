"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import * as authService from '@/lib/auth-service'

// Định nghĩa các vai trò người dùng
export type UserRole = "admin" | "staff" | "customer"

// Thông tin người dùng đăng nhập
interface User {
  id: string
  username: string
  role: UserRole
  specificRole?: string
  fullName?: string
  email?: string
}

// Định nghĩa context
export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
  isAdmin: boolean;
  canAccess: (feature: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Danh sách tính năng chỉ admin mới có quyền truy cập
const ADMIN_ONLY_FEATURES = [
  "room-types",
  "services-create", 
  "services-delete",
  "invoices-delete",
  "customers-delete",
  "events-delete",
  "rooms-create",
  "rooms-delete",
  "user-management",
  "system-settings"
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Kiểm tra xem người dùng đã đăng nhập chưa khi component được mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true)
      try {
        // Kiểm tra xem đã có token và còn hạn không
        if (authService.isAuthenticated()) {
          // Lấy thông tin user từ API
          const userInfo = await authService.getCurrentUser();
          if (userInfo) {
            const userType = authService.getUserType() as UserRole;
            const userRole = authService.getUserRole();
            
            console.log('Auth context found user:', userInfo.username, 'type:', userType, 'role:', userRole);
            
            setUser({
              id: userInfo.id,
              username: userInfo.username,
              role: userType,
              specificRole: userRole || undefined,
              fullName: userInfo.fullName,
              email: userInfo.email
            });
          }
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái đăng nhập:", error);
        // Nếu có lỗi khi lấy thông tin user, đăng xuất
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Hàm đăng nhập
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // Gọi API đăng nhập từ auth-service
      const authToken = await authService.login({ username, password });
      
      if (authToken) {
        // Lấy thông tin user sau khi đăng nhập thành công
        const userInfo = await authService.getCurrentUser();
        const userType = authService.getUserType() as UserRole;
        
        if (userInfo) {
          // Lưu thông tin user vào state
          setUser({
            id: userInfo.id,
            username: userInfo.username,
            role: userType,
            fullName: userInfo.fullName,
            email: userInfo.email
          });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }

  // Hàm đăng xuất
  const logout = () => {
    setUser(null);
    authService.logout();
  }

  // Kiểm tra người dùng có quyền truy cập tính năng hay không
  const canAccess = (feature: string): boolean => {
    if (!user) return false;
    if (user.role === "admin") return true;
    return !ADMIN_ONLY_FEATURES.includes(feature);
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    setUser,
    logout,
    isAdmin: user?.role === "admin" || user?.specificRole === "admin",
    canAccess
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook để sử dụng context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 