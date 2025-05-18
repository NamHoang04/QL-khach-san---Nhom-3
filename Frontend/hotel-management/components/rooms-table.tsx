"use client"

import { useState } from "react"
import { EditRoomDialog } from "./edit-room-dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog"

// Make sure this interface is compatible with other RoomData interfaces
interface RoomData {
  id?: string
  roomNumber: string
  floor: string
  roomType: string
  price: string
  status: string
  description?: string
}

// This helps us ensure we only work with rooms that have IDs
type RoomWithId = RoomData & { id: string };

interface RoomsTableProps {
  rooms: RoomWithId[]
  onEdit: (room: RoomWithId) => void
  onDelete: (id: string) => void
}

export function RoomsTable({ rooms, onEdit, onDelete }: RoomsTableProps) {
  const [selectedRoom, setSelectedRoom] = useState<RoomWithId | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null)

  const handleEdit = (room: RoomWithId) => {
    setSelectedRoom(room)
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = (updatedRoom: RoomData) => {
    if (updatedRoom.id && selectedRoom) {
      onEdit({...updatedRoom, id: updatedRoom.id} as RoomWithId)
    }
  }

  const handleDelete = (id: string) => {
    setRoomToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (roomToDelete) {
      onDelete(roomToDelete)
      setRoomToDelete(null)
    }
    setIsDeleteDialogOpen(false)
  }

  const getRoomTypeLabel = (type: string) => {
    switch (type) {
      case "standard": return "Phòng Standard"
      case "deluxe": return "Phòng Deluxe"
      case "suite": return "Phòng Suite"
      case "family": return "Phòng Family"
      default: return type
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available": return { label: "Sẵn sàng", class: "bg-green-100 text-green-800" }
      case "occupied": return { label: "Đang sử dụng", class: "bg-red-100 text-red-800" }
      case "maintenance": return { label: "Bảo trì", class: "bg-yellow-100 text-yellow-800" }
      default: return { label: status, class: "bg-gray-100 text-gray-800" }
    }
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Số phòng
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
            {rooms.map((room) => {
              const status = getStatusLabel(room.status)
              return (
                <tr key={room.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{room.roomNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getRoomTypeLabel(room.roomType)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{room.floor}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{room.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.class}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleEdit(room)}
                      className="text-blue-600 hover:text-blue-900 mr-3">
                      Chỉnh sửa
                    </button>
                    <button 
                      onClick={() => handleDelete(room.id)}
                      className="text-red-600 hover:text-red-900">
                      Xóa
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {selectedRoom && (
        <EditRoomDialog
          room={selectedRoom}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleSaveEdit}
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa phòng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa phòng này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 