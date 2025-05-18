"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { XCircle } from "lucide-react"

interface Room {
  id: string
  roomNumber: string
  roomType: string
  floor: string
  price: string
  status: "available" | "occupied" | "maintenance"
  description?: string
}

interface EditRoomDialogProps {
  room: Room
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (room: Room) => void
}

export function EditRoomDialog({ room, open, onOpenChange, onSave }: EditRoomDialogProps) {
  const [formData, setFormData] = useState<Room>({
    id: "",
    roomNumber: "",
    roomType: "",
    floor: "",
    price: "",
    status: "available",
    description: ""
  })
  
  const [errors, setErrors] = useState({
    roomNumber: false,
    roomType: false,
    floor: false,
    price: false,
    priceInvalid: false
  })

  useEffect(() => {
    if (room) {
      setFormData(room)
      // Reset errors when room data changes
      setErrors({
        roomNumber: false,
        roomType: false,
        floor: false,
        price: false,
        priceInvalid: false
      })
    }
  }, [room])

  const handleChange = (field: keyof Room, value: string) => {
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
    
    setFormData((prev) => ({ ...prev, [field]: value }))
    
    // Clear error when field is filled
    if (field in errors) {
      setErrors(prev => ({ ...prev, [field]: false }))
    }
  }
  
  const validateForm = () => {
    const newErrors = {
      roomNumber: !formData.roomNumber.trim(),
      roomType: !formData.roomType.trim(),
      floor: !formData.floor.trim(),
      price: !formData.price.trim(),
      priceInvalid: formData.price.trim() !== "" && !/^[0-9,]+$/.test(formData.price)
    }
    
    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error)
  }
  
  // Format the price with proper thousand separators
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
    if (formData.price) {
      setFormData(prev => ({ ...prev, price: formatPrice(formData.price) }))
    }
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData)
      onOpenChange(false)
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold text-center text-blue-700">CHỈNH SỬA THÔNG TIN PHÒNG</DialogTitle>
            </DialogHeader>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="roomNumber" className="text-sm text-gray-600">
                    Mã phòng <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="roomNumber"
                    value={formData.roomNumber}
                    onChange={(e) => handleChange("roomNumber", e.target.value)}
                    className={`border-gray-300 ${errors.roomNumber ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Nhập mã phòng..."
                    required
                  />
                  {errors.roomNumber && (
                    <p className="text-red-500 text-xs mt-1">Mã phòng là bắt buộc</p>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="floor" className="text-sm text-gray-600">
                    Tầng <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="floor"
                    value={formData.floor}
                    onChange={(e) => handleChange("floor", e.target.value)}
                    className={`border-gray-300 ${errors.floor ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Nhập tầng..."
                    required
                  />
                  {errors.floor && (
                    <p className="text-red-500 text-xs mt-1">Tầng là bắt buộc</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="roomType" className="text-sm text-gray-600">
                    Loại phòng <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.roomType} onValueChange={(value) => handleChange("roomType", value)}>
                    <SelectTrigger className={`border-gray-300 ${errors.roomType ? 'border-red-500 focus:ring-red-500' : ''}`}>
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
                  <Label htmlFor="price" className="text-sm text-gray-600">
                    Giá (VNĐ/đêm) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    onBlur={handlePriceBlur}
                    className={`border-gray-300 ${errors.price || errors.priceInvalid ? 'border-red-500 focus:ring-red-500' : ''}`}
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

              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="status" className="text-sm text-gray-600">
                  Trạng thái <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: "available" | "occupied" | "maintenance") => 
                    handleChange("status", value)
                  }
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Sẵn sàng</SelectItem>
                    <SelectItem value="occupied">Đang sử dụng</SelectItem>
                    <SelectItem value="maintenance">Bảo trì</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="description" className="text-sm text-gray-600">
                  Mô tả
                </Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="border-gray-300 min-h-[100px]"
                  placeholder="Nhập mô tả phòng..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Hủy bỏ
                </Button>
                <Button 
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 