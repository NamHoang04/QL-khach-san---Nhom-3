"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { shouldUseMockData } from "@/lib/config"
import { get } from "@/lib/api-service"
import { format } from "date-fns"
import { Button } from "@/components/ui/button" 
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Calendar,
  Clock,
  Hotel,
  Users,
  CreditCard,
  CalendarRange,
  Phone,
  Mail,
  MapPin,
  User,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Coffee,
  Wifi,
  Bath,
  Moon,
  Receipt,
  AlertTriangle,
  Download,
  Plus,
  Minus,
  ShoppingBag,
  Trash2,
  PencilRuler
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface Service {
  id: number
  name: string
  price: number
  description: string
  category: string
  imageUrl?: string
}

interface BookedService {
  id: number
  name: string
  price: number
  quantity: number
  totalPrice: number
}

interface BookingDetail {
  id: number
  bookingCode: string
  roomId: number
  roomNumber: string
  roomTypeName: string
  roomImage?: string
  checkIn: string
  checkOut: string
  status: string
  createdAt: string
  guestInfo: {
    fullName: string
    email: string
    phone: string
    address?: string
    specialRequests?: string
  }
  paymentInfo: {
    totalAmount: number
    paid: boolean
    paymentMethod?: string | null
    paymentDate?: string | null
  }
  guests: {
    adults: number
    children: number
  }
  amenities: string[]
  services?: BookedService[]
}

export default function BookingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const bookingId = params.id as string
  
  const [booking, setBooking] = useState<BookingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false)
  const [services, setServices] = useState<Service[]>([])
  const [serviceLoading, setServiceLoading] = useState(false)
  const [selectedServices, setSelectedServices] = useState<BookedService[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  
  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!user?.id) return
      
      try {
        setLoading(true)
        
        if (shouldUseMockData()) {
          // Mock data
          const mockBooking: BookingDetail = {
            id: parseInt(bookingId),
            bookingCode: `BK${bookingId.padStart(5, '0')}`,
            roomId: 101,
            roomNumber: "101",
            roomTypeName: "Phòng Deluxe View Biển",
            roomImage: "/room-1.jpg",
            checkIn: "2023-12-15T14:00:00",
            checkOut: "2023-12-18T12:00:00",
            status: "Confirmed",
            createdAt: "2023-12-01T10:30:00",
            guestInfo: {
              fullName: "Nguyễn Văn A",
              email: "nguyenvana@example.com",
              phone: "0901234567",
              address: "123 Đường Nguyễn Huệ, Quận 1, TP.HCM",
              specialRequests: "Phòng ở tầng cao, xa thang máy"
            },
            paymentInfo: {
              totalAmount: 3600000,
              paid: false,
              paymentMethod: null,
              paymentDate: null
            },
            guests: {
              adults: 2,
              children: 0
            },
            amenities: ["wifi", "breakfast", "ac", "tv", "minibar"],
            services: []
          }
          
          // Check for services in localStorage
          const storageKey = `booking_services_${bookingId}`
          const servicesJson = localStorage.getItem(storageKey)
          
          if (servicesJson) {
            try {
              const storedServices = JSON.parse(servicesJson)
              mockBooking.services = storedServices
              
              // Update total amount to include services
              if (storedServices.length > 0) {
                const servicesTotal = storedServices.reduce(
                  (sum: number, service: BookedService) => sum + service.totalPrice, 0
                )
                mockBooking.paymentInfo.totalAmount += servicesTotal
              }
            } catch (err) {
              console.error("Error parsing services from localStorage:", err)
            }
          }
          
          // Simulate network delay
          setTimeout(() => {
            setBooking(mockBooking)
            setLoading(false)
          }, 800)
        } else {
          // Real API call
          const data = await get<BookingDetail>(`Bookings/${bookingId}`)
          if (!data.services) {
            data.services = []
          }
          
          // Check for services in localStorage
          const storageKey = `booking_services_${bookingId}`
          const servicesJson = localStorage.getItem(storageKey)
          
          if (servicesJson) {
            try {
              const storedServices = JSON.parse(servicesJson)
              data.services = storedServices
              
              // Update total amount to include services
              if (storedServices.length > 0) {
                const servicesTotal = storedServices.reduce(
                  (sum: number, service: BookedService) => sum + service.totalPrice, 0
                )
                data.paymentInfo.totalAmount += servicesTotal
              }
            } catch (err) {
              console.error("Error parsing services from localStorage:", err)
            }
          }
          
          setBooking(data)
          setLoading(false)
        }
      } catch (err) {
        console.error("Error fetching booking details:", err)
        setError("Không thể tải thông tin đặt phòng. Vui lòng thử lại sau.")
        setLoading(false)
      }
    }
    
    fetchBookingDetails()
  }, [bookingId, user])
  
  // Fetch available services
  const fetchServices = async () => {
    setServiceLoading(true)
    
    try {
      if (shouldUseMockData()) {
        // Mock service data
        const mockServices: Service[] = [
          { 
            id: 1, 
            name: "Buffet sáng", 
            price: 250000, 
            description: "Buffet sáng với đa dạng món ăn Á - Âu",
            category: "food"
          },
          { 
            id: 2, 
            name: "Đưa đón sân bay", 
            price: 400000, 
            description: "Dịch vụ đưa đón sân bay sang trọng, thoải mái",
            category: "transport"
          },
          { 
            id: 3, 
            name: "Phòng Gym", 
            price: 100000, 
            description: "Phòng tập gym hiện đại với đầy đủ thiết bị",
            category: "fitness"
          },
          { 
            id: 4, 
            name: "Spa & Massage", 
            price: 850000, 
            description: "Dịch vụ spa và massage cao cấp",
            category: "spa"
          },
          { 
            id: 5, 
            name: "WiFi cao cấp", 
            price: 50000, 
            description: "Dịch vụ WiFi tốc độ cao dành cho khách VIP",
            category: "connectivity"
          },
          { 
            id: 6, 
            name: "Dịch vụ giặt ủi", 
            price: 150000, 
            description: "Dịch vụ giặt ủi chuyên nghiệp",
            category: "housekeeping"
          },
          { 
            id: 7, 
            name: "Bữa tối sang trọng", 
            price: 550000, 
            description: "Bữa tối với các món ăn đặc sản địa phương",
            category: "food"
          },
          { 
            id: 8, 
            name: "Tour du lịch", 
            price: 1200000, 
            description: "Tour du lịch khám phá thành phố và vùng lân cận",
            category: "tour"
          }
        ]
        
        setServices(mockServices)
        setTimeout(() => {
          setServiceLoading(false)
        }, 500)
      } else {
        // Real API call
        const data = await get<Service[]>('Services')
        setServices(data)
        setServiceLoading(false)
      }
    } catch (err) {
      console.error("Error fetching services:", err)
      toast.error("Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.")
      setServiceLoading(false)
    }
  }
  
  // Open service booking dialog
  const openServiceDialog = () => {
    // Prefill selectedServices with any existing services
    if (booking?.services && booking.services.length > 0) {
      setSelectedServices(booking.services)
    } else {
      setSelectedServices([])
    }
    
    fetchServices()
    setServiceDialogOpen(true)
  }
  
  // Add or update service in selection
  const handleAddService = (service: Service) => {
    setSelectedServices(prev => {
      // Check if service is already in the list
      const existingIndex = prev.findIndex(s => s.id === service.id)
      
      if (existingIndex >= 0) {
        // Service exists, increment quantity
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
          totalPrice: (updated[existingIndex].quantity + 1) * service.price
        }
        return updated
      } else {
        // Add new service
        return [...prev, {
          id: service.id,
          name: service.name,
          price: service.price,
          quantity: 1,
          totalPrice: service.price
        }]
      }
    })
    
    toast.success(`Đã thêm ${service.name}`)
  }
  
  // Decrease quantity or remove service
  const handleDecreaseService = (serviceId: number) => {
    setSelectedServices(prev => {
      const existingIndex = prev.findIndex(s => s.id === serviceId)
      
      if (existingIndex >= 0) {
        const service = prev[existingIndex]
        
        if (service.quantity === 1) {
          // Remove service if quantity will be 0
          return prev.filter(s => s.id !== serviceId)
        } else {
          // Decrease quantity
          const updated = [...prev]
          updated[existingIndex] = {
            ...service,
            quantity: service.quantity - 1,
            totalPrice: (service.quantity - 1) * service.price
          }
          return updated
        }
      }
      
      return prev
    })
  }
  
  // Remove service completely
  const handleRemoveService = (serviceId: number) => {
    if (!booking || !booking.services) return
    
    // Filter out the service
    const updatedServices = booking.services.filter(s => s.id !== serviceId)
    
    // Calculate new total amount
    const newTotalAmount = calculateTotalAmount(booking, updatedServices ?? [])
    
    // Update booking state
    const updatedBooking = {
      ...booking,
      services: updatedServices,
      paymentInfo: {
        ...booking.paymentInfo,
        totalAmount: newTotalAmount
      }
    }
    
    // Update localStorage
    const storageKey = `booking_services_${bookingId}`
    localStorage.setItem(storageKey, JSON.stringify(updatedServices))
    
    // Update state
    setBooking(updatedBooking)
    
    toast.success("Đã xóa dịch vụ thành công")
  }
  
  // Save selected services to booking
  const handleSaveServices = () => {
    if (booking) {
      const updatedBooking = {
        ...booking,
        services: selectedServices,
        paymentInfo: {
          ...booking.paymentInfo,
          totalAmount: calculateTotalAmount(booking, selectedServices)
        }
      }
      
      setBooking(updatedBooking)
      setServiceDialogOpen(false)
      
      // In a real app, you would save this to the backend
      toast.success("Đã cập nhật dịch vụ")
    }
  }
  
  // Calculate total amount including services
  const calculateTotalAmount = (booking: BookingDetail, services: BookedService[]) => {
    const roomTotal = booking.paymentInfo.totalAmount
    const servicesTotal = services.reduce((sum, service) => sum + service.totalPrice, 0)
    
    return roomTotal + servicesTotal
  }
  
  // Filter services by search query
  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // Calculate duration of stay
  const calculateDuration = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy')
  }
  
  // Format full date and time
  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm')
  }
  
  // Format price as VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }
  
  // Get status badge color and icon
  const getStatusDetails = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return {
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle2 className="w-4 h-4 text-green-600" />,
          text: "Đã xác nhận"
        }
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Clock className="w-4 h-4 text-yellow-600" />,
          text: "Đang xử lý"
        }
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <XCircle className="w-4 h-4 text-red-600" />,
          text: "Đã hủy"
        }
      case 'completed':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <CheckCircle2 className="w-4 h-4 text-blue-600" />,
          text: "Đã hoàn thành"
        }
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <AlertCircle className="w-4 h-4 text-gray-600" />,
          text: status
        }
    }
  }
  
  // Get amenity icon
  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="w-4 h-4" />
      case 'breakfast':
        return <Coffee className="w-4 h-4" />
      case 'bath':
        return <Bath className="w-4 h-4" />
      default:
        return null
    }
  }
  
  // Handle booking cancellation
  const handleCancelBooking = () => {
    // In a real app, this would call an API to cancel the booking
    toast.success("Đặt phòng đã được hủy thành công")
    setBooking(prev => prev ? { ...prev, status: "Cancelled" } : null)
    setCancelDialogOpen(false)
  }
  
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="flex items-center justify-center p-16 bg-white rounded-lg shadow-sm border">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Đang tải thông tin đặt phòng...</p>
          </div>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="bg-red-50 border border-red-100 text-red-600 p-8 rounded-lg text-center shadow-sm">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Đã xảy ra lỗi</h3>
          <p>{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => router.back()}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Quay lại
          </Button>
        </div>
      </div>
    )
  }
  
  if (!booking) {
    return (
      <div className="max-w-5xl mx-auto p-4">
        <div className="bg-yellow-50 border border-yellow-100 text-yellow-800 p-8 rounded-lg text-center shadow-sm">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
          <h3 className="text-lg font-medium mb-2">Không tìm thấy thông tin</h3>
          <p>Không tìm thấy thông tin đặt phòng với mã này.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => router.push("/customer/bookings")}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Quay lại danh sách đặt phòng
          </Button>
        </div>
      </div>
    )
  }
  
  const statusDetails = getStatusDetails(booking.status)
  const nights = calculateDuration(booking.checkIn, booking.checkOut)
  const hasServices = booking.services && booking.services.length > 0
  const servicesTotal = hasServices 
    ? booking.services?.reduce((sum: number, service: BookedService) => sum + service.totalPrice, 0) || 0
    : 0
  
  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/customer/bookings" className="text-blue-600 hover:underline flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span>Quay lại danh sách đặt phòng</span>
        </Link>
      </div>
      
      {/* Header section */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">Chi tiết đặt phòng</h1>
              <Badge variant="outline">#{booking.bookingCode}</Badge>
            </div>
            <p className="text-gray-500 text-sm">
              Đặt lúc: {formatDateTime(booking.createdAt)}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge className={`px-3 py-1.5 ${statusDetails.color} flex items-center gap-1.5`}>
              {statusDetails.icon}
              {statusDetails.text}
            </Badge>
            
            {booking.status.toLowerCase() === 'confirmed' && (
              <Button 
                variant="outline" 
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => setCancelDialogOpen(true)}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Hủy đặt phòng
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Room information */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Thông tin phòng</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/3 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="p-8 text-center text-gray-500">
                    <Hotel className="w-12 h-12 mx-auto mb-2 text-blue-600" />
                    <p>Hình ảnh phòng</p>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{booking.roomTypeName}</h3>
                  <p className="text-gray-600 mb-3 flex items-center">
                    <Hotel className="w-4 h-4 mr-1.5 text-gray-500" /> 
                    Phòng {booking.roomNumber}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Nhận phòng</span>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1.5 text-blue-600" />
                        <span className="font-medium">{formatDate(booking.checkIn)}</span>
                      </div>
                      <span className="text-xs text-gray-500 mt-0.5">Sau 14:00</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Trả phòng</span>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1.5 text-blue-600" />
                        <span className="font-medium">{formatDate(booking.checkOut)}</span>
                      </div>
                      <span className="text-xs text-gray-500 mt-0.5">Trước 12:00</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-0">
                      <Moon className="w-3 h-3 mr-1" />
                      {nights} đêm
                    </Badge>
                    <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-0">
                      <Users className="w-3 h-3 mr-1" />
                      {booking.guests.adults} người lớn
                      {booking.guests.children > 0 && `, ${booking.guests.children} trẻ em`}
                    </Badge>
                  </div>
                  
                  {booking.amenities && booking.amenities.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Tiện nghi phòng</h4>
                      <div className="flex flex-wrap gap-2">
                        {booking.amenities.map((amenity, index) => {
                          const icon = getAmenityIcon(amenity);
                          return icon ? (
                            <TooltipProvider key={index}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                    {icon}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="capitalize">{amenity}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Guest information */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Thông tin khách hàng</CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="flex items-start">
                  <User className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Họ và tên</div>
                    <div className="font-medium">{booking.guestInfo.fullName}</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <div className="font-medium">{booking.guestInfo.email}</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
                  <div>
                    <div className="text-sm text-gray-500">Số điện thoại</div>
                    <div className="font-medium">{booking.guestInfo.phone}</div>
                  </div>
                </div>
                {booking.guestInfo.address && (
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
                    <div>
                      <div className="text-sm text-gray-500">Địa chỉ</div>
                      <div className="font-medium">{booking.guestInfo.address}</div>
                    </div>
                  </div>
                )}
              </div>
              
              {booking.guestInfo.specialRequests && (
                <div className="mt-6">
                  <h4 className="text-sm font-semibold mb-2">Yêu cầu đặc biệt</h4>
                  <div className="bg-gray-50 p-3 rounded-lg text-gray-700">
                    {booking.guestInfo.specialRequests}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Services section - only show if there are services or status is confirmed */}
          {(hasServices || booking.status.toLowerCase() === 'confirmed') && (
            <Card>
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Dịch vụ đã đặt
                </CardTitle>
                
                {booking.status.toLowerCase() === 'confirmed' && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={openServiceDialog}
                  >
                    <PencilRuler className="w-4 h-4 mr-1" />
                    {hasServices ? 'Chỉnh sửa dịch vụ' : 'Đặt dịch vụ'}
                  </Button>
                )}
              </CardHeader>
              <CardContent className="pt-2">
                {hasServices ? (
                  <div className="space-y-4">
                    {booking.services && booking.services.map((service) => (
                      <div key={service.id} className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-gray-500">
                            {formatPrice(service.price)} x {service.quantity}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{formatPrice(service.totalPrice)}</span>
                          {booking.status.toLowerCase() === 'confirmed' && (
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleRemoveService(service.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>Bạn chưa đặt dịch vụ nào</p>
                    <p className="text-sm">Nhấn vào nút "Đặt dịch vụ" để thêm dịch vụ vào đặt phòng</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Right column - Payment summary */}
        <div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <Receipt className="w-5 h-5 mr-2" />
                Chi tiết thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Giá phòng x {nights} đêm</span>
                  <span className="font-medium">{formatPrice(booking.paymentInfo.totalAmount - servicesTotal)}</span>
                </div>
                
                {hasServices && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Dịch vụ đã đặt</span>
                    <span className="font-medium">{formatPrice(servicesTotal)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Thuế và phí</span>
                  <span className="font-medium">Đã bao gồm</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span>{formatPrice(booking.paymentInfo.totalAmount)}</span>
                </div>
                
                <div className={`p-3 rounded-lg ${booking.paymentInfo.paid ? 'bg-green-50' : 'bg-yellow-50'}`}>
                  <div className="flex items-center">
                    {booking.paymentInfo.paid ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
                        <div>
                          <p className="font-medium text-green-800">Đã thanh toán</p>
                          <p className="text-sm text-green-700">
                            {booking.paymentInfo.paymentMethod} • {booking.paymentInfo.paymentDate && formatDateTime(booking.paymentInfo.paymentDate)}
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Clock className="w-5 h-5 text-yellow-600 mr-2" />
                        <p className="font-medium text-yellow-800">Chưa thanh toán</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              {!booking.paymentInfo.paid && booking.status.toLowerCase() === 'confirmed' && (
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Thanh toán ngay
                </Button>
              )}
              
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Tải xác nhận đặt phòng
              </Button>
            </CardFooter>
          </Card>
          
          {/* Booking policies
          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Chính sách đặt phòng</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <CalendarRange className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
                  <span>Hủy miễn phí trước ngày {formatDate(new Date(new Date(booking.checkIn).getTime() - 3 * 24 * 60 * 60 * 1000).toISOString())}</span>
                </li>
                <li className="flex items-start">
                  <Clock className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
                  <span>Nhận phòng từ 14:00, trả phòng trước 12:00</span>
                </li>
                <li className="flex items-start">
                  <Users className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0 mt-0.5" />
                  <span>Trẻ em dưới 6 tuổi được ở miễn phí khi dùng chung giường với người lớn</span>
                </li>
              </ul>
            </CardContent>
          </Card> */}
        </div>
      </div>
      
      {/* Service booking dialog */}
      {serviceDialogOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] mx-4 flex flex-col">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">Đặt dịch vụ</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-500"
                  onClick={() => setServiceDialogOpen(false)}
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>
              
              <div className="mt-4">
                <Input
                  placeholder="Tìm kiếm dịch vụ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
              {/* Available services */}
              <div className="w-full md:w-1/2 p-4 overflow-hidden flex flex-col border-r">
                <h4 className="font-medium mb-2 text-gray-700">Dịch vụ có sẵn</h4>
                
                {serviceLoading ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <ScrollArea className="flex-1">
                    <div className="space-y-3 pr-4">
                      {filteredServices.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <p>Không tìm thấy dịch vụ nào</p>
                        </div>
                      ) : (
                        filteredServices.map(service => (
                          <div 
                            key={service.id} 
                            className="border rounded-lg p-3 hover:bg-gray-50 transition"
                          >
                            <div className="flex justify-between">
                              <div>
                                <h5 className="font-medium">{service.name}</h5>
                                <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
                              </div>
                              <div className="text-right">
                                <div className="font-medium text-blue-700">{formatPrice(service.price)}</div>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="mt-1 h-8 text-blue-600 hover:bg-blue-50"
                                  onClick={() => handleAddService(service)}
                                >
                                  <Plus className="w-4 h-4 mr-1" />
                                  Thêm
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                )}
              </div>
              
              {/* Selected services */}
              <div className="w-full md:w-1/2 p-4 overflow-hidden flex flex-col">
                <h4 className="font-medium mb-2 text-gray-700">Dịch vụ đã chọn</h4>
                
                <ScrollArea className="flex-1">
                  <div className="space-y-3 pr-4">
                    {selectedServices.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <p>Chưa có dịch vụ nào được chọn</p>
                        <p className="text-sm">Nhấn "Thêm" ở các dịch vụ bên trái để chọn</p>
                      </div>
                    ) : (
                      selectedServices.map(service => (
                        <div 
                          key={service.id} 
                          className="border rounded-lg p-3"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="font-medium">{service.name}</h5>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleRemoveService(service.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center border rounded-md">
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8"
                                onClick={() => handleDecreaseService(service.id)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center">{service.quantity}</span>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="h-8 w-8"
                                onClick={() => handleAddService(services.find(s => s.id === service.id)!)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="text-right">
                              <div className="font-medium">{formatPrice(service.totalPrice)}</div>
                              <div className="text-xs text-gray-500">
                                {formatPrice(service.price)} x {service.quantity}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between font-bold mb-4">
                    <span>Tổng cộng:</span>
                    <span>{formatPrice(selectedServices.reduce((sum, service) => sum + service.totalPrice, 0))}</span>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setServiceDialogOpen(false)}
                    >
                      Hủy
                    </Button>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={handleSaveServices}
                    >
                      Xác nhận
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Cancel confirmation dialog */}
      {cancelDialogOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-2">Xác nhận hủy đặt phòng?</h3>
            <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn hủy đặt phòng này? Hành động này không thể hoàn tác.</p>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setCancelDialogOpen(false)}
              >
                Đóng
              </Button>
              <Button 
                variant="destructive"
                onClick={handleCancelBooking}
              >
                Hủy đặt phòng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 