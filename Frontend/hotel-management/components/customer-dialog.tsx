"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { CustomerData, CustomerUpsertDTO } from "@/lib/customer-service"
import { Separator } from "@/components/ui/separator"

interface CustomerDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CustomerUpsertDTO) => Promise<void>
  customer: CustomerData | null
  isSaving: boolean
  serverErrors?: { [key: string]: string };
}

export function CustomerDialog({ isOpen, onClose, onSave, customer, isSaving, serverErrors }: CustomerDialogProps) {
  const [formData, setFormData] = useState<Partial<CustomerUpsertDTO>>({
    customerCode: '',
    userName: '',
    fullName: '',
    email: '',
    phone: '',
    identityNumber: '',
    address: '',
    password: '',
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (customer) {
      setFormData({
        customerCode: customer.customerCode,
        userName: customer.userName,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        identityNumber: customer.identityNumber || '',
        address: customer.address || '',
        password: '',
      })
    } else {
      setFormData({
        customerCode: '',
        userName: '',
        fullName: '',
        email: '',
        phone: '',
        identityNumber: '',
        address: '',
        password: '',
      })
    }
    setErrors({})
  }, [customer, isOpen])

  useEffect(() => {
    if (serverErrors) {
      setErrors(prev => ({...prev, ...serverErrors}));
    }
  }, [serverErrors]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {}
    if (!formData.customerCode?.trim()) newErrors.customerCode = "Mã khách hàng là bắt buộc.";
    if (!formData.fullName?.trim()) newErrors.fullName = "Họ tên đầy đủ là bắt buộc."
    if (!formData.userName?.trim()) newErrors.userName = "Tên đăng nhập là bắt buộc."
    if (!customer && !formData.password) { // Password is required only for new customers
        newErrors.password = "Mật khẩu là bắt buộc khi tạo mới."
    }
    if (!formData.phone?.trim()) newErrors.phone = "Số điện thoại là bắt buộc."
    if (!formData.email?.trim() || !/^\S+@\S+\.\S+$/.test(formData.email || '')) {
        newErrors.email = "Email không hợp lệ."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof CustomerUpsertDTO, value: string) => {
    setFormData(prev => ({...prev, [field]: value}))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      })
    }
  }

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error("Vui lòng điền đúng và đủ các thông tin bắt buộc.")
      return
    }

    const dataToSave: CustomerUpsertDTO = {
      customerCode: formData.customerCode || "",
      fullName: formData.fullName || "",
      userName: formData.userName || "",
      email: formData.email || "",
      phone: formData.phone || "",
      identityNumber: formData.identityNumber || undefined,
      address: formData.address || undefined,
      password: formData.password || undefined,
    };
    
    await onSave(dataToSave)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{customer ? "Chỉnh sửa Khách hàng" : "Thêm Khách hàng mới"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          
          <h3 className="text-md font-semibold text-gray-700">Thông tin cá nhân</h3>
          <div>
              <Label htmlFor="customerCode">Mã khách hàng</Label>
              <Input id="customerCode" value={formData.customerCode || ''} onChange={(e) => handleInputChange('customerCode', e.target.value)} disabled={!!customer} />
              {errors.customerCode && <p className="text-red-500 text-xs mt-1">{errors.customerCode}</p>}
            </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Họ và Tên</Label>
              <Input id="fullName" value={formData.fullName} onChange={(e) => handleInputChange('fullName', e.target.value)} />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input id="phone" value={formData.phone} onChange={(e) => handleInputChange('phone', e.target.value)} />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <Label htmlFor="identityNumber">CCCD/CMND</Label>
              <Input id="identityNumber" value={formData.identityNumber || ''} onChange={(e) => handleInputChange('identityNumber', e.target.value)} />
            </div>
            <div>
              <Label htmlFor="address">Địa chỉ</Label>
              <Input id="address" value={formData.address || ''} onChange={(e) => handleInputChange('address', e.target.value)} />
            </div>
          </div>
          
          <Separator className="my-4" />

          <h3 className="text-md font-semibold text-gray-700">Thông tin tài khoản</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="userName">Tên đăng nhập</Label>
              <Input id="userName" value={formData.userName} onChange={(e) => handleInputChange('userName', e.target.value)} />
              {errors.userName && <p className="text-red-500 text-xs mt-1">{errors.userName}</p>}
            </div>
            <div>
              <Label htmlFor="password">Mật khẩu</Label>
              <Input id="password" type="password" placeholder={customer ? "Để trống nếu không đổi" : ""} onChange={(e) => handleInputChange('password', e.target.value)} />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">Hủy</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 