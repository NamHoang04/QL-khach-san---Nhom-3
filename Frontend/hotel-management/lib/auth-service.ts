import { post, get } from './api-service';
import { AUTH_CONFIG, API_CONFIG } from './config';
import { shouldUseMockData } from './config';

// Định nghĩa interface cho thông tin đăng nhập
export interface LoginCredentials {
  username: string;
  password: string;
}

// Định nghĩa interface cho thông tin đăng ký
export interface RegisterData {
  username: string;
  email: string;
  phone: string;
  identityNumber: string; // CCCD/CMND
  address: string;
  password: string;
  confirmPassword: string;
}

// Định nghĩa interface cho thông tin người dùng
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  permissions: string[];
}

// Định nghĩa interface cho token đăng nhập
export interface AuthToken {
  token: string;
  expiresAt: string;
  userType: 'admin' | 'staff' | 'customer';
  userId: string;
  role: string;
}

// Định nghĩa interface cho phản hồi API đăng nhập
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Add AuthResponseDTO interface to match backend response
interface AuthResponseDTO {
  success: boolean;
  message: string;
  token: string;
  user?: {
    id: string;
    username: string;
    email: string;
    fullName: string;
    role: string;
    [key: string]: any;
  };
}

// Mock dữ liệu cho admin và staff nếu API chưa sẵn sàng
const mockAdmins = [
  {
    id: "A001",
    username: "admin",
    password: "admin123",
    email: "admin@hotel.com",
    fullName: "Admin User",
    role: "admin",
    permissions: ["all"]
  }
];

const mockStaff = [
  {
    id: "S001",
    username: "staff",
    password: "staff123",
    email: "staff@hotel.com",
    fullName: "Staff User",
    role: "staff",
    permissions: ["bookings", "rooms", "customers"]
  }
];

const mockCustomers = [
  {
    id: "C001",
    username: "customer",
    password: "customer123",
    email: "customer@example.com",
    fullName: "Customer User",
    phone: "0123456789",
    identityNumber: "123456789012",
    address: "123 Main St",
    role: "customer"
  }
];

// Gửi thông tin đăng nhập và lấy token
export async function login(credentials: LoginCredentials): Promise<AuthToken> {
  if (shouldUseMockData()) {
    console.log('Using mock data for login');
    return mockLogin(credentials);
  }
  
  console.log('Attempting secure API login to:', `${API_CONFIG.baseUrl}/Auth/login`);
  
  try {
    // Gọi API đăng nhập của backend
    const response = await post<ApiResponse<AuthResponseDTO>>('Auth/login', {
      username: credentials.username,
      password: credentials.password
    });
    
    console.log('Login API response:', response);
    
    if (!response.success) {
      throw new Error(response.message || 'Đăng nhập thất bại');
    }
    
    // Lấy dữ liệu từ response
    const authData = response.data;
    
    // Xác định loại người dùng từ phản hồi
    let userType: 'admin' | 'staff' | 'customer' = 'customer';
    
    // Nếu phản hồi có chứa thông tin về user.role thì xác định đúng loại
    if (authData.user?.role) {
      const role = authData.user.role.toLowerCase();
      if (role === 'admin') userType = 'admin';
      else if (role === 'staff') userType = 'staff';
    }
    
    const token: AuthToken = {
      token: authData.token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Assuming 24 hour expiry
      userType: userType,
      userId: authData.user?.id || '',
      role: authData.user?.role || userType
    };
    
    // Lưu thông tin token và loại user
    saveAuthToken(token, userType);
    
    return token;
  } catch (error) {
    console.error('Login failed:', error);
    // Nếu đăng nhập thất bại, ném lỗi
    throw new Error(error instanceof Error ? error.message : 'Tên đăng nhập hoặc mật khẩu không đúng');
  }
}

// Đăng ký tài khoản mới
export async function register(data: RegisterData): Promise<AuthToken> {
  if (shouldUseMockData()) {
    console.log('Using mock data for registration');
    return mockRegister(data);
  }
  
  console.log('Attempting secure API registration to:', `${API_CONFIG.baseUrl}/Auth/register`);
  
  try {
    // Gọi API đăng ký của backend
    const response = await post<ApiResponse<AuthResponseDTO>>('Auth/register', {
      username: data.username,
      email: data.email,
      phone: data.phone,
      identityNumber: data.identityNumber,
      address: data.address,
      password: data.password,
      confirmPassword: data.confirmPassword
    });
    
    console.log('Register API response:', response);
    
    if (!response.success) {
      throw new Error(response.message || 'Đăng ký thất bại');
    }
    
    // Lấy dữ liệu từ response
    const authData = response.data;
    
    const token: AuthToken = {
      token: authData.token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Assuming 24 hour expiry
      userType: 'customer',
      userId: authData.user?.id || '',
      role: 'customer'
    };
    
    // Lưu thông tin token và loại user
    saveAuthToken(token, 'customer');
    
    return token;
  } catch (error) {
    console.error('Registration failed:', error);
    throw new Error(error instanceof Error ? error.message : 'Đăng ký thất bại');
  }
}

// Hàm lưu thông tin token - sử dụng cách lưu an toàn hơn
function saveAuthToken(token: AuthToken, userType: 'admin' | 'staff' | 'customer'): void {
  try {
    // Lưu token cơ bản
    localStorage.setItem(AUTH_CONFIG.tokenKey, token.token);
    // Lưu thời gian hết hạn
    localStorage.setItem(`${AUTH_CONFIG.tokenKey}_expiry`, token.expiresAt);
    // Lưu loại người dùng
    localStorage.setItem(`${AUTH_CONFIG.tokenKey}_type`, userType);
    // Lưu role
    localStorage.setItem(`${AUTH_CONFIG.tokenKey}_role`, token.role || userType);
    // Lưu ID người dùng 
    localStorage.setItem(`${AUTH_CONFIG.tokenKey}_id`, token.userId);
    
    // Thiết lập thời gian tự động đăng xuất khi token hết hạn
    const expiryTime = new Date(token.expiresAt).getTime();
    const currentTime = new Date().getTime();
    const timeUntilExpiry = expiryTime - currentTime;
    
    if (timeUntilExpiry > 0) {
      setTimeout(() => {
        logout();
      }, timeUntilExpiry);
    }
  } catch (error) {
    console.error('Error saving auth token:', error);
    // Xử lý lỗi khi lưu token nếu cần
  }
}

// Mock login function khi API chưa sẵn sàng
async function mockLogin(credentials: LoginCredentials): Promise<AuthToken> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Thử đăng nhập với mock admin
      const admin = mockAdmins.find(a => 
        a.username === credentials.username && a.password === credentials.password);
      
      if (admin) {
        console.log('Admin login successful');
        const token: AuthToken = {
          token: 'mock-admin-token-' + Math.random().toString(36).substring(2, 10),
          expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 giờ
          userType: 'admin',
          userId: admin.id,
          role: admin.role
        };
        
        saveAuthToken(token, 'admin');
        resolve(token);
        return;
      }
      
      // Thử đăng nhập với mock staff
      const staff = mockStaff.find(s => 
        s.username === credentials.username && s.password === credentials.password);
      
      if (staff) {
        console.log('Staff login successful');
        const token: AuthToken = {
          token: 'mock-staff-token-' + Math.random().toString(36).substring(2, 10),
          expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 giờ
          userType: 'staff',
          userId: staff.id,
          role: staff.role
        };
        
        saveAuthToken(token, 'staff');
        resolve(token);
        return;
      }
      
      // Thử đăng nhập với mock customer
      const customer = mockCustomers.find(c => 
        c.username === credentials.username && c.password === credentials.password);
        
      if (customer) {
        console.log('Customer login successful');
        const token: AuthToken = {
          token: 'mock-customer-token-' + Math.random().toString(36).substring(2, 10),
          expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 giờ
          userType: 'customer',
          userId: customer.id,
          role: customer.role
        };
        
        saveAuthToken(token, 'customer');
        resolve(token);
        return;
      }
      
      // Thất bại
      reject(new Error('Tên đăng nhập hoặc mật khẩu không đúng'));
    }, 500);
  });
}

// Mock register function khi API chưa sẵn sàng
async function mockRegister(data: RegisterData): Promise<AuthToken> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Kiểm tra xem username đã tồn tại chưa
      const existingUser = [...mockAdmins, ...mockStaff, ...mockCustomers]
        .find(u => u.username === data.username || u.email === data.email);
        
      if (existingUser) {
        reject(new Error('Tên đăng nhập hoặc email đã tồn tại'));
        return;
      }
      
      // Tạo ID mới
      const newId = "C" + (Math.floor(Math.random() * 900) + 100);
      
      // Thêm khách hàng mới vào danh sách mock
      const newCustomer = {
        id: newId,
        username: data.username,
        password: data.password,
        email: data.email,
        fullName: data.username,
        phone: data.phone,
        identityNumber: data.identityNumber,
        address: data.address,
        role: "customer"
      };
      
      mockCustomers.push(newCustomer);
      
      // Trả về token
      const token: AuthToken = {
        token: 'mock-customer-token-' + Math.random().toString(36).substring(2, 10),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 giờ
        userType: 'customer',
        userId: newId,
        role: 'customer'
      };
      
      saveAuthToken(token, 'customer');
      resolve(token);
    }, 800);
  });
}

// Đăng xuất
export function logout(): void {
  localStorage.removeItem(AUTH_CONFIG.tokenKey);
  localStorage.removeItem(`${AUTH_CONFIG.tokenKey}_expiry`);
  localStorage.removeItem(`${AUTH_CONFIG.tokenKey}_type`);
  localStorage.removeItem(`${AUTH_CONFIG.tokenKey}_role`);
  localStorage.removeItem(`${AUTH_CONFIG.tokenKey}_id`);
  
  // Redirect về trang login
  window.location.href = '/login';
}

// Kiểm tra xem người dùng đã đăng nhập chưa
export function isAuthenticated(): boolean {
  const token = localStorage.getItem(AUTH_CONFIG.tokenKey);
  const expiryStr = localStorage.getItem(`${AUTH_CONFIG.tokenKey}_expiry`);
  
  if (!token || !expiryStr) {
    return false;
  }
  
  // Kiểm tra xem token đã hết hạn chưa
  const expiry = new Date(expiryStr);
  const now = new Date();
  
  if (now > expiry) {
    // Token đã hết hạn, đăng xuất
    logout();
    return false;
  }
  
  return true;
}

// Lấy token đăng nhập hiện tại
export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_CONFIG.tokenKey);
}

// Kiểm tra xem đang đăng nhập với quyền admin không
export function isAdmin(): boolean {
  return getUserType() === 'admin';
}

// Lấy loại người dùng đã đăng nhập
export function getUserType(): 'admin' | 'staff' | 'customer' | null {
  const type = localStorage.getItem(`${AUTH_CONFIG.tokenKey}_type`);
  console.log('getUserType from localStorage:', type);
  if (type === 'admin' || type === 'staff' || type === 'customer') {
    return type;
  }
  return null;
}

// Lấy ID của người dùng đã đăng nhập
export function getUserId(): string | null {
  return localStorage.getItem(`${AUTH_CONFIG.tokenKey}_id`);
}

// Lấy quyền của người dùng đã đăng nhập
export function getUserRole(): string | null {
  const role = localStorage.getItem(`${AUTH_CONFIG.tokenKey}_role`);
  console.log('getUserRole from localStorage:', role);
  return role;
}

// Redirect người dùng dựa vào quyền
export function redirectBasedOnRole(): void {
  const userType = getUserType();
  
  if (!userType) {
    // Nếu chưa đăng nhập, chuyển về trang login
    window.location.href = '/login';
    return;
  }
  
  // Chuyển đến trang dashboard tương ứng
  switch (userType) {
    case 'admin':
      window.location.href = '/admin/dashboard';
      break;
    case 'staff':
      window.location.href = '/staff/dashboard';
      break;
    case 'customer':
      window.location.href = '/customer';
      break;
    default:
      window.location.href = '/login';
  }
}

// Lấy thông tin người dùng hiện tại từ token
export async function getCurrentUser(): Promise<User | null> {
  try {
    if (!isAuthenticated()) {
      return null;
    }
    
    const userType = getUserType();
    const userId = getUserId();
    
    if (!userType || !userId) {
      return null;
    }
    
    // Trong phiên bản mock, trả về thông tin từ mock data
    if (shouldUseMockData()) {
      if (userType === 'admin') {
        const admin = mockAdmins.find(a => a.id === userId);
        return admin || null;
      } else if (userType === 'staff') {
        const staff = mockStaff.find(s => s.id === userId);
        return staff || null;
      } else if (userType === 'customer') {
        const customer = mockCustomers.find(c => c.id === userId);
        return customer ? {
          id: customer.id,
          username: customer.username,
          email: customer.email || '',
          fullName: customer.fullName || customer.username,
          role: customer.role,
          permissions: []
        } : null;
      }
    }
    
    // Trong trường hợp thật, gọi API để lấy thông tin
    // Endpoint phụ thuộc vào loại người dùng
    let endpoint = '';
    switch (userType) {
      case 'admin':
        endpoint = `Admins/${userId}`;
        break;
      case 'staff':
        endpoint = `Staff/${userId}`;
        break;
      case 'customer':
        endpoint = `Customers/${userId}`;
        break;
    }
    
    const userInfo = await get<User>(endpoint);
    return userInfo;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    return null;
  }
}

// Trả về auth headers cho các API requests
export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
} 