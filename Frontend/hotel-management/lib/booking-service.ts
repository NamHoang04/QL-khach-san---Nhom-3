import { get, post, put, del } from './api-service';
import { shouldUseMockData } from './config';

// Định nghĩa interface cho dữ liệu đặt phòng
export interface BookingData {
  id?: string
  customerName: string
  phone: string
  email?: string
  checkInDate: string
  checkOutDate: string
  advancePayment: string
  agreedPrice: string
  note: string
  roomType: string
  status: "pending" | "confirmed" | "cancelled" | "completed"
  createdAt?: string
  updatedAt?: string
}

// Mock dữ liệu cho ví dụ
const mockBookings: BookingData[] = [
  {
    id: "B00123",
    customerName: "Nguyễn Văn A",
    phone: "0987654321",
    email: "nguyenvana@gmail.com",
    checkInDate: "2024-06-01",
    checkOutDate: "2024-06-03",
    advancePayment: "500.000đ",
    agreedPrice: "1.200.000đ",
    note: "",
    roomType: "Phòng đơn",
    status: "confirmed",
    createdAt: "2024-05-20T10:30:00",
    updatedAt: "2024-05-20T10:30:00"
  },
  {
    id: "B00124",
    customerName: "Trần Thị B",
    phone: "0123456789",
    email: "tranthib@gmail.com",
    checkInDate: "2024-06-05",
    checkOutDate: "2024-06-10",
    advancePayment: "800.000đ",
    agreedPrice: "2.500.000đ",
    note: "Khách yêu cầu phòng tầng cao",
    roomType: "Phòng đôi",
    status: "pending",
    createdAt: "2024-05-22T14:15:00",
    updatedAt: "2024-05-22T14:15:00"
  }
];

// Hàm lấy danh sách đặt phòng
export async function getBookings(): Promise<BookingData[]> {
  if (shouldUseMockData()) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockBookings);
      }, 500);
    });
  }
  
  return get<BookingData[]>('bookings');
}

// Hàm lấy chi tiết đặt phòng theo ID
export async function getBookingById(id: string): Promise<BookingData | null> {
  if (shouldUseMockData()) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const booking = mockBookings.find(b => b.id === id);
        resolve(booking || null);
      }, 300);
    });
  }
  
  return get<BookingData>(`bookings/${id}`);
}

// Hàm tạo đặt phòng mới
export async function createBooking(booking: Omit<BookingData, 'id' | 'createdAt' | 'updatedAt'>): Promise<BookingData> {
  if (shouldUseMockData()) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newBooking: BookingData = {
          ...booking,
          id: `B${Math.floor(Math.random() * 90000) + 10000}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        mockBookings.push(newBooking);
        resolve(newBooking);
      }, 500);
    });
  }
  
  return post<BookingData>('bookings', booking);
}

// Hàm cập nhật đặt phòng
export async function updateBooking(id: string, bookingData: Partial<BookingData>): Promise<BookingData> {
  if (shouldUseMockData()) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockBookings.findIndex(b => b.id === id);
        if (index === -1) {
          reject(new Error("Booking not found"));
          return;
        }
        
        const updatedBooking = {
          ...mockBookings[index],
          ...bookingData,
          updatedAt: new Date().toISOString()
        };
        
        mockBookings[index] = updatedBooking;
        resolve(updatedBooking);
      }, 500);
    });
  }
  
  return put<BookingData>(`bookings/${id}`, bookingData);
}

// Hàm xóa đặt phòng
export async function deleteBooking(id: string): Promise<void> {
  if (shouldUseMockData()) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockBookings.findIndex(b => b.id === id);
        if (index === -1) {
          reject(new Error("Booking not found"));
          return;
        }
        
        mockBookings.splice(index, 1);
        resolve();
      }, 500);
    });
  }
  
  return del<void>(`bookings/${id}`);
}

// Fallback mock implementation if API is not available
export function useMockBookingData(): boolean {
  // Set this to true to use mock data instead of API
  const useMock = false;
  
  if (useMock) {
    // Redefine the functions to use mock data
    // Copy the mock implementation from the original file
  }
  
  return useMock;
} 