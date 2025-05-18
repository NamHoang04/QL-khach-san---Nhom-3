"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { get } from "@/lib/api-service"
import { shouldUseMockData } from "@/lib/config"
import { format } from "date-fns"
import { 
  CalendarClock, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Hotel, 
  Loader2, 
  XCircle 
} from "lucide-react"
import Link from "next/link"

interface Booking {
  id: number
  bookingCode: string
  roomId: number
  roomNumber: string
  roomTypeName: string
  checkIn: string
  checkOut: string
  status: string
}

export default function MyBookingsPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) return
      
      try {
        setLoading(true)
        
        if (shouldUseMockData()) {
          // For mock data mode
          const mockBookings: Booking[] = [
            {
              id: 1,
              bookingCode: "BK0001",
              roomId: 101,
              roomNumber: "101",
              roomTypeName: "Deluxe King",
              checkIn: "2023-12-01T14:00:00",
              checkOut: "2023-12-05T12:00:00",
              status: "Confirmed"
            },
            {
              id: 2,
              bookingCode: "BK0002",
              roomId: 205,
              roomNumber: "205",
              roomTypeName: "Suite",
              checkIn: "2023-12-20T14:00:00",
              checkOut: "2023-12-25T12:00:00",
              status: "Pending"
            },
            {
              id: 3,
              bookingCode: "BK0003",
              roomId: 310,
              roomNumber: "310",
              roomTypeName: "Standard Double",
              checkIn: "2023-11-10T14:00:00",
              checkOut: "2023-11-12T12:00:00",
              status: "Completed"
            }
          ]
          setBookings(mockBookings)
        } else {
          // If real API mode
          const data = await get<Booking[]>(`Bookings/customer/${user.id}`)
          setBookings(data)
        }
      } catch (err) {
        console.error("Error fetching bookings:", err)
        setError("Không thể tải dữ liệu đặt phòng. Vui lòng thử lại sau.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchBookings()
  }, [user])
  
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
  
  return (
    <div className="container max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Đặt phòng của tôi</h1>
      
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
          <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
          {error}
        </div>
      ) : !bookings.length ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <CalendarClock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">Chưa có đặt phòng nào</h3>
          <p className="text-gray-500 mb-4">Bạn chưa đặt phòng nào. Hãy tìm và đặt phòng ngay để có trải nghiệm tuyệt vời.</p>
          <Link href="/customer/search" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            Tìm phòng
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
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
                
                <div className="border-t border-gray-200 pt-4 pb-2">
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
                  <div className="mt-3 text-sm text-gray-600">
                    <span className="font-medium text-gray-700">{calculateDuration(booking.checkIn, booking.checkOut)} đêm</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <Link 
                    href={`/customer/booking/${booking.id}`} 
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Xem chi tiết
                  </Link>
                  
                  {booking.status.toLowerCase() === 'confirmed' && (
                    <Link 
                      href={`/customer/payments/booking/${booking.id}`} 
                      className="inline-flex items-center text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded hover:bg-blue-100"
                    >
                      <CreditCard className="w-4 h-4 mr-1" />
                      Thanh toán
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 