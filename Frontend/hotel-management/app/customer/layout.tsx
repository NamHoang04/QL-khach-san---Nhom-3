"use client"

import { Toaster } from "sonner"
import { Sidebar } from "@/components/customer/sidebar"

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-auto p-8 bg-gray-50">
        {children}
        <Toaster position="top-right" />
      </div>
    </div>
  )
} 