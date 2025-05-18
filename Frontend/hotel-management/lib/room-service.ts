import { get, post, put, del } from './api-service';

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
  return get<Room[]>('rooms');
}

// Hàm lấy chi tiết phòng theo ID
export async function getRoomById(id: string): Promise<Room | null> {
  return get<Room>(`rooms/${id}`);
}

// Hàm lấy phòng theo số phòng
export async function getRoomByNumber(roomNumber: string): Promise<Room | null> {
  return get<Room>(`rooms/byNumber/${roomNumber}`);
}

// Hàm tạo phòng mới
export async function createRoom(room: Omit<Room, 'id'>): Promise<Room> {
  return post<Room>('rooms', room);
}

// Hàm cập nhật phòng
export async function updateRoom(id: string, roomData: Partial<Room>): Promise<Room> {
  return put<Room>(`rooms/${id}`, roomData);
}

// Hàm xóa phòng
export async function deleteRoom(id: string): Promise<void> {
  return del<void>(`rooms/${id}`);
}

// Hàm lấy danh sách loại phòng
export async function getRoomTypes(): Promise<RoomType[]> {
  return get<RoomType[]>('roomtypes');
}

// Hàm lấy chi tiết loại phòng theo ID
export async function getRoomTypeById(id: string): Promise<RoomType | null> {
  return get<RoomType>(`roomtypes/${id}`);
}

// Hàm tạo loại phòng mới
export async function createRoomType(roomType: Omit<RoomType, 'id'>): Promise<RoomType> {
  return post<RoomType>('roomtypes', roomType);
}

// Hàm cập nhật loại phòng
export async function updateRoomType(id: string, roomTypeData: Partial<RoomType>): Promise<RoomType> {
  return put<RoomType>(`roomtypes/${id}`, roomTypeData);
}

// Hàm xóa loại phòng
export async function deleteRoomType(id: string): Promise<void> {
  return del<void>(`roomtypes/${id}`);
}

// Hàm lấy danh sách phòng có sẵn cho đặt phòng
export async function getAvailableRooms(checkInDate: string, checkOutDate: string): Promise<Room[]> {
  return get<Room[]>(`rooms/available?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`);
} 