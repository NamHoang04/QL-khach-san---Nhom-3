"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResetSuccess, setIsResetSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(false);

  useEffect(() => {
    // Lấy email từ URL
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
      setEmailValid(true);
    } else {
      setEmailValid(false);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      setError("Vui lòng nhập mật khẩu mới!");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp!");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Giả lập API call để đặt lại mật khẩu
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Trong ứng dụng thực tế, ở đây sẽ là một API call đến server để đặt lại mật khẩu cho email
      setIsResetSuccess(true);
    } catch (err) {
      setError("Có lỗi xảy ra khi đặt lại mật khẩu. Vui lòng thử lại sau!");
    } finally {
      setIsLoading(false);
    }
  };

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
      
      <div className="relative z-10 w-[410px] bg-white rounded-2xl shadow-lg p-8">
        <Link href="/login" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Quay lại đăng nhập
        </Link>

        {!emailValid ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">Truy cập không hợp lệ!</h2>
            <p className="text-gray-600 mb-6">
              Bạn cần xác thực email trước khi đặt lại mật khẩu.
            </p>
            <Link href="/forgot-password" className="text-blue-600 hover:underline font-medium">
              Yêu cầu đặt lại mật khẩu
            </Link>
          </div>
        ) : !isResetSuccess ? (
          <>
            <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Đặt lại mật khẩu</h2>
            <p className="text-gray-600 text-center mb-6">
              Nhập mật khẩu mới cho tài khoản {email}.
            </p>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mật khẩu mới"
                  className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Xác nhận mật khẩu mới"
                  className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button 
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              
              <button
                type="submit"
                className={`bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Đặt lại mật khẩu thành công!</h2>
            <p className="text-gray-600 mb-6">
              Mật khẩu của bạn đã được đặt lại thành công. Giờ đây bạn có thể đăng nhập bằng mật khẩu mới.
            </p>
            <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 inline-block">
              Đăng nhập ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 