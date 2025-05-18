import { get, post, put, del } from './api-service';

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
  return get<Invoice[]>('invoices');
}

// Hàm lấy chi tiết hóa đơn theo ID
export async function getInvoiceById(id: string): Promise<Invoice | null> {
  return get<Invoice>(`invoices/${id}`);
}

// Hàm lấy hóa đơn theo ID đặt phòng
export async function getInvoiceByBookingId(bookingId: string): Promise<Invoice | null> {
  return get<Invoice>(`invoices/byBooking/${bookingId}`);
}

// Hàm tạo hóa đơn mới
export async function createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<Invoice> {
  return post<Invoice>('invoices', invoice);
}

// Hàm cập nhật hóa đơn
export async function updateInvoice(id: string, invoiceData: Partial<Invoice>): Promise<Invoice> {
  return put<Invoice>(`invoices/${id}`, invoiceData);
}

// Hàm xóa hóa đơn
export async function deleteInvoice(id: string): Promise<void> {
  return del<void>(`invoices/${id}`);
}

// Hàm ghi nhận thanh toán cho hóa đơn
export async function recordPayment(id: string, amount: number, paymentMethod: string): Promise<Invoice> {
  return post<Invoice>(`invoices/${id}/payment`, { amount, paymentMethod });
}

// Hàm thêm dịch vụ vào hóa đơn
export async function addServiceToInvoice(invoiceId: string, service: Omit<InvoiceService, 'id'>): Promise<InvoiceService> {
  return post<InvoiceService>(`invoices/${invoiceId}/services`, service);
}

// Hàm xóa dịch vụ khỏi hóa đơn
export async function removeServiceFromInvoice(invoiceId: string, serviceId: string): Promise<void> {
  return del<void>(`invoices/${invoiceId}/services/${serviceId}`);
} 