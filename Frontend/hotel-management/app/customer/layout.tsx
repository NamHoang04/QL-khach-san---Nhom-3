"use client"

import { Sidebar } from "@/components/customer/sidebar"
import { Toaster } from "sonner"

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Middleware đã xử lý việc kiểm tra đăng nhập.
  // Layout này chỉ chịu trách nhiệm cho giao diện.
  return (
    <div className="flex flex-col h-screen w-full">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-gray-50">
        {children}
        <Toaster position="top-right"/>
      </div>
    </div>
  )
} 