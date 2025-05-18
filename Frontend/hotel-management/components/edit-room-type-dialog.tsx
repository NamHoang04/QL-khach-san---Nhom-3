"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

interface RoomType {
  id: string;
  name: string;
  pricePerNight: number;
  description: string;
  amenities: string[];
}

interface EditRoomTypeDialogProps {
  roomType: RoomType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (roomType: RoomType) => void;
}

const AMENITIES = [
  "Wifi miễn phí",
  "TV",
  "Minibar",
  "Điều hòa",
  "Bồn tắm spa",
  "Bữa sáng miễn phí",
  "Máy sấy tóc",
  "Két an toàn",
  "Tủ lạnh"
];

export function EditRoomTypeDialog({ roomType, open, onOpenChange, onSave }: EditRoomTypeDialogProps) {
  const [editedRoomType, setEditedRoomType] = useState<RoomType | null>(null);

  // Update state when roomType changes or dialog opens
  useEffect(() => {
    if (open && roomType) {
      setEditedRoomType({ ...roomType });
    }
  }, [roomType, open]);

  const handleChange = (field: keyof Omit<RoomType, 'id'>, value: any) => {
    if (!editedRoomType) return;
    
    setEditedRoomType((prev) => {
      if (!prev) return null;
      return { ...prev, [field]: value };
    });
  };

  const handleNumberChange = (field: 'pricePerNight', value: string) => {
    const numValue = value ? parseInt(value, 10) : 0;
    if (!isNaN(numValue)) {
      handleChange(field, numValue);
    }
  };

  const toggleAmenity = (amenity: string) => {
    if (!editedRoomType) return;
    
    setEditedRoomType((prev) => {
      if (!prev) return null;
      
      if (prev.amenities.includes(amenity)) {
        return {
          ...prev,
          amenities: prev.amenities.filter(a => a !== amenity)
        };
      } else {
        return {
          ...prev,
          amenities: [...prev.amenities, amenity]
        };
      }
    });
  };

  const handleSave = () => {
    if (!editedRoomType) return;
    
    onSave(editedRoomType);
    onOpenChange(false);
  };

  const isFormValid = () => {
    if (!editedRoomType) return false;
    
    return (
      editedRoomType.name.trim() !== "" &&
      editedRoomType.pricePerNight > 0
    );
  };

  if (!editedRoomType) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-2 border-blue-500 shadow-lg">
        <div className="bg-white p-6">
          <div className="bg-[#e6f0ff] rounded-md p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl font-bold text-center">CHỈNH SỬA LOẠI PHÒNG</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-6">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="name" className="text-sm text-gray-600">
                  Tên loại phòng <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={editedRoomType.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="border-b border-gray-400 bg-transparent rounded-none focus:border-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                  placeholder="Nhập tên loại phòng"
                />
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="pricePerNight" className="text-sm text-gray-600">
                  Giá mỗi đêm (VNĐ) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="pricePerNight"
                  type="number"
                  value={editedRoomType.pricePerNight || ""}
                  onChange={(e) => handleNumberChange("pricePerNight", e.target.value)}
                  className="border-b border-gray-400 bg-transparent rounded-none focus:border-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
                  placeholder="Nhập giá"
                  min="0"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description" className="text-sm text-gray-600">
                  Mô tả
                </Label>
                <Textarea
                  id="description"
                  value={editedRoomType.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="border border-gray-400 bg-transparent focus:border-blue-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Mô tả về loại phòng"
                  rows={3}
                />
              </div>
              
              <div className="grid gap-2">
                <Label className="text-sm text-gray-600">
                  Tiện nghi
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {AMENITIES.map((amenity) => (
                    <div className="flex items-center space-x-2" key={amenity}>
                      <Checkbox 
                        id={`amenity-${amenity}`} 
                        checked={editedRoomType.amenities.includes(amenity)}
                        onCheckedChange={() => toggleAmenity(amenity)}
                      />
                      <label
                        htmlFor={`amenity-${amenity}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center gap-4 mt-4">
                <Button
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="bg-[#f08080] hover:bg-[#e06060] text-white border-none w-24"
                >
                  HỦY
                </Button>
                <Button 
                  onClick={handleSave} 
                  className="bg-[#4169e1] hover:bg-[#3159d1] text-white w-24"
                  disabled={!isFormValid()}
                >
                  LƯU
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
