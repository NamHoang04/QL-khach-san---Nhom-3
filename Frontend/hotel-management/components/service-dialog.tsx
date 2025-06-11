"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Service, ServiceUpsertDto } from "@/lib/service-service"
import { formatCurrency, parseCurrency } from "@/lib/utils"

interface ServiceDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: ServiceUpsertDto) => Promise<void>
  service: Service | null
}

export function ServiceDialog({ isOpen, onClose, onSave, service }: ServiceDialogProps) {
  const [formData, setFormData] = useState<Partial<ServiceUpsertDto>>({})
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    if (isOpen) {
      if (service) {
        setFormData({
          name: service.name,
          price: service.price,
          description: service.description
        });
      } else {
        setFormData({
          name: '',
          price: 0,
          description: ''
        });
      }
      setErrors({})
    }
  }, [service, isOpen])

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name?.trim()) newErrors.name = "Tên dịch vụ là bắt buộc.";
    if (!formData.price || formData.price <= 0) newErrors.price = "Giá dịch vụ phải là một số dương.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async () => {
    if (!validate()) {
      toast.error("Vui lòng kiểm tra lại thông tin dịch vụ.");
      return;
    }
    await onSave(formData as ServiceUpsertDto);
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseCurrency(e.target.value);
    setFormData(prev => ({ ...prev, price: parsedValue }));
  };

  const handleInputChange = (field: keyof ServiceUpsertDto, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{service ? "Chỉnh sửa Dịch vụ" : "Tạo Dịch vụ mới"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Tên</Label>
            <Input id="name" value={formData.name || ''} onChange={(e) => handleInputChange('name', e.target.value)} className="col-span-3" />
            {errors.name && <p className="col-span-4 text-red-500 text-xs text-right">{errors.name}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">Giá</Label>
            <Input 
              id="price" 
              value={formatCurrency(formData.price)} 
              onChange={handlePriceChange} 
              className="col-span-3" 
            />
            {errors.price && <p className="col-span-4 text-red-500 text-xs text-right">{errors.price}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Mô tả</Label>
            <Textarea id="description" value={formData.description || ''} onChange={(e) => handleInputChange('description', e.target.value)} className="col-span-3" />
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