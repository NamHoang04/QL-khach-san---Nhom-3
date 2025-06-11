"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, PlusCircle, Trash2 } from "lucide-react"
import { cn, formatCurrency, parseCurrency } from "@/lib/utils"
import { toast } from "sonner"
import { Service, getServices } from "@/lib/service-service"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Room, getAvailableRooms } from "@/lib/room-service"

// A local interface to match the component's data structure
interface SelectedService {
  serviceId: string;
  name: string;
  quantity: number;
  price: number;
}

interface BookingData {
  id?: string;
  customerName: string;
  phone: string;
  email: string;
  checkInDate: string;
  checkOutDate: string;
  advancePayment: number;
  agreedPrice: number;
  note: string;
  roomId: string; // Changed from roomType to roomId
  status: string;
  createdAt?: string;
  updatedAt?: string;
  services?: SelectedService[];
}

interface NewBookingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (booking: BookingData) => Promise<void>
}

export function NewBookingDialog({ open, onOpenChange, onSave }: NewBookingDialogProps) {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(today)
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(tomorrow)
  const [availableServices, setAvailableServices] = useState<Service[]>([])
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([])
  const [availableRooms, setAvailableRooms] = useState<Room[]>([])
  const [selectedRoomPrice, setSelectedRoomPrice] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [isFetchingRooms, setIsFetchingRooms] = useState(false)
  
  const [booking, setBooking] = useState<BookingData>({
    customerName: "",
    phone: "",
    email: "",
    checkInDate: format(today, "yyyy-MM-dd"),
    checkOutDate: format(tomorrow, "yyyy-MM-dd"),
    advancePayment: 0,
    agreedPrice: 0,
    note: "",
    roomId: "",
    status: "pending",
    services: []
  })

  const fetchRooms = useCallback(async (start: Date, end: Date) => {
      setIsFetchingRooms(true);
      try {
        const rooms = await getAvailableRooms(format(start, "yyyy-MM-dd"), format(end, "yyyy-MM-dd"));
        setAvailableRooms(rooms);
        // If the currently selected room is no longer available, reset it
        if (booking.roomId && !rooms.some(r => r.id === booking.roomId)) {
            setBooking(prev => ({...prev, roomId: ""}));
            setSelectedRoomPrice(0);
        }
      } catch (error) {
        toast.error("Không thể tải danh sách phòng trống.");
        setAvailableRooms([]);
      } finally {
        setIsFetchingRooms(false);
      }
  }, [booking.roomId]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const servicesRes = await getServices();
        setAvailableServices(servicesRes);
      } catch (error) {
        toast.error("Không thể tải danh sách dịch vụ.");
      }
    };

    if (open) {
      fetchInitialData();
      if (checkInDate && checkOutDate) {
          fetchRooms(checkInDate, checkOutDate);
      }
      // Reset form when dialog opens
      setBooking({
        customerName: "",
        phone: "",
        email: "",
        checkInDate: format(today, "yyyy-MM-dd"),
        checkOutDate: format(tomorrow, "yyyy-MM-dd"),
        advancePayment: 0,
        agreedPrice: 0,
        note: "",
        roomId: "",
        status: "pending",
        services: []
      });
      setSelectedServices([]);
      setCheckInDate(today);
      setCheckOutDate(tomorrow);
      setSelectedRoomPrice(0);
    }
  }, [open, fetchRooms]);


  useEffect(() => {
    let roomTotal = 0;
    if (checkInDate && checkOutDate && selectedRoomPrice > 0) {
      const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
      const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      const numberOfNights = Math.max(1, dayDiff);
      roomTotal = (selectedRoomPrice || 0) * numberOfNights;
    }
    
    const servicesTotal = selectedServices.reduce((total, service) => {
        return total + (service.price * service.quantity);
    }, 0);

    setBooking(prev => ({ ...prev, agreedPrice: roomTotal + servicesTotal }));

  }, [checkInDate, checkOutDate, selectedRoomPrice, selectedServices]);

  const handleChange = (field: keyof BookingData, value: string | number) => {
    if (field === 'roomId') {
        const selectedRoom = availableRooms.find(r => r.id === value);
        setSelectedRoomPrice(selectedRoom?.pricePerNight ?? 0);
    }
    setBooking((prev) => ({ ...prev, [field]: value as string }))
  }

  const handleAdvancePaymentChange = (value: string) => {
    const parsedValue = parseCurrency(value);
    setBooking(prev => ({ ...prev, advancePayment: parsedValue }));
  };

  const handleAddService = (service: Service) => {
    setSelectedServices(prev => {
      const existingService = prev.find(s => s.serviceId === String(service.id));
      if (existingService) {
        return prev.map(s => s.serviceId === String(service.id) ? { ...s, quantity: s.quantity + 1 } : s);
      } else {
        return [...prev, { serviceId: String(service.id), name: service.name, quantity: 1, price: service.price }];
      }
    });
  }

  const handleRemoveService = (serviceId: string) => {
    setSelectedServices(prev => prev.filter(s => s.serviceId !== serviceId));
  }

  const handleServiceQuantityChange = (serviceId: string, quantity: number) => {
    if (quantity < 1) {
      handleRemoveService(serviceId);
      return;
    }
    setSelectedServices(prev => prev.map(s => s.serviceId === serviceId ? { ...s, quantity } : s));
  }

  const handleCheckInDateChange = (date: Date | undefined) => {
    if (date) {
      setCheckInDate(date)
      const formattedDate = format(date, "yyyy-MM-dd")
      setBooking((prev) => ({ ...prev, checkInDate: formattedDate }))
      
      if (checkOutDate && date >= checkOutDate) {
        const newCheckoutDate = new Date(date)
        newCheckoutDate.setDate(date.getDate() + 1)
        setCheckOutDate(newCheckoutDate)
        setBooking((prev) => ({ 
          ...prev, 
          checkOutDate: format(newCheckoutDate, "yyyy-MM-dd") 
        }))
        fetchRooms(date, newCheckoutDate);
      } else if(checkOutDate) {
        fetchRooms(date, checkOutDate);
      }
    }
  }

  const handleCheckOutDateChange = (date: Date | undefined) => {
    if (date) {
      setCheckOutDate(date)
      const formattedDate = format(date, "yyyy-MM-dd")
      setBooking((prev) => ({ ...prev, checkOutDate: formattedDate }))
      if(checkInDate && date > checkInDate) {
        fetchRooms(checkInDate, date);
      }
    }
  }

  const handleSave = async () => {
    if (isSaving) return;

    if (!booking.customerName.trim()) {
      toast.error("Vui lòng nhập tên khách hàng")
      return
    }
    if (!booking.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại")
      return
    }
    if (!booking.roomId) {
      toast.error("Vui lòng chọn phòng")
      return
    }
    
    setIsSaving(true);
    try {
      await onSave({ ...booking, services: selectedServices })
    toast.success("Đã tạo đặt phòng thành công!")
    onOpenChange(false)
    } catch (error) {
       // Error toast is likely shown by the parent component's catch block
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] p-0 overflow-hidden border-2 border-[#369eff]">
        <div className="bg-[#369eff] bg-opacity-10 p-8">
          <div className="bg-white rounded-lg p-8">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-2xl font-bold text-center text-[#369eff]">ĐẶT PHÒNG MỚI</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-3 gap-8">
              {/* Left Column: Booking Info */}
              <div className="col-span-2 space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-2">
                        <Label htmlFor="customerName" className="text-base text-gray-700">Tên khách hàng <span className="text-red-500">*</span></Label>
                        <Input id="customerName" value={booking.customerName} onChange={(e) => handleChange("customerName", e.target.value)} className="border-b border-gray-400 bg-transparent rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-10"/>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                        <Label htmlFor="phone" className="text-base text-gray-700">Số điện thoại <span className="text-red-500">*</span></Label>
                        <Input id="phone" value={booking.phone} onChange={(e) => handleChange("phone", e.target.value)} className="border-b border-gray-400 bg-transparent rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-10"/>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                        <Label htmlFor="email" className="text-base text-gray-700">Email</Label>
                        <Input id="email" type="email" value={booking.email || ""} onChange={(e) => handleChange("email", e.target.value)} className="border-b border-gray-400 bg-transparent rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-10"/>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                        <Label htmlFor="roomId" className="text-base text-gray-700">Chọn phòng <span className="text-red-500">*</span></Label>
                        <Select value={booking.roomId} onValueChange={(value) => handleChange("roomId", value)} disabled={isFetchingRooms}>
                        <SelectTrigger id="roomId" className="border border-gray-400 bg-transparent rounded-md focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 h-10">
                            <SelectValue placeholder={isFetchingRooms ? "Đang tải phòng..." : "Chọn phòng"} />
                      </SelectTrigger>
                      <SelectContent>
                            {availableRooms.length > 0 ? availableRooms.map(room => (
                                <SelectItem key={room.id} value={room.id!}>
                                    {room.roomNumber} - {room.roomTypeName} ({formatCurrency(room.pricePerNight)})
                                </SelectItem>
                            )) : <SelectItem value="no-rooms" disabled>Không có phòng trống cho ngày đã chọn</SelectItem>}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="grid grid-cols-1 gap-2">
                        <Label htmlFor="checkInDate" className="text-base text-gray-700">Ngày nhận phòng</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-full justify-start text-left font-normal border-b border-gray-400 bg-transparent rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-10", !checkInDate && "text-gray-400")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkInDate ? format(checkInDate, "dd/MM/yyyy") : "Chọn ngày"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={checkInDate} onSelect={handleCheckInDateChange} initialFocus disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}/>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                        <Label htmlFor="checkOutDate" className="text-base text-gray-700">Ngày trả phòng</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className={cn("w-full justify-start text-left font-normal border-b border-gray-400 bg-transparent rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-10", !checkOutDate && "text-gray-400")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkOutDate ? format(checkOutDate, "dd/MM/yyyy") : "Chọn ngày"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={checkOutDate} onSelect={handleCheckOutDateChange} disabled={(date) => checkInDate ? date <= checkInDate : false} initialFocus/>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="grid grid-cols-1 gap-2">
                            <Label htmlFor="advancePayment" className="text-base text-gray-700">Trả trước (VNĐ)</Label>
                            <Input id="advancePayment" value={formatCurrency(booking.advancePayment)} onChange={(e) => handleAdvancePaymentChange(e.target.value)} className="border-b border-gray-400 bg-transparent rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-10"/>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            <Label htmlFor="agreedPrice" className="text-base text-gray-700">Tổng tiền</Label>
                      <Input
                              id="agreedPrice"
                              value={formatCurrency(booking.agreedPrice)}
                              className="border-b border-gray-400 bg-gray-100 rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-10"
                              readOnly
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                        <Label htmlFor="note" className="text-base text-gray-700">Ghi chú</Label>
                        <Input id="note" value={booking.note || ''} onChange={(e) => handleChange("note", e.target.value)} className="border-b border-gray-400 bg-transparent rounded-none focus:border-[#369eff] focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-10"/>
                    </div>
                  </div>
                </div>
                
                {/* Service Selection */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Dịch vụ đã chọn</h3>
                  <ScrollArea className="h-[150px] w-full rounded-md border p-4">
                    {selectedServices.length === 0 ? (
                      <p className="text-sm text-gray-500">Chưa có dịch vụ nào được chọn.</p>
                    ) : (
                      <div className="space-y-4">
                        {selectedServices.map(s => (
                          <div key={s.serviceId} className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{s.name}</p>
                              <p className="text-sm text-gray-500">{formatCurrency(s.price)}</p>
              </div>
                            <div className="flex items-center gap-2">
                <Input
                                type="number" 
                                value={s.quantity} 
                                onChange={(e) => handleServiceQuantityChange(s.serviceId, parseInt(e.target.value))}
                                className="w-16 h-8 text-center"
                                min="1"
                              />
                              <Button variant="ghost" size="icon" onClick={() => handleRemoveService(s.serviceId)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </div>

              {/* Right Column: Available Services */}
              <div className="col-span-1">
                <h3 className="text-lg font-semibold mb-4">Thêm dịch vụ</h3>
                <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                  <div className="space-y-2">
                    {availableServices.map(service => (
                      <div key={service.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100">
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-gray-500">{formatCurrency(service.price)}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleAddService(service)}>
                          <PlusCircle className="h-5 w-5 text-green-500" />
                </Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            <div className="flex justify-center gap-6 mt-8">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="bg-[#f08080] hover:bg-[#e06060] text-white border-none h-10 px-8" disabled={isSaving}>HỦY</Button>
              <Button onClick={handleSave} className="bg-[#369eff] hover:bg-[#2b7fd9] text-white h-10 px-8" disabled={isSaving}>
                {isSaving ? "Đang lưu..." : "LƯU ĐẶT PHÒNG"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
