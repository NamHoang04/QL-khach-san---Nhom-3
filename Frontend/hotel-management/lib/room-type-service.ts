import { api } from './api';

// Định nghĩa kiểu dữ liệu cho một loại phòng, khớp với DTO
export interface RoomTypeData {
  id: number;
  name: string;
  price: number;
  description?: string;
  area?: number;
  maxGuests?: number;
  amenities?: string;
  imageUrl?: string;
}

// DTO cho việc tạo và cập nhật
export type RoomTypeUpsertDTO = Omit<RoomTypeData, 'id'>;

// Các hàm gọi API cho RoomTypes
export async function getRoomTypes(): Promise<RoomTypeData[]> {
  const response = await api.get<RoomTypeData[]>('/RoomTypes');
  return response.data;
}

export async function getRoomTypeById(id: number): Promise<RoomTypeData> {
  const response = await api.get<RoomTypeData>(`/RoomTypes/${id}`);
  return response.data;
}

export async function createRoomType(data: RoomTypeUpsertDTO): Promise<RoomTypeData> {
  const response = await api.post<RoomTypeData>('/RoomTypes', data);
  return response.data;
}

export async function updateRoomType(id: number, data: RoomTypeUpsertDTO): Promise<void> {
  await api.put<void>(`/RoomTypes/${id}`, data);
}

export async function deleteRoomType(id: number): Promise<void> {
  await api.delete<void>(`/RoomTypes/${id}`);
} 