import { api } from './api';

// Định nghĩa interface cho hóa đơn
export interface Invoice {
  id?: string
  bookingId: string
  customerId: string
  customerName?: string
  roomId: string
  roomNumber?: string
  checkInDate: string
  checkOutDate: string
  totalAmount: number
  paidAmount: number
  paymentStatus: 'unpaid' | 'partially_paid' | 'paid'
  paymentMethod?: 'cash' | 'credit_card' | 'bank_transfer' | 'other'
  invoiceDate: string
  dueDate?: string
  notes?: string
  services?: InvoiceService[]
  createdAt?: string
  updatedAt?: string
}

// Định nghĩa interface cho dịch vụ trong hóa đơn
export interface InvoiceService {
  id?: string
  serviceId: string
  serviceName: string
  quantity: number
  price: number
  amount: number
}

// Hàm lấy danh sách hóa đơn
export async function getInvoices(): Promise<Invoice[]> {
  const response = await api.get<Invoice[]>('/Invoices');
  return response.data;
}

// Hàm lấy chi tiết hóa đơn theo ID
export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const response = await api.get<Invoice>(`/Invoices/${id}`);
  return response.data;
}

// Hàm lấy hóa đơn theo ID đặt phòng
export async function getInvoiceByBookingId(bookingId: string): Promise<Invoice | null> {
  const response = await api.get<Invoice>(`/Invoices/byBooking/${bookingId}`);
  return response.data;
}

// Hàm tạo hóa đơn mới
export async function createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<Invoice> {
  const response = await api.post<Invoice>('/invoices', invoice);
  return response.data;
}

// Hàm tạo hóa đơn tự động từ một đặt phòng
export async function createInvoiceForBooking(bookingId: string): Promise<Invoice> {
  const response = await api.post<Invoice>('/invoices/auto', { bookingId });
  return response.data;
}

// Hàm cập nhật hóa đơn
export async function updateInvoice(id: string, invoiceData: Partial<Invoice>): Promise<Invoice> {
  const response = await api.put<Invoice>(`/Invoices/${id}`, invoiceData);
  return response.data;
}

// Hàm xóa hóa đơn
export async function deleteInvoice(id: string): Promise<void> {
  await api.delete<void>(`/Invoices/${id}`);
}

// Hàm ghi nhận thanh toán cho hóa đơn
export async function recordPayment(id: string, amount: number, paymentMethod: string): Promise<Invoice> {
  const response = await api.post<Invoice>(`Invoices/${id}/payment`, { amount, paymentMethod });
  return response.data;
}

// Hàm thêm dịch vụ vào hóa đơn
export async function addServiceToInvoice(invoiceId: string, service: Omit<InvoiceService, 'id'>): Promise<InvoiceService> {
  const response = await api.post<InvoiceService>(`Invoices/${invoiceId}/services`, service);
  return response.data;
}

// Hàm xóa dịch vụ khỏi hóa đơn
export async function removeServiceFromInvoice(invoiceId: string, serviceId: string): Promise<void> {
  await api.delete<void>(`Invoices/${invoiceId}/services/${serviceId}`);
} 