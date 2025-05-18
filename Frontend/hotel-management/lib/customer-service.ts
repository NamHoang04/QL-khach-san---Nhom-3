import { get, post, put, del } from './api-service';

// Định nghĩa interface cho khách hàng
export interface Customer {
  id?: string
  fullName: string
  email?: string
  phone: string
  address?: string
  identityCard: string
  nationality?: string
  dateOfBirth?: string
  gender?: 'male' | 'female' | 'other'
  notes?: string
  createdAt?: string
  updatedAt?: string
}

// Hàm lấy danh sách khách hàng
export async function getCustomers(): Promise<Customer[]> {
  return get<Customer[]>('customers');
}

// Hàm lấy chi tiết khách hàng theo ID
export async function getCustomerById(id: string): Promise<Customer | null> {
  return get<Customer>(`customers/${id}`);
}

// Hàm tìm kiếm khách hàng theo tên hoặc số điện thoại
export async function searchCustomers(query: string): Promise<Customer[]> {
  return get<Customer[]>(`customers/search?query=${encodeURIComponent(query)}`);
}

// Hàm tạo khách hàng mới
export async function createCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
  return post<Customer>('customers', customer);
}

// Hàm cập nhật thông tin khách hàng
export async function updateCustomer(id: string, customerData: Partial<Customer>): Promise<Customer> {
  return put<Customer>(`customers/${id}`, customerData);
}

// Hàm xóa khách hàng
export async function deleteCustomer(id: string): Promise<void> {
  return del<void>(`customers/${id}`);
}

// Hàm lấy lịch sử đặt phòng của khách hàng
export async function getCustomerBookingHistory(customerId: string): Promise<any[]> {
  return get<any[]>(`customers/${customerId}/bookings`);
} 