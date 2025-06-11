import { api } from './api';

// Định nghĩa interface cho phòng
export interface Room {
  id?: string
  roomNumber: string
  roomTypeId: string
  roomTypeName?: string
  status: "available" | "occupied" | "maintenance" | "reserved"
  floor: number
  description?: string
  pricePerNight?: number
  images?: string[]
}

// Định nghĩa interface cho loại phòng
export interface RoomType {
  id?: string
  name: string
  description: string
  capacity: number
  basePrice: number
  amenities: string[]
  images?: string[]
}

// Hàm lấy danh sách phòng
export async function getRooms(): Promise<Room[]> {
  const response = await api.get('/rooms');
  return response.data as Room[];
}

// Hàm lấy chi tiết phòng theo ID
export async function getRoomById(id: string): Promise<Room> {
  const response = await api.get(`/rooms/${id}`);
  return response.data as Room;
}

// Hàm lấy phòng theo số phòng
export async function getRoomByNumber(roomNumber: string): Promise<Room> {
  const response = await api.get(`/rooms/byNumber/${roomNumber}`);
  return response.data as Room;
}

// Hàm tạo phòng mới
export async function createRoom(room: Omit<Room, 'id'>): Promise<Room> {
  const response = await api.post('/rooms', room);
  return response.data as Room;
}

// Hàm cập nhật phòng
export async function updateRoom(id: string, roomData: Partial<Room>): Promise<Room> {
  const response = await api.put(`/rooms/${id}`, roomData);
  return response.data as Room;
}

// Hàm xóa phòng
export async function deleteRoom(id: string): Promise<void> {
  await api.delete(`/rooms/${id}`);
}

// Hàm lấy danh sách loại phòng
export async function getRoomTypes(): Promise<RoomType[]> {
  const response = await api.get('/roomtypes');
  return response.data as RoomType[];
}

// Hàm lấy chi tiết loại phòng theo ID
export async function getRoomTypeById(id: string): Promise<RoomType> {
  const response = await api.get(`/roomtypes/${id}`);
  return response.data as RoomType;
}

// Hàm tạo loại phòng mới
export async function createRoomType(roomType: Omit<RoomType, 'id'>): Promise<RoomType> {
  const response = await api.post('/roomtypes', roomType);
  return response.data as RoomType;
}

// Hàm cập nhật loại phòng
export async function updateRoomType(id: string, roomTypeData: Partial<RoomType>): Promise<RoomType> {
  const response = await api.put(`/roomtypes/${id}`, roomTypeData);
  return response.data as RoomType;
}

// Hàm xóa loại phòng
export async function deleteRoomType(id: string): Promise<void> {
  await api.delete(`/roomtypes/${id}`);
}

// Hàm lấy danh sách phòng có sẵn cho đặt phòng
export async function getAvailableRooms(checkInDate: string, checkOutDate: string): Promise<Room[]> {
  const response = await api.get(`/rooms/available?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`);
  return response.data as Room[];
} 