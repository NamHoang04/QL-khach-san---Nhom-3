import { fetchData, postData, putData, deleteData } from './api';

// Định nghĩa interface cho dữ liệu đặt phòng
export interface BookingData {
  id?: string
  customerName: string
  phone: string
  email?: string
  checkInDate: string
  checkOutDate: string
  advancePayment: number
  agreedPrice: number
  note: string
  roomType: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  createdAt?: string
  updatedAt?: string
}

// Hàm lấy danh sách đặt phòng
export async function getBookings(): Promise<BookingData[]> {
  return fetchData('/bookings');
}

// Hàm lấy chi tiết đặt phòng theo ID
export async function getBookingById(id: string): Promise<BookingData> {
  return fetchData(`/bookings/${id}`);
}

// Hàm tạo đặt phòng mới
export async function createBooking(booking: Omit<BookingData, 'id' | 'createdAt' | 'updatedAt'>): Promise<BookingData> {
  return postData('/bookings', booking);
}

// Hàm cập nhật đặt phòng
export async function updateBooking(id: string, bookingData: Partial<BookingData>): Promise<BookingData> {
  return putData(`/bookings/${id}`, bookingData);
}

// Hàm xóa đặt phòng
export async function deleteBooking(id: string): Promise<void> {
  return deleteData(`/bookings/${id}`);
} 