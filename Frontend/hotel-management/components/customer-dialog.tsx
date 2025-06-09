"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { CustomerData, CustomerUpsertDTO } from "@/lib/customer-service"

interface CustomerDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: CustomerUpsertDTO) => Promise<void>
  customer: CustomerData | null
}

export function CustomerDialog({ isOpen, onClose, onSave, customer }: CustomerDialogProps) {
  const [formData, setFormData] = useState<CustomerUpsertDTO>({
    customerCode: '',
    userName: '',
    email: '',
    phone: '',
    identityNumber: '',
    address: ''
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (customer) {
      setFormData({
        customerCode: customer.customerCode,
        userName: customer.userName,
        email: customer.email,
        phone: customer.phone,
        identityNumber: customer.identityNumber || '',
        address: customer.address || ''
      })
    } else {
      setFormData({
        customerCode: '',
        userName: '',
        email: '',
        phone: '',
        identityNumber: '',
        address: ''
      })
    }
    setErrors({})
  }, [customer, isOpen])

  const validate = () => {
    const newErrors: { [key: string]: string } = {}
    if (!formData.customerCode.trim()) newErrors.customerCode = "Mã khách hàng là bắt buộc."
    if (!formData.userName.trim()) newErrors.userName = "Tên khách hàng là bắt buộc."
    if (!formData.phone.trim()) newErrors.phone = "Số điện thoại là bắt buộc."
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
        newErrors.email = "Email không hợp lệ."
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error("Vui lòng điền đúng và đủ các thông tin bắt buộc.")
      return
    }
    await onSave(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{customer ? "Chỉnh sửa Khách hàng" : "Thêm Khách hàng mới"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="customerCode" className="text-right">Mã KH</Label>
            <Input id="customerCode" value={formData.customerCode} onChange={(e) => setFormData({...formData, customerCode: e.target.value})} className="col-span-3" />
            {errors.customerCode && <p className="col-span-4 text-red-500 text-xs text-right">{errors.customerCode}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="userName" className="text-right">Họ Tên</Label>
            <Input id="userName" value={formData.userName} onChange={(e) => setFormData({...formData, userName: e.target.value})} className="col-span-3" />
            {errors.userName && <p className="col-span-4 text-red-500 text-xs text-right">{errors.userName}</p>}
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="col-span-3" />
             {errors.email && <p className="col-span-4 text-red-500 text-xs text-right">{errors.email}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">SĐT</Label>
            <Input id="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="col-span-3" />
             {errors.phone && <p className="col-span-4 text-red-500 text-xs text-right">{errors.phone}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="identityNumber" className="text-right">CCCD/CMND</Label>
            <Input id="identityNumber" value={formData.identityNumber || ''} onChange={(e) => setFormData({...formData, identityNumber: e.target.value})} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">Địa chỉ</Label>
            <Input id="address" value={formData.address || ''} onChange={(e) => setFormData({...formData, address: e.target.value})} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Hủy</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit}>Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 