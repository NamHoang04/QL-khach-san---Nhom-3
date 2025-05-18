"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import * as authService from '@/lib/auth-service'

export function RoleRedirector() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (isLoading) return;
    
    if (isAuthenticated) {
      const userType = authService.getUserType();
      
      // Nếu đã đăng nhập, chuyển hướng đến trang phù hợp với vai trò
      if (isAdmin || userType === 'admin') {
        router.push("/admin/dashboard")
      } else {
        router.push("/staff/dashboard")
      }
    } else {
      router.push("/login")
    }
  }, [isAuthenticated, isAdmin, router, isLoading])
  
  // Hiển thị loading khi đang xử lý
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    )
  }
  
  return null
} 