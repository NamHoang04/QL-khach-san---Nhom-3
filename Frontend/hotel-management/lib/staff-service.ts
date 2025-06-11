import { api } from './api';

// Định nghĩa kiểu dữ liệu cho nhân viên
export interface StaffData {
  id: string; // Backend dùng int
  staffCode: string;
  userName: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  status: string;
  avatarUrl?: string;
}

// DTO cho việc tạo nhân viên (bao gồm cả password)
export interface StaffCreateDTO {
  staffCode: string;
  userName: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  status?: string;
  avatarUrl?: string;
  password?: string; // Mật khẩu chỉ cần khi tạo mới
}

// DTO cho việc cập nhật (không bao gồm password)
export type StaffUpdateDTO = Omit<StaffCreateDTO, 'staffCode'>;


// Các hàm gọi API cho Staff
export async function getStaffList(): Promise<StaffData[]> {
  const response = await api.get<StaffData[]>('/Staff');
  return response.data;
}

export async function getStaffById(id: string): Promise<StaffData> {
  const response = await api.get<StaffData>(`/Staff/${id}`);
  return response.data;
}

export async function createStaff(data: StaffCreateDTO): Promise<StaffData> {
  const response = await api.post<StaffData>('/Staff', data);
  return response.data;
}

export async function updateStaff(id: string, data: StaffUpdateDTO): Promise<void> {
  await api.put<void>(`/Staff/${id}`, data);
}

export async function deleteStaff(id: string): Promise<void> {
  await api.delete<void>(`/Staff/${id}`);
} 