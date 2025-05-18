"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { XCircle } from "lucide-react"

interface RoomData {
  id?: string
  roomNumber: string
  floor: string
  roomType: string
  price: string
  status: string
  description?: string
}

interface NewRoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (room: RoomData) => void
}

export function NewRoomDialog({ open, onOpenChange, onSave }: NewRoomDialogProps) {
  const [room, setRoom] = useState<RoomData>({
    roomNumber: "",
    floor: "1",
    roomType: "",
    price: "",
    status: "available",
    description: ""
  })
  
  const [errors, setErrors] = useState({
    roomNumber: false,
    roomType: false,
    price: false,
    priceInvalid: false
  })

  const handleChange = (field: keyof RoomData, value: string) => {
    // Special handling for price field
    if (field === 'price') {
      // Only allow numbers and commas
      if (value && !/^[0-9,]+$/.test(value)) {
        setErrors(prev => ({ ...prev, priceInvalid: true }))
        
        toast.error(
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            <span>Giá phòng chỉ được nhập số!</span>
          </div>
        )
        return
      } else {
        setErrors(prev => ({ ...prev, priceInvalid: false }))
      }
    }
    
    setRoom((prev) => ({ ...prev, [field]: value }))
    
    // Clear error when field is filled
    if (field in errors) {
      setErrors(prev => ({ ...prev, [field]: false }))
    }
  }
  
  const validateForm = () => {
    const newErrors = {
      roomNumber: !room.roomNumber.trim(),
      roomType: !room.roomType.trim(),
      price: !room.price.trim(),
      priceInvalid: room.price.trim() !== "" && !/^[0-9,]+$/.test(room.price)
    }
    
    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error)
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave(room)
      onOpenChange(false)
      
      // Reset form
      setRoom({
        roomNumber: "",
        floor: "1",
        roomType: "",
        price: "",
        status: "available",
        description: ""
      })
      
      setErrors({
        roomNumber: false,
        roomType: false,
        price: false,
        priceInvalid: false
      })
    } else {
      // Show validation error toast
      toast.error(
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-500" />
          <span>Vui lòng điền đầy đủ thông tin bắt buộc!</span>
        </div>
      )
    }
  }

  // Format the price with proper thousand separators if needed
  const formatPrice = (value: string) => {
    if (!value) return value
    
    // Remove non-numeric characters except commas
    const numericValue = value.replace(/[^0-9,]/g, '')
    
    // Remove existing commas
    const withoutCommas = numericValue.replace(/,/g, '')
    
    // Add commas for thousands
    let formattedValue = ''
    for (let i = 0; i < withoutCommas.length; i++) {
      if (i > 0 && (withoutCommas.length - i) % 3 === 0) {
        formattedValue += ','
      }
      formattedValue += withoutCommas[i]
    }
    
    return formattedValue
  }

  const handlePriceBlur = () => {
    if (room.price) {
      setRoom(prev => ({ ...prev, price: formatPrice(room.price) }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden border-2 border-[#369eff]">
        <div className="bg-[#369eff] bg-opacity-10 p-8">
          <div className="bg-white rounded-lg p-8">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-2xl font-bold text-center text-[#369eff]">THÊM PHÒNG MỚI</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="roomNumber" className="text-base text-gray-700">
                    Số phòng <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="roomNumber"
                    value={room.roomNumber}
                    onChange={(e) => handleChange("roomNumber", e.target.value)}
                    className={`border-b ${errors.roomNumber ? 'border-red-500' : 'border-gray-400'} bg-transparent rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 h-10 px-0`}
                    placeholder="Nhập số phòng..."
                    required
                  />
                  {errors.roomNumber && (
                    <p className="text-red-500 text-xs mt-1">Số phòng là bắt buộc</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="floor" className="text-base text-gray-700">
                    Tầng
                  </Label>
                  <Input
                    id="floor"
                    type="number"
                    value={room.floor}
                    onChange={(e) => handleChange("floor", e.target.value)}
                    className="border-b border-gray-400 bg-transparent rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 h-10 px-0"
                    placeholder="Nhập tầng..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="roomType" className="text-base text-gray-700">
                    Loại phòng <span className="text-red-500">*</span>
                  </Label>
                  <Select value={room.roomType} onValueChange={(value) => handleChange("roomType", value)}>
                    <SelectTrigger 
                      className={`border-b ${errors.roomType ? 'border-red-500' : 'border-gray-400'} bg-transparent rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 h-10 px-0`}
                    >
                      <SelectValue placeholder="Chọn loại phòng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Phòng Standard</SelectItem>
                      <SelectItem value="deluxe">Phòng Deluxe</SelectItem>
                      <SelectItem value="suite">Phòng Suite</SelectItem>
                      <SelectItem value="family">Phòng Family</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.roomType && (
                    <p className="text-red-500 text-xs mt-1">Loại phòng là bắt buộc</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="price" className="text-base text-gray-700">
                    Giá (VNĐ/đêm) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    value={room.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    onBlur={handlePriceBlur}
                    className={`border-b ${errors.price || errors.priceInvalid ? 'border-red-500' : 'border-gray-400'} bg-transparent rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 h-10 px-0`}
                    placeholder="Nhập giá phòng..."
                    required
                  />
                  {errors.price && (
                    <p className="text-red-500 text-xs mt-1">Giá phòng là bắt buộc</p>
                  )}
                  {errors.priceInvalid && (
                    <p className="text-red-500 text-xs mt-1">Giá phòng chỉ được nhập số</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="status" className="text-base text-gray-700">
                    Trạng thái
                  </Label>
                  <Select value={room.status} onValueChange={(value) => handleChange("status", value)}>
                    <SelectTrigger className="border-b border-gray-400 bg-transparent rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 h-10 px-0">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Sẵn sàng</SelectItem>
                      <SelectItem value="occupied">Đang sử dụng</SelectItem>
                      <SelectItem value="maintenance">Bảo trì</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="description" className="text-base text-gray-700">
                  Mô tả
                </Label>
                <Input
                  id="description"
                  value={room.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="border-b border-gray-400 bg-transparent rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 h-10 px-0"
                  placeholder="Nhập mô tả phòng..."
                />
              </div>

              <div className="flex justify-end space-x-3 mt-8">
                <Button 
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Hủy bỏ
                </Button>
                <Button 
                  onClick={handleSave}
                  className="bg-[#369eff] hover:bg-blue-600 text-white"
                >
                  Lưu phòng
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 