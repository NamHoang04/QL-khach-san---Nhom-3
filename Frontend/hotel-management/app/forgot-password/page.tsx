"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Nếu có mã từ URL thì tự động điền vào
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const codeParam = urlParams.get('code');
    if (codeParam) {
      setVerificationCode(codeParam);
    }
  }, []);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError("Vui lòng nhập email!");
      return;
    }

    if (!email.includes('@')) {
      setError("Vui lòng nhập email hợp lệ!");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Gọi API để gửi mã xác thực
      const response = await fetch('/api/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      console.log("API Response:", data);
      
      if (response.ok && data.success) {
        // Chuyển sang bước nhập mã xác thực
        setCodeSent(true);
        
        // Đặt thời gian chờ cho nút gửi lại
        setResendDisabled(true);
        setResendCountdown(300);
        
        // Bắt đầu đếm ngược
        const countdownInterval = setInterval(() => {
          setResendCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownInterval);
              setResendDisabled(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(data.error || "Không thể gửi mã xác thực. Vui lòng thử lại sau!");
      }
    } catch (err) {
      console.error("Lỗi khi gửi mã:", err);
      setError("Có lỗi xảy ra khi gửi mã xác thực. Vui lòng thử lại sau!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode) {
      setError("Vui lòng nhập mã xác thực!");
      return;
    }

    if (verificationCode.length !== 6) {
      setError("Mã xác thực phải có 6 chữ số!");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Gọi API để kiểm tra mã xác thực
      const response = await fetch('/api/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code: verificationCode }),
      });
      
      const data = await response.json();
      console.log("API Verify Response:", data);
      
      if (response.ok && data.success) {
        // Chuyển tới trang đặt lại mật khẩu với email đã xác thực
        const verifiedEmail = data.verifiedEmail || email;
        router.push(`/reset-password?email=${encodeURIComponent(verifiedEmail)}`);
      } else {
        setError(data.error || "Mã xác thực không chính xác hoặc đã hết hạn!");
      }
    } catch (err) {
      console.error("Lỗi khi xác thực:", err);
      setError("Có lỗi xảy ra khi xác thực. Vui lòng thử lại sau!");
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

        {!codeSent ? (
          <>
            <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Quên mật khẩu</h2>
            <p className="text-gray-600 text-center mb-6">
              Nhập email đăng ký của bạn. Chúng tôi sẽ gửi mã xác thực 6 chữ số để đặt lại mật khẩu.
            </p>
            
            <form onSubmit={handleSendCode} className="flex flex-col gap-4">
              <div>
                <input
                  type="email"
                  placeholder="Email đăng ký"
                  className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              
              <button
                type="submit"
                className={`bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Đang gửi...' : 'Gửi mã xác thực'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Xác thực mã</h2>
            <p className="text-gray-600 text-center mb-6">
              Vui lòng nhập mã xác thực 6 chữ số đã được gửi đến {email}.
            </p>
            
            <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Nhập mã xác thực 6 chữ số"
                  className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  value={verificationCode}
                  onChange={e => setVerificationCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  disabled={isLoading}
                  maxLength={6}
                />
                <div className="flex justify-between mt-1">
                  <button 
                    type="button" 
                    className="text-sm text-blue-600 hover:underline"
                    onClick={() => {
                      setError("");
                      setCodeSent(false);
                    }}
                  >
                    Thay đổi email
                  </button>
                  <button 
                    type="button" 
                    className={`text-sm ${resendDisabled ? 'text-gray-400' : 'text-blue-600 hover:underline'}`}
                    onClick={handleSendCode}
                    disabled={resendDisabled || isLoading}
                  >
                    {resendDisabled 
                      ? `Gửi lại sau (${resendCountdown}s)` 
                      : 'Gửi lại mã'}
                  </button>
                </div>
              </div>
              
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              
              <button
                type="submit"
                className={`bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Đang xác thực...' : 'Xác thực'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
} 