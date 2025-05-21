"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useSaved } from "@/lib/saved-context"
import { get } from "@/lib/api-service"
import { shouldUseMockData } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Trash2, Heart, Star, Hotel, Coffee, Search, CalendarDays, Utensils, Car, Dumbbell, Waves, Wifi, ShoppingBag, AlertTriangle, CheckCircle, Plus, ChevronLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

interface Booking {
  id: string | number
  roomName: string
}

export default function SavedPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { savedRooms, savedServices, loading: savedLoading, removeRoom, removeService } = useSaved()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  // Service booking state
  const [dialogOpen, setDialogOpen] = useState(false)
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<any | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [selectedBookingId, setSelectedBookingId] = useState<string>("")
  
  useEffect(() => {
    // Just set loading to false when savedRooms and savedServices are loaded
    if (!savedLoading) {
      setLoading(false)
    }
  }, [savedLoading])
  
  // Format price as VND
  const formatPrice = (price: number): string => {
    return price.toLocaleString('vi-VN') + ' ₫'
  }
  
  // Get icon for service category
  const getServiceIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'food':
        return <Utensils className="w-4 h-4" />
      case 'transport':
        return <Car className="w-4 h-4" />
      case 'fitness':
        return <Dumbbell className="w-4 h-4" />
      case 'spa':
        return <Waves className="w-4 h-4" />
      case 'connectivity':
        return <Wifi className="w-4 h-4" />
      case 'shopping':
        return <ShoppingBag className="w-4 h-4" />
      default:
        return <Coffee className="w-4 h-4" />
    }
  }
  
  // Book a room directly
  const bookRoom = (roomId: number) => {
    router.push(`/customer/room/${roomId}`)
  }
  
  // Prepare to book a service
  const handleBookService = (service: any) => {
    setSelectedService(service)
    setQuantity(1) // Always reset to 1 when opening dialog
    
    // For fixed quantity services, skip the quantity selection dialog
    if (service.isFixedQuantity) {
      setBookingDialogOpen(true)
      fetchActiveBookings()
    } else {
      setDialogOpen(true)
    }
  }
  
  // Fetch active bookings
  const fetchActiveBookings = () => {
    setLoadingBookings(true)
    
    // In a real app, you would fetch this from the API
    if (shouldUseMockData()) {
      // Mock booking data
      const mockBookings = [
        { id: 1, roomName: "Phòng Deluxe King - 101" },
        { id: 2, roomName: "Phòng Premium Double - 203" },
        { id: 3, roomName: "Suite Biển - 305" },
      ]
      
      setTimeout(() => {
        setBookings(mockBookings)
        setLoadingBookings(false)
      }, 500)
    } else {
      // Real API call would go here
      get<Booking[]>('Bookings/active')
        .then(data => {
          setBookings(data)
        })
        .catch(err => {
          console.error("Error fetching bookings:", err)
          toast.error("Không thể tải danh sách đặt phòng.")
        })
        .finally(() => {
          setLoadingBookings(false)
        })
    }
  }
  
  // Confirm service booking - only for variable quantity services
  const confirmServiceBooking = () => {
    if (!selectedService) return
    
    // Show booking selection dialog
    setBookingDialogOpen(true)
    fetchActiveBookings()
  }
  
  // Add service to selected booking
  const addServiceToBooking = () => {
    if (!selectedService || !selectedBookingId) {
      toast.error("Vui lòng chọn phòng đã đặt để thêm dịch vụ")
      return
    }
    
    // For fixed quantity services, always use quantity of 1
    const serviceQuantity = selectedService.isFixedQuantity ? 1 : quantity
    
    const bookedService = {
      id: selectedService.serviceId,
      name: selectedService.serviceName,
      price: selectedService.price,
      quantity: serviceQuantity,
      totalPrice: selectedService.price * serviceQuantity
    }
    
    // Get current booking services from localStorage
    const storageKey = `booking_services_${selectedBookingId}`
    const existingServicesJson = localStorage.getItem(storageKey)
    let services = []
    
    if (existingServicesJson) {
      try {
        services = JSON.parse(existingServicesJson)
        
        // For fixed quantity services, check if it already exists - don't allow duplicates
        if (selectedService.isFixedQuantity) {
          const existingIndex = services.findIndex((s: any) => s.id === bookedService.id)
          if (existingIndex >= 0) {
            toast.error(`Dịch vụ "${selectedService.serviceName}" đã được đặt và không thể đặt thêm`)
            setBookingDialogOpen(false)
            setSelectedService(null)
            setSelectedBookingId("")
            return
          }
          // Add new fixed service
          services.push(bookedService)
        } else {
          // For regular services, update quantity if exists
          const existingIndex = services.findIndex((s: any) => s.id === bookedService.id)
          
          if (existingIndex >= 0) {
            // Update existing service
            services[existingIndex] = {
              ...services[existingIndex],
              quantity: services[existingIndex].quantity + bookedService.quantity,
              totalPrice: services[existingIndex].price * (services[existingIndex].quantity + bookedService.quantity)
            }
          } else {
            // Add new service
            services.push(bookedService)
          }
        }
      } catch (err) {
        console.error("Error parsing services from localStorage:", err)
        // Start fresh if there's an error
        services = [bookedService]
      }
    } else {
      // No existing services, add the new one
      services = [bookedService]
    }
    
    // Save back to localStorage
    localStorage.setItem(storageKey, JSON.stringify(services))
    
    // Close dialogs
    setDialogOpen(false)
    setBookingDialogOpen(false)
    
    // Reset state
    setSelectedService(null)
    setQuantity(1)
    setSelectedBookingId("")
    
    // Show success message
    toast.success(
      <div className="flex items-center">
        <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
        <div>
          <p className="font-medium">Đã thêm dịch vụ vào đặt phòng</p>
          <p className="text-sm">{bookedService.name}{!selectedService.isFixedQuantity && ` (${serviceQuantity})`}</p>
        </div>
      </div>,
      {
        action: {
          label: "Xem chi tiết",
          onClick: () => router.push(`/customer/booking/${selectedBookingId}`)
        }
      }
    )
  }
  
  const renderRooms = () => {
    if (!savedRooms.length) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700">Chưa có phòng nào được lưu</h3>
          <p className="text-gray-500 mt-1 mb-4">Bạn chưa lưu phòng nào vào danh sách yêu thích</p>
          <Link href="/customer/search">
            <Button>
              <Search className="w-4 h-4 mr-2" />
              Tìm phòng ngay
            </Button>
          </Link>
        </div>
      )
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedRooms.map(room => (
          <Card key={room.id} className="overflow-hidden hover:shadow-md transition">
            <div className="relative h-48">
              {room.imageUrl ? (
                <Image
                  src={room.imageUrl}
                  alt={room.roomType}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Hotel className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <button 
                onClick={() => removeRoom(room.roomId)}
                className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:bg-red-50 transition"
                title="Xóa khỏi danh sách yêu thích"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
            
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{room.roomType}</h3>
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="text-sm ml-1">4.8</span>
                </div>
              </div>
              
              <p className="text-gray-500 text-sm mb-3 line-clamp-2">{room.description}</p>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold text-lg">{formatPrice(room.price)}</span>
                  <span className="text-sm text-gray-500">/đêm</span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="hover:bg-blue-50 hover:text-blue-600"
                    onClick={() => router.push(`/customer/room/${room.roomId}`)}
                  >
                    Chi tiết
                  </Button>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => bookRoom(room.roomId)}
                  >
                    Đặt phòng
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
  
  const renderServices = () => {
    if (!savedServices.length) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700">Chưa có dịch vụ nào được lưu</h3>
          <p className="text-gray-500 mt-1 mb-4">Bạn chưa lưu dịch vụ nào vào danh sách yêu thích</p>
          <Link href="/customer/services">
            <Button>
              <Coffee className="w-4 h-4 mr-2" />
              Xem dịch vụ
            </Button>
          </Link>
        </div>
      )
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedServices.map(service => (
          <Card key={service.id} className="overflow-hidden hover:shadow-md transition">
            <div className="relative h-40">
              {service.imageUrl ? (
                <Image
                  src={service.imageUrl}
                  alt={service.serviceName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Coffee className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <button 
                onClick={() => removeService(service.serviceId)}
                className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:bg-red-50 transition"
                title="Xóa khỏi danh sách yêu thích"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
              
              {service.isFixedQuantity && (
                <span className="absolute bottom-2 left-2 text-xs px-2 py-1 bg-blue-600/80 text-white rounded-full">
                  Dịch vụ cố định
                </span>
              )}
            </div>
            
            <CardContent className="p-5">
              <div className="flex items-start gap-2 mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{service.serviceName}</h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    {getServiceIcon(service.category)}
                    <span className="ml-1 capitalize">{service.category}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-500 text-sm mb-3 line-clamp-2">{service.description}</p>
              
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-600">{formatPrice(service.price)}</span>
                
                <Button 
                  size="sm" 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleBookService(service)}
                >
                  Đặt dịch vụ
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="container max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Đã lưu</h1>
      
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
          <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-lg text-center shadow-sm">
          {error}
        </div>
      ) : (
        <Tabs defaultValue="rooms" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="rooms" className="text-center">
              <Hotel className="w-4 h-4 mr-2" />
              Phòng
              {savedRooms.length > 0 && <span className="ml-2 inline-block bg-blue-100 text-blue-800 text-xs rounded-full px-2">{savedRooms.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="services" className="text-center">
              <Coffee className="w-4 h-4 mr-2" />
              Dịch vụ
              {savedServices.length > 0 && <span className="ml-2 inline-block bg-blue-100 text-blue-800 text-xs rounded-full px-2">{savedServices.length}</span>}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="rooms" className="space-y-6">
            {renderRooms()}
          </TabsContent>
          
          <TabsContent value="services" className="space-y-6">
            {renderServices()}
          </TabsContent>
        </Tabs>
      )}
      
      {/* Service booking dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Đặt dịch vụ</DialogTitle>
            <DialogDescription>
              Vui lòng chọn số lượng dịch vụ bạn muốn đặt.
            </DialogDescription>
          </DialogHeader>
          
          {selectedService && (
            <div className="space-y-4">
              <div className="p-4 border rounded-md bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{selectedService.serviceName}</h3>
                    <p className="text-sm text-gray-600">{selectedService.description}</p>
                    {selectedService.isFixedQuantity && (
                      <div className="mt-2">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          Dịch vụ cố định
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="font-bold text-blue-700">{formatPrice(selectedService.price)}</span>
                </div>
              </div>
              
              {/* {!selectedService.isFixedQuantity && (
                <div className="space-y-2">
                  <Label htmlFor="quantity">Số lượng</Label>
                  <div className="flex items-center">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      disabled={quantity <= 1}
                      className="h-9 w-9 p-0"
                    >
                      -
                    </Button>
                    <Input
                      id="quantity"
                      className="h-9 w-20 mx-2 text-center"
                      value={quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value)
                        if (!isNaN(value) && value >= 1) {
                          setQuantity(value)
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="h-9 w-9 p-0"
                    >
                      +
                    </Button>
                  </div>
                </div>
              )} */}
              
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-sm font-medium">Tổng tiền:</span>
                <span className="font-bold text-xl text-blue-700">
                  {formatPrice(selectedService.price * (selectedService.isFixedQuantity ? 1 : quantity))}
                </span>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex space-x-2 sm:space-x-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={confirmServiceBooking}
            >
              Tiếp tục
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Booking selection dialog */}
      <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chọn đặt phòng</DialogTitle>
            <DialogDescription>
              {selectedService ? (
                <div className="mt-2">
                  <div className="p-3 bg-gray-50 rounded-md mb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{selectedService.serviceName}</h3>
                        {selectedService.isFixedQuantity && (
                          <div className="mt-1">
                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                              Dịch vụ cố định
                            </span>
                          </div>
                        )}
                      </div>
                      <span className="font-medium">{formatPrice(selectedService.price)}</span>
                    </div>
                  </div>
                  <p>Vui lòng chọn đặt phòng bạn muốn thêm dịch vụ.</p>
                </div>
              ) : (
                <p>Vui lòng chọn đặt phòng bạn muốn thêm dịch vụ.</p>
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {loadingBookings ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="animate-spin w-6 h-6 text-blue-600 mr-2" />
                <span>Đang tải danh sách đặt phòng...</span>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-2" />
                <h3 className="font-medium text-lg">Không có đặt phòng nào</h3>
                <p className="text-gray-600 text-sm mt-1">Bạn cần đặt phòng trước khi đặt dịch vụ.</p>
                <Button 
                  className="mt-4" 
                  variant="outline"
                  onClick={() => router.push('/customer/search')}
                >
                  Đặt phòng ngay
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {bookings.map(booking => (
                  <div
                    key={booking.id}
                    className={`p-4 border rounded-md cursor-pointer transition-all ${
                      selectedBookingId === booking.id.toString()
                        ? 'border-blue-500 bg-blue-50'
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedBookingId(booking.id.toString())}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{booking.roomName}</h3>
                        <p className="text-sm text-gray-600">Mã đặt phòng: #{booking.id}</p>
                      </div>
                      {selectedBookingId === booking.id.toString() && (
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <DialogFooter className="flex space-x-2 sm:space-x-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setBookingDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="button"
              disabled={!selectedBookingId || loadingBookings || bookings.length === 0}
              onClick={addServiceToBooking}
            >
              Đặt dịch vụ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 