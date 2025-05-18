"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StaffMember {
  id: string
  code: string
  name: string
  position: string
  email: string
  phone: string
  status: "active" | "inactive"
}

interface EditStaffDialogProps {
  staff: StaffMember
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (staff: StaffMember) => void
}

export function EditStaffDialog({ staff, open, onOpenChange, onSave }: EditStaffDialogProps) {
  const [formData, setFormData] = useState<StaffMember>({
    id: "",
    code: "",
    name: "",
    position: "",
    email: "",
    phone: "",
    status: "active"
  })

  useEffect(() => {
    if (staff) {
      setFormData(staff)
    }
  }, [staff])

  const handleChange = (field: keyof StaffMember, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    onSave(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-auto max-h-[90vh]">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold text-center text-blue-700">SỬA THÔNG TIN NHÂN VIÊN</DialogTitle>
            </DialogHeader>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="code" className="text-sm text-gray-600">
                    Mã nhân viên
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
                    Họ tên nhân viên <span className="text-red-500">*</span>
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
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="border-gray-300"
                    placeholder="Nhập email..."
                    required
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

              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="position" className="text-sm text-gray-600">
                  Vị trí công việc <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.position} onValueChange={(value) => handleChange("position", value)}>
                  <SelectTrigger id="position" className="border-gray-300">
                    <SelectValue placeholder="Chọn vị trí" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lễ tân">Lễ tân</SelectItem>
                    <SelectItem value="Quản lý khu vực">Quản lý khu vực</SelectItem>
                    <SelectItem value="Nhân viên dịch vụ">Nhân viên dịch vụ</SelectItem>
                    <SelectItem value="Nhân viên buồng phòng">Nhân viên buồng phòng</SelectItem>
                  </SelectContent>
                </Select>
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
