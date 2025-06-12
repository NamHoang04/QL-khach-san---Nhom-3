"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { NewBookingData } from "./new-booking-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BookingUpsertDTO } from "@/lib/booking-service"
import { formatCurrency } from "@/lib/utils"
import { differenceInDays, format } from "date-fns"
import { getRoomTypes, RoomType } from "@/lib/room-service"

interface Step4Props {
  bookingData: NewBookingData
  onSave: (data: BookingUpsertDTO) => void
  onBack: () => void
}

export function Step4_Confirm({ bookingData, onSave, onBack }: Step4Props) {
  const [numberOfAdults, setNumberOfAdults] = useState(1)
  const [numberOfChildren, setNumberOfChildren] = useState(0)
  const [note, setNote] = useState("")
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])

  useEffect(() => {
    getRoomTypes().then(setRoomTypes)
  }, [])
  
  const { customer, checkIn, checkOut, room } = bookingData

  const roomType = roomTypes.find(rt => rt.id === room?.roomTypeId)
  const pricePerNight = roomType?.basePrice ?? 0
  const nights = (checkIn && checkOut) ? differenceInDays(new Date(checkOut), new Date(checkIn)) : 0
  const totalPrice = pricePerNight * nights

  const handleSubmit = () => {
    if (!customer || !checkIn || !checkOut || !room || !room.id) return

    const finalData: BookingUpsertDTO = {
      customerId: customer.id,
      roomId: parseInt(room.id, 10),
      checkIn,
      checkOut,
      numberOfAdults,
      numberOfChildren,
      note,
      totalPrice: totalPrice,
      status: "Confirmed", // Or 'Pending',
    }
    onSave(finalData)
  }

  if (!customer || !checkIn || !checkOut || !room) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lỗi Dữ liệu</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Thiếu thông tin để tạo đặt phòng. Vui lòng quay lại.</p>
          <Button variant="outline" onClick={onBack} className="mt-4">
            Quay lại
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bước 4: Xác nhận thông tin</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">Chi tiết đặt phòng</h3>
          <div className="p-4 border rounded-md space-y-2 bg-gray-50">
            <p><strong>Khách hàng:</strong> {customer.userName} ({customer.email})</p>
            <p><strong>Nhận phòng:</strong> {format(new Date(checkIn), 'dd/MM/yyyy')}</p>
            <p><strong>Trả phòng:</strong> {format(new Date(checkOut), 'dd/MM/yyyy')}</p>
            <p><strong>Phòng:</strong> {room.roomNumber} - {room.roomTypeName}</p>
            <p className="font-bold text-xl"><strong>Tổng cộng:</strong> {formatCurrency(totalPrice)} ({nights} đêm)</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="adults">Số người lớn</Label>
            <Input id="adults" type="number" value={numberOfAdults} min={1} onChange={e => setNumberOfAdults(parseInt(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="children">Số trẻ em</Label>
            <Input id="children" type="number" value={numberOfChildren} min={0} onChange={e => setNumberOfChildren(parseInt(e.target.value))} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="note">Ghi chú</Label>
          <Textarea id="note" value={note} onChange={e => setNote(e.target.value)} placeholder="Yêu cầu đặc biệt..." />
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Quay lại
          </Button>
          <Button onClick={handleSubmit}>Hoàn tất đặt phòng</Button>
        </div>
      </CardContent>
    </Card>
  )
} 