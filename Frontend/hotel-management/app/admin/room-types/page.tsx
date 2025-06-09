"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Edit, Trash2, PlusCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { getRoomTypes, deleteRoomType, createRoomType, updateRoomType, RoomTypeData, RoomTypeUpsertDTO } from "@/lib/room-type-service"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { RoomTypeDialog } from "@/components/room-type-dialog"

export default function AdminRoomTypesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRoomType, setSelectedRoomType] = useState<RoomTypeData | null>(null)
  const [roomTypes, setRoomTypes] = useState<RoomTypeData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRoomTypes = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getRoomTypes()
      setRoomTypes(data)
      setError(null)
    } catch (err: any) {
      console.error("Failed to fetch room types:", err)
      const errorMessage = err.message || "Lỗi kết nối đến máy chủ."
      setError(errorMessage)
      toast.error(`Không thể tải danh sách loại phòng: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRoomTypes()
  }, [fetchRoomTypes])

  const handleSave = async (data: RoomTypeUpsertDTO) => {
    try {
      if (selectedRoomType) {
        // Update
        await updateRoomType(selectedRoomType.id, data)
        toast.success(`Đã cập nhật loại phòng "${data.name}".`)
      } else {
        // Create
        await createRoomType(data)
        toast.success(`Đã tạo loại phòng mới "${data.name}".`)
      }
      fetchRoomTypes()
      setIsDialogOpen(false)
    } catch (err: any) {
      console.error("Failed to save room type:", err)
      const errorMessage = err.response?.data?.message || err.message || "Đã có lỗi xảy ra."
      toast.error(`Lưu thất bại: ${errorMessage}`)
    }
  }

  const handleDelete = async () => {
    if (!selectedRoomType) return
    try {
      await deleteRoomType(selectedRoomType.id)
      toast.success(`Đã xóa loại phòng "${selectedRoomType.name}".`)
      fetchRoomTypes()
    } catch (err: any) {
      console.error("Failed to delete room type:", err)
      const errorMessage = err.response?.data?.message || err.message || "Đã có lỗi xảy ra."
      toast.error(`Xóa loại phòng thất bại: ${errorMessage}`)
    } finally {
      setIsDeleteDialogOpen(false)
    }
  }

  const openDialog = (roomType: RoomTypeData | null = null) => {
    setSelectedRoomType(roomType)
    setIsDialogOpen(true)
  }

  const openDeleteDialog = (roomType: RoomTypeData) => {
    setSelectedRoomType(roomType)
    setIsDeleteDialogOpen(true)
  }
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  }

  const filteredRoomTypes = roomTypes.filter(rt =>
    rt.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Spinner size="large" /></div>
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10"><p>Đã xảy ra lỗi: {error}</p></div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Quản lý Loại Phòng</h1>
        <p className="text-gray-600">Thêm, sửa, xóa và quản lý các loại phòng của khách sạn</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm loại phòng..."
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
            Thêm loại phòng
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên loại phòng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá (VNĐ/đêm)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số khách tối đa</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRoomTypes.map((rt) => (
                <tr key={rt.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{rt.name}</div>
                    <div className="text-sm text-gray-500">{rt.description?.substring(0, 50)}...</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(rt.price)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{rt.maxGuests}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="ghost" className="text-blue-600 hover:text-blue-900" onClick={() => openDialog(rt)}>
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" className="text-red-600 hover:text-red-900" onClick={() => openDeleteDialog(rt)}>
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredRoomTypes.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Không tìm thấy loại phòng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog for Add/Edit Room Type */}
      {isDialogOpen && (
        <RoomTypeDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSave}
          roomType={selectedRoomType}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa loại phòng"
        description={`Bạn có chắc chắn muốn xóa loại phòng "${selectedRoomType?.name}" không? Các phòng đang sử dụng loại này sẽ không bị ảnh hưởng nhưng bạn không thể khôi phục loại phòng.`}
      />
    </div>
  )
} 