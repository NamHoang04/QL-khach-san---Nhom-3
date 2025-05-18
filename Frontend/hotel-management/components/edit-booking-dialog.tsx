"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookingData } from "@/lib/booking-service"

interface EditBookingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (booking: BookingData) => void
  booking: BookingData | null
}

export function EditBookingDialog({ open, onOpenChange, onSave, booking }: EditBookingDialogProps) {
  const [formData, setFormData] = useState<BookingData>({
    id: "",
    customerName: "",
    phone: "",
    email: "",
    checkInDate: "",
    checkOutDate: "",
    advancePayment: "",
    agreedPrice: "",
    note: "",
    roomType: "",
    status: "pending",
  })

  useEffect(() => {
    if (booking) {
      setFormData(booking)
    }
  }, [booking])

  const handleChange = (field: keyof BookingData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    onSave(formData)
    onOpenChange(false)
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
                    <Label htmlFor="customerName" className="text-base text-gray-700">
                      Tên khách hàng
                    </Label>
                    <Input
                      id="customerName"
                      value={formData.customerName}
                      onChange={(e) => handleChange("customerName", e.target.value)}
                      className="border-b border-gray-400 bg-transparent rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-10"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="phone" className="text-base text-gray-700">
                      Số điện thoại
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="border-b border-gray-400 bg-transparent rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-10"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="email" className="text-base text-gray-700">
                      Email
                    </Label>
                    <Input
                      id="email"
                      value={formData.email || ""}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="border-b border-gray-400 bg-transparent rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-10"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="roomType" className="text-base text-gray-700">
                      Loại phòng
                    </Label>
                    <Select value={formData.roomType} onValueChange={(value) => handleChange("roomType", value)}>
                      <SelectTrigger
                        id="roomType"
                        className="border border-gray-400 bg-transparent rounded-md focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 h-10"
                      >
                        <SelectValue placeholder="Chọn loại phòng" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Phòng tổng thống">Phòng tổng thống</SelectItem>
                        <SelectItem value="Phòng thường">Phòng thường</SelectItem>
                        <SelectItem value="Phòng VIP">Phòng VIP</SelectItem>
                        <SelectItem value="Phòng đôi">Phòng đôi</SelectItem>
                        <SelectItem value="Phòng đơn">Phòng đơn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="checkInDate" className="text-base text-gray-700">
                        Ngày nhận phòng
                      </Label>
                      <Input
                        id="checkInDate"
                        type="date"
                        value={formData.checkInDate}
                        onChange={(e) => handleChange("checkInDate", e.target.value)}
                        className="border-b border-gray-400 bg-transparent rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 h-10 px-0 [&::-webkit-calendar-picker-indicator]:ml-auto [&::-webkit-calendar-picker-indicator]:mr-0 [&::-webkit-calendar-picker-indicator]:hover:cursor-pointer"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="checkOutDate" className="text-base text-gray-700">
                        Ngày trả phòng
                      </Label>
                      <Input
                        id="checkOutDate"
                        type="date"
                        value={formData.checkOutDate}
                        onChange={(e) => handleChange("checkOutDate", e.target.value)}
                        className="border-b border-gray-400 bg-transparent rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 h-10 px-0 [&::-webkit-calendar-picker-indicator]:ml-auto [&::-webkit-calendar-picker-indicator]:mr-0 [&::-webkit-calendar-picker-indicator]:hover:cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="advancePayment" className="text-base text-gray-700">
                        Tiền trả trước
                      </Label>
                      <Input
                        id="advancePayment"
                        value={formData.advancePayment}
                        onChange={(e) => handleChange("advancePayment", e.target.value)}
                        className="border-b border-gray-400 bg-transparent rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-right h-10"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="agreedPrice" className="text-base text-gray-700">
                        Giá thỏa thuận
                      </Label>
                      <Input
                        id="agreedPrice"
                        value={formData.agreedPrice}
                        onChange={(e) => handleChange("agreedPrice", e.target.value)}
                        className="border-b border-gray-400 bg-transparent rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-right h-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="status" className="text-base text-gray-700">
                      Trạng thái
                    </Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value: "pending" | "confirmed" | "cancelled" | "completed") => 
                        handleChange("status", value)
                      }
                    >
                      <SelectTrigger
                        id="status"
                        className="border border-gray-400 bg-transparent rounded-md focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 h-10"
                      >
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Chờ xác nhận</SelectItem>
                        <SelectItem value="confirmed">Đã xác nhận</SelectItem>
                        <SelectItem value="cancelled">Đã hủy</SelectItem>
                        <SelectItem value="completed">Đã hoàn thành</SelectItem>
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