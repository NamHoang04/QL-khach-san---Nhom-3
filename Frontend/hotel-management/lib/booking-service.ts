import { api } from './api';

// Interface này khớp với BookingDTO của backend
export interface Booking {
    id: number;
    bookingCode: string;
    bookingDate: string;
    checkInDate: string;
    checkOutDate: string;
    numberOfAdults: number;
    numberOfChildren: number;
    totalPrice: number;
    status: string;
    note?: string;
    customerId: string;
    customerName: string; // Thêm từ join
    staffId?: string;
    staffName?: string; // Thêm từ join
    roomName: string; // Thêm từ join
}

// DTO cho việc tạo và cập nhật
export interface BookingUpsertDTO {
  checkInDate: string;
  checkOutDate: string;
  numberOfAdults: number;
  numberOfChildren: number;
  totalPrice: number;
  status: string;
  note?: string;
  customerId: string;
  staffId?: string;
  roomId: number; // Cần roomId khi tạo
}

export async function getBookings(): Promise<Booking[]> {
  const response = await api.get<Booking[]>('/Bookings');
  return response.data;
}

export async function getBookingById(id: number): Promise<Booking> {
  const response = await api.get<Booking>(`/Bookings/${id}`);
  return response.data;
}

export async function createBooking(data: BookingUpsertDTO): Promise<Booking> {
  const response = await api.post<Booking>('/Bookings', data);
  return response.data;
}

export async function updateBooking(id: number, data: Partial<BookingUpsertDTO>): Promise<void> {
  await api.put(`/Bookings/${id}`, data);
}

export async function deleteBooking(id: number): Promise<void> {
  await api.delete(`/Bookings/${id}`);
} 