"use client"

import { useState } from "react"
import { CustomerData } from "@/lib/customer-service"
import { Room } from "@/lib/room-service"
import { Step1_Customer } from "./step1-customer"
import { Step2_Dates } from "./step2-dates"
import { Step3_Room } from "./step3-room"
import { Step4_Confirm } from "./step4-confirm"
import { BookingUpsertDTO, createBooking } from "@/lib/booking-service"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

export type NewBookingData = {
  customer?: CustomerData
  checkIn?: string
  checkOut?: string
  room?: Room
  numberOfAdults?: number
  numberOfChildren?: number
  totalPrice?: number
}

interface NewBookingFormProps {
    onSaveSuccess: () => void;
}

export function NewBookingForm({ onSaveSuccess }: NewBookingFormProps) {
  const [step, setStep] = useState(1)
  const [bookingData, setBookingData] = useState<NewBookingData>({})
  const [isSaving, setIsSaving] = useState(false)

  const handleNext = (data: Partial<NewBookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }))
    setStep(prev => prev + 1)
  }

  const handleBack = () => {
    setStep(prev => prev - 1)
  }

  const handleSave = async (finalData: BookingUpsertDTO) => {
    setIsSaving(true);
    try {
        const newBooking = await createBooking(finalData);
        toast.success(`Đã tạo đặt phòng ${newBooking.bookingCode} thành công!`);
        onSaveSuccess();
    } catch (error: any) {
        const errorMessage = error?.data?.message || error?.message || "Đã có lỗi xảy ra."
        toast.error(`Không thể tạo đặt phòng: ${errorMessage}`);
    } finally {
        setIsSaving(false);
    }
  }

  const handleReset = () => {
    setStep(1);
    setBookingData({});
  }

  return (
    <div className="p-1">
      {isSaving && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <p>Đang xử lý...</p>
        </div>
      )}

      {step === 1 && <Step1_Customer onNext={handleNext} />}
      {step === 2 && <Step2_Dates onNext={handleNext} onBack={handleBack} />}
      {step === 3 && (
        <Step3_Room
          checkIn={bookingData.checkIn!}
          checkOut={bookingData.checkOut!}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      {step === 4 && (
        <Step4_Confirm
          bookingData={bookingData}
          onSave={handleSave}
          onBack={handleBack}
        />
      )}
      {step > 1 && !isSaving && (
          <Button variant="ghost" onClick={handleReset} className="absolute top-4 right-16">Bắt đầu lại</Button>
      )}
    </div>
  )
} 