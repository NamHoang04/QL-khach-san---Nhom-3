import { get, post, put, del } from './api-service';

// Định nghĩa interface cho dịch vụ
export interface Service {
  id?: string
  name: string
  description: string
  price: number
  category: string
  isAvailable: boolean
  image?: string
  createdAt?: string
  updatedAt?: string
}

// Hàm lấy danh sách dịch vụ
export async function getServices(): Promise<Service[]> {
  return get<Service[]>('services');
}

// Hàm lấy chi tiết dịch vụ theo ID
export async function getServiceById(id: string): Promise<Service | null> {
  return get<Service>(`services/${id}`);
}

// Hàm lấy danh sách dịch vụ theo danh mục
export async function getServicesByCategory(category: string): Promise<Service[]> {
  return get<Service[]>(`services/byCategory/${category}`);
}

// Hàm tạo dịch vụ mới
export async function createService(service: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<Service> {
  return post<Service>('services', service);
}

// Hàm cập nhật dịch vụ
export async function updateService(id: string, serviceData: Partial<Service>): Promise<Service> {
  return put<Service>(`services/${id}`, serviceData);
}

// Hàm xóa dịch vụ
export async function deleteService(id: string): Promise<void> {
  return del<void>(`services/${id}`);
}

// Hàm cập nhật trạng thái khả dụng của dịch vụ
export async function updateServiceAvailability(id: string, isAvailable: boolean): Promise<Service> {
  return put<Service>(`services/${id}/availability`, { isAvailable });
} 