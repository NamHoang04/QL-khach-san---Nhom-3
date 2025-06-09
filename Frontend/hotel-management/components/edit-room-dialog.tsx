"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { XCircle } from "lucide-react"
import { api } from "@/lib/api"

// Kiểu dữ liệu khớp với trang chính và backend
interface Room {
  id: number
  roomNumber: string
  roomTypeId: number
  floor: number
  price: number
  status: "Available" | "Occupied" | "Maintenance"
  description?: string
  roomTypeName?: string
}

interface RoomType {
  id: number;
  name:string;
  price: number;
}

// DTO để cập nhật phòng
interface RoomUpsertDTO {
  roomNumber: string
  floor: number
  roomTypeId: number
  price: number
  status: "Available" | "Occupied" | "Maintenance"
  description?: string
}

interface EditRoomDialogProps {
  room: Room | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (room: RoomUpsertDTO) => void
}

export function EditRoomDialog({ room, open, onOpenChange, onSave }: EditRoomDialogProps) {
  const [formData, setFormData] = useState<Partial<RoomUpsertDTO>>({})
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [errors, setErrors] = useState({
    roomNumber: false,
    roomTypeId: false,
  })

  // Lấy danh sách loại phòng
  useEffect(() => {
    if (open) {
      const fetchRoomTypes = async () => {
        try {
          const response = await api.get<RoomType[]>('/RoomTypes');
          setRoomTypes(response.data);
        } catch (error) {
          toast.error("Lỗi kết nối: Không thể tải danh sách loại phòng.");
        }
      };
      fetchRoomTypes();
    }
  }, [open]);

  // Cập nhật form data khi phòng được chọn thay đổi
  useEffect(() => {
    if (room) {
      setFormData({
        roomNumber: room.roomNumber,
        floor: room.floor,
        roomTypeId: room.roomTypeId,
        price: room.price,
        status: room.status,
        description: room.description
      });
    }
  }, [room, open])

  const handleChange = (field: keyof RoomUpsertDTO, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === 'roomTypeId') {
        const selectedType = roomTypes.find(rt => rt.id === value);
        if (selectedType) {
            setFormData(prev => ({ ...prev, price: selectedType.price }));
        }
    }
  }
  
  const validateForm = () => {
    const newErrors = {
      roomNumber: !formData.roomNumber?.trim(),
      roomTypeId: !formData.roomTypeId,
    }
    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error)
  }

  const handleSave = () => {
    if (validateForm() && formData.roomNumber && formData.roomTypeId && formData.floor && formData.price && formData.status) {
      onSave(formData as RoomUpsertDTO)
      onOpenChange(false)
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
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold text-center text-blue-700">CHỈNH SỬA THÔNG TIN PHÒNG</DialogTitle>
            </DialogHeader>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="roomNumber" className="text-sm text-gray-600">
                    Mã phòng <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="roomNumber"
                    value={formData.roomNumber || ''}
                    onChange={(e) => handleChange("roomNumber", e.target.value)}
                    className={`border-gray-300 ${errors.roomNumber ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Nhập mã phòng..."
                    required
                  />
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="floor" className="text-sm text-gray-600">
                    Tầng <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="floor"
                    type="number"
                    value={formData.floor || 1}
                    onChange={(e) => handleChange("floor", parseInt(e.target.value, 10))}
                    className={`border-gray-300`}
                    placeholder="Nhập tầng..."
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="roomTypeId" className="text-sm text-gray-600">
                    Loại phòng <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.roomTypeId?.toString()} onValueChange={(value) => handleChange("roomTypeId", parseInt(value))}>
                    <SelectTrigger className={`border-gray-300 ${errors.roomTypeId ? 'border-red-500 focus:ring-red-500' : ''}`}>
                      <SelectValue placeholder="Chọn loại phòng" />
                    </SelectTrigger>
                    <SelectContent>
                      {roomTypes.map(type => (
                        <SelectItem key={type.id} value={type.id.toString()}>{type.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="price" className="text-sm text-gray-600">
                    Giá (VNĐ/đêm)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price || 0}
                    onChange={(e) => handleChange("price", parseFloat(e.target.value))}
                    className={`border-gray-300`}
                    placeholder="Giá theo loại phòng..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="status" className="text-sm text-gray-600">
                  Trạng thái <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value: "Available" | "Occupied" | "Maintenance") => 
                    handleChange("status", value)
                  }
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Sẵn sàng</SelectItem>
                    <SelectItem value="Occupied">Đang sử dụng</SelectItem>
                    <SelectItem value="Maintenance">Bảo trì</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="description" className="text-sm text-gray-600">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description || ''}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="border-gray-300"
                  placeholder="Thêm mô tả (nếu có)..."
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
                Lưu thay đổi
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 