"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Edit, Trash2, PlusCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { getStaffList, deleteStaff, createStaff, updateStaff, StaffData, StaffCreateDTO, StaffUpdateDTO } from "@/lib/staff-service"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { StaffDialog } from "@/components/staff-dialog"

export default function AdminStaffPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<StaffData | null>(null)
  const [staffList, setStaffList] = useState<StaffData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getStaffList()
      // Lọc theo tìm kiếm ở phía client
      const filtered = data.filter(staff =>
        staff.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.staffCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.phone.includes(searchQuery)
      )
      setStaffList(filtered)
      setError(null)
    } catch (err: any) {
      console.error("Failed to fetch staff:", err)
      const errorMessage = err.message || "Lỗi kết nối đến máy chủ."
      setError(errorMessage)
      toast.error(`Không thể tải danh sách nhân viên: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }, [searchQuery]) // Thêm searchQuery vào dependency

  useEffect(() => {
    fetchStaff()
  }, [fetchStaff])

  const handleSave = async (data: StaffCreateDTO | StaffUpdateDTO) => {
    try {
      if (selectedStaff) {
        // Update
        await updateStaff(selectedStaff.id, data as StaffUpdateDTO)
        toast.success(`Đã cập nhật nhân viên "${(data as StaffUpdateDTO).fullName}".`)
      } else {
        // Create
        await createStaff(data as StaffCreateDTO)
        toast.success(`Đã tạo nhân viên mới "${(data as StaffCreateDTO).fullName}".`)
      }
      fetchStaff()
      setIsDialogOpen(false)
    } catch (err: any) {
      console.error("Failed to save staff:", err)
      const errorMessage = err.response?.data?.message || err.message || "Đã có lỗi xảy ra."
      toast.error(`Lưu nhân viên thất bại: ${errorMessage}`)
    }
  }

  const handleDelete = async () => {
    if (!selectedStaff) return
    try {
      await deleteStaff(selectedStaff.id)
      toast.success(`Đã xóa nhân viên "${selectedStaff.fullName}".`)
      fetchStaff()
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Đã có lỗi xảy ra."
      toast.error(`Xóa nhân viên thất bại: ${errorMessage}`)
    } finally {
      setIsDeleteDialogOpen(false)
    }
  }

  const openDialog = (staff: StaffData | null = null) => {
    setSelectedStaff(staff)
    setIsDialogOpen(true)
  }

  const openDeleteDialog = (staff: StaffData) => {
    setSelectedStaff(staff)
    setIsDeleteDialogOpen(true)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Spinner size="large" /></div>
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10"><p>Đã xảy ra lỗi: {error}</p></div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Quản lý Nhân viên</h1>
        <p className="text-gray-600">Thêm, sửa, xóa và quản lý tài khoản nhân viên</p>
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
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            onClick={() => openDialog()}
          >
            <PlusCircle size={18} />
            Thêm nhân viên
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã NV</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ Tên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chức vụ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {staffList.map((staff) => (
                <tr key={staff.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{staff.staffCode}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{staff.fullName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{staff.position}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{staff.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      staff.status === 'Đang làm việc' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {staff.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="ghost" className="text-blue-600 hover:text-blue-900" onClick={() => openDialog(staff)}>
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" className="text-red-600 hover:text-red-900" onClick={() => openDeleteDialog(staff)}>
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
              {staffList.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Không tìm thấy nhân viên nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {isDialogOpen && (
        <StaffDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSave}
          staff={selectedStaff}
        />
      )}

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa nhân viên"
        description={`Bạn có chắc chắn muốn xóa nhân viên "${selectedStaff?.fullName}"? Hành động này sẽ xóa vĩnh viễn tài khoản của họ.`}
      />
    </div>
  )
} 