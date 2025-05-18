"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Customer {
  id: string
  code: string
  name: string
  email: string
  phone: string
  idCard: string
  address?: string
  gender: string
}

interface EditCustomerDialogProps {
  customer: Customer
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (customer: Customer) => void
}

export function EditCustomerDialog({ customer, open, onOpenChange, onSave }: EditCustomerDialogProps) {
  const [formData, setFormData] = useState<Customer>({
    id: "",
    code: "",
    name: "",
    email: "",
    phone: "",
    idCard: "",
    address: "",
    gender: "male"
  })

  useEffect(() => {
    if (customer) {
      setFormData(customer)
    }
  }, [customer])

  const handleChange = (field: keyof Customer, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    onSave(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold text-center text-blue-700">SỬA THÔNG TIN KHÁCH HÀNG</DialogTitle>
            </DialogHeader>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="code" className="text-sm text-gray-600">
                    Mã khách hàng
                  </Label>
                  <Input
                    id="code"
                    value={formData.code}
                    className="border-gray-300 bg-gray-100"
                    disabled
                  />
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="name" className="text-sm text-gray-600">
                    Họ tên khách hàng <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="border-gray-300"
                    placeholder="Nhập họ tên..."
                    required
                  />
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
                    value={formData.email}
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
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="border-gray-300"
                    placeholder="Nhập số điện thoại..."
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="idCard" className="text-sm text-gray-600">
                    CMND/CCCD <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="idCard"
                    value={formData.idCard}
                    onChange={(e) => handleChange("idCard", e.target.value)}
                    className="border-gray-300"
                    placeholder="Nhập số CMND/CCCD..."
                    required
                  />
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="gender" className="text-sm text-gray-600">
                    Giới tính
                  </Label>
                  <Select value={formData.gender} onValueChange={(value) => handleChange("gender", value)}>
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

              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="address" className="text-sm text-gray-600">
                  Địa chỉ
                </Label>
                <Input
                  id="address"
                  value={formData.address || ""}
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
