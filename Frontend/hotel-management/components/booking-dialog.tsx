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
import { getRooms, Room } from "@/lib/room-service"

interface BookingDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: BookingUpsertDTO) => Promise<void>
  booking: Booking | null
}

export function BookingDialog({ isOpen, onClose, onSave, booking }: BookingDialogProps) {
  const [formData, setFormData] = useState<Partial<BookingUpsertDTO>>({})
  const [customers, setCustomers] = useState<CustomerData[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    async function fetchData() {
        try {
            const [customersData, roomsData] = await Promise.all([
                getCustomers(),
                getRooms()
            ]);
            setCustomers(customersData);
            setRooms(roomsData.filter(r => r.status.toLowerCase() === 'available')); // Fix case-sensitivity
        } catch (error) {
            toast.error("Không thể tải danh sách khách hàng hoặc phòng.")
        }
    }
    if(isOpen) {
        fetchData();
        if (booking) {
          setFormData({
            checkInDate: booking.checkInDate.split('T')[0],
            checkOutDate: booking.checkOutDate.split('T')[0],
            numberOfAdults: booking.numberOfAdults,
            numberOfChildren: booking.numberOfChildren,
            totalPrice: booking.totalPrice,
            status: booking.status,
            note: booking.note,
            customerId: booking.customerId,
            staffId: booking.staffId,
          });
        } else {
          // Reset for new booking
          setFormData({
            checkInDate: new Date().toISOString().split('T')[0],
            checkOutDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
            numberOfAdults: 1,
            numberOfChildren: 0,
            status: 'Pending',
            customerId: undefined,
            roomId: undefined,
          });
        }
        setErrors({})
    }
  }, [booking, isOpen])

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.customerId) newErrors.customerId = "Vui lòng chọn khách hàng.";
    if (!formData.roomId) newErrors.roomId = "Vui lòng chọn phòng.";
    if (!formData.checkInDate) newErrors.checkInDate = "Ngày nhận phòng là bắt buộc.";
    if (!formData.checkOutDate) newErrors.checkOutDate = "Ngày trả phòng là bắt buộc.";
    if (formData.checkInDate && formData.checkOutDate && new Date(formData.checkOutDate) <= new Date(formData.checkInDate)) {
        newErrors.checkOutDate = "Ngày trả phòng phải sau ngày nhận phòng.";
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
                        {rooms.map(r => <SelectItem key={r.id} value={String(r.id)}>{r.roomNumber} - {r.roomTypeName}</SelectItem>)}
                    </SelectContent>
                </Select>
                {errors.roomId && <p className="col-span-4 text-red-500 text-xs text-right">{errors.roomId}</p>}
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="checkInDate" className="text-right">Ngày nhận</Label>
                <Input id="checkInDate" type="date" value={formData.checkInDate || ''} onChange={(e) => handleInputChange('checkInDate', e.target.value)} className="col-span-3" />
                {errors.checkInDate && <p className="col-span-4 text-red-500 text-xs text-right">{errors.checkInDate}</p>}
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="checkOutDate" className="text-right">Ngày trả</Label>
                <Input id="checkOutDate" type="date" value={formData.checkOutDate || ''} onChange={(e) => handleInputChange('checkOutDate', e.target.value)} className="col-span-3" />
                {errors.checkOutDate && <p className="col-span-4 text-red-500 text-xs text-right">{errors.checkOutDate}</p>}
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