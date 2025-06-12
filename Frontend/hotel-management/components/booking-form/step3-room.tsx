"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Room, getRooms, RoomType, getRoomTypes } from "@/lib/room-service"
import { NewBookingData } from "./new-booking-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatCurrency } from "@/lib/utils"

interface Step3Props {
  checkIn: string
  checkOut: string
  onNext: (data: Partial<NewBookingData>) => void
  onBack: () => void
}

export function Step3_Room({ checkIn, checkOut, onNext, onBack }: Step3Props) {
  const [availableRooms, setAvailableRooms] = useState<Room[]>([])
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true)
            const [rooms, types] = await Promise.all([getRooms(), getRoomTypes()])
            // In a real app, you'd have an API endpoint to fetch rooms available for specific dates.
            // Here we filter by status for demonstration.
            setAvailableRooms(rooms.filter(r => r.status.toLowerCase() === "available"))
            setRoomTypes(types)
        } catch (error) {
            console.error("Failed to fetch room data", error)
        } finally {
            setLoading(false)
        }
    }
    fetchData()
  }, [checkIn, checkOut])

  const getRoomPrice = (room: Room) => {
    const roomType = roomTypes.find(rt => rt.id === room.roomTypeId);
    return roomType?.basePrice ?? 0;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bước 3: Chọn phòng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-72 border rounded-md">
          {loading ? (
            <p className="p-4">Đang tìm phòng trống...</p>
          ) : (
            <div className="p-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableRooms.length > 0 ? (
                availableRooms.map(room => (
                  <div
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={`p-4 rounded-lg cursor-pointer border-2 ${
                      selectedRoom?.id === room.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <h4 className="font-bold text-lg">{room.roomNumber}</h4>
                    <p className="text-gray-600">{room.roomTypeName}</p>
                    <p className="font-semibold mt-2">{formatCurrency(getRoomPrice(room))}/đêm</p>
                  </div>
                ))
              ) : (
                <p className="p-4 col-span-full text-center">Không có phòng trống trong khoảng ngày đã chọn.</p>
              )}
            </div>
          )}
        </ScrollArea>
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Quay lại
          </Button>
          <Button onClick={() => onNext({ room: selectedRoom! })} disabled={!selectedRoom}>
            Tiếp theo
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 