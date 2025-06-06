import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// Các đường dẫn công khai không cần xác thực
const publicPaths = ['/login', '/register', '/forgot-password'];

// Các đường dẫn được bảo vệ theo role
const protectedPaths = {
  admin: ['/admin'],
  staff: ['/staff'],
  customer: ['/customer']
};

// Hàm helper để lấy role từ token
function getRoleFromToken(token: string): string | null {
  try {
    const decoded = jwtDecode(token);
    // Kiểm tra các định dạng role khác nhau trong token
    const role = (decoded as any).role || 
                (decoded as any).Role || 
                (decoded as any).userRole || 
                (decoded as any).UserRole ||
                (decoded as any)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    return role || null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

// Hàm helper để kiểm tra quyền admin
function isAdmin(role: string): boolean {
  const roleLower = role.toLowerCase();
  return ['admin', 'administrator'].includes(roleLower);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Cho phép truy cập các đường dẫn công khai
  if (publicPaths.includes(pathname)) {
    // Nếu đã đăng nhập và truy cập trang login, chuyển hướng đến dashboard tương ứng
    if (pathname === '/login') {
      const token = request.cookies.get('token')?.value;
      if (token) {
        try {
          const role = getRoleFromToken(token);
          if (role) {
            // Kiểm tra token còn hạn không
            const decoded = jwtDecode(token);
            const exp = (decoded as any).exp;
            const currentTime = Math.floor(Date.now() / 1000);
            
            if (exp && exp > currentTime) {
              // Ưu tiên kiểm tra quyền admin trước
              if (isAdmin(role)) {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url));
              }
              
              // Sau đó kiểm tra các quyền khác
              const roleLower = role.toLowerCase();
              if (['manager', 'receptionist', 'staff'].includes(roleLower)) {
                return NextResponse.redirect(new URL('/staff/dashboard', request.url));
              } else if (roleLower === 'customer') {
                return NextResponse.redirect(new URL('/customer/dashboard', request.url));
              }
            } else {
              // Token hết hạn, xóa và chuyển về login
              const response = NextResponse.redirect(new URL('/login', request.url));
              response.cookies.delete('token');
              return response;
            }
          }
        } catch (error) {
          // Nếu có lỗi khi xử lý token, chuyển về trang login
          const response = NextResponse.redirect(new URL('/login', request.url));
          response.cookies.delete('token');
          return response;
        }
      }
    }
    return NextResponse.next();
  }

  try {
    // Kiểm tra token từ cookies
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Lấy role từ token
    const role = getRoleFromToken(token);
    if (!role) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }

    // Kiểm tra token còn hạn không
    const decoded = jwtDecode(token);
    const exp = (decoded as any).exp;
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (!exp || exp <= currentTime) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }

    // Kiểm tra quyền truy cập dựa trên role
    const roleLower = role.toLowerCase();
    
    // Kiểm tra quyền admin
    if (pathname.startsWith('/admin')) {
      if (!isAdmin(role)) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
    
    // Kiểm tra quyền staff
    if (pathname.startsWith('/staff')) {
      if (!['staff', 'manager', 'receptionist'].includes(roleLower)) {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
    
    // Kiểm tra quyền customer
    if (pathname.startsWith('/customer')) {
      if (roleLower !== 'customer') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    // Xử lý các lỗi không mong muốn
    console.error('Middleware error:', error);
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('token');
    return response;
  }
}

// Cấu hình các đường dẫn cần áp dụng middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 