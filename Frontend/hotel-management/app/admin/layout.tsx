"use client"

import { AdminSidebar } from "@/components/admin/sidebar"
import { SidebarProvider } from "@/components/sidebar-provider"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
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