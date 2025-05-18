"use client"

import { useAuth } from "@/lib/auth-context"
import { AuthGuard } from "@/components/auth-guard"
import { useEffect, useState } from "react"

export default function AdminDashboardPage() {
  const { user, isLoading } = useAuth();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Chào buổi sáng");
    else if (hour < 18) setGreeting("Chào buổi chiều");
    else setGreeting("Chào buổi tối");
  }, []);

  return (
    <AuthGuard requiredRole="admin">
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">
            {greeting}, {user?.fullName || user?.username || "Quản trị viên"}!
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Bạn đang đăng nhập với vai trò: <span className="font-medium text-blue-600">Quản trị viên</span>
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Quản lý Phòng</h2>
            <p className="text-gray-600 mb-4">Thêm, sửa, xóa và cấu hình các phòng</p>
            <a href="/admin/rooms-management" className="text-blue-600 hover:underline">Quản lý phòng →</a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Loại Phòng</h2>
            <p className="text-gray-600 mb-4">Thêm và quản lý các loại phòng khác nhau</p>
            <a href="/admin/room-types" className="text-blue-600 hover:underline">Quản lý loại phòng →</a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Quản lý Đặt phòng</h2>
            <p className="text-gray-600 mb-4">Xem và quản lý các đơn đặt phòng</p>
            <a href="/admin/booking" className="text-blue-600 hover:underline">Quản lý đặt phòng →</a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Quản lý Nhân viên</h2>
            <p className="text-gray-600 mb-4">Thêm và quản lý tài khoản nhân viên</p>
            <a href="/admin/staff" className="text-blue-600 hover:underline">Quản lý nhân viên →</a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Báo cáo Doanh thu</h2>
            <p className="text-gray-600 mb-4">Xem báo cáo doanh thu và thống kê</p>
            <a href="/admin/invoices" className="text-blue-600 hover:underline">Xem báo cáo →</a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Cài đặt Hệ thống</h2>
            <p className="text-gray-600 mb-4">Cấu hình và thiết lập hệ thống</p>
            <a href="/admin/settings" className="text-blue-600 hover:underline">Cài đặt →</a>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
} 