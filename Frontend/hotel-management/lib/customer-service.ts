import { post, get, put, del } from './api';

// Định nghĩa kiểu dữ liệu cho một khách hàng
export interface CustomerData {
  id: string;
  customerCode: string;
  userName: string;
  email: string;
  phone: string;
  identityNumber?: string;
  address?: string;
}

// Định nghĩa kiểu dữ liệu cho việc tạo/cập nhật khách hàng
export type CustomerUpsertDTO = Omit<CustomerData, 'id' | 'customerCode'>;

const API_ENDPOINT = '/Customers';

// Lấy danh sách tất cả khách hàng
export async function getCustomers(): Promise<CustomerData[]> {
  const response = await get<CustomerData[]>(API_ENDPOINT);
  return response.data;
}

// Tạo khách hàng mới
export async function createCustomer(data: CustomerUpsertDTO): Promise<CustomerData> {
  const response = await post<CustomerData>(API_ENDPOINT, data);
  return response.data;
}

// Cập nhật thông tin khách hàng
export async function updateCustomer(id: string, data: CustomerUpsertDTO): Promise<void> {
  await put(`${API_ENDPOINT}/${id}`, data);
}

// Xóa khách hàng
export async function deleteCustomer(id: string): Promise<void> {
  await del(`${API_ENDPOINT}/${id}`);
}

// Tìm kiếm khách hàng (ví dụ, API hỗ trợ /Customer/search?query=...)
// Nếu API không hỗ trợ, chúng ta sẽ lọc ở client-side.
export async function searchCustomers(query: string): Promise<CustomerData[]> {
    const response = await get<CustomerData[]>(`${API_ENDPOINT}/search`, { params: { query } });
    return response.data;
}

// Hàm lấy lịch sử đặt phòng của khách hàng
export async function getCustomerBookingHistory(customerId: string): Promise<any[]> {
  const response = await get<any[]>(`/Customers/${customerId}/bookings`);
  return response.data;
} 