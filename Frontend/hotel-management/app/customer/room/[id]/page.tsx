"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { 
  Calendar, 
  Users, 
  Check, 
  Star, 
  Wifi, 
  Coffee, 
  Bath, 
  Heart,
  Share,
  Map,
  Utensils,
  Volume2,
  PanelTop,
  Thermometer,
  Check as CheckIcon,
  X as XIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

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
    description: "Phòng sang trọng với tầm nhìn ra biển, không gian rộng rãi và tiện nghi cao cấp. Phòng được thiết kế tinh tế, sang trọng với tông màu trắng chủ đạo, tạo cảm giác thư thái, dễ chịu cho du khách.",
    longDescription: "Phòng Deluxe với tầm nhìn ra biển cung cấp không gian sang trọng và thoải mái cho kỳ nghỉ của bạn. Phòng được thiết kế với tông màu trắng chủ đạo kết hợp nội thất gỗ cao cấp tạo cảm giác ấm cúng nhưng vẫn thanh lịch. Từ cửa sổ phòng, bạn có thể ngắm nhìn toàn cảnh biển xanh tuyệt đẹp.\n\nPhòng được trang bị đầy đủ tiện nghi hiện đại như TV màn hình phẳng, minibar, máy điều hòa, két an toàn và khu vực làm việc. Phòng tắm rộng rãi với bồn tắm riêng biệt và vòi sen, cùng bộ đồ dùng phòng tắm cao cấp. Khách lưu trú sẽ được phục vụ bữa sáng miễn phí tại nhà hàng của khách sạn hoặc có thể yêu cầu phục vụ tại phòng.",
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
  const roomId = params.id as string
  
  // Find room by ID
  const room = roomsData.find(r => r.id === roomId) || roomsData[0]
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [guests, setGuests] = useState("2")
  const [isHeartActive, setIsHeartActive] = useState(false)

  const showAvailableImages = () => {
    // This is a placeholder. In reality, these would be actual images.
    return (
      <div className="grid grid-cols-2 gap-2">
        <div 
          className={`h-80 bg-blue-900 rounded-lg flex items-center justify-center text-white ${
            selectedImageIndex === 0 ? "col-span-2 row-span-2" : ""
          }`}
          onClick={() => setSelectedImageIndex(0)}
        >
          Main Room View
        </div>
        
        <div 
          className="h-44 bg-blue-800 rounded-lg flex items-center justify-center text-white"
          onClick={() => setSelectedImageIndex(1)}
        >
          Bathroom
        </div>
        
        <div 
          className="h-44 bg-blue-700 rounded-lg flex items-center justify-center text-white"
          onClick={() => setSelectedImageIndex(2)}
        >
          Room Details
        </div>
        
        <div 
          className="h-44 bg-blue-800 rounded-lg flex items-center justify-center text-white"
          onClick={() => setSelectedImageIndex(3)}
        >
          Ocean View
        </div>
        
        <div 
          className="h-44 bg-blue-700 rounded-lg flex items-center justify-center text-white"
          onClick={() => setSelectedImageIndex(4)}
        >
          Balcony
        </div>
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
    
    // This would normally navigate to a booking confirmation page with the selected details
    toast.success(`Đã đặt ${room.name} từ ${checkInDate} đến ${checkOutDate} cho ${guests} khách`)
    // In a real application, you would use router.push to navigate to the booking page
  }
  
  return (
    <div className="space-y-8">
      {/* Room title and basic info */}
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{room.name}</h1>
            <div className="flex items-center text-sm text-gray-600 gap-2">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-medium">{room.rating}</span>
                <span className="mx-1">•</span>
                <span>{room.reviews} đánh giá</span>
              </div>
              <span className="mx-1">•</span>
              <span>{room.type.charAt(0).toUpperCase() + room.type.slice(1)}</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => setIsHeartActive(!isHeartActive)}
              className={isHeartActive ? "text-red-500" : ""}
            >
              <Heart className={isHeartActive ? "fill-red-500" : ""} />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => toast.success("Đã sao chép đường dẫn phòng!")}
            >
              <Share />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Room images */}
      <div>
        {showAvailableImages()}
      </div>
      
      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Room details */}
        <div className="flex-1">
          {/* Quick info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-500 mb-1 flex items-center">
                <Users className="mr-2 h-5 w-5" />
                <span className="font-medium">Sức chứa</span>
              </div>
              <p>{room.capacity} người</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-500 mb-1 flex items-center">
                <PanelTop className="mr-2 h-5 w-5" />
                <span className="font-medium">Kích thước</span>
              </div>
              <p>{room.size}</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-500 mb-1 flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                <span className="font-medium">Nhận phòng</span>
              </div>
              <p>{room.policies.checkin}</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-blue-500 mb-1 flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                <span className="font-medium">Trả phòng</span>
              </div>
              <p>{room.policies.checkout}</p>
            </div>
          </div>
          
          {/* Room description */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Mô tả</h2>
            <p className="text-gray-700 whitespace-pre-line">{room.longDescription}</p>
          </div>
          
          {/* Room highlights */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Điểm nổi bật</h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {room.highlights.map((highlight, index) => (
                <li key={index} className="flex items-center">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Amenities */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Tiện nghi phòng</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <Wifi className="mr-3 h-5 w-5 text-blue-500" />
                <span>Wifi miễn phí</span>
              </div>
              
              <div className="flex items-center">
                <Coffee className="mr-3 h-5 w-5 text-blue-500" />
                <span>Bữa sáng miễn phí</span>
              </div>
              
              <div className="flex items-center">
                <Thermometer className="mr-3 h-5 w-5 text-blue-500" />
                <span>Điều hòa nhiệt độ</span>
              </div>
              
              <div className="flex items-center">
                <Bath className="mr-3 h-5 w-5 text-blue-500" />
                <span>Phòng tắm riêng</span>
              </div>
              
              <div className="flex items-center">
                <Utensils className="mr-3 h-5 w-5 text-blue-500" />
                <span>Minibar</span>
              </div>
              
              <div className="flex items-center">
                <Volume2 className="mr-3 h-5 w-5 text-blue-500" />
                <span>TV màn hình phẳng</span>
              </div>
            </div>
          </div>
          
          {/* Policies */}
          <div>
            <h2 className="text-xl font-bold mb-4">Chính sách phòng</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Chính sách hủy phòng</h3>
                <p className="text-gray-700">{room.policies.cancellation}</p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Chính sách trẻ em</h3>
                <p className="text-gray-700">{room.policies.children}</p>
              </div>
              
              <div className="flex items-center">
                <h3 className="font-medium mr-2">Hút thuốc:</h3>
                {room.policies.smoking.includes("Không") ? (
                  <span className="flex items-center text-red-500">
                    <XIcon className="h-4 w-4 mr-1" /> Không cho phép
                  </span>
                ) : (
                  <span className="flex items-center text-green-500">
                    <CheckIcon className="h-4 w-4 mr-1" /> Cho phép
                  </span>
                )}
              </div>
              
              <div className="flex items-center">
                <h3 className="font-medium mr-2">Vật nuôi:</h3>
                {room.policies.pets.includes("Không") ? (
                  <span className="flex items-center text-red-500">
                    <XIcon className="h-4 w-4 mr-1" /> Không cho phép
                  </span>
                ) : (
                  <span className="flex items-center text-green-500">
                    <CheckIcon className="h-4 w-4 mr-1" /> Cho phép
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Booking card */}
        <div className="lg:w-1/3">
          <Card className="sticky top-8">
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  {room.discountedPrice ? (
                    <div>
                      <span className="text-2xl font-bold">{formatPrice(room.discountedPrice)}</span>
                      <span className="text-gray-500"> / đêm</span>
                      <div className="flex items-center mt-1">
                        <span className="text-sm line-through text-gray-500 mr-2">
                          {formatPrice(room.price)}
                        </span>
                        <span className="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded">
                          Giảm 20%
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className="text-2xl font-bold">{formatPrice(room.price)}</span>
                      <span className="text-gray-500"> / đêm</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Ngày nhận phòng</label>
                  <Input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Ngày trả phòng</label>
                  <Input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Số lượng khách</label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn số lượng khách" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 người</SelectItem>
                      <SelectItem value="2">2 người</SelectItem>
                      {room.capacity > 2 && (
                        <>
                          <SelectItem value="3">3 người</SelectItem>
                          <SelectItem value="4">4 người</SelectItem>
                          {room.capacity > 4 && (
                            <SelectItem value="5">5 người</SelectItem>
                          )}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Yêu cầu đặc biệt (không bắt buộc)</label>
                  <Textarea placeholder="Ghi chú thêm yêu cầu cho phòng của bạn..." />
                </div>
              </div>
              
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={handleBookNow}
              >
                Đặt phòng ngay
              </Button>
              
              <div className="mt-4 text-sm text-gray-500 text-center">
                Chưa bị trừ tiền - Thanh toán tại khách sạn
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Reviews and Map Tabs */}
      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="reviews" className="flex-1">Đánh giá</TabsTrigger>
          <TabsTrigger value="location" className="flex-1">Vị trí</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reviews" className="pt-4">
          <div className="space-y-4">
            <div className="bg-gray-50 p-6 rounded-lg mb-4">
              <div className="flex items-center mb-4">
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-2xl mr-4">
                  {room.rating}
                </div>
                <div>
                  <h3 className="text-lg font-bold">Tuyệt vời</h3>
                  <p className="text-gray-600">{room.reviews} đánh giá từ khách hàng</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Điểm nổi bật từ đánh giá</h4>
                  <ul className="space-y-1">
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      <span>Vị trí tuyệt vời</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      <span>Phòng sạch sẽ và rộng rãi</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      <span>Nhân viên thân thiện</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Đánh giá theo tiêu chí</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="w-24 text-sm">Sạch sẽ</span>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: "95%" }}></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">9.5</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-24 text-sm">Tiện nghi</span>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: "90%" }}></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">9.0</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-24 text-sm">Vị trí</span>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: "97%" }}></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">9.7</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-24 text-sm">Dịch vụ</span>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full rounded-full" style={{ width: "92%" }}></div>
                      </div>
                      <span className="ml-2 text-sm font-medium">9.2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sample reviews */}
            <div className="space-y-6">
              {[
                {
                  name: "Nguyễn Văn A",
                  date: "01/06/2023",
                  rating: 5,
                  comment: "Phòng rất đẹp và sạch sẽ. Tầm nhìn ra biển tuyệt vời. Nhân viên thân thiện và nhiệt tình. Chắc chắn sẽ quay lại."
                },
                {
                  name: "Trần Thị B",
                  date: "15/05/2023",
                  rating: 4,
                  comment: "Mọi thứ đều rất tốt, phòng rộng rãi và thoải mái. Chỉ tiếc là bữa sáng không đa dạng lắm."
                },
                {
                  name: "Lê Văn C",
                  date: "20/04/2023",
                  rating: 5,
                  comment: "Tuyệt vời! Dịch vụ chuyên nghiệp, phòng đẹp, sạch sẽ, đầy đủ tiện nghi. Vị trí thuận tiện cho việc di chuyển."
                }
              ].map((review, index) => (
                <div key={index} className="border-b pb-6 last:border-b-0">
                  <div className="flex justify-between mb-2">
                    <div className="font-medium">{review.name}</div>
                    <div className="text-sm text-gray-500">{review.date}</div>
                  </div>
                  <div className="flex items-center mb-2">
                    {Array(5).fill(0).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < review.rating 
                            ? "fill-yellow-400 text-yellow-400" 
                            : "text-gray-300"
                        }`} 
                      />
                    ))}
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center">
              <Button variant="outline">Xem thêm đánh giá</Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="location" className="pt-4">
          <div className="space-y-4">
            <div className="h-80 bg-gray-100 rounded-lg flex items-center justify-center">
              <Map className="h-12 w-12 text-gray-400" />
              <span className="ml-2 text-gray-500">Bản đồ vị trí khách sạn</span>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-2">Địa chỉ</h3>
              <p className="text-gray-700">123 Đường Biển, Phường Hải Cảng, Quận Sơn Trà, Đà Nẵng</p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-2">Địa điểm xung quanh</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="bg-blue-100 p-1 rounded mt-0.5 mr-2">
                    <Map className="h-4 w-4 text-blue-700" />
                  </div>
                  <div>
                    <span className="font-medium">Bãi biển Mỹ Khê</span>
                    <span className="text-gray-500 text-sm block">Cách 100m (đi bộ 2 phút)</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 p-1 rounded mt-0.5 mr-2">
                    <Map className="h-4 w-4 text-blue-700" />
                  </div>
                  <div>
                    <span className="font-medium">Chợ Hàn</span>
                    <span className="text-gray-500 text-sm block">Cách 2km (đi xe 7 phút)</span>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="bg-blue-100 p-1 rounded mt-0.5 mr-2">
                    <Map className="h-4 w-4 text-blue-700" />
                  </div>
                  <div>
                    <span className="font-medium">Cầu Rồng</span>
                    <span className="text-gray-500 text-sm block">Cách 3km (đi xe 10 phút)</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Recommended Rooms */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Phòng tương tự</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              id: "2",
              name: "Phòng Suite Gia Đình",
              image: "/room-2.jpg",
              price: "2,000,000",
              rating: 4.9,
              description: "Phòng suite rộng rãi với 2 phòng ngủ, phù hợp cho gia đình có trẻ em."
            },
            {
              id: "5",
              name: "Phòng Deluxe Hướng Vườn",
              image: "/room-5.jpg",
              price: "1,100,000",
              rating: 4.6,
              description: "Phòng deluxe yên tĩnh với tầm nhìn ra khu vườn xanh mát của khách sạn."
            },
            {
              id: "6",
              name: "Phòng Suite Cao Cấp",
              image: "/room-6.jpg",
              price: "2,500,000",
              rating: 5.0,
              description: "Phòng suite cao cấp nhất với không gian rộng rãi và dịch vụ đẳng cấp 5 sao."
            }
          ].map((room) => (
            <Card key={room.id} className="overflow-hidden hover:shadow-lg transition">
              <div className="relative h-48 bg-gray-200 flex items-center justify-center">
                <div className="text-gray-400">Room Image</div>
              </div>
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{room.name}</h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm ml-1">{room.rating}</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mb-4">{room.description}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-lg">{room.price} VNĐ</span>
                    <span className="text-sm text-gray-500">/đêm</span>
                  </div>
                  <Link href={`/customer/room/${room.id}`}>
                    <Button variant="outline" className="hover:bg-blue-50 hover:text-blue-600">
                      Chi tiết
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 