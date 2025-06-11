"use client"

import { useSidebar } from "./sidebar-provider"
import { Button } from "./ui/button"
import { 
  Menu,
  Home, 
  Users, 
  Key, 
  Calendar, 
  CreditCard, 
  Settings, 
  LogOut,
  LayoutGrid,
  BarChart3,
  Camera,
  FileText,
  User
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

// Định nghĩa các mục menu với ràng buộc quyền
const menuItems = [
  { href: "/admin/dashboard", label: "Trang chính", icon: Home, feature: "", adminOnly: true },
  { href: "/staff/dashboard", label: "Trang chính", icon: Home, feature: "", adminOnly: false },
  { href: "/booking", label: "Đặt phòng", icon: Calendar, feature: "" },
  { href: "/rooms", label: "Phòng", icon: Key, feature: "" },
  { href: "/admin/room-types", label: "Loại phòng", icon: LayoutGrid},
  { href: "/services", label: "Quản lý dịch vụ", icon: BarChart3, feature: "" },
  { href: "/invoices", label: "Quản lý hóa đơn", icon: CreditCard, feature: "" },
  { href: "/customers", label: "Quản lý khách hàng", icon: Users, feature: "" },
  { href: "/admin/staff", label: "Quản lý nhân viên", icon: Users, adminOnly: true },
  { href: "/events", label: "Quản lý sự kiện", icon: Camera, feature: "" },
]

export function Sidebar({ children }: { children: React.ReactNode }) {
  const { isOpen, toggleSidebar } = useSidebar()
  const pathname = usePathname()
  const router = useRouter()
  const { logout, user, canAccess, isAdmin } = useAuth()

  // Lọc menu dựa trên quyền của người dùng
  const filteredMenuItems = menuItems.filter(item => {
    // Nếu item không có yêu cầu đặc biệt về quyền, hiển thị nó
    if (item.adminOnly === undefined) {
      return true
    }
    // Nếu item yêu cầu quyền admin, chỉ hiển thị nếu user là admin
    // Nếu item yêu cầu quyền staff (adminOnly: false), chỉ hiển thị nếu user không phải là admin
    return item.adminOnly === isAdmin
  })

  // Xử lý sự kiện đăng xuất
  const handleLogout = () => {
    logout()
  }

  return (
    <>
      <aside className={`fixed top-0 left-0 h-screen bg-white shadow-lg transition-all duration-300 z-50 ${isOpen ? 'w-80' : 'w-16'} flex flex-col`}>
        <div className="flex flex-col h-full">
          <div className="p-4 border-b flex items-center justify-between min-h-[64px]">
            {isOpen && (
              <div className="flex flex-col">
                <h1 className="text-xl font-bold">Hotel Management</h1>
                {user && (
                  <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <User className="h-3.5 w-3.5" />
                    <span>{user.username}</span>
                    <span className={`ml-1 px-1.5 py-0.5 rounded text-xs ${
                      user.role === 'admin' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {user.role === 'admin' ? 'Admin' : 'Nhân viên'}
                    </span>
                  </div>
                )}
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className={`hover:bg-gray-100 ${!isOpen && 'mx-auto'}`}
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
          {isOpen && (
            <>
            <ul className="space-y-1">
              {filteredMenuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <li key={item.href} className="min-h-[40px]">
                    <Link href={item.href}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                          className={`w-full justify-start transition-colors duration-200 px-4 ${
                          isActive 
                            ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' 
                            : 'hover:bg-gray-100'
                        } whitespace-normal text-left h-auto py-2`}
                      >
                        <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'} flex-shrink-0`} />
                          <span className="ml-2 break-words">{item.label}</span>
                      </Button>
                    </Link>
                  </li>
                )
              })}
            </ul>
          <div className="p-4 mt-auto">
            <Button
              onClick={handleLogout}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg focus:outline-none shadow flex items-center justify-center gap-2"
            >
              <LogOut className="h-5 w-5" />
                  <span>Đăng xuất</span>
            </Button>
          </div>
            </>
          )}
        </div>
      </aside>
      <div className={`transition-all duration-300 ${isOpen ? 'ml-80' : 'ml-16'} min-h-screen`}>
        {children}
      </div>
    </>
  )
}
