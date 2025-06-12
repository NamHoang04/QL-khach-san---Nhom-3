import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// Các đường dẫn công khai không cần xác thực
const publicPaths = ['/', '/login', '/register', '/forgot-password'];

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
    console.log('Decoded token:', decoded);
    
    // Kiểm tra các định dạng role khác nhau trong token
    const role = (decoded as any).role || 
                (decoded as any).Role || 
                (decoded as any).userRole || 
                (decoded as any).UserRole ||
                (decoded as any)['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
                (decoded as any).roles?.[0];
                
    console.log('Extracted role:', role);
    return role || null;  // Return the original role value without toLowerCase()
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
  const pathname = request.nextUrl.pathname;
  
  // Bỏ qua các request không cần xác thực
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/images') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Cho phép truy cập các đường dẫn công khai
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  try {
    // Kiểm tra token từ cookies
    const token = request.cookies.get('token')?.value;
    if (!token) {
      console.log('No token found, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Lấy role từ token
    const role = getRoleFromToken(token);
    console.log('Extracted role for protected path:', role);
    
    if (!role) {
      console.log('No role found in token');
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }

    // Kiểm tra token còn hạn không
    const decoded = jwtDecode(token);
    const exp = (decoded as any).exp;
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (exp && exp <= currentTime) {
      console.log('Token expired');
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }

    // Kiểm tra quyền truy cập dựa trên role
    const roleLower = role.toLowerCase();
    console.log('Checking access for role:', roleLower, 'on path:', pathname);
    
    // Kiểm tra quyền admin
    if (pathname.startsWith('/admin')) {
      if (!['admin', 'administrator'].includes(roleLower)) {
        console.log('Access denied: Not an admin');
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
    
    // Kiểm tra quyền staff
    if (pathname.startsWith('/staff')) {
      if (!['staff', 'manager', 'receptionist'].includes(roleLower)) {
        console.log('Access denied: Not a staff member');
        return NextResponse.redirect(new URL('/login', request.url));
      }
    }
    
    // Kiểm tra quyền customer
    if (pathname.startsWith('/customer')) {
      if (roleLower !== 'customer') {
        console.log('Access denied: Not a customer');
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