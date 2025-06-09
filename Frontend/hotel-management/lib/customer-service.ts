import { api } from './api';

// Định nghĩa kiểu dữ liệu cho khách hàng
export interface CustomerData {
  id: string; // Backend dùng int nhưng frontend có thể dùng string để đơn giản
  customerCode: string;
  userName: string;
  email: string;
  phone: string;
  identityNumber?: string;
  address?: string;
}

// DTO cho việc tạo và cập nhật
export type CustomerUpsertDTO = Omit<CustomerData, 'id'>;


// Các hàm gọi API cho Customers
export async function getCustomers(): Promise<CustomerData[]> {
  const response = await api.get<CustomerData[]>('/Customers');
  return response.data;
}

export async function getCustomerById(id: string): Promise<CustomerData> {
  const response = await api.get<CustomerData>(`/Customers/${id}`);
  return response.data;
}

export async function createCustomer(data: CustomerUpsertDTO): Promise<CustomerData> {
  const response = await api.post<CustomerData>('/Customers', data);
  return response.data;
}

export async function updateCustomer(id: string, data: CustomerUpsertDTO): Promise<void> {
  await api.put<void>(`/Customers/${id}`, data);
}

export async function deleteCustomer(id: string): Promise<void> {
  await api.delete<void>(`/Customers/${id}`);
}

// Hàm tìm kiếm khách hàng theo tên hoặc số điện thoại
export async function searchCustomers(query: string): Promise<CustomerData[]> {
  const response = await api.get<CustomerData[]>(`/Customers/search?query=${encodeURIComponent(query)}`);
  return response.data;
}

// Hàm lấy lịch sử đặt phòng của khách hàng
export async function getCustomerBookingHistory(customerId: string): Promise<any[]> {
  const response = await api.get<any[]>(`/Customers/${customerId}/bookings`);
  return response.data;
} 