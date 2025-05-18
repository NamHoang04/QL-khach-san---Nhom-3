"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { XCircle } from "lucide-react"

interface CustomerData {
  name: string
  email: string
  phone: string
  idCard: string
  address: string
  gender: string
}

interface NewCustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (customer: CustomerData) => void
}

export function NewCustomerDialog({ open, onOpenChange, onSave }: NewCustomerDialogProps) {
  const [customer, setCustomer] = useState<CustomerData>({
    name: "",
    email: "",
    phone: "",
    idCard: "",
    address: "",
    gender: "male"
  })
  
  const [errors, setErrors] = useState({
    name: false,
    phone: false,
    idCard: false
  })

  const handleChange = (field: keyof CustomerData, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }))
    
    // Clear error for this field if it has a value
    if (field in errors && value.trim() !== '') {
      setErrors(prev => ({ ...prev, [field]: false }))
    }
  }
  
  const validateForm = () => {
    const newErrors = {
      name: !customer.name.trim(),
      phone: !customer.phone.trim(),
      idCard: !customer.idCard.trim()
    }
    
    setErrors(newErrors)
    
    return !Object.values(newErrors).some(error => error)
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave(customer)
      onOpenChange(false)
      // Reset form
      setCustomer({
        name: "",
        email: "",
        phone: "",
        idCard: "",
        address: "",
        gender: "male"
      })
      setErrors({
        name: false,
        phone: false,
        idCard: false
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold text-center text-blue-700">THÊM KHÁCH HÀNG MỚI</DialogTitle>
            </DialogHeader>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="name" className="text-sm text-gray-600">
                    Họ tên khách hàng <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={customer.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={`border-gray-300 ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Nhập họ tên..."
                    required
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">Họ tên khách hàng là bắt buộc</p>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="gender" className="text-sm text-gray-600">
                    Giới tính
                  </Label>
                  <Select value={customer.gender} onValueChange={(value) => handleChange("gender", value)}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Nam</SelectItem>
                      <SelectItem value="female">Nữ</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="email" className="text-sm text-gray-600">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={customer.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="border-gray-300"
                    placeholder="Nhập email..."
                  />
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="phone" className="text-sm text-gray-600">
                    Số điện thoại <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    value={customer.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className={`border-gray-300 ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Nhập số điện thoại..."
                    required
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">Số điện thoại là bắt buộc</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="idCard" className="text-sm text-gray-600">
                  CMND/CCCD <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="idCard"
                  value={customer.idCard}
                  onChange={(e) => handleChange("idCard", e.target.value)}
                  className={`border-gray-300 ${errors.idCard ? 'border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Nhập số CMND/CCCD..."
                  required
                />
                {errors.idCard && (
                  <p className="text-red-500 text-xs mt-1">CMND/CCCD là bắt buộc</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="address" className="text-sm text-gray-600">
                  Địa chỉ
                </Label>
                <Input
                  id="address"
                  value={customer.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="border-gray-300"
                  placeholder="Nhập địa chỉ..."
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
                  Lưu khách hàng
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 