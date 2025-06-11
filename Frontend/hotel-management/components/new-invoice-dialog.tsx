"use client"

import { useState, useEffect, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Booking, getBookings } from "@/lib/booking-service"
import { Service, getServices } from "@/lib/service-service"
import { Invoice, InvoiceService, createInvoice } from "@/lib/invoice-service"

interface NewInvoiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: () => void
}

export function NewInvoiceDialog({ open, onOpenChange, onSave }: NewInvoiceDialogProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [selectedBookingId, setSelectedBookingId] = useState<string>("")
  const [addedServices, setAddedServices] = useState<InvoiceService[]>([])
  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const [bookingsData, servicesData] = await Promise.all([
            getBookings(),
            getServices(),
          ]);
          // Filter for bookings that might need an invoice
          setBookings(bookingsData.filter(b => b.status === 'Confirmed' || b.status === 'CheckedIn' || b.status === 'CheckedOut'));
          setServices(servicesData);
        } catch (error) {
          toast.error("Không thể tải dữ liệu đặt phòng hoặc dịch vụ.");
        }
      };
      fetchData();
    }
  }, [open]);

  const selectedBooking = useMemo(() => {
    return bookings.find(b => String(b.id) === selectedBookingId);
  }, [selectedBookingId, bookings]);

  const invoiceItems = useMemo(() => {
    if (!selectedBooking) return [];
    
    const roomCharge: InvoiceService = {
      serviceId: `room-${selectedBooking.roomId}`,
      serviceName: `Tiền phòng - ${selectedBooking.roomName}`,
      quantity: 1, // Placeholder, can be improved to calculate nights
      price: selectedBooking.totalPrice || 0,
      amount: selectedBooking.totalPrice || 0,
    };
    
    return [roomCharge, ...addedServices];
  }, [selectedBooking, addedServices]);

  const totalAmount = useMemo(() => {
    return invoiceItems.reduce((sum, item) => sum + item.amount, 0);
  }, [invoiceItems]);

  const handleAddService = (serviceId: string) => {
    const service = services.find(s => String(s.id) === serviceId);
    if (service) {
      setAddedServices(prev => {
        const existing = prev.find(s => s.serviceId === serviceId);
        if (existing) {
          return prev.map(s => s.serviceId === serviceId ? { ...s, quantity: s.quantity + 1, amount: s.price * (s.quantity + 1) } : s);
        } else {
          return [...prev, { serviceId, serviceName: service.name, price: service.price, quantity: 1, amount: service.price }];
        }
      });
    }
  };

  const handleRemoveService = (serviceId: string) => {
    setAddedServices(prev => prev.filter(s => s.serviceId !== serviceId));
  }

  const handleSave = async () => {
    if (!selectedBooking) {
      toast.error("Vui lòng chọn một đặt phòng để tạo hóa đơn.");
      return;
    }

    const newInvoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'> = {
      bookingId: String(selectedBooking.id),
      customerId: selectedBooking.customerId,
      roomId: String(selectedBooking.roomId),
      checkInDate: selectedBooking.checkIn,
      checkOutDate: selectedBooking.checkOut,
      invoiceDate: new Date().toISOString(),
      services: invoiceItems,
      totalAmount: totalAmount,
      paidAmount: 0,
      paymentStatus: 'unpaid',
      notes: notes,
    };

    try {
      await createInvoice(newInvoice);
      toast.success("Hóa đơn đã được tạo thành công!");
      onSave(); // This will trigger a refetch in the parent
      onOpenChange(false); // Close dialog
    } catch (error) {
      toast.error("Tạo hóa đơn thất bại.");
      console.error(error);
    }
  };
  
  const formatCurrency = (value: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader><DialogTitle>Tạo Hóa Đơn Mới</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="booking" className="text-right">Chọn Đặt Phòng</Label>
            <Select onValueChange={setSelectedBookingId} value={selectedBookingId}>
              <SelectTrigger className="col-span-3"><SelectValue placeholder="Tìm theo mã đặt phòng hoặc tên khách..." /></SelectTrigger>
              <SelectContent>
                {bookings.map(b => (
                  <SelectItem key={b.id} value={String(b.id)}>
                    {b.bookingCode} - {b.customerName} - {b.roomName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedBooking && (
            <>
              <div className="mt-4 p-4 border rounded-md bg-gray-50">
                <h3 className="font-semibold mb-2">Chi Tiết Hóa Đơn</h3>
                <div className="grid grid-cols-2 gap-4">
                  <p><strong>Khách hàng:</strong> {selectedBooking.customerName}</p>
                  <p><strong>Phòng:</strong> {selectedBooking.roomName}</p>
                </div>
                <div className="mt-4">
                    <table className="w-full text-sm">
                        <thead><tr className="border-b"><th className="text-left py-1">Dịch vụ</th><th className="text-right py-1">Thành tiền</th></tr></thead>
                        <tbody>
                            {invoiceItems.map(item => (
                                <tr key={item.serviceId}>
                                    <td className="py-1">{item.serviceName} (x{item.quantity})</td>
                                    <td className="text-right py-1">{formatCurrency(item.amount)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
              </div>

              <div className="mt-4">
                <Label>Thêm Dịch Vụ Khác</Label>
                <div className="flex gap-2 mt-2">
                    <Select onValueChange={handleAddService} value="">
                        <SelectTrigger><SelectValue placeholder="Chọn dịch vụ..." /></SelectTrigger>
                        <SelectContent>
                            {services.map(s => <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="mt-2 space-y-1">
                    {addedServices.map(s => (
                        <div key={s.serviceId} className="flex justify-between items-center text-sm p-1 bg-blue-50 rounded">
                            <span>{s.serviceName} x{s.quantity}</span>
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveService(s.serviceId)}><Trash2 className="w-4 h-4 text-red-500"/></Button>
                        </div>
                    ))}
                </div>
              </div>

              <div className="mt-4">
                <Label htmlFor="notes">Ghi Chú</Label>
                <Textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} />
              </div>

              <div className="mt-6 text-right">
                <p className="font-bold text-xl">Tổng Cộng: {formatCurrency(totalAmount)}</p>
              </div>
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button onClick={handleSave} disabled={!selectedBooking}>Lưu Hóa Đơn</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}