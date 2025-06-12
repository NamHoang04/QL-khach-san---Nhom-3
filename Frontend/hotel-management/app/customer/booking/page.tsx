"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation" 
import { get, post } from "@/lib/api"
import { format } from "date-fns"
import { 
  CalendarClock, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Hotel, 
  Loader2, 
  XCircle,
  ChevronLeft,
  Calendar,
  Users,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"

interface Booking {
  id: number | string
  bookingCode: string
  roomId: number
  roomNumber: string
  roomTypeName: string
  checkIn: string
  checkOut: string
  status: string
}

interface PendingBooking {
  id?: number | string
  roomId: string | number
  roomName: string
  checkInDate: string
  checkOutDate: string
  nights: number
  guests: string | number
  pricePerNight: number
  totalPrice: number
}

interface Service {
  id: number
  name: string
  price: number
  quantity: number
  childQuantity?: number
  totalPrice: number
}

export default function MyBookingsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [pendingBooking, setPendingBooking] = useState<PendingBooking | null>(null)
  const [pendingServices, setPendingServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  useEffect(() => {
    // Check for pending booking from localStorage
    const savedPendingBooking = localStorage.getItem('pendingBooking')
    if (savedPendingBooking) {
      try {
        setPendingBooking(JSON.parse(savedPendingBooking))
      } catch (error) {
        console.error("Error parsing pending booking:", error)
      }
    }
    
    const fetchBookings = async () => {
      if (!user?.id) return
      
      try {
        setLoading(true)
        
        const response = await get<Booking[]>(`Bookings/customer/${user.id}`)
        setBookings(response.data)
      } catch (err) {
        console.error("Error fetching bookings:", err)
        // It's possible the API returns 404 if there are no bookings, which is not a critical error.
        if (err instanceof Error && err.message.includes("404")) {
          setBookings([]) // Set to empty array if no bookings found
        } else {
          setError("Không thể tải dữ liệu đặt phòng. Vui lòng thử lại sau.")
        }
      } finally {
        setLoading(false)
      }
    }
    
    fetchBookings()
  }, [user])
  
  // Load pending booking from localStorage
  useEffect(() => {
    const pendingBookingString = localStorage.getItem("pendingBooking")
    if (pendingBookingString) {
      try {
        const bookingData = JSON.parse(pendingBookingString)
        setPendingBooking(bookingData)
      } catch (err) {
        console.error("Error parsing pending booking:", err)
      }
    }
  }, [])
  
  // Load services for current booking if any
  useEffect(() => {
    if (pendingBooking) {
      const bookingId = pendingBooking.id || 'pending';
      const storageKey = `booking_services_${String(bookingId)}`;
      const servicesJson = localStorage.getItem(storageKey);
      if (servicesJson) {
        try {
          const services = JSON.parse(servicesJson);
          setPendingServices(services);
        } catch (error) {
          console.error("Error parsing services:", error);
        }
      }
    }
  }, [pendingBooking]);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy')
  }
  
  // Format price as VND
  const formatPrice = (price: number) => {
    if (typeof price !== 'number') {
      return 'N/A'; // or '0 ₫' or some other default
    }
    return price.toLocaleString('vi-VN') + ' ₫'
  }

  // Calculate booking status based on dates
  const calculateBookingStatus = (checkIn: string) => {
    const today = new Date()
    const checkInDate = new Date(checkIn)
    
    if (isNaN(checkInDate.getTime())) {
      return { status: "Error", message: "Invalid date" }
    }
    
    if (checkInDate < today) {
      return { status: "Past", message: "Đã kết thúc" }
    } else {
      return { status: "Upcoming", message: "Sắp tới" }
    }
  }

  // Get status badge color based on status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  // Get status icon based on status
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-blue-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }
  
  // Handle confirm booking
  const handleConfirmBooking = async () => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để hoàn tất đặt phòng.", {
        action: {
          label: "Đăng nhập",
          onClick: () => router.push('/login'),
        },
      });
      return;
    }

    if (!pendingBooking) {
      toast.error("Không tìm thấy thông tin đặt phòng tạm thời.", {
        description: "Vui lòng thử chọn lại phòng và ngày đặt.",
        action: {
          label: "Tìm phòng",
          onClick: () => router.push('/customer/search'),
        },
      });
      return;
    }
    
    // Detailed validation
    if (!pendingBooking.roomId) {
      toast.error("Lỗi: Không tìm thấy mã phòng. Vui lòng thử lại.");
      return;
    }
    if (!pendingBooking.checkInDate || !pendingBooking.checkOutDate) {
      toast.error("Vui lòng chọn ngày nhận và trả phòng.", {
        description: "Bạn có thể chọn lại ngày từ trang chi tiết phòng.",
        action: {
          label: "Quay lại",
          onClick: () => router.push(`/customer/room/${pendingBooking.roomId}`),
        },
      });
      return;
    }
    
    try {
      toast.loading("Đang xử lý đặt phòng...");

      const bookingPayload = {
        customerId: user.id,
        roomId: pendingBooking.roomId,
        checkInDate: new Date(pendingBooking.checkInDate).toISOString(),
        checkOutDate: new Date(pendingBooking.checkOutDate).toISOString(),
        totalPrice: pendingBooking.totalPrice,
        status: "Confirmed" // Or "Pending" depending on flow
      };

      const newBooking = await post<Booking>('/Bookings', bookingPayload);
      
      // Add to bookings list
      setBookings(prev => [newBooking.data, ...prev]);
      
      toast.success("Đặt phòng thành công!");

      // Clear pending booking
      localStorage.removeItem('pendingBooking');
      setPendingBooking(null);
      
    } catch (err) {
      console.error("Error confirming booking:", err);
      toast.error("Không thể xác nhận đặt phòng. Vui lòng thử lại.");
    }
  }
  
  // Handle cancel pending booking
  const handleCancelPendingBooking = () => {
    localStorage.removeItem('pendingBooking');
    setPendingBooking(null);
    toast.info("Đã hủy đặt phòng");
  }

  // In the getBookingStatus function call, where bookingIdOrCode is used in url path
  const getBookingStatus = async (bookingIdOrCode: string | number) => {
    try {
      // Use toString() to ensure the ID is converted to string for URL construction
      const data = await get<any>(`Bookings/${bookingIdOrCode.toString()}/status`)
      return data
    } catch (err) {
      console.error(`Error getting booking status for ${bookingIdOrCode}:`, err)
      return null
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <Link href="/customer" className="text-blue-600 hover:underline flex items-center">
          <ChevronLeft className="h-4 w-4" />
          <span>Quay lại</span>
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Đặt phòng của tôi</h1>
      
      {/* Pending Booking Confirmation */}
      {pendingBooking && (
        <div className="mb-8">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
            <div className="flex items-center text-blue-700 mb-2">
              <Clock className="w-5 h-5 mr-2" />
              <h2 className="text-lg font-medium">Xác nhận đặt phòng</h2>
            </div>
            <p className="text-sm text-blue-600">
              Vui lòng xác nhận thông tin đặt phòng của bạn dưới đây trước khi hoàn tất.
            </p>
          </div>
          
          <Card className="p-5 border shadow-sm">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="text-xl font-semibold">{pendingBooking.roomName}</h3>
                <p className="text-gray-600 text-sm">Loại phòng: {pendingBooking.roomName}</p>
              </div>
              <div className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>Chờ xác nhận</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 mb-5">
              <div>
                <div className="text-sm text-gray-500 mb-1">Thông tin đặt phòng</div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                    <div>
                      <span className="font-medium">Nhận phòng:</span> {formatDate(pendingBooking.checkInDate)}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                    <div>
                      <span className="font-medium">Trả phòng:</span> {formatDate(pendingBooking.checkOutDate)}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-gray-500 mr-2" />
                    <div>
                      <span className="font-medium">Số khách:</span> {pendingBooking.guests} người
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1">Chi tiết thanh toán</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Giá phòng ({pendingBooking.nights} đêm)</span>
                    <span className="font-medium">{formatPrice(pendingBooking.pricePerNight)} × {pendingBooking.nights}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Tổng tiền</span>
                    <span className="text-lg text-blue-700">{formatPrice(pendingBooking.totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Pending booking details */}
            <div className="pt-4">
              <div className="text-gray-500 mb-2">Chi tiết đặt phòng:</div>
              <div className="font-medium mb-1">{pendingBooking.roomName}</div>
              <div className="text-gray-600 text-sm">
                {pendingBooking.checkInDate ? formatDate(pendingBooking.checkInDate) : 'N/A'} - {pendingBooking.checkOutDate ? formatDate(pendingBooking.checkOutDate) : 'N/A'} ({pendingBooking.nights} đêm)
              </div>
              <div className="text-gray-600 text-sm">
                {pendingBooking.guests} khách
              </div>
              
              {/* Price section */}
              <div className="mt-4">
                <div className="flex justify-between">
                  <div className="text-gray-600">Giá phòng ({pendingBooking.nights} đêm)</div>
                  <div>{formatPrice(pendingBooking.pricePerNight * pendingBooking.nights)}</div>
                </div>
                
                {/* Services section */}
                <div className="mt-2">
                  <div className="flex justify-between items-center">
                    <div className="text-gray-600">Dịch vụ đi kèm</div>
                    <Link href="/customer/services" className="text-blue-600 text-sm hover:underline">
                      Thêm dịch vụ
                    </Link>
                  </div>
                  
                  {/* Display services if available */}
                  {pendingServices && pendingServices.length > 0 ? (
                    <div className="mt-2 border-t border-gray-100 pt-2">
                      {pendingServices.map((service, index) => (
                        <div key={index} className="flex justify-between py-1 text-sm">
                          <div>{service.name} x{service.quantity}</div>
                          <div>{formatPrice(service.totalPrice)}</div>
                        </div>
                      ))}
                      <div className="flex justify-between mt-2 pt-2 border-t border-gray-100">
                        <div className="text-gray-600">Tổng dịch vụ</div>
                        <div>{formatPrice(pendingServices.reduce((sum, service) => sum + service.totalPrice, 0))}</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">Chưa có dịch vụ đi kèm</div>
                  )}
                </div>
                
                {/* Total price */}
                <div className="flex justify-between mt-4 pt-2 border-t border-gray-100">
                  <div className="font-medium">Tổng tiền</div>
                  <div className="font-bold text-lg">
                    {formatPrice(
                      pendingBooking.totalPrice + 
                      (pendingServices ? pendingServices.reduce((sum, service) => sum + service.totalPrice, 0) : 0)
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-end">
              <Button variant="outline" onClick={handleCancelPendingBooking}>
                Hủy
              </Button>
              <Button onClick={handleConfirmBooking}>
                Xác nhận đặt phòng
              </Button>
            </div>
          </Card>
        </div>
      )}
      
      {/* Existing bookings list */}
      {loading && !pendingBooking ? (
        <div className="flex items-center justify-center p-12 bg-white rounded-lg shadow-sm border">
          <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
          <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-lg text-center shadow-sm">
          {error}
        </div>
      ) : !bookings.length && !pendingBooking ? (
        <div className="bg-white p-8 rounded-lg text-center shadow-sm border">
          <CalendarClock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">Chưa có đặt phòng nào</h3>
          <p className="text-gray-500 mb-4">Bạn chưa đặt phòng nào. Hãy tìm và đặt phòng ngay để có trải nghiệm tuyệt vời.</p>
          <Link href="/customer/search" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            Tìm phòng
          </Link>
        </div>
      ) : (
        <div className="mt-8">
          {bookings.length > 0 && (
            <>
              <h2 className="text-lg font-semibold mb-4">Lịch sử đặt phòng</h2>
              <div className="grid gap-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition">
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">{booking.roomTypeName}</h3>
                          <p className="text-gray-600 mt-1 flex items-center">
                            <Hotel className="w-4 h-4 mr-1" /> Phòng {booking.roomNumber}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span className="ml-1">{booking.status}</span>
                          </span>
                          <span className="text-xs text-gray-500">#{booking.bookingCode}</span>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-100 pt-4 pb-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-gray-500">Nhận phòng</div>
                            <div className="font-medium text-gray-900">{formatDate(booking.checkIn)}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-500">Trả phòng</div>
                            <div className="font-medium text-gray-900">{formatDate(booking.checkOut)}</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="mt-4 flex justify-end">
                        <Link 
                          href={`/customer/booking/${booking.id}`} 
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
} 