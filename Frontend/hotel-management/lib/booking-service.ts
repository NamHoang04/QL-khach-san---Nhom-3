import { api } from './api';

// Interface này khớp với BookingDTO của backend
export interface Booking {
    id: number;
    bookingCode: string;
    checkIn: string;
    checkOut: string;
    numberOfAdults: number;
    numberOfChildren: number;
    totalPrice?: number;
    status: string;
    note?: string;
    customerId: string;
    customerName: string;
    customerEmail?: string;
    staffId?: string;
    staffName?: string;
    roomId: number;
    roomName: string;
    roomNumber?: string;
}

// DTO cho việc tạo và cập nhật
export interface BookingUpsertDTO {
  checkIn: string;
  checkOut: string;
  numberOfAdults: number;
  numberOfChildren: number;
  totalPrice: number;
  status: string;
  note?: string;
  customerId: string;
  staffId?: string;
  roomId: number;
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