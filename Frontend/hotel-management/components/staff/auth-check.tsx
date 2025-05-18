"use client"

import { StaffSidebar } from "@/components/staff/sidebar"
import { SidebarProvider } from "@/components/sidebar-provider"
import { useAuth } from "@/lib/auth-context"
import { redirect } from "next/navigation"

export function StaffAuthCheck({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  
  // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
  if (!isAuthenticated) {
    redirect("/login")
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