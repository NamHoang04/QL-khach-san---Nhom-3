"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { RoomTypeData, RoomTypeUpsertDTO } from "@/lib/room-type-service"

interface RoomTypeDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: RoomTypeUpsertDTO) => Promise<void>
  roomType: RoomTypeData | null
}

export function RoomTypeDialog({ isOpen, onClose, onSave, roomType }: RoomTypeDialogProps) {
  const [formData, setFormData] = useState<RoomTypeUpsertDTO>({
    name: '',
    price: 0,
    description: '',
    area: 0,
    maxGuests: 1,
    amenities: '',
    imageUrl: ''
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (roomType) {
      setFormData({
        name: roomType.name,
        price: roomType.price,
        description: roomType.description || '',
        area: roomType.area || 0,
        maxGuests: roomType.maxGuests || 1,
        amenities: roomType.amenities || '',
        imageUrl: roomType.imageUrl || ''
      })
    } else {
      // Reset for new room type
      setFormData({
        name: '',
        price: 0,
        description: '',
        area: 0,
        maxGuests: 1,
        amenities: '',
        imageUrl: ''
      })
    }
    setErrors({})
  }, [roomType, isOpen])

  const validate = () => {
    const newErrors: { [key: string]: string } = {}
    if (!formData.name.trim()) newErrors.name = "Tên loại phòng là bắt buộc."
    if (formData.price <= 0) newErrors.price = "Giá phòng phải lớn hơn 0."
    if (formData.maxGuests <= 0) newErrors.maxGuests = "Số khách tối đa phải lớn hơn 0."
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error("Vui lòng kiểm tra lại các thông tin đã nhập.")
      return
    }
    await onSave(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{roomType ? "Chỉnh sửa Loại phòng" : "Thêm Loại phòng mới"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Tên</Label>
            <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="col-span-3" />
            {errors.name && <p className="col-span-4 text-red-500 text-xs text-right">{errors.name}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">Giá (VNĐ)</Label>
            <Input id="price" type="number" value={formData.price || 0} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} className="col-span-3" />
            {errors.price && <p className="col-span-4 text-red-500 text-xs text-right">{errors.price}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="maxGuests" className="text-right">Số khách tối đa</Label>
            <Input id="maxGuests" type="number" value={formData.maxGuests || 1} onChange={(e) => setFormData({...formData, maxGuests: Number(e.target.value)})} className="col-span-3" />
            {errors.maxGuests && <p className="col-span-4 text-red-500 text-xs text-right">{errors.maxGuests}</p>}
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="area" className="text-right">Diện tích (m²)</Label>
            <Input id="area" type="number" value={formData.area || 0} onChange={(e) => setFormData({...formData, area: Number(e.target.value)})} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amenities" className="text-right">Tiện nghi</Label>
            <Input id="amenities" value={formData.amenities || ''} onChange={(e) => setFormData({...formData, amenities: e.target.value})} className="col-span-3" placeholder="Ví dụ: Wifi, TV, Minibar"/>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Mô tả</Label>
            <Textarea id="description" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageUrl" className="text-right">URL hình ảnh</Label>
            <Input id="imageUrl" value={formData.imageUrl || ''} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Hủy</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit}>Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 