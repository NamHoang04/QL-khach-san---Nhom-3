"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, logout } from '@/lib/auth-service';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Xóa lịch sử đăng nhập khi mở trang web
    const clearAuthHistory = () => {
      // Xóa sessionStorage
      sessionStorage.clear();
      
      // Xóa cookie
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; secure; samesite=strict';
      
      // Xóa localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('saved_rooms');
      localStorage.removeItem('saved_services');
    };

    clearAuthHistory();
    
    // Chuyển hướng đến trang login
    router.push('/login');
  }, [router]);

  // Hiển thị loading spinner trong khi đang chuyển hướng
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );
}
