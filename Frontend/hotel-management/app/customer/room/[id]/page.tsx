"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { 
  Calendar, 
  Users, 
  Check, 
  Star, 
  Wifi, 
  Coffee, 
  Bath, 
  Thermometer,
  Utensils,
  PanelTop,
  ChevronLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"

// Sample room data - in a real app, this would be fetched from an API
const roomsData = [
  {
    id: "1",
    name: "Phòng Deluxe View Biển",
    type: "deluxe",
    images: ["/room-1-1.jpg", "/room-1-2.jpg", "/room-1-3.jpg", "/room-1-4.jpg"],
    price: 1200000,
    discountedPrice: 960000, // With 20% discount
    rating: 4.8,
    reviews: 124,
    capacity: 2,
    beds: "1 giường King-size",
    size: "35m²",
    amenities: ["wifi", "breakfast", "ac", "tv", "minibar", "workspace"],
    description: "Phòng sang trọng với tầm nhìn ra biển, không gian rộng rãi và tiện nghi cao cấp.",
    longDescription: "Phòng Deluxe với tầm nhìn ra biển cung cấp không gian sang trọng và thoải mái cho kỳ nghỉ của bạn. Phòng được thiết kế với tông màu trắng chủ đạo kết hợp nội thất gỗ cao cấp tạo cảm giác ấm cúng nhưng vẫn thanh lịch.",
    highlights: [
      "Tầm nhìn ra biển",
      "Diện tích rộng rãi",
      "Bữa sáng miễn phí",
      "Wifi tốc độ cao",
      "Phòng tắm cao cấp",
    ],
    policies: {
      checkin: "14:00",
      checkout: "12:00",
      cancellation: "Miễn phí hủy phòng trước 3 ngày. Sau thời gian đó, phí hủy phòng tương đương 1 đêm lưu trú.",
      children: "Trẻ em dưới 6 tuổi được ở miễn phí khi dùng chung giường với người lớn.",
      pets: "Không cho phép vật nuôi.",
      smoking: "Không hút thuốc.",
    }
  },
]

export default function RoomDetailPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.id as string
  
  // Find room by ID
  const room = roomsData.find(r => r.id === roomId) || roomsData[0]
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [guests, setGuests] = useState("2")
  const [showFullDescription, setShowFullDescription] = useState(false)

  const showAvailableImages = () => {
    // This is a placeholder. In reality, these would be actual images.
    return (
      <div 
        className="bg-blue-900 rounded-lg w-full flex items-center justify-center text-white"
        style={{
          width: 'auto',
          height: 'auto',
        }}
      >
        Hình ảnh phòng {selectedImageIndex + 1}
      </div>
    )
  }
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }
  
  const handleBookNow = () => {
    if (!checkInDate || !checkOutDate) {
      toast.error("Vui lòng chọn ngày nhận phòng và trả phòng")
      return
    }
    
    // Calculate nights
    const start = new Date(checkInDate)
    const end = new Date(checkOutDate)
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    
    if (nights <= 0) {
      toast.error("Ngày trả phòng phải sau ngày nhận phòng")
      return
    }
    
    // Calculate total cost
    const roomPrice = room.discountedPrice || room.price
    const totalNights = Math.max(1, nights)
    const subtotal = roomPrice * totalNights
    const taxAndFees = roomPrice * 0.1
    const totalAmount = subtotal + taxAndFees
    
    // Create booking object
    const bookingData = {
      roomId: room.id,
      roomName: room.name,
      checkInDate,
      checkOutDate,
      guests: parseInt(guests),
      nights: totalNights,
      price: roomPrice,
      subtotal,
      taxAndFees,
      totalAmount,
      createdAt: new Date().toISOString(),
      status: "Pending"
    }
    
    // Store in localStorage - in a real app, this would be sent to the server
    localStorage.setItem("pendingBooking", JSON.stringify(bookingData))
    
    // Show notification and redirect to payments page
    toast.success(`Đã đặt ${room.name} từ ${checkInDate} đến ${checkOutDate} cho ${guests} khách`)
    router.push("/customer/payments?tab=pending")
  }
  
  return (
    <div className="max-w-7xl mx-auto" style={{ width: 'auto', height: 'auto' }}>
      {/* Back button */}
      <div className="mb-4">
        <Link href="/customer" className="flex items-center text-blue-600 hover:underline">
          <ChevronLeft className="w-4 h-4 mr-1" /> Quay lại trang chủ
        </Link>
      </div>
      
      <div className="space-y-6">
        {/* Room title and price */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold">{room.name}</h1>
            <div className="flex items-center text-sm text-gray-600 mt-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="font-medium">{room.rating}</span>
              <span className="mx-1">•</span>
              <span>{room.reviews} đánh giá</span>
            </div>
          </div>
        </div>
        
        {/* Main content - 2 column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Room information and images */}
          <div className="lg:col-span-2">
            {/* Room image */}
            <div className="mb-2">
              {showAvailableImages()}
            </div>
            
            {/* Price display below image */}
            <div className="bg-blue-50 p-3 rounded-md mb-6">
              {room.discountedPrice ? (
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xl font-bold text-blue-700">{formatPrice(room.discountedPrice)}</span>
                    <span className="text-gray-500"> / đêm</span>
                  </div>
                  <div className="text-sm">
                    <span className="line-through text-gray-500 mr-2">{formatPrice(room.price)}</span>
                    <span className="text-green-600 font-medium">Tiết kiệm 20%</span>
                  </div>
                </div>
              ) : (
                <div>
                  <span className="text-xl font-bold text-blue-700">{formatPrice(room.price)}</span>
                  <span className="text-gray-500"> / đêm</span>
                </div>
              )}
            </div>
            
            {/* Room details */}
            <Card>
              <CardContent className="p-6">
                {/* Quick info */}
                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" /> 
                    <span><strong>{room.capacity}</strong> người</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PanelTop className="h-4 w-4 text-blue-600" /> 
                    <span><strong>{room.size}</strong></span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-2">Mô tả</h2>
                  <p className="text-gray-700">
                    {showFullDescription ? room.longDescription : room.description}
                    {room.longDescription !== room.description && (
                      <Button 
                        variant="link" 
                        className="px-0 h-auto font-medium" 
                        onClick={() => setShowFullDescription(!showFullDescription)}
                      >
                        {showFullDescription ? "Thu gọn" : "Xem thêm"}
                      </Button>
                    )}
                  </p>
                </div>
                
                {/* Amenities + Highlights together */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold mb-3">Tiện nghi & Đặc điểm</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {room.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="mr-2 h-4 w-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{highlight}</span>
                      </div>
                    ))}
                    <div className="flex items-center">
                      <Wifi className="mr-2 h-4 w-4 text-blue-600 flex-shrink-0" />
                      <span className="text-sm">Wifi miễn phí</span>
                    </div>
                    <div className="flex items-center">
                      <Coffee className="mr-2 h-4 w-4 text-blue-600 flex-shrink-0" />
                      <span className="text-sm">Bữa sáng miễn phí</span>
                    </div>
                    <div className="flex items-center">
                      <Thermometer className="mr-2 h-4 w-4 text-blue-600 flex-shrink-0" />
                      <span className="text-sm">Điều hòa nhiệt độ</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="mr-2 h-4 w-4 text-blue-600 flex-shrink-0" />
                      <span className="text-sm">Phòng tắm riêng</span>
                    </div>
                    <div className="flex items-center">
                      <Utensils className="mr-2 h-4 w-4 text-blue-600 flex-shrink-0" />
                      <span className="text-sm">Minibar</span>
                    </div>
                  </div>
                </div>
                
                {/* Simplified Policies */}
                <div>
                  <h2 className="text-lg font-bold mb-2">Chính sách phòng</h2>
                  <ul className="text-sm space-y-2">
                    <li>• Hút thuốc: <span className="text-red-500 font-medium">Không</span></li>
                    <li>• Vật nuôi: <span className="text-red-500 font-medium">Không</span></li>
                    <li>• {room.policies.cancellation}</li>
                    <li>• {room.policies.children}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right column - Booking card */}
          <div>
            <Card className="sticky top-4">
              <CardContent className="p-4">
                <h2 className="text-lg font-bold mb-4">Đặt phòng</h2>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Ngày nhận phòng</label>
                    <Input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Ngày trả phòng</label>
                    <Input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full"
                      min={checkInDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Số lượng khách</label>
                    <Select value={guests} onValueChange={setGuests}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Chọn số lượng khách" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 người</SelectItem>
                        <SelectItem value="2">2 người</SelectItem>
                        {room.capacity > 2 && (
                          <>
                            <SelectItem value="3">3 người</SelectItem>
                            <SelectItem value="4">4 người</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {checkInDate && checkOutDate && (
                    <div className="bg-blue-50 p-3 rounded-md mt-4">
                      <div className="flex justify-between text-sm">
                        <span>Giá phòng x {Math.max(1, Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)))} đêm</span>
                        <span className="font-medium">
                          {formatPrice((room.discountedPrice || room.price) * 
                            Math.max(1, Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24))))}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span>Thuế và phí dịch vụ</span>
                        <span className="font-medium">{formatPrice((room.discountedPrice || room.price) * 0.1)}</span>
                      </div>
                      <div className="border-t my-2"></div>
                      <div className="flex justify-between font-bold">
                        <span>Tổng cộng</span>
                        <span>
                          {formatPrice(
                            (room.discountedPrice || room.price) * 
                            Math.max(1, Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24))) 
                            + (room.discountedPrice || room.price) * 0.1
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 mt-4"
                    onClick={handleBookNow}
                  >
                    Đặt phòng ngay
                  </Button>
                  
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Chưa bị trừ tiền - Thanh toán tại khách sạn
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 