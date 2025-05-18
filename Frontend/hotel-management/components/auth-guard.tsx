"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

interface AuthGuardProps {
  children: React.ReactNode
  requiredFeature?: string
  requiredRole?: "admin" | "staff" | "any"
}

export function AuthGuard({ children, requiredFeature, requiredRole = "any" }: AuthGuardProps) {
  const { isAuthenticated, canAccess, isAdmin, isLoading, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Đợi cho việc kiểm tra auth hoàn tất
    if (isLoading) return;
    
    // Đường dẫn không cần auth
    const publicPaths = ["/login", "/register", "/forgot-password", "/reset-password"];
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
    
    console.log('Auth check:', { 
      isAuthenticated, 
      isAdmin, 
      path: pathname,
      isPublicPath, 
      requiredRole,
      user
    });
    
    // Kiểm tra xác thực
    if (!isAuthenticated && !isPublicPath) {
      console.log('Not authenticated, redirecting to login');
      router.push("/login");
      return;
    }

    // Người dùng đã đăng nhập truy cập trang công khai
    if (isAuthenticated && isPublicPath) {
      // Chuyển hướng về dashboard tương ứng
      const redirectPath = isAdmin ? "/admin/dashboard" : "/staff/dashboard";
      console.log(`Already authenticated on public path, redirecting to ${redirectPath}`);
      router.push(redirectPath);
      return;
    }

    // Kiểm tra quyền vai trò
    if (isAuthenticated && requiredRole !== "any") {
      if (requiredRole === "admin" && !isAdmin) {
        console.log('Admin role required but user is staff, redirecting to staff dashboard');
        router.push("/staff/dashboard");
        return;
      }
      
      if (requiredRole === "staff" && isAdmin) {
        console.log('Staff role required but user is admin, redirecting to admin dashboard');
        router.push("/admin/dashboard");
        return;
      }
    }

    // Kiểm tra quyền truy cập tính năng
    if (requiredFeature && !canAccess(requiredFeature)) {
      console.log(`Feature "${requiredFeature}" access denied, redirecting to dashboard`);
      if (isAdmin) {
        router.push("/admin/dashboard");
      } else {
        router.push("/staff/dashboard");
      }
      return;
    }
  }, [isAuthenticated, canAccess, isAdmin, router, pathname, requiredFeature, requiredRole, isLoading, user]);

  // Hiển thị loading khi đang kiểm tra auth
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Hiển thị nội dung khi đã xác thực và có quyền
  return <>{children}</>;
}

// Component bảo vệ một phần của trang, không chuyển hướng mà ẩn nội dung nếu không có quyền
export function ProtectedContent({ 
  children, 
  requiredFeature,
  requiredRole
}: { 
  children: React.ReactNode
  requiredFeature?: string
  requiredRole?: "admin" | "staff"
}) {
  const { canAccess, isAdmin, isAuthenticated, user } = useAuth();

  const hasAccess = () => {
    if (!isAuthenticated) {
      console.log('Content hidden: Not authenticated');
      return false;
    }

    if (requiredRole === "admin" && !isAdmin) {
      console.log('Content hidden: Admin role required but user is staff');
      return false;
    }

    if (requiredRole === "staff" && isAdmin) {
      console.log('Content hidden: Staff role required but user is admin');
      return false;
    }

    if (requiredFeature && !canAccess(requiredFeature)) {
      console.log(`Content hidden: Feature "${requiredFeature}" access denied`);
      return false;
    }

    return true;
  };

  return hasAccess() ? <>{children}</> : null;
} 