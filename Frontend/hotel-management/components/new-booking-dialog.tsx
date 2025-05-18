"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { BookingData } from "@/lib/booking-service"
import { toast } from "sonner"

interface NewBookingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (booking: BookingData) => void
}

export function NewBookingDialog({ open, onOpenChange, onSave }: NewBookingDialogProps) {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(today)
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(tomorrow)
  
  const [booking, setBooking] = useState<Omit<BookingData, 'id' | 'createdAt' | 'updatedAt'>>({
    customerName: "",
    phone: "",
    email: "",
    checkInDate: format(today, "yyyy-MM-dd"),
    checkOutDate: format(tomorrow, "yyyy-MM-dd"),
    advancePayment: "0đ",
    agreedPrice: "0đ",
    note: "",
    roomType: "",
    status: "pending"
  })

  const handleChange = (field: keyof Omit<BookingData, 'id' | 'createdAt' | 'updatedAt'>, value: string) => {
    setBooking((prev) => ({ ...prev, [field]: value }))
  }

  const handleCheckInDateChange = (date: Date | undefined) => {
    if (date) {
      setCheckInDate(date)
      const formattedDate = format(date, "yyyy-MM-dd")
      setBooking((prev) => ({ ...prev, checkInDate: formattedDate }))
      
      // Nếu ngày check-out sớm hơn ngày check-in mới, thì cập nhật ngày check-out
      if (checkOutDate && date > checkOutDate) {
        const newCheckoutDate = new Date(date)
        newCheckoutDate.setDate(date.getDate() + 1)
        setCheckOutDate(newCheckoutDate)
        setBooking((prev) => ({ 
          ...prev, 
          checkOutDate: format(newCheckoutDate, "yyyy-MM-dd") 
        }))
      }
    }
  }

  const handleCheckOutDateChange = (date: Date | undefined) => {
    if (date) {
      setCheckOutDate(date)
      const formattedDate = format(date, "yyyy-MM-dd")
      setBooking((prev) => ({ ...prev, checkOutDate: formattedDate }))
    }
  }

  const handleSave = () => {
    // Kiểm tra dữ liệu trước khi lưu
    if (!booking.customerName.trim()) {
      toast.error("Vui lòng nhập tên khách hàng")
      return
    }
    if (!booking.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại")
      return
    }
    if (!booking.roomType) {
      toast.error("Vui lòng chọn loại phòng")
      return
    }
    
    onSave(booking)
    toast.success("Đã tạo đặt phòng thành công!")
    
    // Reset form sau khi lưu
    setBooking({
      customerName: "",
      phone: "",
      email: "",
      checkInDate: format(today, "yyyy-MM-dd"),
      checkOutDate: format(tomorrow, "yyyy-MM-dd"),
      advancePayment: "0đ",
      agreedPrice: "0đ",
      note: "",
      roomType: "",
      status: "pending"
    })
    
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden border-2 border-[#369eff]">
        <div className="bg-[#369eff] bg-opacity-10 p-8">
          <div className="bg-white rounded-lg p-8">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-2xl font-bold text-center text-[#369eff]">ĐẶT PHÒNG MỚI</DialogTitle>
            </DialogHeader>

            <div className="grid gap-8">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="customerName" className="text-base text-gray-700">
                      Tên khách hàng <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="customerName"
                      value={booking.customerName}
                      onChange={(e) => handleChange("customerName", e.target.value)}
                      className="border-b border-gray-400 bg-transparent rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-10"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="phone" className="text-base text-gray-700">
                      Số điện thoại <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      value={booking.phone}
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
                      type="email"
                      value={booking.email || ""}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="border-b border-gray-400 bg-transparent rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-10"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="roomType" className="text-base text-gray-700">
                      Loại phòng <span className="text-red-500">*</span>
                    </Label>
                    <Select value={booking.roomType} onValueChange={(value) => handleChange("roomType", value)}>
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
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal border-b border-gray-400 bg-transparent rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-10",
                              !checkInDate && "text-gray-400"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkInDate ? format(checkInDate, "dd/MM/yyyy") : "Chọn ngày"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={checkInDate}
                            onSelect={handleCheckInDateChange}
                            initialFocus
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="checkOutDate" className="text-base text-gray-700">
                        Ngày trả phòng
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal border-b border-gray-400 bg-transparent rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-10",
                              !checkOutDate && "text-gray-400"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkOutDate ? format(checkOutDate, "dd/MM/yyyy") : "Chọn ngày"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={checkOutDate}
                            onSelect={handleCheckOutDateChange}
                            initialFocus
                            disabled={(date) => checkInDate ? date <= checkInDate : date <= new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="grid grid-cols-1 gap-2">
                      <Label htmlFor="advancePayment" className="text-base text-gray-700">
                        Tiền trả trước
                      </Label>
                      <Input
                        id="advancePayment"
                        value={booking.advancePayment}
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
                        value={booking.agreedPrice}
                        onChange={(e) => handleChange("agreedPrice", e.target.value)}
                        className="border-b border-gray-400 bg-transparent rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 px-0 text-right h-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="note" className="text-base text-gray-700">
                  Ghi chú
                </Label>
                <Input
                  id="note"
                  value={booking.note}
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
