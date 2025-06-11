"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { XCircle } from "lucide-react"
import { api } from "@/lib/api"
import { formatCurrency, parseCurrency } from "@/lib/utils"

// Kiểu dữ liệu cho một loại phòng
interface RoomType {
  id: number;
  name: string;
  price: number;
}

// Kiểu dữ liệu cho DTO tạo phòng, dùng cho cả form và onSave
interface RoomUpsertDTO {
  roomNumber: string
  floor: number
  roomTypeId: number
  price: number
  status: "Available" | "Occupied" | "Maintenance"
  description?: string
}

interface NewRoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (room: RoomUpsertDTO) => void
}

const initialFormState: Partial<RoomUpsertDTO> = {
  floor: 1,
  status: "Available",
  price: 0
};

export function NewRoomDialog({ open, onOpenChange, onSave }: NewRoomDialogProps) {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [room, setRoom] = useState<Partial<RoomUpsertDTO>>(initialFormState)
  const [errors, setErrors] = useState({
    roomNumber: false,
    roomTypeId: false,
  })

  // Lấy danh sách loại phòng từ API
  useEffect(() => {
    if (open) {
      const fetchRoomTypes = async () => {
        try {
          const response = await api.get<RoomType[]>('/RoomTypes');
          setRoomTypes(response.data);
        } catch (error) {
          console.error("Failed to fetch room types:", error);
          toast.error("Lỗi kết nối: Không thể tải danh sách loại phòng.");
        }
      };
      fetchRoomTypes();
    }
  }, [open]);

  const handleChange = (field: keyof RoomUpsertDTO, value: string | number) => {
    setRoom((prev) => ({ ...prev, [field]: value }))
    if (field === 'roomTypeId') {
        const selectedType = roomTypes.find(rt => rt.id === value);
        if (selectedType) {
            setRoom(prev => ({ ...prev, price: selectedType.price }));
        }
    }
    if (field in errors) {
      setErrors(prev => ({ ...prev, [field]: false }))
    }
  }
  
  const validateForm = () => {
    const newErrors = {
      roomNumber: !room.roomNumber?.trim(),
      roomTypeId: !room.roomTypeId,
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error)
  }

  const handleSave = () => {
    if (validateForm() && room.roomNumber && room.roomTypeId && room.floor && room.price && room.status) {
      onSave(room as RoomUpsertDTO)
      onOpenChange(false)
      setRoom(initialFormState)
      setErrors({ roomNumber: false, roomTypeId: false })
    } else {
      toast.error(
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-500" />
          <span>Vui lòng điền đầy đủ thông tin bắt buộc!</span>
        </div>
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden border-2 border-[#369eff]">
        <div className="bg-[#369eff] bg-opacity-10 p-8">
          <div className="bg-white rounded-lg p-8">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-2xl font-bold text-center text-[#369eff]">THÊM PHÒNG MỚI</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="roomNumber" className="text-base text-gray-700">
                    Số phòng <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="roomNumber"
                    value={room.roomNumber || ""}
                    onChange={(e) => handleChange("roomNumber", e.target.value)}
                    className={`border-b ${errors.roomNumber ? 'border-red-500' : 'border-gray-400'} bg-transparent rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 h-10 px-0`}
                    placeholder="Nhập số phòng..."
                    required
                  />
                  {errors.roomNumber && (
                    <p className="text-red-500 text-xs mt-1">Số phòng là bắt buộc</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="floor" className="text-base text-gray-700">
                    Tầng
                  </Label>
                  <Input
                    id="floor"
                    type="number"
                    value={room.floor || 1}
                    onChange={(e) => handleChange("floor", parseInt(e.target.value, 10))}
                    className="border-b border-gray-400 bg-transparent rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 h-10 px-0"
                    placeholder="Nhập tầng..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="roomTypeId" className="text-base text-gray-700">
                  Loại phòng <span className="text-red-500">*</span>
                </Label>
                <Select value={room.roomTypeId?.toString()} onValueChange={(value) => handleChange("roomTypeId", parseInt(value, 10))}>
                  <SelectTrigger 
                    className={`border-b ${errors.roomTypeId ? 'border-red-500' : 'border-gray-400'} bg-transparent rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 h-10 px-0`}
                  >
                    <SelectValue placeholder="Chọn loại phòng" />
                  </SelectTrigger>
                  <SelectContent>
                    {roomTypes.map(type => (
                      <SelectItem key={type.id} value={type.id.toString()}>{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.roomTypeId && (
                  <p className="text-red-500 text-xs mt-1">Loại phòng là bắt buộc</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="price" className="text-base text-gray-700">
                    Giá (VNĐ/đêm)
                  </Label>
                  <Input
                      id="price"
                      value={formatCurrency(room.price)}
                      className="border-b border-gray-400 bg-gray-100 rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 h-10 px-0"
                      placeholder="Giá phòng..."
                      readOnly
                  />
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="status" className="text-base text-gray-700">
                    Trạng thái
                  </Label>
                  <Select value={room.status} onValueChange={(value: "Available" | "Occupied" | "Maintenance") => handleChange("status", value)}>
                    <SelectTrigger className="border-b border-gray-400 bg-transparent rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 h-10 px-0">
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Available">Sẵn sàng</SelectItem>
                      <SelectItem value="Occupied">Đang sử dụng</SelectItem>
                      <SelectItem value="Maintenance">Bảo trì</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="description" className="text-base text-gray-700">Mô tả</Label>
                <Input
                  id="description"
                  value={room.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="border-b border-gray-400 bg-transparent rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 h-10 px-0"
                  placeholder="Thêm mô tả (nếu có)..."
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button onClick={handleSave} className="bg-[#369eff] hover:bg-[#2a8ce8] text-white">
                Lưu
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 