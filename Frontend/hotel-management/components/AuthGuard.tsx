"use client"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    // Nếu chưa đăng nhập và không ở trang login/register thì chuyển hướng login
    if (!isLoggedIn && pathname !== "/login" && pathname !== "/register") {
      router.replace("/login");
      setIsChecking(false);
      return;
    }
    // Nếu đã đăng nhập mà vào /login hoặc /register thì chuyển về dashboard tương ứng
    if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
      if (isAdmin) {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/staff/dashboard");
      }
      setIsChecking(false);
      return;
    }
    setIsChecking(false);
  }, [pathname, router, isAdmin]);

  if (isChecking) return null;
  return <>{children}</>;
}