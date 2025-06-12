"use client"

import { Sidebar } from "@/components/customer/sidebar"
import { Toaster } from "sonner"
import { AuthProvider } from "@/lib/auth-context"
import { SavedProvider } from "@/lib/saved-context"

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Middleware đã xử lý việc kiểm tra đăng nhập.
  // Layout này chỉ chịu trách nhiệm cho giao diện.
  return (
    <AuthProvider>
      <SavedProvider>
    <div className="flex flex-col h-screen w-full">
      <Sidebar />
      <div className="flex-1 overflow-auto bg-gray-50">
        {children}
        <Toaster position="top-right"/>
      </div>
    </div>
      </SavedProvider>
    </AuthProvider>
  )
} 