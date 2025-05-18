"use client"

import { useState } from "react"
import { NewRoomDialog } from "@/components/new-room-dialog"
import { RoomsTable } from "@/components/rooms-table"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

// Define a common RoomData type that includes both new and existing rooms
interface RoomData {
  id?: string  // id is optional for new rooms
  roomNumber: string
  floor: string
  roomType: string
  price: string
  status: string
  description?: string
}

// Dữ liệu mẫu
const sampleRooms: (RoomData & { id: string })[] = [
  {
    id: "1",
    roomNumber: "101",
    floor: "1",
    roomType: "standard",
    price: "750,000",
    status: "available"
  },
  {
    id: "2",
    roomNumber: "102",
    floor: "1",
    roomType: "deluxe",
    price: "1,200,000",
    status: "occupied"
  },
  {
    id: "3",
    roomNumber: "201",
    floor: "2",
    roomType: "suite",
    price: "1,800,000",
    status: "available"
  },
  {
    id: "4",
    roomNumber: "202",
    floor: "2",
    roomType: "family",
    price: "1,400,000",
    status: "maintenance"
  }
]

export default function AdminRoomsManagementPage() {
  const [isNewRoomDialogOpen, setIsNewRoomDialogOpen] = useState(false)
  const [rooms, setRooms] = useState<(RoomData & { id: string })[]>(sampleRooms)
  const [searchQuery, setSearchQuery] = useState("")
  
  const handleAddRoom = (room: RoomData) => {
    const newRoom = {
      ...room,
      id: `${Date.now()}`  // Simple ID generation
    }
    setRooms([...rooms, newRoom])
  }
  
  const handleEditRoom = (updatedRoom: RoomData & { id: string }) => {
    setRooms(rooms.map(room => 
      room.id === updatedRoom.id ? updatedRoom : room
    ))
  }
  
  const handleDeleteRoom = (id: string) => {
    setRooms(rooms.filter(room => room.id !== id))
  }
  
  const filteredRooms = searchQuery
    ? rooms.filter(room => 
        room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.roomType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.floor.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : rooms

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Quản lý Phòng</h1>
        <p className="text-gray-600">Thêm, chỉnh sửa và xóa phòng khách sạn</p>
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
            onClick={() => setIsNewRoomDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Thêm phòng mới
          </Button>
        </div>
        
        <RoomsTable 
          rooms={filteredRooms}
          onEdit={handleEditRoom}
          onDelete={handleDeleteRoom}
        />
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{filteredRooms.length}</span> của <span className="font-medium">{filteredRooms.length}</span> kết quả
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="px-3 py-1" disabled>
              Trước
            </Button>
            <Button className="px-3 py-1 bg-blue-600 text-white">
              1
            </Button>
            <Button variant="outline" className="px-3 py-1" disabled>
              Tiếp
            </Button>
          </div>
        </div>
      </div>
      
      <NewRoomDialog 
        open={isNewRoomDialogOpen}
        onOpenChange={setIsNewRoomDialogOpen}
        onSave={handleAddRoom}
      />
    </div>
  )
} 