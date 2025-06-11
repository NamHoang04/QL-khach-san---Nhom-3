"use client"

import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Booking, updateBooking } from "@/lib/booking-service"
import { toast } from "sonner"

interface BookingDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  onEdit: () => void
  onBookingUpdate: () => void;
  booking: Booking | null
  roomName: string
}

const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
};

const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return "N/A";
    }
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Confirmed':
            return 'bg-blue-100 text-blue-800';
        case 'CheckedIn':
            return 'bg-green-100 text-green-800';
        case 'CheckedOut':
            return 'bg-gray-100 text-gray-800';
        case 'Cancelled':
            return 'bg-red-100 text-red-800';
        case 'Pending':
        default:
            return 'bg-yellow-100 text-yellow-800';
    }
}

export function BookingDetailsDialog({ isOpen, onClose, onEdit, onBookingUpdate, booking, roomName }: BookingDetailsDialogProps) {
  const router = useRouter();

  if (!booking) return null

  const handleCheckIn = async () => {
    if (!booking) return;
    try {
      await updateBooking(booking.id, { status: 'CheckedIn' });
      toast.success("Đã nhận phòng thành công!");
      onBookingUpdate();
      onClose();
    } catch (error) {
      toast.error("Thao tác nhận phòng thất bại.");
    }
  };

  const handleCheckOut = async () => {
    if (!booking) return;
    try {
      await updateBooking(booking.id, { status: 'CheckedOut' });
      toast.success("Đã trả phòng thành công! Chuyển đến trang hóa đơn.");
      onBookingUpdate();
      onClose();
      router.push('/admin/invoices');
    } catch (error) {
      toast.error("Thao tác trả phòng thất bại.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Chi tiết Đặt phòng - {booking.bookingCode}</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-600">Trạng thái:</span>
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(booking.status)}`}>
                {booking.status}
            </span>
          </div>
          <hr/>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <span className="font-semibold text-gray-600">Khách hàng:</span>
            <span>{booking.customerName}</span>

            <span className="font-semibold text-gray-600">Số phòng:</span>
            <span>{roomName}</span>

            <span className="font-semibold text-gray-600">Ngày nhận phòng:</span>
            <span>{formatDate(booking.checkIn)}</span>

            <span className="font-semibold text-gray-600">Ngày trả phòng:</span>
            <span>{formatDate(booking.checkOut)}</span>

            <span className="font-semibold text-gray-600">Người lớn:</span>
            <span>{booking.numberOfAdults}</span>

            <span className="font-semibold text-gray-600">Trẻ em:</span>
            <span>{booking.numberOfChildren}</span>
          </div>
          <hr/>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-600">Tổng tiền:</span>
            <span className="font-bold text-lg">{formatCurrency(booking.totalPrice)}</span>
          </div>
           {booking.note && (
            <div>
                <span className="font-semibold text-gray-600">Ghi chú:</span>
                <p className="mt-1 text-sm text-gray-700 bg-gray-50 p-2 rounded-md border">{booking.note}</p>
            </div>
           )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Đóng</Button>
          {booking.status === 'Confirmed' && (
            <Button type="button" variant="secondary" onClick={handleCheckIn}>Nhận phòng</Button>
          )}
          {booking.status === 'CheckedIn' && (
            <Button type="button" variant="destructive" onClick={handleCheckOut}>Trả phòng</Button>
          )}
          <Button type="button" onClick={onEdit}>Chỉnh sửa</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 