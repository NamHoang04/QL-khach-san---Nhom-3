"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { login } from "@/lib/auth-service"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { Eye, EyeOff, Info } from "lucide-react"
import { shouldUseMockData, enableMockData, API_CONFIG } from '@/lib/config'

export default function LoginPage() {
  const router = useRouter()
  const { setUser } = useAuth()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [useMockData, setUseMockData] = useState(shouldUseMockData())

  // Kiểm tra API có online không
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        console.log('Checking API health at:', `${API_CONFIG.baseUrl}/Health`);
        const response = await fetch(`${API_CONFIG.baseUrl}/Health`, { 
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (response.ok) {
          setApiStatus('online');
          console.log('API is online');
        } else {
          setApiStatus('offline');
          console.warn('API returned error:', response.status);
          
          // Try an alternative endpoint in case Health endpoint is not available
          try {
            console.log('Trying alternative health check at base URL');
            const altResponse = await fetch(API_CONFIG.baseUrl, { 
              method: 'GET',
              mode: 'cors'
            });
            
            if (altResponse.ok || altResponse.status === 404) {
              // A 404 on the base URL is still a sign the API is running
              setApiStatus('online');
              console.log('API is online (base URL check)');
            }
          } catch (altError) {
            console.warn('Alternative health check failed:', altError);
          }
        }
      } catch (error) {
        console.warn('API health check failed:', error);
        setApiStatus('offline');
        
        // Force mock data mode if API is offline
        if (!shouldUseMockData()) {
          console.log('API is offline, forcing mock data mode');
          // We can't modify the config directly, but we can show a message
        }
      }
    };
    
    checkApiStatus();
  }, []);

  // Update the mock data setting
  const toggleMockData = () => {
    const newValue = !useMockData;
    setUseMockData(newValue);
    enableMockData(newValue);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsLoading(true)

    // Kiểm tra nếu không có mạng hoặc API offline
    if (apiStatus === 'offline' && !useMockData) {
      console.log('API appears to be offline, but continuing anyway...');
    }

    try {
      console.log('Attempting login with username:', username);
      const response = await login({ username, password })
      
      console.log('Login successful, user type:', response.userType, 'role:', response.role);
      
      // Lưu thông tin user vào context
      setUser({
        id: response.userId,
        username: username,
        role: response.userType,
        specificRole: response.role
      })

      // Chuyển hướng dựa vào userType và role
      if (response.userType === 'admin') {
        // Admin luôn vào trang admin dashboard
        console.log('Redirecting to admin dashboard');
        router.push('/admin/dashboard');
      } else if (response.userType === 'staff') {
        // Staff luôn vào trang staff dashboard
        console.log('Redirecting to staff dashboard');
        router.push('/staff/dashboard');
      } else if (response.userType === 'customer') {
        // Customer vào trang customer dashboard
        console.log('Redirecting to customer dashboard');
        router.push('/customer');
      } else {
        setError('Loại người dùng không hợp lệ');
      }
    } catch (err) {
      console.error('Login error details:', err);
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center min-h-screen font-sans bg-cover bg-center overflow-hidden" style={{backgroundImage: 'url(https://elitetour.com.vn/files/images/Blogs/Combo-Intercontinental-Phu-Quoc.jpg)'}}>
      <div className="absolute inset-0 z-0">
        <div className="bg-blue-900/40 absolute inset-0"></div>
        <div className="pointer-events-none select-none absolute inset-0">
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-200 opacity-20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-40 -right-40 w-[420px] h-[420px] bg-blue-300 opacity-10 rounded-full blur-2xl"></div>
          <svg className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10" width="120" height="120" fill="none" viewBox="0 0 48 48"><rect x="8" y="20" width="32" height="20" rx="3" fill="#2563eb"/><rect x="14" y="10" width="20" height="10" rx="2" fill="#2563eb"/><rect x="20" y="4" width="8" height="6" rx="1.5" fill="#2563eb"/></svg>
          <svg className="absolute left-8 top-1/3 opacity-10" width="80" height="80" fill="none" viewBox="0 0 48 48"><circle cx="20" cy="28" r="8" stroke="#2563eb" strokeWidth="3"/><rect x="28" y="26" width="14" height="4" rx="2" fill="#2563eb"/><rect x="38" y="22" width="4" height="12" rx="2" fill="#2563eb"/></svg>
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-[430px] flex flex-col gap-4 bg-white rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-2">ĐĂNG NHẬP</h2>
        
        {apiStatus === 'offline' && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-md text-sm">
            <p className="font-medium">API có thể đang offline!</p>
            <p className="text-xs mt-1">Kiểm tra xem máy chủ backend đã chạy chưa. Đảm bảo API đang chạy ở {API_CONFIG.baseUrl}</p>
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={toggleMockData}
                className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-medium py-1 px-2 rounded"
              >
                {useMockData ? 'Tắt chế độ dữ liệu giả lập' : 'Dùng dữ liệu giả lập'}
              </button>
            </div>
          </div>
        )}
        
        <div className="space-y-1">
          <input
            type="text"
            placeholder="Tên đăng nhập"
            className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={isLoading}
          />
          <div className="flex justify-between items-center text-xs text-gray-500">
            <div>
              {shouldUseMockData() 
                ? "Tài khoản mock: admin/admin123 | staff/staff123 | customer/customer123" 
                : "Nhập tài khoản admin, nhân viên hoặc khách hàng"}
            </div>
            <button 
              type="button" 
              className="text-blue-500 hover:text-blue-700 flex items-center"
              onClick={() => setShowHint(!showHint)}
            >
              <Info size={16} className="mr-1" /> Trợ giúp
            </button>
          </div>
        </div>
        
        {showHint && (
          <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800">
            <p className="font-medium mb-1">Thông tin đăng nhập:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><b>Quản trị viên (Admin):</b> Đăng nhập bằng tên admin từ bảng Admins</li>
              <li><b>Nhân viên (Staff):</b> Đăng nhập bằng mã nhân viên (StaffCode) từ bảng Staffs</li>
              <li><b>Khách hàng (Customer):</b> Đăng nhập bằng tên đăng nhập hoặc email</li>
            </ul>
          </div>
        )}
        
        <div className="space-y-1">
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <button 
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
              Quên mật khẩu?
            </Link>
          </div>
        </div>
        
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        
        <button
          type="submit"
          className={`bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
        
        <div className="text-center mt-2 text-gray-700 text-sm">
          Bạn chưa có tài khoản?{' '}
          <a href="/register" className="text-blue-600 font-bold">Đăng ký</a>
        </div>

        <div className="mt-1 text-xs text-gray-500 text-center">
          API URL: {API_CONFIG.baseUrl} | Mode: {useMockData ? 'Mock Data' : 'Live API'}
        </div>
      </form>
    </div>
  )
} 