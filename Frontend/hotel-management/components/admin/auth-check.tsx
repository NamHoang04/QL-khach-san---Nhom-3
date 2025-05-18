"use client"

import { AdminSidebar } from "@/components/admin/sidebar"
import { SidebarProvider } from "@/components/sidebar-provider"
import { useAuth } from "@/lib/auth-context"
import { redirect } from "next/navigation"

export function AdminAuthCheck({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin } = useAuth()
  
  // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
  if (!isAuthenticated) {
    redirect("/login")
  }
  
  // Nếu không phải admin, chuyển hướng đến trang dành cho nhân viên
  if (!isAdmin) {
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