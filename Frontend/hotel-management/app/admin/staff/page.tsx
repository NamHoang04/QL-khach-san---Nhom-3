"use client"

import { useState } from "react"
import { Search, CheckCircle } from "lucide-react"
import { NewStaffDialog } from "@/components/new-staff-dialog"
import { EditStaffDialog } from "@/components/edit-staff-dialog"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface StaffMember {
  id: string
  code: string
  name: string
  position: string
  email: string
  phone: string
  status: "active" | "inactive"
}

export default function AdminStaffManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)
  
  // Sample staff data
  const [staffList, setStaffList] = useState<StaffMember[]>([
    {
      id: "1",
      code: "NV001",
      name: "Nguyễn Thị Hương",
      position: "Lễ tân",
      email: "huong.nguyen@hotel.com",
      phone: "0901234567",
      status: "active"
    },
    {
      id: "2",
      code: "NV002",
      name: "Trần Văn Minh",
      position: "Quản lý khu vực",
      email: "minh.tran@hotel.com",
      phone: "0912345678",
      status: "active"
    },
    {
      id: "3",
      code: "NV003",
      name: "Lê Thị Mai",
      position: "Nhân viên dịch vụ",
      email: "mai.le@hotel.com",
      phone: "0987654321",
      status: "inactive"
    }
  ])

  const handleAddStaff = (staffData: any) => {
    const newStaff = {
      id: `${staffList.length + 1}`,
      code: staffData.code,
      name: staffData.name,
      position: staffData.position,
      email: staffData.email,
      phone: staffData.phone,
      status: staffData.status as "active" | "inactive"
    }
    
    setStaffList([...staffList, newStaff])
    
    // Show success toast with check icon
    toast.success(
      <div className="flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <span>Nhân viên đã được thêm thành công!</span>
      </div>
    )
  }

  const handleEditStaff = (staffData: any) => {
    setStaffList(staffList.map(staff => 
      staff.id === selectedStaff?.id ? {
        ...staff,
        name: staffData.name,
        position: staffData.position,
        email: staffData.email,
        phone: staffData.phone,
      } : staff
    ))
    
    // Show success toast with check icon
    toast.success(
      <div className="flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <span>Thông tin nhân viên đã được cập nhật thành công!</span>
      </div>
    )
  }

  const handleToggleStatus = () => {
    if (selectedStaff) {
      const newStatus = selectedStaff.status === "active" ? "inactive" : "active"
      setStaffList(staffList.map(staff => 
        staff.id === selectedStaff.id ? {
          ...staff,
          status: newStatus
        } : staff
      ))
      setIsStatusDialogOpen(false)
      setSelectedStaff(null)
      
      // Show success toast with check icon
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>
            Trạng thái nhân viên đã được chuyển thành {newStatus === "active" ? "Đang làm việc" : "Tạm nghỉ"}!
          </span>
        </div>
      )
    }
  }

  const openEditDialog = (staff: StaffMember) => {
    setSelectedStaff(staff)
    setIsEditDialogOpen(true)
  }

  const openStatusDialog = (staff: StaffMember) => {
    setSelectedStaff(staff)
    setIsStatusDialogOpen(true)
  }

  const filteredStaff = staffList.filter(staff => 
    staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.phone.includes(searchQuery)
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Quản lý Nhân viên</h1>
        <p className="text-gray-600">Xem và quản lý tài khoản nhân viên</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm nhân viên..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            />
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setIsAddDialogOpen(true)}
          >
            Thêm nhân viên mới
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã NV
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Họ tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vị trí
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số điện thoại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.map((staff) => (
                <tr key={staff.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{staff.code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{staff.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{staff.position}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{staff.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{staff.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      staff.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {staff.status === 'active' ? 'Đang làm việc' : 'Tạm nghỉ'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button 
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => openEditDialog(staff)}
                    >
                      Sửa
                    </Button>
                    <Button 
                      variant="ghost"
                      className={`${staff.status === 'active' ? 'text-amber-600 hover:text-amber-900' : 'text-green-600 hover:text-green-900'}`}
                      onClick={() => openStatusDialog(staff)}
                    >
                      {staff.status === 'active' ? 'Tạm nghỉ' : 'Kích hoạt'}
                    </Button>
                  </td>
                </tr>
              ))}
              
              {filteredStaff.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    Không tìm thấy nhân viên nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{filteredStaff.length}</span> của <span className="font-medium">{staffList.length}</span> kết quả
          </div>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border rounded text-sm" disabled>
              Trước
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
              1
            </button>
            <button className="px-3 py-1 border rounded text-sm" disabled>
              Tiếp
            </button>
          </div>
        </div>
      </div>

      {/* Add Staff Dialog */}
      <NewStaffDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleAddStaff}
      />

      {/* Edit Staff Dialog */}
      {selectedStaff && (
        <EditStaffDialog
          staff={selectedStaff}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleEditStaff}
        />
      )}

      {/* Status Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
        onConfirm={handleToggleStatus}
        title={selectedStaff?.status === 'active' ? 'Xác nhận khóa tài khoản' : 'Xác nhận kích hoạt tài khoản'}
        description={`Bạn có chắc chắn muốn ${selectedStaff?.status === 'active' ? 'khóa' : 'kích hoạt'} tài khoản của nhân viên "${selectedStaff?.name}" không?`}
      />
    </div>
  )
} 