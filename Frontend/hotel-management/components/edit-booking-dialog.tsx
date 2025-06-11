"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Booking, BookingUpsertDTO } from "@/lib/booking-service"
import { formatCurrency, parseCurrency } from "@/lib/utils"

interface EditBookingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (booking: Partial<BookingUpsertDTO>) => void
  booking: Booking | null
}

export function EditBookingDialog({ open, onOpenChange, onSave, booking }: EditBookingDialogProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<Partial<BookingUpsertDTO>>({})

  useEffect(() => {
    if (booking) {
      setFormData({
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        numberOfAdults: booking.numberOfAdults,
        numberOfChildren: booking.numberOfChildren,
        totalPrice: booking.totalPrice,
        status: booking.status,
        note: booking.note,
        customerId: booking.customerId,
        roomId: booking.roomId,
      })
    }
  }, [booking])

  const handleChange = (field: keyof BookingUpsertDTO, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePriceChange = (value: string) => {
    const parsedValue = parseCurrency(value);
    setFormData(prev => ({ ...prev, totalPrice: parsedValue }));
  };

  const handleSave = () => {
    // Validation
    if ((formData.numberOfAdults ?? 0) < 1) {
      toast.error("Số người lớn phải có ít nhất là 1.");
      return;
    }
    if ((formData.totalPrice ?? 0) <= 1000) {
      toast.error("Giá phòng phải lớn hơn 1,000 VNĐ.");
      return;
    }

    onSave(formData)
    onOpenChange(false)

    if (formData.status === 'CheckedOut') {
      toast.info("Chuyển đến trang hóa đơn để thanh toán.");
      router.push('/admin/invoices');
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden border-2 border-[#369eff]">
        <div className="bg-[#369eff] bg-opacity-10 p-8">
          <div className="bg-white rounded-lg p-8">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-2xl font-bold text-center text-[#369eff]">CHỈNH SỬA ĐẶT PHÒNG</DialogTitle>
            </DialogHeader>

            <div className="grid gap-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-2">
                    <Label className="text-base text-gray-700">Khách hàng</Label>
                    <p className="font-semibold">{booking?.customerName}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Label className="text-base text-gray-700">Phòng</Label>
                    <p className="font-semibold">{booking?.roomName}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="checkInDate" className="text-base text-gray-700">Ngày nhận phòng</Label>
                      <Input id="checkInDate" type="date" value={formData.checkIn ? formData.checkIn.split('T')[0] : ''} onChange={(e) => handleChange("checkIn", e.target.value)} />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="checkOutDate" className="text-base text-gray-700">Ngày trả phòng</Label>
                      <Input id="checkOutDate" type="date" value={formData.checkOut ? formData.checkOut.split('T')[0] : ''} onChange={(e) => handleChange("checkOut", e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="numberOfAdults" className="text-base text-gray-700">Số người lớn</Label>
                      <Input id="numberOfAdults" type="number" value={formData.numberOfAdults || 1} onChange={(e) => handleChange("numberOfAdults", Number(e.target.value))} />
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="totalPrice" className="text-base text-gray-700">Giá (VNĐ)</Label>
                      <Input id="totalPrice" value={formatCurrency(formData.totalPrice)} onChange={(e) => handlePriceChange(e.target.value)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="status" className="text-base text-gray-700">Trạng thái</Label>
                    <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                      <SelectTrigger><SelectValue placeholder="Chọn trạng thái" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pending">Chờ xác nhận</SelectItem>
                        <SelectItem value="Confirmed">Đã xác nhận</SelectItem>
                        <SelectItem value="CheckedIn">Đã nhận phòng</SelectItem>
                        <SelectItem value="CheckedOut">Đã trả phòng</SelectItem>
                        <SelectItem value="Cancelled">Đã hủy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="note" className="text-base text-gray-700">
                  Ghi chú
                </Label>
                <Input
                  id="note"
                  value={formData.note}
                  onChange={(e) => handleChange("note", e.target.value)}
                  className="border-b border-gray-400 bg-transparent rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-10"
                />
              </div>

              <div className="flex justify-center gap-6 mt-6">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="bg-[#f08080] hover:bg-[#e06060] text-white border-none h-10 px-8"
                >
                  HỦY
                </Button>
                <Button onClick={handleSave} className="bg-[#369eff] hover:bg-[#2b7fd9] text-white h-10 px-8">
                  LƯU
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 