"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
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
  numberOfAdults: number;
  numberOfChildren: number;
  advancePayment: number;
  agreedPrice: number;
  note: string;
  roomId: string;
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
    numberOfAdults: 2,
    numberOfChildren: 0,
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
        numberOfAdults: 2,
        numberOfChildren: 0,
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
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Tạo đặt phòng mới</DialogTitle>
            </DialogHeader>

        <ScrollArea className="max-h-[75vh] p-1">
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Middle Column (Main): Customer and Booking */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Info */}
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg mb-4">1. Thông tin khách hàng</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="customerName" className="text-right">Tên khách hàng</Label>
                    <Input id="customerName" value={booking.customerName} onChange={(e) => handleChange("customerName", e.target.value)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">Số điện thoại</Label>
                    <Input id="phone" value={booking.phone} onChange={(e) => handleChange("phone", e.target.value)} className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">Email</Label>
                    <Input id="email" type="email" value={booking.email || ""} onChange={(e) => handleChange("email", e.target.value)} className="col-span-3" />
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg mb-4">2. Chi tiết đặt phòng</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Ngày nhận phòng</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal col-span-3", !checkInDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkInDate ? format(checkInDate, "dd/MM/yyyy") : <span>Chọn ngày</span>}
                          </Button>
                        </PopoverTrigger>
                      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={checkInDate} onSelect={handleCheckInDateChange} /></PopoverContent>
                      </Popover>
                    </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Ngày trả phòng</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                         <Button variant="outline" className={cn("w-full justify-start text-left font-normal col-span-3", !checkOutDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                          {checkOutDate ? format(checkOutDate, "dd/MM/yyyy") : <span>Chọn ngày</span>}
                          </Button>
                        </PopoverTrigger>
                      <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={checkOutDate} onSelect={handleCheckOutDateChange} /></PopoverContent>
                      </Popover>
                  </div>
                   <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Chọn phòng</Label>
                       <Select value={booking.roomId} onValueChange={(value) => handleChange("roomId", value)} disabled={isFetchingRooms}>
                         <SelectTrigger className="col-span-3">{isFetchingRooms ? 'Đang tải...' : (availableRooms.find(r => r.id === booking.roomId)?.roomTypeName || 'Chọn phòng')}</SelectTrigger>
                         <SelectContent>
                          {availableRooms.filter(room => room.id).map(room => (
                            <SelectItem key={room.id} value={room.id!}>
                              {room.roomTypeName} ({room.roomNumber}) - {formatCurrency(room.pricePerNight)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                        </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="numberOfAdults" className="text-right">Người lớn</Label>
                      <Input id="numberOfAdults" type="number" min="1" value={booking.numberOfAdults} onChange={(e) => handleChange("numberOfAdults", parseInt(e.target.value, 10))} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="numberOfChildren" className="text-right">Trẻ em</Label>
                      <Input id="numberOfChildren" type="number" min="0" value={booking.numberOfChildren} onChange={(e) => handleChange("numberOfChildren", parseInt(e.target.value, 10))} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                       <Label htmlFor="note" className="text-right">Ghi chú</Label>
                       <Input id="note" value={booking.note || ''} onChange={(e) => handleChange("note", e.target.value)} className="col-span-3" />
                    </div>
                </div>
              </div>

            </div>

            {/* Right Column (Side): Services & Pricing */}
            <div className="lg:col-span-1 space-y-4">
               <div className="p-4 border rounded-lg">
                 <h3 className="font-semibold text-lg mb-2">3. Dịch vụ & Thanh toán</h3>
                 {/* Pricing */}
                 <div className="space-y-4 mb-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Tổng tiền</Label>
                        <Input value={formatCurrency(booking.agreedPrice)} readOnly className="bg-gray-100 font-bold col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right">Trả trước</Label>
                        <Input value={formatCurrency(booking.advancePayment)} onChange={(e) => handleAdvancePaymentChange(e.target.value)} className="col-span-3" />
                  </div>
                </div>
                
                 {/* Selected Services */}
                 <div className="mb-4">
                    <h4 className="font-medium mb-2 text-sm">Đã chọn:</h4>
                     <ScrollArea className="h-40 w-full rounded-md border p-2">
                    {selectedServices.length === 0 ? (
                         <p className="text-sm text-gray-500 text-center py-4">Chưa có dịch vụ nào.</p>
                    ) : (
                         <div className="space-y-2">
                        {selectedServices.map(s => (
                             <div key={s.serviceId} className="flex items-center justify-between text-sm">
                            <div>
                              <p className="font-medium">{s.name}</p>
                                 <p className="text-xs text-gray-500">{formatCurrency(s.price)}</p>
              </div>
                            <div className="flex items-center gap-2">
                                 <Input type="number" value={s.quantity} onChange={(e) => handleServiceQuantityChange(s.serviceId, parseInt(e.target.value))} className="w-14 h-8 text-center" min="1"/>
                                 <Button variant="ghost" size="icon" onClick={() => handleRemoveService(s.serviceId)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
                 {/* Available Services */}
                 <div>
                    <h4 className="font-medium mb-2 text-sm">Thêm dịch vụ:</h4>
                     <ScrollArea className="h-60 w-full rounded-md border p-2">
                       <div className="space-y-1">
                    {availableServices.map(service => (
                           <div key={service.id} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 text-sm">
                        <div>
                          <p className="font-medium">{service.name}</p>
                               <p className="text-xs text-gray-500">{formatCurrency(service.price)}</p>
                        </div>
                             <Button variant="ghost" size="icon" onClick={() => handleAddService(service)}><PlusCircle className="h-5 w-5 text-green-500" /></Button>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
            </div>

          </div>
        </ScrollArea>
        
        <DialogFooter className="p-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>Hủy</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Đang lưu..." : "Lưu đặt phòng"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
