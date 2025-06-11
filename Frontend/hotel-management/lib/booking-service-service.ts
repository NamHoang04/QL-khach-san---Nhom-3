import { api } from './api';

export interface BookingService {
  id: string;
  serviceId: string; // The backend seems to send the full service object, but we'll use the ID.
  serviceName?: string; 
  bookingId: string; 
  quantity: number;
  price: number;
  note?: string;
}

export interface BookingServiceCreateDTO {
  serviceId: string;
  bookingId: string;
  quantity: number;
  price: number;
  note?: string;
}

// Fetches services for a *specific* booking
export async function getServicesForBooking(bookingId: number | string): Promise<BookingService[]> {
  const response = await api.get<BookingService[]>(`/BookingServices?bookingId=${bookingId}`);
  return response.data;
}

export const createBookingService = async (data: Partial<BookingService>): Promise<BookingService> => {
  const response = await api.post<BookingService>('/BookingServices', data);
  return response.data;
}

export const getAllBookingServices = async (): Promise<BookingService[]> => {
  const response = await api.get<BookingService[]>('/BookingServices');
  return response.data;
};

export const PostServicesForBooking = async (bookingId: string): Promise<void> => {
  await api.post(`/BookingServices?bookingId=${bookingId}`);
};

// Deletes all services for a given booking.
export const deleteServicesForBooking = async (bookingId: string): Promise<void> => {
  await api.delete(`/BookingServices?bookingId=${bookingId}`);
}; 