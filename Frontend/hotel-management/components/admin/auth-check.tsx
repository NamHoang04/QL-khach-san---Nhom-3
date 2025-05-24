"use client"

import { AdminSidebar } from "@/components/admin/sidebar"
import { SidebarProvider } from "@/components/sidebar-provider"
import { useAuth } from "@/lib/auth-context"
import { redirect } from "next/navigation"
import { getUserRole, getUserType } from "@/lib/auth-service"
import { useEffect } from "react"

export function AdminAuthCheck({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, user } = useAuth()
  
  useEffect(() => {
    console.log("Admin auth check:", { 
      isAuthenticated, 
      isAdmin, 
      user,
      directUserType: getUserType(),
      directUserRole: getUserRole()
    });
  }, [isAuthenticated, isAdmin, user]);
  
  // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    redirect("/login")
  }
  
  // Nếu không phải admin, chuyển hướng đến trang dành cho nhân viên
  if (!isAdmin && user?.role !== 'admin') {
    console.log("Not admin, redirecting to staff dashboard");
    redirect("/staff/dashboard")
  }
  
  return (
    <SidebarProvider>
      <AdminSidebar>
        <main className="p-6">
          {children}
        </main>
      </AdminSidebar>
    </SidebarProvider>
  )
} 