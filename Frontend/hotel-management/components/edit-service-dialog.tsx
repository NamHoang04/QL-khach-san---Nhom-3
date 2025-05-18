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

interface ServiceData {
  id: string
  code: string
  name: string
  description: string
  price: string
  status: string
}

interface EditServiceDialogProps {
  service: ServiceData
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (service: ServiceData) => void
}

export function EditServiceDialog({ service, open, onOpenChange, onSave }: EditServiceDialogProps) {
  const [formData, setFormData] = useState<ServiceData>({
    id: "",
    code: "",
    name: "",
    description: "",
    price: "",
    status: ""
  })
  
  const [errors, setErrors] = useState({
    name: false,
    price: false,
    priceFormat: false
  })

  useEffect(() => {
    if (service) {
      setFormData(service)
      // Reset errors when dialog reopens with new service
      setErrors({
        name: false,
        price: false,
        priceFormat: false
      })
    }
  }, [service])

  const handleChange = (field: keyof ServiceData, value: string) => {
    // For price field, validate that it contains only numbers, commas and periods
    if (field === 'price') {
      // Remove existing format error when field is empty or changed
      setErrors(prev => ({ ...prev, priceFormat: false }))
      
      // Only validate non-empty price values
      if (value && !/^[0-9,.]+$/.test(value)) {
        setErrors(prev => ({ ...prev, priceFormat: true }))
        toast.error(
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            <span>Giá dịch vụ chỉ được chứa số, dấu phẩy và dấu chấm</span>
          </div>
        )
        return
      }
    }
    
    setFormData((prev) => ({ ...prev, [field]: value }))
    
    // Clear error when user types in a required field
    if (field === 'name' || field === 'price') {
      setErrors(prev => ({ ...prev, [field]: false }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      name: formData.name.trim() === '',
      price: formData.price.trim() === '',
      priceFormat: formData.price.trim() !== '' && !/^[0-9,.]+$/.test(formData.price)
    }
    
    setErrors(newErrors)
    
    if (newErrors.name || newErrors.price || newErrors.priceFormat) {
      // Show error toast with X icon
      toast.error(
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-500" />
          <span>
            {newErrors.priceFormat 
              ? 'Giá dịch vụ chỉ được chứa số, dấu phẩy và dấu chấm' 
              : 'Vui lòng điền đầy đủ các trường bắt buộc'}
          </span>
        </div>
      )
      return false
    }
    
    return true
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-none">
        <div className="bg-[#ffd1dc] p-6">
          <div className="bg-[#e6f0ff] rounded-md p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl font-bold text-center">SỬA DỊCH VỤ</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="name" className="text-sm text-gray-600">
                  Tên dịch vụ <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={`border-b ${errors.name ? 'border-red-500' : 'border-gray-400'} bg-transparent rounded-none focus:border-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 px-0`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">Vui lòng nhập tên dịch vụ</p>
                )}
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="description" className="text-sm text-gray-600">
                  Mô tả
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="min-h-[80px] border-gray-400 bg-transparent rounded focus:border-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="price" className="text-sm text-gray-600">
                    Giá (VND) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    className={`border-b ${errors.price || errors.priceFormat ? 'border-red-500' : 'border-gray-400'} bg-transparent rounded-none focus:border-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 px-0`}
                  />
                  {errors.price && (
                    <p className="text-xs text-red-500 mt-1">Vui lòng nhập giá dịch vụ</p>
                  )}
                  {errors.priceFormat && (
                    <p className="text-xs text-red-500 mt-1">Giá dịch vụ chỉ được chứa số, dấu phẩy và dấu chấm</p>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="status" className="text-sm text-gray-600">
                    Trạng thái
                  </Label>
                  <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                    <SelectTrigger
                      id="status"
                      className="border-b border-gray-400 bg-transparent rounded-none focus:border-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                    >
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Đang hoạt động</SelectItem>
                      <SelectItem value="inactive">Tạm ngưng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    onOpenChange(false)
                    setErrors({ name: false, price: false, priceFormat: false })
                  }}
                  className="bg-[#f08080] hover:bg-[#e06060] text-white border-none w-24"
                >
                  HỦY
                </Button>
                <Button onClick={handleSave} className="bg-[#4169e1] hover:bg-[#3159d1] text-white w-24">
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