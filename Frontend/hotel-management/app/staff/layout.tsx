"use client"

import { StaffSidebar } from "@/components/staff/sidebar"
import { SidebarProvider } from "@/components/sidebar-provider"

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
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