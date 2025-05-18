"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, Eye, EyeOff } from "lucide-react"
import { register, RegisterData } from "@/lib/auth-service"
import { shouldUseMockData, enableMockData, API_CONFIG } from '@/lib/config'

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    identityNumber: "", // Changed from cccd to identityNumber to match backend
    address: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [useMockData, setUseMockData] = useState(shouldUseMockData());

  // Update the mock data setting
  const toggleMockData = () => {
    const newValue = !useMockData;
    setUseMockData(newValue);
    enableMockData(newValue);
  };

  // Kiểm tra API có online không khi component mount
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
      }
    };
    
    checkApiStatus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
    setFieldErrors((prev: any) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const errors: any = {};
    if (!form.username) errors.username = "Không được bỏ trống";
    else if (form.username.length < 4) errors.username = "Tên đăng nhập phải có ít nhất 4 ký tự";
    if (!form.email) errors.email = "Không được bỏ trống";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = "Email không hợp lệ";
    if (!form.phone) errors.phone = "Không được bỏ trống";
    else if (!/^[0-9]{10,11}$/.test(form.phone)) errors.phone = "Số điện thoại không hợp lệ";
    if (!form.identityNumber) errors.identityNumber = "Không được bỏ trống";
    else if (!/^[0-9]{9,12}$/.test(form.identityNumber)) errors.identityNumber = "CCCD/CMND không hợp lệ";
    if (!form.address) errors.address = "Không được bỏ trống";
    if (!form.password) errors.password = "Không được bỏ trống";
    else if (form.password.length < 6) errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    if (!form.confirmPassword) errors.confirmPassword = "Không được bỏ trống";
    if (form.password && form.confirmPassword && form.password !== form.confirmPassword) 
      errors.confirmPassword = "Mật khẩu không khớp";
    if (!form.agree) errors.agree = "Bạn phải đồng ý với chính sách";
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Gọi hàm register từ auth-service
      const registerData: RegisterData = {
        username: form.username,
        email: form.email,
        phone: form.phone,
        identityNumber: form.identityNumber,
        address: form.address,
        password: form.password,
        confirmPassword: form.confirmPassword
      };
      
      await register(registerData);
      
      // Đăng ký thành công
      setShowPopup(true);
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
      
      // Hiển thị thông báo lỗi
      if (error instanceof Error) {
        // Xử lý lỗi cụ thể từ API nếu có
        if (error.message.includes("username")) {
          setFieldErrors((prev: Record<string, string>) => ({ ...prev, username: "Tên đăng nhập đã tồn tại" }));
        } else if (error.message.includes("email")) {
          setFieldErrors((prev: Record<string, string>) => ({ ...prev, email: "Email đã tồn tại" }));
        } else if (error.message.includes("identityNumber")) {
          setFieldErrors((prev: Record<string, string>) => ({ ...prev, identityNumber: "CCCD/CMND đã tồn tại" }));
        }
        
        setError(error.message);
      } else {
        setError("Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePopupClick = () => {
    setShowPopup(false);
    router.push("/login");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center min-h-screen font-sans bg-cover bg-center overflow-hidden" style={{backgroundImage: 'url(https://elitetour.com.vn/files/images/Blogs/Combo-Intercontinental-Phu-Quoc.jpg)'}}>
      {/* Overlay xanh mờ và decor SVG dưới form */}
      <div className="absolute inset-0 z-0">
        <div className="bg-blue-900/40 absolute inset-0"></div>
        <div className="pointer-events-none select-none absolute inset-0">
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-200 opacity-20 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-40 -right-40 w-[420px] h-[420px] bg-blue-300 opacity-10 rounded-full blur-2xl"></div>
          <svg className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10" width="120" height="120" fill="none" viewBox="0 0 48 48"><rect x="8" y="20" width="32" height="20" rx="3" fill="#2563eb"/><rect x="14" y="10" width="20" height="10" rx="2" fill="#2563eb"/><rect x="20" y="4" width="8" height="6" rx="1.5" fill="#2563eb"/></svg>
          <svg className="absolute left-8 top-1/3 opacity-10" width="80" height="80" fill="none" viewBox="0 0 48 48"><circle cx="20" cy="28" r="8" stroke="#2563eb" strokeWidth="3"/><rect x="28" y="26" width="14" height="4" rx="2" fill="#2563eb"/><rect x="38" y="22" width="4" height="12" rx="2" fill="#2563eb"/></svg>
        </div>
      </div>
      
      {apiStatus === 'offline' && (
        <div className="fixed top-4 left-0 right-0 mx-auto w-[90%] max-w-md z-50">
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
        </div>
      )}
      
      {showPopup && (
        <div onClick={handlePopupClick} className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 cursor-pointer">
          <div className="bg-white rounded-2xl shadow-xl px-8 py-8 flex flex-col items-center gap-4 min-w-[320px] max-w-[90vw]">
            <CheckCircle className="text-green-500 w-16 h-16 mb-2" />
            <div className="text-xl font-semibold text-gray-800 mb-2">Đăng ký thành công!</div>
            <div className="text-gray-600 text-center">Bạn đã đăng ký tài khoản thành công. Vui lòng đăng nhập lại với tài khoản vừa tạo.</div>
            <div className="text-xs text-gray-400 mt-2">Nhấn vào bất kỳ đâu để quay lại trang đăng nhập</div>
          </div>
        </div>
      )}
      {/* Form luôn nổi bật trên nền */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-[550px] flex flex-col gap-2 bg-white rounded-2xl shadow-xl px-5 py-4 border border-blue-100 font-sans"
      >
        <h2 className="text-xl font-bold text-center text-blue-600 mb-2 font-sans uppercase">ĐĂNG KÝ TÀI KHOẢN</h2>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-black font-sans" htmlFor="username">
              Tên đăng nhập <span className="text-red-500">*</span>
            </label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Tên đăng nhập"
              className={`p-2 rounded-lg border ${fieldErrors.username ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-sm font-sans`}
              value={form.username}
              onChange={handleChange}
              disabled={isLoading}
            />
            {fieldErrors.username && <span className="text-xs text-red-500 mt-0.5">{fieldErrors.username}</span>}
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-black font-sans" htmlFor="email">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              className={`p-2 rounded-lg border ${fieldErrors.email ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-sm font-sans`}
              value={form.email}
              onChange={handleChange}
              disabled={isLoading}
            />
            {fieldErrors.email && <span className="text-xs text-red-500 mt-0.5">{fieldErrors.email}</span>}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-black font-sans" htmlFor="phone">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="text"
              name="phone"
              placeholder="Số điện thoại"
              className={`p-2 rounded-lg border ${fieldErrors.phone ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-sm font-sans`}
              value={form.phone}
              onChange={handleChange}
              disabled={isLoading}
            />
            {fieldErrors.phone && <span className="text-xs text-red-500 mt-0.5">{fieldErrors.phone}</span>}
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-black font-sans" htmlFor="identityNumber">
              CCCD/CMND <span className="text-red-500">*</span>
            </label>
            <input
              id="identityNumber"
              type="text"
              name="identityNumber"
              placeholder="Nhập CCCD/CMND"
              className={`p-2 rounded-lg border ${fieldErrors.identityNumber ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-sm font-sans`}
              value={form.identityNumber}
              onChange={handleChange}
              disabled={isLoading}
            />
            {fieldErrors.identityNumber && <span className="text-xs text-red-500 mt-0.5">{fieldErrors.identityNumber}</span>}
          </div>
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-black font-sans" htmlFor="address">
            Địa chỉ <span className="text-red-500">*</span>
          </label>
          <textarea
            id="address"
            name="address"
            placeholder="Nhập địa chỉ của bạn"
            rows={1}
            className={`p-2 rounded-lg border ${fieldErrors.address ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-sm font-sans resize-none`}
            value={form.address}
            onChange={handleChange}
            disabled={isLoading}
          />
          {fieldErrors.address && <span className="text-xs text-red-500 mt-0.5">{fieldErrors.address}</span>}
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 relative">
            <label className="text-xs font-medium text-black font-sans" htmlFor="password">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Nhập mật khẩu"
                className={`p-2 rounded-lg border ${fieldErrors.password ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-sm font-sans pr-8 w-full`}
                value={form.password}
                onChange={handleChange}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500 hover:text-blue-600"
                onClick={() => setShowPassword(v => !v)}
                tabIndex={-1}
                disabled={isLoading}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {fieldErrors.password && <span className="text-xs text-red-500 mt-0.5">{fieldErrors.password}</span>}
          </div>
          
          <div className="flex flex-col gap-1 relative">
            <label className="text-xs font-medium text-black font-sans" htmlFor="confirmPassword">
              Nhập lại mật khẩu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                className={`p-2 rounded-lg border ${fieldErrors.confirmPassword ? 'border-red-400' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-sm font-sans pr-8 w-full`}
                value={form.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-2 text-gray-500 hover:text-blue-600"
                onClick={() => setShowConfirmPassword(v => !v)}
                tabIndex={-1}
                disabled={isLoading}
                aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {fieldErrors.confirmPassword && <span className="text-xs text-red-500 mt-0.5">{fieldErrors.confirmPassword}</span>}
          </div>
        </div>
        
        <label className="flex items-center gap-2 text-xs mt-1 font-sans">
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
            disabled={isLoading}
          />
          Tôi đồng ý chia sẻ thông tin và đồng ý với chính sách bảo mật dữ liệu cá nhân <span className="text-red-500">*</span>
        </label>
        {fieldErrors.agree && <span className="text-xs text-red-500 mt-0.5">{fieldErrors.agree}</span>}
        {error && <div className="text-red-500 text-xs text-center mt-1">{error}</div>}
        
        <button
          type="submit"
          className={`bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 shadow-lg mt-2 text-base tracking-wide font-sans ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG KÝ'}
        </button>
        
        <div className="text-center mt-1 text-gray-700 text-xs font-sans">
          Đã có tài khoản?{' '}
          <a href="/login" className="text-blue-600 font-bold">Đăng nhập</a>
        </div>
        
        <div className="mt-1 text-xs text-gray-500 text-center">
          API URL: {API_CONFIG.baseUrl} | Mode: {useMockData ? 'Mock Data' : 'Live API'}
        </div>
      </form>
    </div>
  );
} 