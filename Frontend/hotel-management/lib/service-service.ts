import { api } from './api';

// Định nghĩa interface cho dịch vụ
export interface Service {
  id: number;
  name: string;
  price: number;
  description?: string;
}

export interface ServiceUpsertDto {
  name: string;
  price: number;
  description?: string;
}

// Hàm lấy danh sách dịch vụ
export async function getServices(): Promise<Service[]> {
  const response = await api.get<Service[]>('/Services');
  return response.data;
}

// Hàm tạo dịch vụ mới
export async function createService(data: ServiceUpsertDto): Promise<Service> {
  const response = await api.post<Service>('/Services', data);
  return response.data;
}

// Hàm cập nhật dịch vụ
export async function updateService(id: number, data: ServiceUpsertDto): Promise<void> {
  await api.put(`/Services/${id}`, data);
}

// Hàm xóa dịch vụ
export async function deleteService(id: number): Promise<void> {
  await api.delete(`/Services/${id}`);
} 