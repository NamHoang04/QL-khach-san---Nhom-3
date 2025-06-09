"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { StaffData, StaffCreateDTO, StaffUpdateDTO } from "@/lib/staff-service"

interface StaffDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: StaffCreateDTO | StaffUpdateDTO) => Promise<void>
  staff: StaffData | null
}

export function StaffDialog({ isOpen, onClose, onSave, staff }: StaffDialogProps) {
  const [formData, setFormData] = useState<StaffCreateDTO>({
    staffCode: '',
    userName: '',
    email: '',
    phone: '',
    position: '',
    status: 'Đang làm việc',
    password: '',
    avatarUrl: ''
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const isEditMode = !!staff;

  useEffect(() => {
    if (staff) {
      setFormData({
        userName: staff.userName,
        email: staff.email,
        phone: staff.phone,
        position: staff.position,
        status: staff.status,
        avatarUrl: staff.avatarUrl || '',
        // Edit mode specific
        staffCode: staff.staffCode, 
        password: '' // Không hiển thị password cũ
      })
    } else {
      // Reset for new staff
      setFormData({
        staffCode: '',
        userName: '',
        email: '',
        phone: '',
        position: '',
        status: 'Đang làm việc',
        password: '',
        avatarUrl: ''
      })
    }
    setErrors({})
  }, [staff, isOpen])

  const validate = () => {
    const newErrors: { [key: string]: string } = {}
    if (!isEditMode && !formData.staffCode.trim()) newErrors.staffCode = "Mã nhân viên là bắt buộc."
    if (!formData.userName.trim()) newErrors.userName = "Tên nhân viên là bắt buộc."
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Email không hợp lệ."
    if (!formData.phone.trim()) newErrors.phone = "Số điện thoại là bắt buộc."
    if (!formData.position.trim()) newErrors.position = "Chức vụ là bắt buộc."
    if (!isEditMode && !formData.password) newErrors.password = "Mật khẩu là bắt buộc."

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error("Vui lòng điền đúng và đủ thông tin.")
      return
    }

    let dataToSave: StaffCreateDTO | StaffUpdateDTO;

    if (isEditMode) {
        const { staffCode, password, ...updateData } = formData;
        dataToSave = updateData;
    } else {
        dataToSave = formData;
    }
    
    await onSave(dataToSave)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Chỉnh sửa Nhân viên" : "Thêm Nhân viên mới"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!isEditMode && (
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="staffCode" className="text-right">Mã NV</Label>
              <Input id="staffCode" value={formData.staffCode} onChange={(e) => setFormData({...formData, staffCode: e.target.value})} className="col-span-3" />
              {errors.staffCode && <p className="col-span-4 text-red-500 text-xs text-right">{errors.staffCode}</p>}
            </div>
          )}
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
            <Label htmlFor="position" className="text-right">Chức vụ</Label>
            <Input id="position" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} className="col-span-3" />
            {errors.position && <p className="col-span-4 text-red-500 text-xs text-right">{errors.position}</p>}
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">Trạng thái</Label>
             <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Đang làm việc">Đang làm việc</SelectItem>
                    <SelectItem value="Tạm nghỉ">Tạm nghỉ</SelectItem>
                </SelectContent>
            </Select>
          </div>
           {!isEditMode && (
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password"className="text-right">Mật khẩu</Label>
                <Input id="password" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="col-span-3" />
                {errors.password && <p className="col-span-4 text-red-500 text-xs text-right">{errors.password}</p>}
            </div>
           )}
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