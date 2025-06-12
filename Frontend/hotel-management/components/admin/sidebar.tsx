"use client"

import { 
  Home, 
  Users, 
  Key, 
  Calendar, 
  CreditCard, 
  BarChart3,
  LayoutGrid,
  Camera,
  FileText,
  Settings,
  UserCog,
  BedDouble
} from "lucide-react"
import { SidebarBase, SidebarMenuItem } from "../common/sidebar-base"

// Định nghĩa các mục menu cho Admin
const adminMenuItems: SidebarMenuItem[] = [
  { href: "/admin/dashboard", label: "Trang chính", icon: Home },
  { href: "/admin/bookings", label: "Đặt phòng", icon: Calendar },
  { href: "/admin/rooms-management", label: "Quản lý phòng", icon: BedDouble, feature: "rooms-create" },
  { href: "/admin/rooms", label: "Danh sách phòng", icon: Key },
  { href: "/admin/room-types", label: "Loại phòng", icon: LayoutGrid},
  { href: "/admin/services", label: "Dịch vụ", icon: BarChart3 },
  // { href: "/admin/booking-services", label: "Đặt dịch vụ", icon: FileText },
  { href: "/admin/invoices", label: "Hóa đơn", icon: CreditCard },
  { href: "/admin/customers", label: "Khách hàng", icon: Users },
  { href: "/admin/events", label: "Sự kiện", icon: Camera },
  { href: "/admin/staff", label: "Quản lý nhân viên", icon: UserCog },
  { href: "/admin/settings", label: "Cài đặt hệ thống", icon: Settings, feature: "system-settings" },
]

export function AdminSidebar({ children }: { children: React.ReactNode }) {
  return <SidebarBase menuItems={adminMenuItems}>{children}</SidebarBase>
} 