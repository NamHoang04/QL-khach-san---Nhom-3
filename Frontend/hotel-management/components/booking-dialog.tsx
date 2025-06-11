"use client"

import { useEffect, useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Booking, BookingUpsertDTO } from "@/lib/booking-service"
import { CustomerData } from "@/lib/customer-service"
import { Room, RoomType } from "@/lib/room-service"
import { formatCurrency, parseCurrency } from "@/lib/utils"
import { differenceInDays, format } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface BookingDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: BookingUpsertDTO) => Promise<void>
  booking: Booking | null
  rooms: Room[]
  roomTypes: RoomType[]
  customers: CustomerData[]
  isSaving: boolean
}

export function BookingDialog({
  isOpen,
  onClose,
  onSave,
  booking,
  rooms,
  roomTypes,
  customers,
  isSaving,
}: BookingDialogProps) {
  const [formData, setFormData] = useState<Partial<BookingUpsertDTO>>({})
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const { roomCost, numberOfDays, roomPricePerNight } = useMemo(() => {
    let roomCost = 0;
    let numberOfDays = 0;
    let roomPricePerNight = 0;

    if (formData.roomId && rooms.length > 0 && roomTypes.length > 0) {
      const room = rooms.find(r => String(r.id) === String(formData.roomId));
      if (room) {
        const roomType = roomTypes.find(rt => String(rt.id) === String(room.roomTypeId));
        roomPricePerNight = roomType?.basePrice || 0;
      }
    }

    if (formData.checkIn && formData.checkOut) {
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      if (!isNaN(checkInDate.getTime()) && !isNaN(checkOutDate.getTime()) && checkOutDate > checkInDate) {
          numberOfDays = differenceInDays(checkOutDate, checkInDate) || 1;
          roomCost = roomPricePerNight * numberOfDays;
      }
    }
    
    return { roomCost, numberOfDays, roomPricePerNight };
  }, [formData.roomId, formData.checkIn, formData.checkOut, rooms, roomTypes]);

  useEffect(() => {
    if (booking) {
      setFormData({
        checkIn: booking.checkIn ? format(new Date(booking.checkIn), 'yyyy-MM-dd') : '',
        checkOut: booking.checkOut ? format(new Date(booking.checkOut), 'yyyy-MM-dd') : '',
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
      setFormData({
        checkIn: format(new Date(), 'yyyy-MM-dd'),
        checkOut: format(new Date(new Date().setDate(new Date().getDate() + 1)), 'yyyy-MM-dd'),
        numberOfAdults: 1,
        numberOfChildren: 0,
        status: 'Pending',
        customerId: undefined,
        roomId: undefined,
        totalPrice: 0,
      });
    }
    setErrors({});
  }, [booking, isOpen]);

  useEffect(() => {
    setFormData(prev => ({ ...prev, totalPrice: roomCost }));
  }, [roomCost])

  const handlePriceChange = (value: string) => {
    const parsedValue = parseCurrency(value);
    setFormData(prev => ({ ...prev, totalPrice: parsedValue }));
  };

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
    if (!formData.totalPrice || formData.totalPrice < 0) newErrors.totalPrice = "Tổng tiền phải là một số không âm.";
    
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
      <DialogContent className="sm:max-w-xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{booking ? `Chỉnh sửa Đặt phòng ${booking.bookingCode}` : "Tạo Đặt phòng mới"}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="flex-grow pr-6 -mr-6">
          <div className="space-y-4 py-4">
            <h3 className="text-lg font-semibold text-gray-800">Thông tin chính</h3>
            <div className="grid gap-3">
              <Label htmlFor="customerId">Khách hàng</Label>
              <Select value={formData.customerId} onValueChange={(value) => handleInputChange('customerId', value)}>
                <SelectTrigger id="customerId"><SelectValue placeholder="Chọn khách hàng..." /></SelectTrigger>
                <SelectContent>
                  {customers.map(c => <SelectItem key={c.id} value={c.id}>{c.userName} ({c.phone})</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.customerId && <p className="text-red-500 text-xs">{errors.customerId}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="checkInDate">Ngày nhận</Label>
                <Input id="checkInDate" type="date" value={formData.checkIn || ''} onChange={(e) => handleInputChange('checkIn', e.target.value)} />
                {errors.checkIn && <p className="text-red-500 text-xs">{errors.checkIn}</p>}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="checkOutDate">Ngày trả</Label>
                <Input id="checkOutDate" type="date" value={formData.checkOut || ''} onChange={(e) => handleInputChange('checkOut', e.target.value)} />
                {errors.checkOut && <p className="text-red-500 text-xs">{errors.checkOut}</p>}
              </div>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="roomId">Phòng</Label>
              <Select value={String(formData.roomId || '')} onValueChange={(value) => handleInputChange('roomId', Number(value))}>
                <SelectTrigger id="roomId"><SelectValue placeholder="Chọn phòng..." /></SelectTrigger>
                <SelectContent>
                  {availableRooms.map(r => <SelectItem key={r.id} value={String(r.id)}>{r.roomNumber} - {r.roomTypeName}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.roomId && <p className="text-red-500 text-xs">{errors.roomId}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="numberOfAdults">Số người lớn</Label>
                <Input id="numberOfAdults" type="number" value={formData.numberOfAdults || 0} onChange={(e) => handleInputChange('numberOfAdults', parseInt(e.target.value))} />
                {errors.numberOfAdults && <p className="text-red-500 text-xs">{errors.numberOfAdults}</p>}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="numberOfChildren">Số trẻ em</Label>
                <Input id="numberOfChildren" type="number" value={formData.numberOfChildren || 0} onChange={(e) => handleInputChange('numberOfChildren', parseInt(e.target.value))} />
              </div>
            </div>

            <div className="grid gap-3">
                <Label htmlFor="status">Trạng thái</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger id="status"><SelectValue placeholder="Chọn trạng thái..." /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Confirmed">Confirmed</SelectItem>
                        <SelectItem value="CheckedIn">Checked-In</SelectItem>
                        <SelectItem value="CheckedOut">Checked-Out</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="note">Ghi chú</Label>
              <Textarea id="note" value={formData.note || ''} onChange={(e) => handleInputChange('note', e.target.value)} />
            </div>

            <Separator className="my-6" />

            <h3 className="text-lg font-semibold text-gray-800">Chi tiết giá</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Giá phòng / đêm</span>
                <span>{formatCurrency(roomPricePerNight)}</span>
              </div>
              <div className="flex justify-between">
                <span>Số đêm</span>
                <span>{numberOfDays}</span>
              </div>
              <div className="flex justify-between font-semibold text-base">
                <span>Tổng tiền phòng</span>
                <span>{formatCurrency(roomCost)}</span>
              </div>
            </div>

            <div className="grid gap-3 mt-4">
              <Label htmlFor="totalPrice">Tổng tiền cuối cùng (có thể sửa)</Label>
              <Input
                id="totalPrice"
                value={formatCurrency(formData.totalPrice)}
                onChange={(e) => handlePriceChange(e.target.value)}
                onBlur={() => setFormData(prev => ({...prev, totalPrice: prev.totalPrice || 0}))}
              />
              {errors.totalPrice && <p className="text-red-500 text-xs">{errors.totalPrice}</p>}
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Hủy</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 