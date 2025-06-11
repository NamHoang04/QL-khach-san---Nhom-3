"use client"

import { useEffect, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
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
    fullName: '',
    email: '',
    phone: '',
    position: '',
    status: 'Đang làm việc',
    password: '',
    avatarUrl: ''
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const isEditMode = !!staff;

  useEffect(() => {
    if (staff) {
      setFormData({
        userName: staff.userName,
        fullName: staff.fullName,
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
        fullName: '',
        email: '',
        phone: '',
        position: '',
        status: 'Đang làm việc',
        password: '',
        avatarUrl: ''
      })
    }
    setErrors({})
    setShowPassword(false)
    setIsChangingPassword(false)
  }, [staff, isOpen])

  const validate = () => {
    const newErrors: { [key: string]: string } = {}
    if (!isEditMode && !formData.staffCode.trim()) newErrors.staffCode = "Mã nhân viên là bắt buộc."
    if (!formData.userName.trim()) newErrors.userName = "Username là bắt buộc."
    if (!formData.fullName.trim()) newErrors.fullName = "Họ và tên là bắt buộc."
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = "Email không hợp lệ."
    if (!formData.phone.trim()) newErrors.phone = "Số điện thoại là bắt buộc."
    if (!formData.position.trim()) newErrors.position = "Chức vụ là bắt buộc."
    if (!isEditMode && !formData.password) newErrors.password = "Mật khẩu là bắt buộc."
    if (isChangingPassword) {
      if (!formData.password) {
        newErrors.password = "Mật khẩu mới không được để trống.";
      } else if (formData.password.length < 6) {
        newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
      }
    }

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
        const { staffCode, ...updateData } = formData;
        if (!isChangingPassword) {
          // If not changing password, don't send the password field
          delete updateData.password;
        }
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
            <Label htmlFor="fullName" className="text-right">Họ và tên</Label>
            <Input id="fullName" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} className="col-span-3" />
            {errors.fullName && <p className="col-span-4 text-red-500 text-xs text-right">{errors.fullName}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="userName" className="text-right">Username</Label>
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
            <Select value={formData.position} onValueChange={(value) => setFormData({ ...formData, position: value })}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Chọn chức vụ" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="reception">reception</SelectItem>
                    <SelectItem value="cleaning">cleaning</SelectItem>
                    <SelectItem value="customer service">customer service</SelectItem>
                </SelectContent>
            </Select>
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
           {isEditMode && !isChangingPassword && (
            <div className="grid grid-cols-4 items-center gap-4">
              <div className="col-start-2 col-span-3">
                <Button variant="link" onClick={() => setIsChangingPassword(true)} className="p-0 h-auto">
                  Đổi mật khẩu
                </Button>
              </div>
            </div>
           )}
           {(!isEditMode || isChangingPassword) && (
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password"className="text-right">{isEditMode ? "Mật khẩu mới" : "Mật khẩu"}</Label>
                <div className="col-span-3 relative">
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    value={formData.password} 
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    className="pr-10"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-1/2 right-2 -translate-y-1/2 h-7 w-7 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
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