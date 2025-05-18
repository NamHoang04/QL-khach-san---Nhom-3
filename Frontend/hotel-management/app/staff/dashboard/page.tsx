"use client"

import { useAuth } from "@/lib/auth-context"
import { AuthGuard } from "@/components/auth-guard"
import { useEffect, useState } from "react"

export default function StaffDashboardPage() {
  const { user, isLoading } = useAuth();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Chào buổi sáng");
    else if (hour < 18) setGreeting("Chào buổi chiều");
    else setGreeting("Chào buổi tối");
  }, []);

  return (
    <AuthGuard requiredRole="staff">
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">
            {greeting}, {user?.fullName || user?.username || "Nhân viên"}!
          </p>
          <p className="text-gray-500 text-sm mt-1">
            Bạn đang đăng nhập với vai trò: <span className="font-medium text-green-600">Nhân viên</span>
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Quản lý Đặt phòng</h2>
            <p className="text-gray-600 mb-4">Tạo đơn đặt phòng mới và quản lý</p>
            <a href="/staff/booking" className="text-blue-600 hover:underline">Quản lý đặt phòng →</a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Danh sách Phòng</h2>
            <p className="text-gray-600 mb-4">Xem và kiểm tra tình trạng phòng</p>
            <a href="/staff/rooms" className="text-blue-600 hover:underline">Xem phòng →</a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Dịch vụ</h2>
            <p className="text-gray-600 mb-4">Thêm dịch vụ cho khách hàng</p>
            <a href="/staff/services" className="text-blue-600 hover:underline">Quản lý dịch vụ →</a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Khách hàng</h2>
            <p className="text-gray-600 mb-4">Quản lý thông tin khách hàng</p>
            <a href="/staff/customers" className="text-blue-600 hover:underline">Quản lý khách hàng →</a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Hóa đơn</h2>
            <p className="text-gray-600 mb-4">Tạo và quản lý hóa đơn</p>
            <a href="/staff/invoices" className="text-blue-600 hover:underline">Quản lý hóa đơn →</a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Thông tin cá nhân</h2>
            <p className="text-gray-600 mb-4">Quản lý thông tin tài khoản</p>
            <a href="/staff/profile" className="text-blue-600 hover:underline">Xem thông tin →</a>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
} 