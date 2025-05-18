"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { AddRoomTypeDialog } from "@/components/add-room-type-dialog"
import { EditRoomTypeDialog } from "@/components/edit-room-type-dialog"
import { toast } from "sonner"
import { CheckCircle } from "lucide-react"

// Define room type interface
interface RoomType {
  id: string;
  name: string;
  pricePerNight: number;
  description: string;
  amenities: string[];
}

// Mocked room type data
const roomTypesData: RoomType[] = [
  {
    id: "rt1",
    name: "Phòng Standard",
    pricePerNight: 750000,
    description: "Phòng tiêu chuẩn với đầy đủ tiện nghi cơ bản, thích hợp cho 2 người.",
    amenities: ["Wifi miễn phí", "TV"]
  },
  {
    id: "rt2",
    name: "Phòng Deluxe",
    pricePerNight: 1200000,
    description: "Phòng cao cấp với không gian rộng và tầm nhìn đẹp, phù hợp cho gia đình nhỏ.",
    amenities: ["Wifi miễn phí", "TV", "Minibar"]
  },
  {
    id: "rt3",
    name: "Phòng Suite",
    pricePerNight: 2500000,
    description: "Phòng Suite sang trọng với phòng khách riêng biệt, tầm nhìn panorama.",
    amenities: ["Bồn tắm spa", "Bữa sáng miễn phí", "Wifi miễn phí", "TV", "Minibar"]
  },
]

export default function AdminRoomTypesPage() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>(roomTypesData)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | null>(null)
  
  const handleDelete = (roomTypeId: string) => {
    setRoomTypes(roomTypes.filter(rt => rt.id !== roomTypeId))
    setIsDeleteDialogOpen(false)
    
    // Show success toast with check icon
    toast.success(
      <div className="flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <span>Loại phòng đã được xóa thành công!</span>
      </div>
    )
  }
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }
  
  const openDeleteDialog = (roomType: RoomType) => {
    setSelectedRoomType(roomType)
    setIsDeleteDialogOpen(true)
  }
  
  const openEditDialog = (roomType: RoomType) => {
    setSelectedRoomType(roomType)
    setIsEditDialogOpen(true)
  }
  
  const handleAddRoomType = (newRoomType: RoomType) => {
    setRoomTypes(prev => [...prev, newRoomType])
    
    // Show success toast with check icon
    toast.success(
      <div className="flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <span>Đã thêm loại phòng mới thành công!</span>
      </div>
    )
  }
  
  const handleEditRoomType = (editedRoomType: RoomType) => {
    setRoomTypes(prev => 
      prev.map(roomType => 
        roomType.id === editedRoomType.id ? editedRoomType : roomType
      )
    )
    
    // Show success toast with check icon
    toast.success(
      <div className="flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <span>Đã cập nhật loại phòng thành công!</span>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Quản lý Loại Phòng</h1>
        <p className="text-gray-600">Xem và quản lý các loại phòng khách sạn</p>
      </div>
      
      <div className="mb-8">
        <Button 
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          onClick={() => setIsAddDialogOpen(true)}
        >
          Thêm loại phòng mới
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên loại phòng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá mỗi đêm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tiện nghi
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {roomTypes.map((roomType) => (
                <tr key={roomType.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{roomType.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatPrice(roomType.pricePerNight)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {roomType.amenities.slice(0, 3).join(", ")}
                      {roomType.amenities.length > 3 && "..."}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button 
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => openEditDialog(roomType)}
                    >
                      Chỉnh sửa
                    </Button>
                    <Button 
                      variant="ghost"
                      className="text-red-600 hover:text-red-900"
                      onClick={() => openDeleteDialog(roomType)}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa loại phòng "{selectedRoomType?.name}" không? Thao tác này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedRoomType && handleDelete(selectedRoomType.id)}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Add Room Type Dialog */}
      <AddRoomTypeDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleAddRoomType}
      />
      
      {/* Edit Room Type Dialog */}
      <EditRoomTypeDialog
        roomType={selectedRoomType}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleEditRoomType}
      />
      
    </div>
  )
} 