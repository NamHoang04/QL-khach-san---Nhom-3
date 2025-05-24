"use client"

import { StaffSidebar } from "@/components/staff/sidebar"
import { SidebarProvider } from "@/components/sidebar-provider"
import { useAuth } from "@/lib/auth-context"
import { redirect } from "next/navigation"
import { getUserRole, getUserType } from "@/lib/auth-service"
import { useEffect } from "react"

export function StaffAuthCheck({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  
  useEffect(() => {
    console.log("Staff auth check:", { 
      isAuthenticated, 
      user,
      directUserType: getUserType(),
      directUserRole: getUserRole()
    });
  }, [isAuthenticated, user]);
  
  // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    redirect("/login")
  }
  
  // Kiểm tra xem người dùng có phải là staff hoặc admin không
  if (user?.role !== 'staff' && user?.role !== 'admin') {
    console.log("Not staff or admin, redirecting to customer page");
    redirect("/customer")
  }
  
  // Admin cũng có thể xem các trang của staff, nhưng staff không thể xem trang của admin
  
  return (
    <SidebarProvider>
      <StaffSidebar>
        <main className="p-6">
          {children}
        </main>
      </StaffSidebar>
    </SidebarProvider>
  )
}