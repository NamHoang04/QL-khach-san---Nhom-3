"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { get } from "@/lib/api"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { 
  CalendarClock, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Hotel, 
  Loader2, 
  XCircle,
  CalendarDays,
  ChevronRight,
  Filter,
  Info,
  Search,
  ChevronLeft
} from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useSearchParams, useRouter } from 'next/navigation'

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

interface Room {
  id: number;
  roomNumber: string;
  image: string;
  description?: string;
  status: string;
  roomTypeId: number;
  roomTypeName: string;
  price: number;
  amenities: string[];
  capacity?: number;
  rating?: number;
  reviews?: number;
}

const mockRooms: Room[] = [
  {
    id: 1, roomNumber: '101', image: '', description: 'Tận hưởng không gian sang trọng và tầm nhìn tuyệt đẹp.', status: 'available',
    roomTypeId: 1, roomTypeName: 'Phòng Deluxe Nhìn Ra Thành Phố', price: 2500000, amenities: ['wifi', 'tv'], capacity: 2, rating: 4.8, reviews: 120
  },
  {
    id: 2, roomNumber: '205', image: '', description: 'Suite rộng rãi với hai phòng ngủ, lý tưởng cho gia đình.', status: 'available',
    roomTypeId: 2, roomTypeName: 'Suite Gia Đình Rộng Rãi', price: 4200000, amenities: ['wifi', 'tv', 'minibar'], capacity: 4, rating: 4.9, reviews: 95
  },
  {
    id: 3, roomNumber: '302', image: '', description: 'Thư giãn với ban công riêng và tầm nhìn bao quát ra đại dương.', status: 'occupied',
    roomTypeId: 3, roomTypeName: 'Phòng Premier Hướng Biển', price: 3800000, amenities: ['wifi', 'tv', 'bath'], capacity: 2, rating: 4.7, reviews: 150
  },
  {
    id: 4, roomNumber: '102', image: '', description: 'Phòng tiêu chuẩn tiện nghi, phù hợp cho khách đi công tác.', status: 'available',
    roomTypeId: 4, roomTypeName: 'Phòng Standard', price: 1800000, amenities: ['wifi'], capacity: 2, rating: 4.5, reviews: 200
  },
];

const mockBookings: Booking[] = [
    { id: 1, bookingCode: 'BK1001', roomId: 2, roomNumber: '205', roomTypeName: 'Suite Gia Đình Rộng Rãi', checkIn: '2024-07-01', checkOut: '2024-07-05', status: 'confirmed' },
    { id: 2, bookingCode: 'BK1002', roomId: 4, roomNumber: '102', roomTypeName: 'Phòng Standard', checkIn: '2024-07-10', checkOut: '2024-07-12', status: 'completed' },
];

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

type StatusType = 'all' | 'confirmed' | 'pending' | 'completed' | 'cancelled'

export default function MyBookingsPage() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [error, setError] = useState("")
  const [activeStatus, setActiveStatus] = useState<StatusType>('all')
  
  const searchParams = useSearchParams()
  const router = useRouter()
  const roomIdToBook = searchParams.get('roomId')
  const fromSearch = searchParams.get('fromSearch')
  
  const [roomToConfirm, setRoomToConfirm] = useState<Room | null>(null)
  
  useEffect(() => {
    // Simulate fetching existing bookings
    setBookings(mockBookings);
    
    // If navigating from search page, find the room to confirm
    if (roomIdToBook && fromSearch) {
      const room = mockRooms.find(r => r.id === parseInt(roomIdToBook, 10)) || null;
      setRoomToConfirm(room);
    }
  }, [roomIdToBook, fromSearch])
  
  const handleConfirmBooking = () => {
    if (!roomToConfirm) return;
    
    const newBooking: Booking = {
      id: bookings.length + 3,
      bookingCode: `BK${1003 + bookings.length}`,
      roomId: roomToConfirm.id,
      roomNumber: roomToConfirm.roomNumber,
      roomTypeName: roomToConfirm.roomTypeName,
      checkIn: '2024-08-01', // Mock data
      checkOut: '2024-08-05', // Mock data
      status: 'pending',
    };
    
    setBookings(prev => [newBooking, ...prev]);
    setRoomToConfirm(null); // Hide confirmation card
    router.replace('/customer/bookings'); // Clean URL
  };
  
  // Get status badge color based on status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
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
  
  // Get status text in Vietnamese
  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'Đã xác nhận'
      case 'pending':
        return 'Đang xử lý'
      case 'cancelled':
        return 'Đã hủy'
      case 'completed':
        return 'Đã hoàn thành'
      default:
        return status
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
  
  // Format full date and time with day of week
  const formatFullDate = (dateString: string) => {
    return format(new Date(dateString), 'EEEE, dd/MM/yyyy', { locale: vi })
  }
  
  // Filter bookings by status
  const filteredBookings = activeStatus === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status.toLowerCase() === activeStatus)
  
  // Count bookings by status
  const confirmedCount = bookings.filter(b => b.status.toLowerCase() === 'confirmed').length
  const pendingCount = bookings.filter(b => b.status.toLowerCase() === 'pending').length
  const completedCount = bookings.filter(b => b.status.toLowerCase() === 'completed').length
  const cancelledCount = bookings.filter(b => b.status.toLowerCase() === 'cancelled').length
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/customer" className="text-blue-600 hover:underline flex items-center">
          <ChevronLeft className="h-4 w-4" />
          <span>Quay lại</span>
        </Link>
      </div>
      
      {roomToConfirm && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-xl text-blue-800">Xác nhận đặt phòng</CardTitle>
            <CardDescription>Vui lòng xem lại thông tin và xác nhận đặt phòng cho {roomToConfirm.roomTypeName}.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Display room details for confirmation */}
            <p><strong>Phòng:</strong> {roomToConfirm.roomNumber} - {roomToConfirm.roomTypeName}</p>
            <p><strong>Giá:</strong> {formatCurrency(roomToConfirm.price)} / đêm</p>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setRoomToConfirm(null)}>Hủy</Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleConfirmBooking}>Xác nhận</Button>
          </CardFooter>
        </Card>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Đặt phòng của tôi</h1>
          <p className="text-gray-500 mt-1">Quản lý tất cả các đặt phòng của bạn</p>
        </div>
        
        <Link href="/customer/search">
          <Button>
            <Search className="w-4 h-4 mr-2" />
            Tìm phòng mới
          </Button>
        </Link>
      </div>
      
      {error ? (
        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
              {error}
            </div>
          </CardContent>
        </Card>
      ) : !bookings.length ? (
        <Card>
          <CardContent className="p-8 flex flex-col items-center">
            <CalendarClock className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">Chưa có đặt phòng nào</h3>
            <p className="text-gray-500 mb-4 text-center max-w-md">Bạn chưa đặt phòng nào. Hãy tìm và đặt phòng ngay để có trải nghiệm tuyệt vời.</p>
            <Link href="/customer/search">
              <Button size="lg" className="mt-2">
                <Hotel className="w-4 h-4 mr-2" />
                Tìm phòng ngay
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Status Filters */}
          <Card>
            <CardContent className="p-4">
              <Tabs 
                defaultValue="all" 
                value={activeStatus}
                onValueChange={(value) => setActiveStatus(value as StatusType)}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
                  <TabsTrigger value="all" className="text-center">
                    Tất cả
                    <Badge variant="secondary" className="ml-2 bg-gray-100">{bookings.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="confirmed" className="text-center">
                    Đã xác nhận
                    {confirmedCount > 0 && <Badge variant="secondary" className="ml-2 bg-green-100">{confirmedCount}</Badge>}
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="text-center">
                    Đang xử lý
                    {pendingCount > 0 && <Badge variant="secondary" className="ml-2 bg-yellow-100">{pendingCount}</Badge>}
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="text-center">
                    Hoàn thành
                    {completedCount > 0 && <Badge variant="secondary" className="ml-2 bg-blue-100">{completedCount}</Badge>}
                  </TabsTrigger>
                  <TabsTrigger value="cancelled" className="text-center">
                    Đã hủy
                    {cancelledCount > 0 && <Badge variant="secondary" className="ml-2 bg-red-100">{cancelledCount}</Badge>}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Booking List */}
          <div className="grid gap-6">
            {filteredBookings.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <Filter className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <h3 className="text-lg font-medium text-gray-700">Không tìm thấy đặt phòng</h3>
                  <p className="text-gray-500 text-sm mt-1">Không có đặt phòng nào khớp với bộ lọc hiện tại</p>
                </CardContent>
              </Card>
            ) : (
              filteredBookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden transition-shadow hover:shadow-md">
                  <CardHeader className="p-5 pb-3 flex flex-row justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg font-bold">{booking.roomTypeName}</CardTitle>
                        <Badge variant="outline" className="font-normal">#{booking.bookingCode}</Badge>
                      </div>
                      <CardDescription className="mt-1 flex items-center gap-1">
                        <Hotel className="w-3.5 h-3.5" />
                        <span>Phòng {booking.roomNumber}</span>
                      </CardDescription>
                    </div>
                    <Badge className={`${getStatusColor(booking.status)} flex items-center gap-1.5`}>
                      {getStatusIcon(booking.status)}
                      {getStatusText(booking.status)}
                    </Badge>
                  </CardHeader>
                  
                  <CardContent className="p-5 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 p-3 bg-gray-50 rounded-lg">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Nhận phòng
                        </span>
                        <span className="font-medium mt-0.5">{formatDate(booking.checkIn)}</span>
                        <span className="text-xs text-gray-500 capitalize">{formatFullDate(booking.checkIn)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> Trả phòng
                        </span>
                        <span className="font-medium mt-0.5">{formatDate(booking.checkOut)}</span>
                        <span className="text-xs text-gray-500 capitalize">{formatFullDate(booking.checkOut)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 inline-flex items-center px-2.5 py-1 bg-blue-50 text-blue-700 rounded text-sm">
                      <CalendarDays className="w-3.5 h-3.5 mr-1" />
                      <span className="font-medium">{calculateDuration(booking.checkIn, booking.checkOut)} đêm</span>
                    </div>
                  </CardContent>
                  
                  <Separator />
                  
                  <CardFooter className="p-4 flex justify-between items-center">
                    <Link 
                      href={`/customer/booking/${booking.id}`} 
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <Info className="w-4 h-4 mr-1" />
                      <span>Xem chi tiết</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                    
                    {booking.status.toLowerCase() === 'confirmed' && (
                      <Link href={`/customer/payments/booking/${booking.id}`}>
                        <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                          <CreditCard className="w-4 h-4 mr-2" />
                          Thanh toán
                        </Button>
                      </Link>
                    )}
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
} 