"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { XCircle } from "lucide-react"

interface StaffData {
  code: string
  name: string
  email: string
  phone: string
  position: string
  startDate: string
  status: string
  password: string
  confirmPassword: string
}

interface NewStaffDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (staff: StaffData) => void
}

export function NewStaffDialog({ open, onOpenChange, onSave }: NewStaffDialogProps) {
  const [staff, setStaff] = useState<StaffData>({
    code: "",
    name: "",
    email: "",
    phone: "",
    position: "",
    startDate: new Date().toISOString().split('T')[0],
    status: "active",
    password: "",
    confirmPassword: ""
  })
  
  const [errors, setErrors] = useState({
    code: false,
    name: false,
    email: false,
    phone: false,
    position: false,
    password: false,
    confirmPassword: false,
    passwordMatch: false
  })

  const handleChange = (field: keyof StaffData, value: string) => {
    setStaff((prev) => ({ ...prev, [field]: value }))
    
    // Clear error for this field
    if (field in errors) {
      setErrors(prev => ({ ...prev, [field]: false }))
    }
    
    // Check password match if changing either password field
    if (field === 'password' || field === 'confirmPassword') {
      const otherField = field === 'password' ? 'confirmPassword' : 'password'
      const otherValue = field === 'password' ? staff.confirmPassword : staff.password
      
      if (value && otherValue && value !== otherValue) {
        setErrors(prev => ({ ...prev, passwordMatch: true }))
      } else {
        setErrors(prev => ({ ...prev, passwordMatch: false }))
      }
    }
  }
  
  const validateForm = () => {
    const newErrors = {
      code: !staff.code.trim(),
      name: !staff.name.trim(),
      email: !staff.email.trim(),
      phone: !staff.phone.trim(),
      position: !staff.position.trim(),
      password: !staff.password.trim(),
      confirmPassword: !staff.confirmPassword.trim(),
      passwordMatch: staff.password !== staff.confirmPassword
    }
    
    setErrors(newErrors)
    
    return !Object.values(newErrors).some(error => error)
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave(staff)
      onOpenChange(false)
      // Reset form
      setStaff({
        code: "",
        name: "",
        email: "",
        phone: "",
        position: "",
        startDate: new Date().toISOString().split('T')[0],
        status: "active",
        password: "",
        confirmPassword: ""
      })
      setErrors({
        code: false,
        name: false,
        email: false,
        phone: false,
        position: false,
        password: false,
        confirmPassword: false,
        passwordMatch: false
      })
    } else {
      // Show validation error toast
      toast.error(
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-500" />
          <span>Vui lòng điền đầy đủ thông tin và kiểm tra mật khẩu!</span>
        </div>
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-auto max-h-[90vh]">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold text-center text-blue-700">THÊM NHÂN VIÊN MỚI</DialogTitle>
            </DialogHeader>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="code" className="text-sm text-gray-600">
                    Mã nhân viên <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="code"
                    value={staff.code}
                    onChange={(e) => handleChange("code", e.target.value)}
                    className={`border-gray-300 ${errors.code ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Nhập mã nhân viên..."
                    required
                  />
                  {errors.code && (
                    <p className="text-red-500 text-xs mt-1">Mã nhân viên là bắt buộc</p>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="name" className="text-sm text-gray-600">
                    Họ tên nhân viên <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={staff.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className={`border-gray-300 ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Nhập họ tên..."
                    required
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">Họ tên nhân viên là bắt buộc</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="email" className="text-sm text-gray-600">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={staff.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className={`border-gray-300 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Nhập email..."
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">Email là bắt buộc</p>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="phone" className="text-sm text-gray-600">
                    Số điện thoại <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    value={staff.phone}
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

              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="position" className="text-sm text-gray-600">
                    Vị trí công việc <span className="text-red-500">*</span>
                  </Label>
                  <Select value={staff.position} onValueChange={(value) => handleChange("position", value)}>
                    <SelectTrigger 
                      id="position" 
                      className={`border-gray-300 ${errors.position ? 'border-red-500 focus:ring-red-500' : ''}`}
                    >
                      <SelectValue placeholder="Chọn vị trí" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="receptionist">Lễ tân</SelectItem>
                      <SelectItem value="manager">Quản lý</SelectItem>
                      <SelectItem value="service">Nhân viên dịch vụ</SelectItem>
                      <SelectItem value="housekeeping">Nhân viên buồng phòng</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.position && (
                    <p className="text-red-500 text-xs mt-1">Vị trí công việc là bắt buộc</p>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="startDate" className="text-sm text-gray-600">
                    Ngày bắt đầu
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={staff.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                    className="border-gray-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="status" className="text-sm text-gray-600">
                  Trạng thái
                </Label>
                <Select value={staff.status} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger id="status" className="border-gray-300">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Đang làm việc</SelectItem>
                    <SelectItem value="inactive">Tạm nghỉ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-md font-medium mb-4">Thông tin đăng nhập</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="password" className="text-sm text-gray-600">
                      Mật khẩu <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={staff.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      className={`border-gray-300 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Nhập mật khẩu..."
                      required
                    />
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-1">Mật khẩu là bắt buộc</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <Label htmlFor="confirmPassword" className="text-sm text-gray-600">
                      Nhập lại mật khẩu <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={staff.confirmPassword}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                      className={`border-gray-300 ${errors.confirmPassword || errors.passwordMatch ? 'border-red-500 focus:ring-red-500' : ''}`}
                      placeholder="Nhập lại mật khẩu..."
                      required
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-1">Nhập lại mật khẩu là bắt buộc</p>
                    )}
                    {!errors.confirmPassword && errors.passwordMatch && (
                      <p className="text-red-500 text-xs mt-1">Mật khẩu nhập lại không khớp</p>
                    )}
                  </div>
                </div>
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
                  Lưu nhân viên
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 