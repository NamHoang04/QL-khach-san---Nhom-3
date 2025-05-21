"use client"

import { useState, useEffect } from "react"
import { get } from "@/lib/api-service"
import { shouldUseMockData } from "@/lib/config"
import { 
  Utensils, 
  Car, 
  Dumbbell, 
  Waves, 
  Wifi, 
  ShoppingBag, 
  Plus, 
  Sparkles,
  Loader2,
  ChevronLeft,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Service {
  id: number
  name: string
  price: number
  childPrice?: number
  description: string
  category?: string
  imageUrl?: string
  isFixedQuantity?: boolean
  unitType: string
}

interface BookedService {
  id: number
  name: string
  price: number
  quantity: number
  childQuantity?: number
  totalPrice: number
}

export default function ServicesPage() {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [childQuantity, setChildQuantity] = useState(0)
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false)
  const [selectedBookingId, setSelectedBookingId] = useState<string>("")
  const [bookings, setBookings] = useState<Array<{id: string | number, roomName: string}>>([])
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [showCustomAdultQuantityInput, setShowCustomAdultQuantityInput] = useState(false)
  const [showCustomChildQuantityInput, setShowCustomChildQuantityInput] = useState(false)

  // Service categories
  const categories = [
    { id: "all", name: "Tất cả", icon: Sparkles },
    { id: "food", name: "Ẩm thực", icon: Utensils },
    { id: "transport", name: "Đưa đón", icon: Car },
    { id: "spa", name: "Spa & Massage", icon: Waves },
    { id: "laundry", name: "Giặt ủi", icon: ShoppingBag },
  ]

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        
        if (shouldUseMockData()) {
          // Mock service data
          const mockServices: Service[] = [
            { 
              id: 1, 
              name: "Buffet sáng", 
              price: 250000,
              childPrice: 200000,
              description: "Buffet sáng với đa dạng món ăn Á - Âu, phù hợp cho cả gia đình",
              category: "food",
              imageUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf",
              unitType: "người"
            },
            { 
              id: 2, 
              name: "Đưa đón sân bay", 
              price: 400000,
              childPrice: 200000,
              description: "Dịch vụ đưa đón sân bay sang trọng, thoải mái với xe riêng",
              category: "transport",
              imageUrl: "https://images.unsplash.com/photo-1549194898-0cb3ed2fa95e",
              unitType: "người"
            },
            { 
              id: 3, 
              name: "Spa & Massage", 
              price: 850000, 
              description: "Dịch vụ spa và massage cao cấp, giúp thư giãn và làm đẹp",
              category: "spa",
              imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874",
              unitType: "người"
            },
            { 
              id: 4, 
              name: "Dịch vụ giặt ủi", 
              price: 150000, 
              description: "Dịch vụ giặt và ủi quần áo chuyên nghiệp, đảm bảo sạch sẽ và phẳng phiu",
              category: "laundry",
              imageUrl: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f",
              unitType: "kg"
            }
          ]
          setServices(mockServices)
        } else {
          // Real API call
          const data = await get<Service[]>('Services')
          // Add default categories if not present in API response
          const processedData = data.map(service => ({
            ...service,
            category: service.category || getRandomCategory(),
            imageUrl: service.imageUrl || getPlaceholderImage(service.name)
          }))
          setServices(processedData)
        }
      } catch (err) {
        console.error("Error fetching services:", err)
        setError("Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchServices()
  }, [])
  
  // Generate a random category for services without one
  const getRandomCategory = (): string => {
    const categoryIds = categories.filter(c => c.id !== 'all').map(c => c.id)
    return categoryIds[Math.floor(Math.random() * categoryIds.length)]
  }
  
  // Get a placeholder image for services without one
  const getPlaceholderImage = (serviceName: string): string => {
    // Use name to consistently generate the same number (for consistent images)
    const nameSum = serviceName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return `https://source.unsplash.com/random/300x200?hotel,service&sig=${nameSum}`
  }
  
  // Filter services by active category
  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter(service => service.category === activeCategory)
  
  // Format price as VND
  const formatPrice = (price: number): string => {
    return price.toLocaleString('vi-VN') + ' ₫'
  }
  
  // Handle booking service
  const handleBookService = (service: Service) => {
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
      get<Array<{id: string | number, roomName: string}>>('Bookings/active')
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
    
    const bookedService: BookedService = {
      id: selectedService.id,
      name: selectedService.name,
      price: selectedService.price,
      quantity: quantity,
      childQuantity: selectedService.childPrice ? childQuantity : undefined,
      totalPrice: (selectedService.price * quantity) + 
                 (selectedService.childPrice ? selectedService.childPrice * childQuantity : 0)
    }
    
    // Get current booking services from localStorage
    const storageKey = `booking_services_${selectedBookingId}`
    const existingServicesJson = localStorage.getItem(storageKey)
    let services: BookedService[] = []
    
    if (existingServicesJson) {
      try {
        services = JSON.parse(existingServicesJson)
        
        // For fixed quantity services, check if it already exists - don't allow duplicates
        if (selectedService.isFixedQuantity) {
          const existingIndex = services.findIndex(s => s.id === bookedService.id)
          if (existingIndex >= 0) {
            toast.error(`Dịch vụ "${selectedService.name}" đã được đặt và không thể đặt thêm`)
            setBookingDialogOpen(false)
            setSelectedService(null)
            setSelectedBookingId("")
            return
          }
          // Add new fixed service
          services.push(bookedService)
        } else {
          // For regular services, update quantity if exists
          const existingIndex = services.findIndex(s => s.id === bookedService.id)
          
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
    setChildQuantity(0)
    setSelectedBookingId("")
    
    // Show success message
    toast.success((
      <div className="flex items-center">
        <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
        <div>
          <p className="font-medium">Đã thêm dịch vụ vào đặt phòng</p>
          <p className="text-sm">{bookedService.name}{!selectedService.isFixedQuantity && ` (${quantity} người lớn${selectedService.childPrice ? `, ${childQuantity} trẻ em` : ''})`}</p>
        </div>
      </div>
    ), {
      action: {
        label: "Xem chi tiết",
        onClick: () => router.push(`/customer/booking/${selectedBookingId}`)
      }
    })
  }
  
  return (
    <div className="max-w-7xl mx-auto" style={{ width: 'auto', height: 'auto' }}>
      <div className="flex items-center gap-2 mb-2">
        <Link href="/customer" className="text-blue-600 hover:underline flex items-center">
          <ChevronLeft className="h-4 w-4" />
          <span>Quay lại</span>
        </Link>
      </div>
    
      <h1 className="text-2xl font-bold mb-6">Dịch vụ</h1>
      
      {/* Categories selector */}
      <div className="mb-8 overflow-x-auto pb-2 -mx-1">
        <div className="flex space-x-2">
          {categories.map((category) => {
            const CategoryIcon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap
                  ${activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                `}
              >
                <CategoryIcon className="w-4 h-4" />
                <span>{category.name}</span>
              </button>
            )
          })}
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center p-12 bg-white rounded-lg shadow-sm border">
          <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
          <span className="ml-2 text-gray-600">Đang tải dịch vụ...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-lg text-center shadow-sm">
          {error}
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-white p-8 rounded-lg text-center shadow-sm border">
          <h3 className="text-xl font-medium text-gray-700 mb-2">Không có dịch vụ nào</h3>
          <p className="text-gray-500">Không tìm thấy dịch vụ nào trong danh mục này.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div key={service.id} className="bg-white rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition">
              <div className="bg-gray-200 relative" style={{ minHeight: '200px', height: 'auto' }}>
                {service.imageUrl ? (
                  <div className="h-full">
                    <Image 
                      src={service.imageUrl} 
                      alt={service.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center bg-blue-100">
                    <span className="text-blue-600 font-medium">Hình ảnh dịch vụ</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex justify-between">
                  <h3 className="font-bold text-lg">{service.name}</h3>
                  {service.category && (
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                      {categories.find(c => c.id === service.category)?.name || service.category}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm my-3">{service.description}</p>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{service.unitType === 'người' ? 'Giá người lớn:' : 'Giá:'}</span>
                    <span className="font-bold text-blue-700">{formatPrice(service.price)}</span>
                  </div>
                  {service.childPrice && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Giá trẻ em:</span>
                      <span className="font-bold text-blue-700">{formatPrice(service.childPrice)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Đơn vị tính:</span>
                    <span className="text-sm text-gray-600">
                      {service.unitType === "người" ? "người" : service.unitType === "kg" ? "kg" : service.unitType}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleBookService(service)}
                  >
                    Đặt ngay
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
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
                    <h3 className="font-bold">{selectedService.name}</h3>
                    <p className="text-sm text-gray-600">{selectedService.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-700">{formatPrice(selectedService.price)}</div>
                    {selectedService.childPrice && (
                      <div className="text-sm text-gray-600">Trẻ em: {formatPrice(selectedService.childPrice)}</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Số lượng {selectedService.unitType === 'kg' ? 'kg' : 'người lớn'}</Label>
                  <Select
                    value={showCustomAdultQuantityInput ? 'custom' : quantity.toString()}
                    onValueChange={(value) => {
                      if (value === 'custom') {
                        setShowCustomAdultQuantityInput(true);
                        setQuantity(0); // Reset quantity when switching to custom
                      } else {
                        setShowCustomAdultQuantityInput(false);
                        if (selectedService?.unitType === 'kg') {
                           setQuantity(parseFloat(value));
                        } else {
                          setQuantity(parseInt(value));
                        }
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Chọn số lượng" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedService.unitType === 'kg' ? (
                        // For laundry service, show kg options up to 5
                        Array.from({ length: 10 }, (_, i) => (i + 1) * 0.5)
                          .filter(value => value <= 5)
                          .map((value) => (
                            <SelectItem key={value} value={value.toString()}>
                              {value} kg
                            </SelectItem>
                          ))
                      ) : (
                        // For other services, show person options up to 5
                        Array.from({ length: 5 }, (_, i) => i + 1).map((value) => (
                          <SelectItem key={value} value={value.toString()}>
                            {value} {selectedService.unitType === 'kg' ? 'kg' : 'người lớn'}
                          </SelectItem>
                        ))
                      )}
                      <SelectItem key="custom" value="custom">Khác...</SelectItem>
                    </SelectContent>
                  </Select>

                  {showCustomAdultQuantityInput && (
                    <Input
                      id="custom-adult-quantity"
                      type={selectedService.unitType === 'kg' ? 'number' : 'number'}
                      step={selectedService.unitType === 'kg' ? '0.5' : '1'}
                      min="0"
                      value={quantity}
                      onChange={(e) => {
                        const value = selectedService.unitType === 'kg' ? parseFloat(e.target.value) : parseInt(e.target.value, 10);
                        if (!isNaN(value) && value >= 0) {
                          setQuantity(value);
                        } else if (e.target.value === '') {
                           setQuantity(0);
                        }
                      }}
                      placeholder={`Nhập số lượng ${selectedService.unitType === 'kg' ? 'kg' : 'người lớn'}`}
                      className="mt-2"
                    />
                  )}
                </div>

                {selectedService.childPrice && (
                  <div className="space-y-2">
                    <Label htmlFor="child-quantity">Số lượng trẻ em</Label>
                    <Select
                      value={showCustomChildQuantityInput ? 'custom' : childQuantity.toString()}
                      onValueChange={(value) => {
                        if (value === 'custom') {
                          setShowCustomChildQuantityInput(true);
                          setChildQuantity(0); // Reset child quantity when switching to custom
                        } else {
                          setShowCustomChildQuantityInput(false);
                          setChildQuantity(parseInt(value));
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn số lượng" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 6 }, (_, i) => i).map((value) => (
                          <SelectItem key={value} value={value.toString()}>
                            {value} trẻ em
                          </SelectItem>
                        ))}
                        <SelectItem key="custom" value="custom">Khác...</SelectItem>
                      </SelectContent>
                    </Select>

                    {showCustomChildQuantityInput && (
                      <Input
                        id="custom-child-quantity"
                        type="number"
                        step="1"
                        min="0"
                        value={childQuantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10);
                          if (!isNaN(value) && value >= 0) {
                            setChildQuantity(value);
                          } else if (e.target.value === '') {
                             setChildQuantity(0);
                          }
                        }}
                        placeholder="Nhập số lượng trẻ em"
                        className="mt-2"
                      />
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-sm font-medium">Tổng tiền:</span>
                <span className="font-bold text-xl text-blue-700">
                  {formatPrice(
                    (selectedService.price * quantity) + 
                    (selectedService.childPrice ? selectedService.childPrice * childQuantity : 0)
                  )}
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
                        <h3 className="font-medium">{selectedService.name}</h3>
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