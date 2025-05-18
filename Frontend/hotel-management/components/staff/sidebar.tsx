"use client"

import { 
  Home, 
  Users, 
  Key, 
  Calendar, 
  CreditCard, 
  BarChart3,
  Camera,
  User
} from "lucide-react"
import { SidebarBase, SidebarMenuItem } from "../common/sidebar-base"

// Định nghĩa các mục menu cho nhân viên
const staffMenuItems: SidebarMenuItem[] = [
  { href: "/staff/dashboard", label: "Trang chính", icon: Home },
  { href: "/staff/booking", label: "Đặt phòng", icon: Calendar },
  { href: "/staff/rooms", label: "Phòng", icon: Key },
  { href: "/staff/services", label: "Dịch vụ", icon: BarChart3 },
  { href: "/staff/invoices", label: "Hóa đơn", icon: CreditCard },
  { href: "/staff/customers", label: "Khách hàng", icon: Users },
  { href: "/staff/events", label: "Sự kiện", icon: Camera },
  { href: "/staff/profile", label: "Thông tin cá nhân", icon: User }
]

export function StaffSidebar({ children }: { children: React.ReactNode }) {
  return <SidebarBase menuItems={staffMenuItems}>{children}</SidebarBase>
} 