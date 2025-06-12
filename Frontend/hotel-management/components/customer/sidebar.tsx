"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { 
  Home, 
  Calendar, 
  Search, 
  Coffee, 
  CreditCard, 
  UserCircle, 
  Heart,
  Menu, 
  X,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = () => {
    try {
      // Xóa token và thông tin người dùng
      logout()
      
      // Đóng menu mobile nếu đang mở
      setIsMenuOpen(false)
      
      // Hiển thị thông báo thành công
      toast.success("Đăng xuất thành công")
      
      // Chuyển hướng đến trang đăng nhập
      setTimeout(() => {
        router.push('/login')
        router.refresh()
      }, 100)
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Có lỗi xảy ra khi đăng xuất")
    }
  }

  const routes = [
    {
      href: "/customer/dashboard",
      label: "Trang chủ",
      icon: Home,
    },
    {
      href: "/customer/search",
      label: "Tìm phòng",
      icon: Search,
    },
    {
      href: "/customer/bookings",
      label: "Đặt phòng của tôi",
      icon: Calendar,
    },
    {
      href: "/customer/services",
      label: "Dịch vụ",
      icon: Coffee,
    },
    {
      href: "/customer/saved",
      label: "Đã lưu",
      icon: Heart,
    },
    {
      href: "/customer/payments",
      label: "Thanh toán",
      icon: CreditCard,
    },
    {
      href: "/customer/profile",
      label: "Hồ sơ",
      icon: UserCircle,
    },
  ]

  return (
    <>
      {/* Mobile menu toggle */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={toggleMenu}
          className="p-2 rounded-full bg-white shadow-md"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Top Navigation Bar */}
      <header className="w-full bg-white shadow-md">
        <div className="w-full px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/customer">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-blue-600">Hotel</span>
                <span className="text-xl font-bold">Booking</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-4">
              {routes.map((route) => {
                const isActive = pathname === route.href
                
                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={`
                      flex items-center space-x-2 px-2 lg:px-3 py-2 rounded-lg transition text-sm
                      ${isActive 
                        ? "bg-blue-50 text-blue-600" 
                        : "hover:bg-gray-100"
                      }
                    `}
                  >
                    <route.icon size={16} />
                    <span className="hidden lg:inline">{route.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Log out button (desktop) */}
            <Button 
              onClick={handleLogout}
              variant="destructive"
              className="hidden md:flex items-center gap-2"
            >
              <LogOut size={16} />
              <span>Đăng xuất</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu - slides from top */}
      <div 
        className={`
          fixed inset-x-0 top-0 z-40 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}
          md:hidden
        `}
      >
        <div className="p-4 border-b">
          <Link href="/customer">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-blue-600">Hotel</span>
              <span className="text-xl font-bold">Booking</span>
            </div>
          </Link>
        </div>

        <nav className="p-4 space-y-2">
          {routes.map((route) => {
            const isActive = pathname === route.href
            
            return (
              <Link
                key={route.href}
                href={route.href}
                className={`
                  flex items-center space-x-3 px-3 py-2 rounded-lg transition
                  ${isActive 
                    ? "bg-blue-50 text-blue-600" 
                    : "hover:bg-gray-100"
                  }
                `}
              >
                <route.icon size={20} />
                <span>{route.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4">
          <Button 
            onClick={handleLogout}
            variant="destructive"
            className="w-full flex items-center justify-center gap-2"
          >
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </Button>
        </div>
      </div>
    </>
  )
} 