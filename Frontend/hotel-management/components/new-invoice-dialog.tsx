"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Trash2, XCircle } from "lucide-react"
import { toast } from "sonner"

// Room data for selection
const roomTypes = [
  { id: "standard", name: "Phòng Standard", pricePerNight: 1500000 },
  { id: "deluxe", name: "Phòng Deluxe", pricePerNight: 2000000 },
  { id: "suite", name: "Phòng Suite", pricePerNight: 2500000 },
  { id: "family", name: "Phòng Family", pricePerNight: 3000000 },
]

// Service data
const hotelServices = [
  { id: "breakfast", name: "Bữa sáng buffet", price: 250000 },
  { id: "dinner", name: "Bữa tối tại nhà hàng", price: 350000 },
  { id: "spa", name: "Dịch vụ Spa", price: 500000 },
  { id: "laundry", name: "Dịch vụ giặt ủi", price: 150000 },
  { id: "transport", name: "Đưa đón sân bay", price: 350000 },
  { id: "tour", name: "Tour tham quan thành phố", price: 1500000 },
]

interface InvoiceItem {
  id: string
  name: string
  quantity: number
  price: number
  amount: number
}

interface InvoiceData {
  customerName: string
  customerEmail: string
  items: InvoiceItem[]
  status: string
  notes: string
}

interface NewInvoiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (invoice: InvoiceData) => void
}

export function NewInvoiceDialog({ open, onOpenChange, onSave }: NewInvoiceDialogProps) {
  const [invoice, setInvoice] = useState<InvoiceData>({
    customerName: "",
    customerEmail: "",
    items: [
      {
        id: "1",
        name: "",
        quantity: 1,
        price: 0,
        amount: 0
      }
    ],
    status: "pending",
    notes: ""
  })
  
  const [errors, setErrors] = useState({
    customerName: false,
    customerEmail: false,
    items: false
  })
  
  // For room selection
  const [selectedRoom, setSelectedRoom] = useState("")
  const [nightsCount, setNightsCount] = useState(1)

  const getSubtotal = () => {
    return invoice.items.reduce((total, item) => total + item.amount, 0)
  }

  const getTax = () => {
    return getSubtotal() * 0.08
  }

  const getTotal = () => {
    return getSubtotal() + getTax()
  }

  const handleChange = (field: keyof Omit<InvoiceData, "items">, value: string) => {
    setInvoice((prev) => ({ ...prev, [field]: value }))
    
    // Clear error when field is filled
    if (field === 'customerName' || field === 'customerEmail') {
      if (value.trim() !== '') {
        setErrors(prev => ({ ...prev, [field]: false }))
      }
    }
  }

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...invoice.items]
    newItems[index] = { ...newItems[index], [field]: value }
    
    // Recalculate amount
    if (field === 'quantity' || field === 'price') {
      newItems[index].amount = newItems[index].quantity * newItems[index].price
    }
    
    setInvoice((prev) => ({ ...prev, items: newItems }))
    
    // Clear error if items are valid
    if (newItems.every(item => item.name && item.price > 0)) {
      setErrors(prev => ({ ...prev, items: false }))
    }
  }

  const addRoom = () => {
    const room = roomTypes.find(r => r.id === selectedRoom)
    if (room && nightsCount > 0) {
      const newItems = [...invoice.items]
      const roomItem = {
        id: String(Date.now()),
        name: `${room.name} - ${nightsCount} đêm`,
        quantity: nightsCount,
        price: room.pricePerNight,
        amount: room.pricePerNight * nightsCount
      }
      
      // Check if we need to replace the first empty item
      if (newItems.length === 1 && !newItems[0].name) {
        newItems[0] = roomItem
      } else {
        newItems.push(roomItem)
      }
      
      setInvoice(prev => ({ ...prev, items: newItems }))
      
      // Clear error if items are valid
      setErrors(prev => ({ ...prev, items: false }))
      
      // Reset selection for next use
      setSelectedRoom("")
    }
  }
  
  const addService = (serviceId: string) => {
    const service = hotelServices.find(s => s.id === serviceId)
    if (service) {
      const newItems = [...invoice.items]
      const serviceItem = {
        id: String(Date.now()),
        name: service.name,
        quantity: 1,
        price: service.price,
        amount: service.price
      }
      
      // Check if we need to replace the first empty item
      if (newItems.length === 1 && !newItems[0].name) {
        newItems[0] = serviceItem
      } else {
        newItems.push(serviceItem)
      }
      
      setInvoice(prev => ({ ...prev, items: newItems }))
      
      // Clear error if items are valid
      setErrors(prev => ({ ...prev, items: false }))
    }
  }

  const addItem = () => {
    setInvoice((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: String(Date.now()),
          name: "",
          quantity: 1,
          price: 0,
          amount: 0
        }
      ]
    }))
  }

  const removeItem = (index: number) => {
    if (invoice.items.length > 1) {
      const newItems = [...invoice.items]
      newItems.splice(index, 1)
      setInvoice((prev) => ({ ...prev, items: newItems }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      customerName: !invoice.customerName.trim(),
      customerEmail: !invoice.customerEmail.trim(),
      items: invoice.items.length === 0 || invoice.items.some(item => !item.name || item.price <= 0)
    }
    
    setErrors(newErrors)
    
    return !Object.values(newErrors).some(error => error)
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave(invoice)
      onOpenChange(false)
      // Reset form
      setInvoice({
        customerName: "",
        customerEmail: "",
        items: [
          {
            id: "1",
            name: "",
            quantity: 1,
            price: 0,
            amount: 0
          }
        ],
        status: "pending",
        notes: ""
      })
      setErrors({
        customerName: false,
        customerEmail: false,
        items: false
      })
    } else {
      // Show validation error toast
      toast.error(
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-500" />
          <span>Vui lòng điền đầy đủ thông tin bắt buộc!</span>
        </div>
      )
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] p-0 overflow-auto max-h-[90vh]">
        <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-bold text-center text-blue-700">TẠO HÓA ĐƠN MỚI</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Thông tin khách hàng</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="customerName" className="text-sm text-gray-600">
                    Họ tên khách hàng <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="customerName"
                    value={invoice.customerName}
                    onChange={(e) => handleChange("customerName", e.target.value)}
                    className={`border-gray-300 ${errors.customerName ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Nhập tên khách hàng..."
                    required
                  />
                  {errors.customerName && (
                    <p className="text-red-500 text-xs mt-1">Tên khách hàng là bắt buộc</p>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="customerEmail" className="text-sm text-gray-600">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={invoice.customerEmail}
                    onChange={(e) => handleChange("customerEmail", e.target.value)}
                    className={`border-gray-300 ${errors.customerEmail ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Nhập email khách hàng..."
                    required
                  />
                  {errors.customerEmail && (
                    <p className="text-red-500 text-xs mt-1">Email khách hàng là bắt buộc</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Thông tin phòng</h3>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-4">
                <div className="md:col-span-6">
                  <Label className="text-sm text-gray-600 mb-2 block">
                    Loại phòng
                  </Label>
                  <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Chọn loại phòng" />
                    </SelectTrigger>
                    <SelectContent>
                      {roomTypes.map((room) => (
                        <SelectItem key={room.id} value={room.id}>
                          {room.name} - {formatCurrency(room.pricePerNight)}/đêm
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-3">
                  <Label className="text-sm text-gray-600 mb-2 block">
                    Số đêm
                  </Label>
                  <Input
                    type="number"
                    min={1}
                    value={nightsCount}
                    onChange={(e) => setNightsCount(Number(e.target.value))}
                    className="border-gray-300"
                  />
                </div>
                <div className="md:col-span-3 flex items-end">
                  <Button 
                    type="button"
                    onClick={addRoom}
                    disabled={!selectedRoom || nightsCount < 1}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Thêm vào hóa đơn
                  </Button>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Dịch vụ bổ sung</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                {hotelServices.map(service => (
                  <Button
                    key={service.id}
                    type="button"
                    variant="outline"
                    onClick={() => addService(service.id)}
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    {service.name} - {formatCurrency(service.price)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Danh sách dịch vụ</h3>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="text-blue-600 border-blue-600"
                  onClick={addItem}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Thêm dịch vụ
                </Button>
              </div>
              
              {errors.items && (
                <p className="text-red-500 text-sm mb-3">Vui lòng thêm ít nhất một dịch vụ vào hóa đơn</p>
              )}

              <div className="space-y-4">
                {invoice.items.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-4 items-end border-b border-gray-100 pb-4">
                    <div className="col-span-5">
                      <Label htmlFor={`item-name-${index}`} className="text-sm text-gray-600 mb-1 block">
                        Tên dịch vụ
                      </Label>
                      <Input
                        id={`item-name-${index}`}
                        value={item.name}
                        onChange={(e) => handleItemChange(index, "name", e.target.value)}
                        className="border-gray-300"
                        placeholder="Tên dịch vụ..."
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`item-quantity-${index}`} className="text-sm text-gray-600 mb-1 block">
                        Số lượng
                      </Label>
                      <Input
                        id={`item-quantity-${index}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", Number(e.target.value))}
                        className="border-gray-300"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`item-price-${index}`} className="text-sm text-gray-600 mb-1 block">
                        Đơn giá
                      </Label>
                      <Input
                        id={`item-price-${index}`}
                        type="number"
                        min="0"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, "price", Number(e.target.value))}
                        className="border-gray-300"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor={`item-amount-${index}`} className="text-sm text-gray-600 mb-1 block">
                        Thành tiền
                      </Label>
                      <Input
                        id={`item-amount-${index}`}
                        value={formatCurrency(item.amount)}
                        readOnly
                        className="border-gray-300 bg-gray-50"
                      />
                    </div>
                    <div className="col-span-1">
                      <Button 
                        type="button" 
                        variant="ghost"
                        className="text-red-600 hover:text-red-700" 
                        onClick={() => removeItem(index)}
                        disabled={invoice.items.length === 1}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col items-end space-y-1">
                <div className="flex w-72 justify-between">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span>{formatCurrency(getSubtotal())}</span>
                </div>
                <div className="flex w-72 justify-between">
                  <span className="text-gray-600">Thuế VAT (8%):</span>
                  <span>{formatCurrency(getTax())}</span>
                </div>
                <div className="flex w-72 justify-between font-semibold text-lg">
                  <span>Tổng cộng:</span>
                  <span className="text-blue-700">{formatCurrency(getTotal())}</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="status" className="text-sm text-gray-600">
                    Trạng thái thanh toán
                  </Label>
                  <Select value={invoice.status} onValueChange={(value) => handleChange("status", value)}>
                    <SelectTrigger className="border-gray-300">
                      <SelectValue placeholder="Chọn trạng thái thanh toán" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Chờ thanh toán</SelectItem>
                      <SelectItem value="paid">Đã thanh toán</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="notes" className="text-sm text-gray-600">
                    Ghi chú
                  </Label>
                  <Textarea
                    id="notes"
                    value={invoice.notes}
                    onChange={(e) => handleChange("notes", e.target.value)}
                    className="min-h-[80px] border-gray-300"
                    placeholder="Nhập ghi chú (nếu có)..."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Hủy bỏ
              </Button>
              <Button 
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Lưu hóa đơn
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}