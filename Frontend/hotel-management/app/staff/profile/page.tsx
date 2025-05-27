"use client"

import { useState } from "react"
import { AuthGuard } from "@/components/auth-guard"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function StaffProfilePage() {
  const [fullName, setFullName] = useState("Nguyễn Văn Nhân viên")
  const [email, setEmail] = useState("nhanvien@example.com")
  const [phone, setPhone] = useState("0901234567")
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    // Here you would normally save the updated profile info to backend
    toast.success("Thông tin cá nhân đã được cập nhật!")
    setIsEditing(false)
  }

  return (
    <AuthGuard requiredRole="staff">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Thông tin cá nhân</h1>
        <div className="mb-4">
          <label className="block font-medium mb-1">Họ và tên</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div className="mb-4">
          <label className="block font-medium mb-1">Số điện thoại</label>
          <input
            type="tel"
            className="w-full border rounded px-3 py-2"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!isEditing}
          />
        </div>
        <div>
          {isEditing ? (
            <>
              <Button onClick={handleSave} className="mr-2">Lưu</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Hủy</Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}
