"use client"

import { useState } from "react"
import { Search, CheckCircle } from "lucide-react"
import { NewRoomDialog } from "@/components/new-room-dialog"
import { EditRoomDialog } from "@/components/edit-room-dialog"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { AuthGuard } from "@/components/auth-guard"

interface Room {
  id: string
  roomNumber: string
  roomType: string
  floor: string
  price: string
  status: "available" | "occupied" | "maintenance"
  description?: string
}

export default function StaffRoomsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  
  // Sample rooms data
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "1",
      roomNumber: "101",
      roomType: "Phòng Standard",
      floor: "1",
      price: "750,000",
      status: "available"
    },
    {
      id: "2",
      roomNumber: "102",
      roomType: "Phòng Deluxe",
      floor: "1",
      price: "1,200,000",
      status: "occupied"
    },
    {
      id: "3",
      roomNumber: "201",
      roomType: "Phòng Standard",
      floor: "2",
      price: "750,000",
      status: "maintenance"
    },
    {
      id: "4",
      roomNumber: "202",
      roomType: "Phòng Suite",
      floor: "2",
      price: "2,000,000",
      status: "available"
    }
  ])

  const handleAddRoom = (roomData: any) => {
    const newRoom: Room = {
      id: `${rooms.length + 1}`,
      roomNumber: roomData.roomNumber,
      roomType: roomData.roomType,
      floor: roomData.floor,
      price: roomData.price,
      status: roomData.status as "available" | "occupied" | "maintenance",
      description: roomData.description
    }
    
    setRooms([...rooms, newRoom])
    
    // Show success toast with check icon
    toast.success(
      <div className="flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <span>Phòng đã được thêm thành công!</span>
      </div>
    )
  }

  const handleEditRoom = (roomData: any) => {
    setRooms(rooms.map(room => 
      room.id === selectedRoom?.id ? {
        ...room,
        roomNumber: roomData.roomNumber,
        roomType: roomData.roomType,
        floor: roomData.floor,
        price: roomData.price,
        status: roomData.status,
        description: roomData.description
      } : room
    ))
    
    // Show success toast with check icon
    toast.success(
      <div className="flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <span>Phòng đã được cập nhật thành công!</span>
      </div>
    )
  }

  const handleDeleteRoom = () => {
    if (selectedRoom) {
      setRooms(rooms.filter(room => room.id !== selectedRoom.id))
      setIsDeleteDialogOpen(false)
      setSelectedRoom(null)
      
      // Show success toast with check icon
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Phòng đã được xóa thành công!</span>
        </div>
      )
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
    room.roomType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.floor.includes(searchQuery)
  )

  return (
    <AuthGuard requiredRole="staff">
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
                      <div className="text-sm text-gray-900">{room.roomType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{room.floor}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{room.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        room.status === 'available' 
                          ? 'bg-green-100 text-green-800' 
                          : room.status === 'occupied' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {room.status === 'available' 
                          ? 'Sẵn sàng' 
                          : room.status === 'occupied' 
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
          description={`Bạn có chắc chắn muốn xóa phòng ${selectedRoom?.roomNumber} không? Hành động này không thể hoàn tác.`}
        />
      </div>
    </AuthGuard>
  )
}
