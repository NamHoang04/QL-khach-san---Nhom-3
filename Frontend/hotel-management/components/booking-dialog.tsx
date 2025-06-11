"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Booking, BookingUpsertDTO } from "@/lib/booking-service"
import { getCustomers, CustomerData } from "@/lib/customer-service"
import { Room } from "@/lib/room-service"

interface BookingDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: BookingUpsertDTO) => Promise<void>
  booking: Booking | null
  rooms: Room[]
}

export function BookingDialog({ isOpen, onClose, onSave, booking, rooms }: BookingDialogProps) {
  const [formData, setFormData] = useState<Partial<BookingUpsertDTO>>({})
  const [customers, setCustomers] = useState<CustomerData[]>([])
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    async function fetchCustomers() {
        try {
            const customersData = await getCustomers()
            setCustomers(customersData);
        } catch (error) {
            toast.error("Không thể tải danh sách khách hàng.")
        }
    }

    if(isOpen) {
        fetchCustomers();
        if (booking) {
          setFormData({
            checkIn: booking.checkIn ? booking.checkIn.split('T')[0] : '',
            checkOut: booking.checkOut ? booking.checkOut.split('T')[0] : '',
            numberOfAdults: booking.numberOfAdults,
            numberOfChildren: booking.numberOfChildren,
            totalPrice: booking.totalPrice || 0,
            status: booking.status,
            note: booking.note,
            customerId: booking.customerId,
            staffId: booking.staffId,
            roomId: booking.roomId,
          });
        } else {
          // Reset for new booking
          setFormData({
            checkIn: new Date().toISOString().split('T')[0],
            checkOut: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
            numberOfAdults: 1,
            numberOfChildren: 0,
            status: 'Pending',
            customerId: undefined,
            roomId: undefined,
            totalPrice: 0,
          });
        }
        setErrors({})
    }
  }, [booking, isOpen])

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.customerId) newErrors.customerId = "Vui lòng chọn khách hàng.";
    if (!formData.roomId) newErrors.roomId = "Vui lòng chọn phòng.";
    if (!formData.checkIn) newErrors.checkIn = "Ngày nhận phòng là bắt buộc.";
    if (!formData.checkOut) newErrors.checkOut = "Ngày trả phòng là bắt buộc.";
    if (formData.checkIn && formData.checkOut && new Date(formData.checkOut) <= new Date(formData.checkIn)) {
        newErrors.checkOut = "Ngày trả phòng phải sau ngày nhận phòng.";
    }
    if (!formData.numberOfAdults || formData.numberOfAdults <= 0) newErrors.numberOfAdults = "Phải có ít nhất 1 người lớn.";
    if (!formData.totalPrice || formData.totalPrice <= 0) newErrors.totalPrice = "Tổng tiền phải là một số dương.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error("Vui lòng kiểm tra lại thông tin đặt phòng.");
      return;
    }
    await onSave(formData as BookingUpsertDTO);
  }

  const handleInputChange = (field: keyof BookingUpsertDTO, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const availableRooms = rooms.filter(r => {
    if (r.status.toLowerCase() === 'available') return true
    if (booking && String(r.id) === String(booking.roomId)) return true
    return false
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{booking ? `Chỉnh sửa Đặt phòng ${booking.bookingCode}` : "Tạo Đặt phòng mới"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="customerId" className="text-right">Khách hàng</Label>
                <Select value={formData.customerId} onValueChange={(value) => handleInputChange('customerId', value)}>
                    <SelectTrigger className="col-span-3"><SelectValue placeholder="Chọn khách hàng..." /></SelectTrigger>
                    <SelectContent>
                        {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.userName} ({c.phone})</SelectItem>)}
                    </SelectContent>
                </Select>
                {errors.customerId && <p className="col-span-4 text-red-500 text-xs text-right">{errors.customerId}</p>}
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="roomId" className="text-right">Phòng</Label>
                <Select value={String(formData.roomId || '')} onValueChange={(value) => handleInputChange('roomId', Number(value))}>
                    <SelectTrigger className="col-span-3"><SelectValue placeholder="Chọn phòng..." /></SelectTrigger>
                    <SelectContent>
                        {availableRooms.map(r => <SelectItem key={r.id} value={String(r.id)}>{r.roomNumber} - {r.roomTypeName}</SelectItem>)}
                    </SelectContent>
                </Select>
                {errors.roomId && <p className="col-span-4 text-red-500 text-xs text-right">{errors.roomId}</p>}
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="checkInDate" className="text-right">Ngày nhận</Label>
                <Input id="checkInDate" type="date" value={formData.checkIn || ''} onChange={(e) => handleInputChange('checkIn', e.target.value)} className="col-span-3" />
                {errors.checkIn && <p className="col-span-4 text-red-500 text-xs text-right">{errors.checkIn}</p>}
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="checkOutDate" className="text-right">Ngày trả</Label>
                <Input id="checkOutDate" type="date" value={formData.checkOut || ''} onChange={(e) => handleInputChange('checkOut', e.target.value)} className="col-span-3" />
                {errors.checkOut && <p className="col-span-4 text-red-500 text-xs text-right">{errors.checkOut}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="numberOfAdults" className="text-right">Người lớn</Label>
                <Input id="numberOfAdults" type="number" value={formData.numberOfAdults || 1} onChange={(e) => handleInputChange('numberOfAdults', Number(e.target.value))} className="col-span-3" />
                 {errors.numberOfAdults && <p className="col-span-4 text-red-500 text-xs text-right">{errors.numberOfAdults}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="numberOfChildren" className="text-right">Trẻ em</Label>
                <Input id="numberOfChildren" type="number" value={formData.numberOfChildren || 0} onChange={(e) => handleInputChange('numberOfChildren', Number(e.target.value))} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="totalPrice" className="text-right">Tổng tiền</Label>
                <Input id="totalPrice" type="number" value={formData.totalPrice || 0} onChange={(e) => handleInputChange('totalPrice', Number(e.target.value))} className="col-span-3" />
                {errors.totalPrice && <p className="col-span-4 text-red-500 text-xs text-right">{errors.totalPrice}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">Trạng thái</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger className="col-span-3"><SelectValue placeholder="Chọn trạng thái..." /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                        <SelectItem value="CheckedIn">Checked-in</SelectItem>
                        <SelectItem value="CheckedOut">Checked-out</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="note" className="text-right">Ghi chú</Label>
                <Textarea id="note" value={formData.note || ''} onChange={(e) => handleInputChange('note', e.target.value)} className="col-span-3" />
            </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Hủy</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit}>Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 