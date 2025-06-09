// api.ts
import axios from 'axios';
import { API_CONFIG } from './config';

// Tạo instance axios với cấu hình mặc định
export const api = axios.create({
  baseURL: API_CONFIG.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để xử lý request
api.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor để xử lý response
api.interceptors.response.use(
  (response: any) => {
    // Trả về thẳng data để các service không cần gọi .data nữa
    return response;
  },
  (error) => {
    if (error.response) {
      // Xử lý lỗi từ server
      if (error.response.status === 401) {
        // Token hết hạn hoặc không hợp lệ
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
      }
      // Reject với data lỗi từ server để component có thể bắt và hiển thị
      return Promise.reject(error.response);
    }
    // Lỗi không phải từ server (ví dụ: network error)
    return Promise.reject(error);
  }
);