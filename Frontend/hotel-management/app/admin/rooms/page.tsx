"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, CheckCircle } from "lucide-react"
import { NewRoomDialog } from "@/components/new-room-dialog"
import { EditRoomDialog } from "@/components/edit-room-dialog"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { Spinner } from "@/components/ui/spinner"

// Định nghĩa kiểu dữ liệu cho một phòng, khớp với DTO của backend
interface Room {
  id: number // ID là number
  roomNumber: string
  roomTypeId: number
  roomType?: {
    id: number
    name: string
    price: number
  }
  floor: number
  price: number
  status: "Available" | "Occupied" | "Maintenance"
  description?: string
  roomTypeName?: string // Thêm từ DTO
}

// Định nghĩa kiểu dữ liệu cho DTO tạo/sửa phòng
interface RoomUpsertDTO {
  roomNumber: string
  roomTypeId: number
  floor: number
  price: number
  status: "Available" | "Occupied" | "Maintenance"
  description?: string
}

// Định nghĩa kiểu dữ liệu cho response từ API, backend không có success/data wrapper
// type ApiResponse = Room[];

export default function AdminRoomsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true)
      // Sửa lại đường dẫn API và kiểu dữ liệu response
      const response = await api.get<Room[]>("/Rooms")
      setRooms(response.data)
      setError(null)
    } catch (err: any) {
      console.error("Failed to fetch rooms:", err)
      const errorMessage = err.message || "Lỗi kết nối đến máy chủ."
      setError(errorMessage)
      toast.error(`Không thể tải danh sách phòng: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRooms()
  }, [fetchRooms])

  const handleAddRoom = async (roomData: RoomUpsertDTO) => {
    try {
      await api.post("/Rooms", roomData)
      toast.success("Thêm phòng mới thành công!")
      setIsAddDialogOpen(false)
      fetchRooms() // Tải lại danh sách phòng
    } catch (err: any) {
      console.error("Failed to add room:", err)
      const errorMessage = err.data?.message || err.message || "Đã có lỗi xảy ra."
      toast.error(`Thêm phòng thất bại: ${errorMessage}`)
    }
  }

  const handleEditRoom = async (roomData: RoomUpsertDTO) => {
    if (!selectedRoom) return
    try {
      await api.put(`/Rooms/${selectedRoom.id}`, roomData)
      toast.success(`Cập nhật phòng ${selectedRoom.roomNumber} thành công!`)
      setIsEditDialogOpen(false)
      fetchRooms() // Tải lại danh sách phòng
    } catch (err: any) {
      console.error("Failed to edit room:", err)
      const errorMessage = err.data?.message || err.message || "Đã có lỗi xảy ra."
      toast.error(`Cập nhật phòng thất bại: ${errorMessage}`)
    }
  }

  const handleDeleteRoom = async () => {
    if (!selectedRoom) return
    try {
      await api.delete(`/Rooms/${selectedRoom.id}`)
      toast.success(`Đã xóa phòng ${selectedRoom.roomNumber}.`)
      setIsDeleteDialogOpen(false)
      fetchRooms() // Tải lại danh sách phòng
    } catch (err: any) {
      console.error("Failed to delete room:", err)
      const errorMessage = err.data?.message || err.message || "Đã có lỗi xảy ra."
      toast.error(`Xóa phòng thất bại: ${errorMessage}`)
    }
  }

  const openEditDialog = (room: Room) => {
    setSelectedRoom(room)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (room: Room) => {
    setSelectedRoom(room)
    setIsDeleteDialogOpen(true)
  }

  const filteredRooms = rooms.filter(room =>
    room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (room.roomTypeName && room.roomTypeName.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="large" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        <p>Đã xảy ra lỗi:</p>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Quản lý Phòng</h1>
        <p className="text-gray-600">Xem và quản lý danh sách phòng khách sạn</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm phòng..."
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
            Thêm phòng mới
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã phòng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại phòng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tầng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá (VNĐ/đêm)
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
              {filteredRooms.map((room) => (
                <tr key={room.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{room.roomNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{room.roomTypeName || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{room.floor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Intl.NumberFormat('vi-VN').format(room.price)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      room.status === 'Available' 
                        ? 'bg-green-100 text-green-800' 
                        : room.status === 'Occupied' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {room.status === 'Available' 
                        ? 'Sẵn sàng' 
                        : room.status === 'Occupied' 
                          ? 'Đang sử dụng' 
                          : 'Bảo trì'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button 
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => openEditDialog(room)}
                    >
                      Sửa
                    </Button>
                    <Button 
                      variant="ghost"
                      className="text-red-600 hover:text-red-900"
                      onClick={() => openDeleteDialog(room)}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
              
              {filteredRooms.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Không tìm thấy phòng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{filteredRooms.length}</span> của <span className="font-medium">{rooms.length}</span> kết quả
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="px-3 py-1" disabled>
              Trước
            </Button>
            <Button className="px-3 py-1 bg-blue-600 text-white">
              1
            </Button>
            <Button variant="outline" className="px-3 py-1">
              2
            </Button>
            <Button variant="outline" className="px-3 py-1">
              Tiếp
            </Button>
          </div>
        </div>
      </div>

      {/* Add Room Dialog */}
      <NewRoomDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleAddRoom}
      />

      {/* Edit Room Dialog */}
      {selectedRoom && (
        <EditRoomDialog
          room={selectedRoom}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleEditRoom}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteRoom}
        title="Xác nhận xóa phòng"
        description={`Bạn có chắc chắn muốn xóa phòng ${selectedRoom?.roomNumber}? Hành động này không thể hoàn tác.`}
      />
    </div>
  )
} 