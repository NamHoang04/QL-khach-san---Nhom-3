"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  Calendar, 
  Search, 
  Coffee, 
  CreditCard, 
  UserCircle, 
  Heart,
  Menu, 
  X 
} from "lucide-react"

export function Sidebar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const routes = [
    {
      href: "/customer",
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
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMenu}
          className="p-2 rounded-full bg-white shadow-md"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:block
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <Link href="/customer">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-blue-600">Hotel</span>
                <span className="text-2xl font-bold">Booking</span>
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
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

          <div className="p-4 border-t">
            <Link 
              href="/login" 
              className="flex items-center justify-center w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Đăng xuất
            </Link>
          </div>
        </div>
      </div>
    </>
  )
} 