"use client"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

export default function LogoutButton() {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuth();
  
  if (pathname === "/login" || pathname === "/register") return null;
  
  const handleLogout = () => {
    logout();
  };
  
  return (
    <button
      onClick={handleLogout}
      className="fixed left-0 bottom-0 mb-6 ml-4 z-[9999] bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-tl-xl rounded-tr-lg focus:outline-none shadow"
    >
      Đăng xuất
    </button>
  );
} 