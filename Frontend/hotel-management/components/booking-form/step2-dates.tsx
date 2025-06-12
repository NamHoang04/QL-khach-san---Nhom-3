"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NewBookingData } from "./new-booking-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

interface Step2Props {
  onNext: (data: Partial<NewBookingData>) => void
  onBack: () => void
}

export function Step2_Dates({ onNext, onBack }: Step2Props) {
  const [checkIn, setCheckIn] = useState(format(new Date(), "yyyy-MM-dd"))
  const [checkOut, setCheckOut] = useState(
    format(new Date(new Date().setDate(new Date().getDate() + 1)), "yyyy-MM-dd")
  )
  const [error, setError] = useState("")

  const handleNext = () => {
    if (new Date(checkOut) <= new Date(checkIn)) {
      setError("Ngày trả phòng phải sau ngày nhận phòng.")
      return
    }
    setError("")
    onNext({ checkIn, checkOut })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bước 2: Chọn ngày</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="checkin">Ngày nhận phòng</Label>
            <Input
              id="checkin"
              type="date"
              value={checkIn}
              onChange={e => setCheckIn(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="checkout">Ngày trả phòng</Label>
            <Input
              id="checkout"
              type="date"
              value={checkOut}
              onChange={e => setCheckOut(e.target.value)}
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex justify-between">
          <Button variant="outline" onClick={onBack}>
            Quay lại
          </Button>
          <Button onClick={handleNext}>Tiếp theo</Button>
        </div>
      </CardContent>
    </Card>
  )
} 