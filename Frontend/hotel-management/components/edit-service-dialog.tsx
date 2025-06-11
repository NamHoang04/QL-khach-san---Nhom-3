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
import { formatCurrency, parseCurrency } from "@/lib/utils"

interface ServiceData {
  id: string
  code: string
  name: string
  description: string
  price: number
  status: string
}

interface EditServiceDialogProps {
  service: Omit<ServiceData, 'price'> & { price: string }
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (service: Omit<ServiceData, 'price'> & { price: string }) => void
}

export function EditServiceDialog({ service, open, onOpenChange, onSave }: EditServiceDialogProps) {
  const [formData, setFormData] = useState<ServiceData>({
    id: "",
    code: "",
    name: "",
    description: "",
    price: 0,
    status: ""
  })
  
  const [errors, setErrors] = useState({
    name: false,
    price: false,
  })

  useEffect(() => {
    if (service) {
      setFormData({...service, price: parseCurrency(service.price)})
      // Reset errors when dialog reopens with new service
      setErrors({
        name: false,
        price: false,
      })
    }
  }, [service])

  const handleChange = (field: 'name' | 'description' | 'status', value: string) => {
    setFormData((prev) => ({ ...prev, [field as any]: value }))
    
    if (field === 'name') {
      setErrors(prev => ({ ...prev, name: false }))
    }
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsedValue = parseCurrency(value);
    setFormData((prev) => ({ ...prev, price: parsedValue }));
    if (parsedValue > 0) {
        setErrors(prev => ({...prev, price: false}));
    }
  }

  const validateForm = () => {
    const newErrors = {
      name: formData.name.trim() === '',
      price: !formData.price || formData.price <= 0,
    }
    
    setErrors(newErrors)
    
    if (newErrors.name || newErrors.price) {
      toast.error(
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-500" />
          <span>
            Vui lòng điền đầy đủ các trường bắt buộc và giá phải lớn hơn 0
          </span>
        </div>
      )
      return false
    }
    
    return true
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave({...formData, price: formData.price.toString()})
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
                    value={formatCurrency(formData.price)}
                    onChange={handlePriceChange}
                    className={`border-b ${errors.price ? 'border-red-500' : 'border-gray-400'} bg-transparent rounded-none focus:border-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 px-0`}
                  />
                  {errors.price && (
                    <p className="text-xs text-red-500 mt-1">Vui lòng nhập giá dịch vụ hợp lệ</p>
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
                    setErrors({ name: false, price: false })
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