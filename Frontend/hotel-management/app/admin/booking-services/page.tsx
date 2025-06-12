"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { getBookings, Booking } from "@/lib/booking-service"
import { getServices, Service } from "@/lib/service-service"
import { getRooms, Room } from "@/lib/room-service"
import { 
  getServicesForBooking, 
  createBookingService,
  deleteServicesForBooking,
} from "@/lib/booking-service-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, Trash2, User, BedDouble, Calendar as CalendarIcon, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

interface SelectedService {
  serviceId: string;
  name: string;
  quantity: number;
  price: number;
}

export default function AdminManageBookingServicesPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [catalogServices, setCatalogServices] = useState<Service[]>([])
  const [open, setOpen] = useState(false)
  const [selectedBookingId, setSelectedBookingId] = useState<string>("")
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([])
  const [initialServices, setInitialServices] = useState<SelectedService[]>([])
  const [serviceSearchQuery, setServiceSearchQuery] = useState("");

  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLoading(true)
        const [bookingsData, servicesData, roomsData] = await Promise.all([
          getBookings(),
          getServices(),
          getRooms(),
        ])
        setBookings(bookingsData)
        setCatalogServices(servicesData)
        setRooms(roomsData)
      } catch (error) {
        toast.error("Không thể tải dữ liệu cần thiết.")
      } finally {
        setLoading(false)
      }
    }
    fetchInitialData()
  }, [])

  useEffect(() => {
    if (!selectedBookingId) {
      setSelectedServices([])
      setInitialServices([])
      return
    }

    async function fetchBookingServices() {
      try {
        const data = await getServicesForBooking(selectedBookingId)
        
        const serviceMap = new Map<string, SelectedService>();
        data.forEach(bs => {
            const existing = serviceMap.get(bs.serviceId);
            if (existing) {
                existing.quantity += bs.quantity;
            } else {
                const catalogItem = catalogServices.find(s => String(s.id) === bs.serviceId);
                serviceMap.set(bs.serviceId, {
                    serviceId: bs.serviceId,
                    name: catalogItem?.name || 'Dịch vụ không xác định',
                    quantity: bs.quantity,
                    price: catalogItem?.price || 0,
                });
            }
        });
        const mappedServices = Array.from(serviceMap.values());

        setSelectedServices(mappedServices)
        setInitialServices(mappedServices)
      } catch (error) {
        toast.error("Không thể tải dịch vụ cho đặt phòng này.")
        setSelectedServices([])
        setInitialServices([])
      }
    }
    fetchBookingServices()
  }, [selectedBookingId, catalogServices])

  const selectedBooking = useMemo(() => {
    return bookings.find(b => String(b.id) === selectedBookingId)
  }, [selectedBookingId, bookings])
  
  const room = useMemo(() => {
    if (!selectedBooking) return null;
    return rooms.find(r => String(r.id) === String(selectedBooking.roomId));
  }, [selectedBooking, rooms]);

  const isDirty = useMemo(() => {
    if (initialServices.length !== selectedServices.length) return true;
    const sortedInitial = [...initialServices].sort((a, b) => Number(a.serviceId) - Number(b.serviceId));
    const sortedCurrent = [...selectedServices].sort((a, b) => Number(a.serviceId) - Number(b.serviceId));
    return sortedInitial.some((service, index) => {
        const currentService = sortedCurrent[index];
        return service.serviceId !== currentService.serviceId || service.quantity !== currentService.quantity;
    });
  }, [initialServices, selectedServices]);

  const totalServiceCost = useMemo(() => {
    return selectedServices.reduce((total, s) => total + (s.price * s.quantity), 0)
  }, [selectedServices])

  const handleAddService = (service: Service) => {
    setSelectedServices(prev => {
      const existing = prev.find(s => s.serviceId === String(service.id));
      if (existing) {
        return prev.map(s => s.serviceId === String(service.id) ? { ...s, quantity: s.quantity + 1 } : s);
      }
      return [...prev, { serviceId: String(service.id), name: service.name, quantity: 1, price: service.price }];
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
    setSelectedServices(prev => prev.map(s => (s.serviceId === serviceId ? { ...s, quantity } : s)));
  }

  const handleSaveChanges = async () => {
    if (!selectedBookingId) return;
    setIsSaving(true);
    try {
      await deleteServicesForBooking(selectedBookingId);
      if(selectedServices.length > 0) {
        const servicePromises = selectedServices.map(s =>
          createBookingService({
            bookingId: selectedBookingId,
            serviceId: String(s.serviceId),
            quantity: s.quantity,
            price: s.price,
          })
        );
        await Promise.all(servicePromises);
      }
      setInitialServices(selectedServices)
      toast.success(`Đã cập nhật dịch vụ cho đặt phòng ${selectedBooking?.bookingCode}.`);
    } catch (error) {
      toast.error("Lưu dịch vụ thất bại.");
    } finally {
      setIsSaving(false);
    }
  }
  
  const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN').format(amount);
  const formatDate = (dateString?: string) => dateString ? new Date(dateString).toLocaleDateString('vi-VN') : 'N/A';
  
  const filteredCatalogServices = catalogServices.filter(service => 
    service.name.toLowerCase().includes(serviceSearchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Spinner size="large" /></div>;
  }
  
  return (
    <div className="space-y-6">
       <div className="mb-8">
        <h1 className="text-3xl font-bold">Đặt Dịch vụ cho Khách</h1>
        <p className="text-gray-600">Chọn một đặt phòng để thêm hoặc quản lý dịch vụ.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chọn Đặt phòng</CardTitle>
           <CardDescription>Bắt đầu bằng cách chọn một đặt phòng từ danh sách</CardDescription>
        </CardHeader>
        <CardContent>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={open} className="w-full md:w-[400px] justify-between">
                        {selectedBookingId ? bookings.find(b => String(b.id) === selectedBookingId)?.bookingCode + ' - ' + bookings.find(b => String(b.id) === selectedBookingId)?.customerName : "Chọn đặt phòng..."}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                    <Command>
                        <CommandInput placeholder="Tìm mã đặt phòng hoặc tên..." />
                        <CommandList>
                            <CommandEmpty>Không tìm thấy đặt phòng.</CommandEmpty>
                            <CommandGroup>
                                {bookings.map(b => (
                                    <CommandItem key={`booking-${b.id}`} value={b.bookingCode + " " + b.customerName} onSelect={() => { setSelectedBookingId(String(b.id)); setOpen(false); }}>
                                        {b.bookingCode} - {b.customerName}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </CardContent>
      </Card>

        {selectedBooking && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Selected Services Card */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Dịch vụ Đã chọn</CardTitle>
                            <CardDescription>Các dịch vụ cho đặt phòng {selectedBooking.bookingCode}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-80 pr-4">
                                {selectedServices.length === 0 ? (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-gray-500">Chưa có dịch vụ nào được chọn.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {selectedServices.map(s => (
                                            <div key={`selected-service-${s.serviceId}`} className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium">{s.name}</p>
                                                    <p className="text-sm text-gray-500">{formatCurrency(s.price)}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Input type="number" value={s.quantity} onChange={e => handleServiceQuantityChange(s.serviceId, parseInt(e.target.value))} className="w-16 h-9 text-center" min="1"/>
                                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveService(s.serviceId)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                        <CardFooter className="flex flex-col items-end space-y-2 pt-4 border-t">
                            <div className="flex justify-between w-full text-lg font-semibold">
                                <span>Tổng tiền dịch vụ:</span>
                                <span>{formatCurrency(totalServiceCost)}</span>
                            </div>
                        </CardFooter>
                    </Card>

                    {/* Catalog Services Card */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Danh mục Dịch vụ</CardTitle>
                            <CardDescription>Chọn dịch vụ từ danh sách để thêm vào đặt phòng</CardDescription>
                        </CardHeader>
                         <CardContent>
                            <div className="relative mb-4">
                               <Input placeholder="Tìm dịch vụ..." value={serviceSearchQuery} onChange={e => setServiceSearchQuery(e.target.value)} className="pl-9" />
                               <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                            <ScrollArea className="h-80 pr-4">
                                <div className="space-y-2">
                                    {filteredCatalogServices.map(service => (
                                    <div key={`catalog-service-${service.id}`} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
                                        <div>
                                            <p className="font-medium">{service.name}</p>
                                            <p className="text-sm text-gray-500">{formatCurrency(service.price)}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" onClick={() => handleAddService(service)}>
                                            <PlusCircle className="h-5 w-5 text-green-500" />
                                        </Button>
                                    </div>
                                    ))}
                                    {filteredCatalogServices.length === 0 && <p className="text-center text-gray-500 pt-4">Không tìm thấy dịch vụ.</p>}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>
                </div>

                {/* Booking Info Card */}
                <Card className="lg:col-span-1 h-fit sticky top-6">
                    <CardHeader>
                        <CardTitle>Thông tin Đặt phòng</CardTitle>
                        <CardDescription>{selectedBooking.bookingCode}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                         <div className="flex items-center">
                            <User className="w-4 h-4 mr-3 text-gray-500"/>
                            <span>{selectedBooking.customerName}</span>
                        </div>
                        <div className="flex items-center">
                            <BedDouble className="w-4 h-4 mr-3 text-gray-500"/>
                            <span>Phòng {room?.roomNumber || 'N/A'}</span>
                        </div>
                         <Separator/>
                        <div className="flex items-center">
                            <CalendarIcon className="w-4 h-4 mr-3 text-gray-500"/>
                            <span>Nhận: {formatDate(selectedBooking.checkIn)}</span>
                        </div>
                         <div className="flex items-center">
                             <CalendarIcon className="w-4 h-4 mr-3 text-gray-500"/>
                             <span>Trả: {formatDate(selectedBooking.checkOut)}</span>
                        </div>
                    </CardContent>
                    <CardFooter>
                         <Button onClick={handleSaveChanges} disabled={isSaving || !isDirty} className="w-full">
                            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )}
    </div>
  )
} 