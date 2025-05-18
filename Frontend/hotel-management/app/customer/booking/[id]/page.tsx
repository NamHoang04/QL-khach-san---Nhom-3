"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog"
import { 
  CreditCard, 
  Building, 
  Calendar, 
  Users, 
  Clock, 
  Star, 
  CheckCircle,
  ChevronLeft,
  Wifi,
  Coffee,
  Bath
} from "lucide-react"
import { toast } from "sonner"

// Sample room data - would be fetched from API in a real app
const roomsData = [
  {
    id: "1",
    name: "Phòng Deluxe View Biển",
    type: "deluxe",
    images: ["/room-1-1.jpg"],
    price: 1200000,
    discountedPrice: 960000, // With 20% discount
    rating: 4.8,
    reviews: 124,
    capacity: 2,
    beds: "1 giường King-size",
    size: "35m²",
    amenities: ["wifi", "breakfast", "ac", "tv", "minibar", "workspace"],
    description: "Phòng sang trọng với tầm nhìn ra biển, không gian rộng rãi và tiện nghi cao cấp.",
    longDescription: "Phòng Deluxe với tầm nhìn ra biển cung cấp không gian sang trọng và thoải mái cho kỳ nghỉ của bạn.",
    policies: {
      checkin: "14:00",
      checkout: "12:00",
      cancellation: "Miễn phí hủy phòng trước 3 ngày. Sau thời gian đó, phí hủy phòng tương đương 1 đêm lưu trú.",
      children: "Trẻ em dưới 6 tuổi được ở miễn phí khi dùng chung giường với người lớn.",
      pets: "Không cho phép vật nuôi.",
      smoking: "Không hút thuốc.",
    }
  },
  {
    id: "2",
    name: "Phòng Suite Gia Đình",
    type: "suite",
    images: ["/room-2.jpg"],
    price: 2000000,
    discountedPrice: null,
    rating: 4.9,
    reviews: 98,
    capacity: 4,
    beds: "1 giường King-size và 1 giường Queen-size",
    size: "55m²",
    amenities: ["wifi", "breakfast", "bath", "ac", "tv", "minibar", "workspace"],
    description: "Phòng suite rộng rãi với 2 phòng ngủ, phù hợp cho gia đình có trẻ em.",
    longDescription: "Phòng Suite Gia Đình cung cấp không gian thoải mái với 2 phòng ngủ riêng biệt, phù hợp cho gia đình.",
    policies: {
      checkin: "14:00",
      checkout: "12:00",
      cancellation: "Miễn phí hủy phòng trước 5 ngày. Sau thời gian đó, phí hủy phòng tương đương 1 đêm lưu trú.",
      children: "Trẻ em dưới 6 tuổi được ở miễn phí khi dùng chung giường với người lớn.",
      pets: "Không cho phép vật nuôi.",
      smoking: "Không hút thuốc.",
    }
  },
]

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.id as string
  
  // Find room by ID
  const room = roomsData.find(r => r.id === roomId) || roomsData[0]
  
  const [formData, setFormData] = useState({
    checkInDate: "",
    checkOutDate: "",
    adults: "2",
    children: "0",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Vietnam",
    specialRequests: "",
    paymentMethod: "credit-card",
    cardName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    acceptTerms: false
  })
  
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [isBookingComplete, setIsBookingComplete] = useState(false)
  const [bookingReference, setBookingReference] = useState("")
  
  // Calculate number of nights and total price
  const checkIn = formData.checkInDate ? new Date(formData.checkInDate) : null
  const checkOut = formData.checkOutDate ? new Date(formData.checkOutDate) : null
  const nights = checkIn && checkOut 
    ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
    : 0
  
  const price = room.discountedPrice || room.price
  const totalPrice = nights * price
  const depositAmount = totalPrice * 0.2 // 20% deposit
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }
  
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
  }
  
  const validateForm = () => {
    // Basic validation
    if (!formData.checkInDate || !formData.checkOutDate) {
      toast.error("Vui lòng chọn ngày nhận phòng và trả phòng")
      return false
    }
    
    if (!formData.firstName || !formData.lastName) {
      toast.error("Vui lòng nhập họ và tên của bạn")
      return false
    }
    
    if (!formData.email || !formData.phone) {
      toast.error("Vui lòng nhập email và số điện thoại")
      return false
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error("Vui lòng nhập đúng định dạng email")
      return false
    }
    
    // Payment validation
    if (formData.paymentMethod === "credit-card") {
      if (!formData.cardName || !formData.cardNumber || !formData.expiryMonth || !formData.expiryYear || !formData.cvv) {
        toast.error("Vui lòng điền đầy đủ thông tin thẻ thanh toán")
        return false
      }
      
      // Basic card number validation
      if (formData.cardNumber.replace(/\s/g, "").length < 15) {
        toast.error("Số thẻ không hợp lệ")
        return false
      }
      
      // Basic CVV validation
      if (formData.cvv.length < 3) {
        toast.error("Mã bảo mật CVV không hợp lệ")
        return false
      }
    }
    
    if (!formData.acceptTerms) {
      toast.error("Vui lòng chấp nhận điều khoản và điều kiện")
      return false
    }
    
    return true
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      setIsConfirmDialogOpen(true)
    }
  }
  
  const completeBooking = () => {
    // This would normally submit the booking to an API
    
    // Generate a booking reference
    const reference = `BK${Math.floor(100000 + Math.random() * 900000)}`
    setBookingReference(reference)
    setIsBookingComplete(true)
    
    toast.success(
      <div className="flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <span>Đặt phòng thành công!</span>
      </div>
    )
  }
  
  const goToBookings = () => {
    router.push("/customer/bookings")
  }
  
  return (
    <div className="space-y-8">
      <Button 
        variant="ghost" 
        className="flex items-center text-gray-500"
        onClick={() => router.back()}
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Quay lại
      </Button>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Hoàn tất đặt phòng</h1>
        <p className="text-gray-600">Điền thông tin của bạn để hoàn tất đặt phòng</p>
      </div>
      
      {isBookingComplete ? (
        <BookingComplete 
          bookingReference={bookingReference}
          roomName={room.name}
          checkInDate={formData.checkInDate}
          checkOutDate={formData.checkOutDate}
          nights={nights}
          totalPrice={totalPrice}
          goToBookings={goToBookings}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Stay Details */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Chi tiết lưu trú</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="checkInDate">Ngày nhận phòng</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input
                          id="checkInDate"
                          name="checkInDate"
                          type="date"
                          className="pl-10"
                          value={formData.checkInDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="checkOutDate">Ngày trả phòng</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Input
                          id="checkOutDate"
                          name="checkOutDate"
                          type="date"
                          className="pl-10"
                          value={formData.checkOutDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="adults">Người lớn</Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Select 
                          value={formData.adults} 
                          onValueChange={(value) => handleSelectChange("adults", value)}
                        >
                          <SelectTrigger className="pl-10">
                            <SelectValue placeholder="Số người lớn" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 người lớn</SelectItem>
                            <SelectItem value="2">2 người lớn</SelectItem>
                            <SelectItem value="3">3 người lớn</SelectItem>
                            <SelectItem value="4">4 người lớn</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="children">Trẻ em</Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        <Select 
                          value={formData.children} 
                          onValueChange={(value) => handleSelectChange("children", value)}
                        >
                          <SelectTrigger className="pl-10">
                            <SelectValue placeholder="Số trẻ em" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Không có trẻ em</SelectItem>
                            <SelectItem value="1">1 trẻ em</SelectItem>
                            <SelectItem value="2">2 trẻ em</SelectItem>
                            <SelectItem value="3">3 trẻ em</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Guest Information */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Thông tin khách hàng</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Tên</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        placeholder="Tên của bạn"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Họ</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        placeholder="Họ của bạn"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="Số điện thoại của bạn"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Địa chỉ</Label>
                      <Input
                        id="address"
                        name="address"
                        placeholder="Địa chỉ của bạn"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="city">Thành phố</Label>
                      <Input
                        id="city"
                        name="city"
                        placeholder="Thành phố của bạn"
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="country">Quốc gia</Label>
                      <Select 
                        value={formData.country} 
                        onValueChange={(value) => handleSelectChange("country", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn quốc gia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Vietnam">Việt Nam</SelectItem>
                          <SelectItem value="Japan">Nhật Bản</SelectItem>
                          <SelectItem value="Korea">Hàn Quốc</SelectItem>
                          <SelectItem value="China">Trung Quốc</SelectItem>
                          <SelectItem value="USA">Hoa Kỳ</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="specialRequests">Yêu cầu đặc biệt (không bắt buộc)</Label>
                      <Textarea
                        id="specialRequests"
                        name="specialRequests"
                        placeholder="Các yêu cầu đặc biệt cho kỳ nghỉ của bạn"
                        value={formData.specialRequests}
                        onChange={handleInputChange}
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Payment Information */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Thông tin thanh toán</h2>
                  
                  <RadioGroup 
                    value={formData.paymentMethod}
                    onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                    className="space-y-4 mb-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card" className="flex items-center cursor-pointer">
                        <CreditCard className="mr-2 h-5 w-5" />
                        Thẻ tín dụng / Ghi nợ
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                      <Label htmlFor="bank-transfer" className="flex items-center cursor-pointer">
                        <Building className="mr-2 h-5 w-5" />
                        Chuyển khoản ngân hàng
                      </Label>
                    </div>
                  </RadioGroup>
                  
                  {formData.paymentMethod === "credit-card" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Tên chủ thẻ</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          placeholder="Tên in trên thẻ"
                          value={formData.cardName}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Số thẻ</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="•••• •••• •••• ••••"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiryMonth">Tháng hết hạn</Label>
                          <Select 
                            value={formData.expiryMonth} 
                            onValueChange={(value) => handleSelectChange("expiryMonth", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="MM" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                                <SelectItem 
                                  key={month} 
                                  value={month.toString().padStart(2, '0')}
                                >
                                  {month.toString().padStart(2, '0')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="expiryYear">Năm hết hạn</Label>
                          <Select 
                            value={formData.expiryYear} 
                            onValueChange={(value) => handleSelectChange("expiryYear", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="YY" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i).map(year => (
                                <SelectItem 
                                  key={year} 
                                  value={year.toString().slice(-2)}
                                >
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            placeholder="•••"
                            value={formData.cvv}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {formData.paymentMethod === "bank-transfer" && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="mb-4">
                        Vui lòng chuyển khoản đặt cọc {formatPrice(depositAmount)} đến tài khoản ngân hàng dưới đây:
                      </p>
                      <ul className="space-y-2 text-sm">
                        <li><strong>Tên ngân hàng:</strong> ACB</li>
                        <li><strong>Số tài khoản:</strong> 123456789</li>
                        <li><strong>Chủ tài khoản:</strong> CÔNG TY KHÁCH SẠN XYZ</li>
                        <li><strong>Nội dung chuyển khoản:</strong> {room.name} - {formData.lastName} {formData.firstName}</li>
                      </ul>
                      <p className="mt-4 text-sm text-gray-600">
                        Sau khi nhận được thanh toán, chúng tôi sẽ gửi xác nhận đặt phòng qua email của bạn.
                      </p>
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="terms" 
                        checked={formData.acceptTerms}
                        onCheckedChange={(checked) => 
                          handleCheckboxChange("acceptTerms", checked as boolean)
                        }
                      />
                      <label 
                        htmlFor="terms" 
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Tôi đồng ý với <a href="#" className="text-blue-600 hover:underline">Điều khoản và Điều kiện</a>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex justify-end">
                <Button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 px-8"
                >
                  Hoàn tất đặt phòng
                </Button>
              </div>
            </form>
          </div>
          
          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-4">Tóm tắt đặt phòng</h2>
                  
                  <div className="mb-4">
                    <div className="relative h-40 bg-gray-200 rounded-lg overflow-hidden mb-4">
                      <div className="flex items-center justify-center h-full text-gray-400">
                        Room Image
                      </div>
                    </div>
                    
                    <h3 className="font-bold text-lg">{room.name}</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>{room.rating}</span>
                      <span className="mx-1">•</span>
                      <span>{room.reviews} đánh giá</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 border-t border-b py-4 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium">Nhận phòng</p>
                        <p className="text-sm">{formatDate(formData.checkInDate)} từ {room.policies.checkin}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium">Trả phòng</p>
                        <p className="text-sm">{formatDate(formData.checkOutDate)} trước {room.policies.checkout}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium">Thời gian lưu trú</p>
                        <p className="text-sm">{nights} đêm</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium">Số lượng khách</p>
                        <p className="text-sm">{formData.adults} người lớn, {formData.children} trẻ em</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full">
                        <Wifi className="h-3 w-3 mr-1" />
                        Wifi miễn phí
                      </div>
                      
                      {room.amenities.includes("breakfast") && (
                        <div className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full">
                          <Coffee className="h-3 w-3 mr-1" />
                          Bữa sáng miễn phí
                        </div>
                      )}
                      
                      {room.amenities.includes("bath") && (
                        <div className="flex items-center text-xs bg-gray-100 px-2 py-1 rounded-full">
                          <Bath className="h-3 w-3 mr-1" />
                          Bồn tắm spa
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Giá phòng ({nights} đêm)</span>
                      <span>{formatPrice(price)} × {nights}</span>
                    </div>
                    
                    {room.discountedPrice && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Giảm giá (20%)</span>
                        <span>-{formatPrice((room.price - room.discountedPrice) * nights)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between text-sm">
                      <span>Thuế và phí</span>
                      <span>Đã bao gồm</span>
                    </div>
                    
                    <div className="flex justify-between font-bold text-lg pt-3 border-t">
                      <span>Tổng cộng</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm text-blue-600">
                      <span>Đặt cọc (20%)</span>
                      <span>{formatPrice(depositAmount)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
      
      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận đặt phòng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn sắp hoàn tất đặt phòng {room.name} từ ngày {formatDate(formData.checkInDate)} 
              đến ngày {formatDate(formData.checkOutDate)} với tổng số tiền {formatPrice(totalPrice)}.
              <br /><br />
              Tiếp tục để hoàn tất đặt phòng?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={completeBooking}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Component for the booking completion screen
function BookingComplete({
  bookingReference,
  roomName,
  checkInDate,
  checkOutDate,
  nights,
  totalPrice,
  goToBookings
}: {
  bookingReference: string,
  roomName: string,
  checkInDate: string,
  checkOutDate: string,
  nights: number,
  totalPrice: number,
  goToBookings: () => void
}) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date)
  }
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Đặt phòng thành công!</h2>
            <p className="text-gray-600">
              Chúng tôi đã gửi xác nhận đặt phòng đến email của bạn.
            </p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="mb-4">
              <span className="text-sm text-gray-500">Mã đặt phòng</span>
              <p className="text-xl font-bold">{bookingReference}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="text-sm text-gray-500">Phòng</span>
                <p className="font-medium">{roomName}</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Thời gian lưu trú</span>
                <p className="font-medium">{nights} đêm</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Nhận phòng</span>
                <p className="font-medium">{formatDate(checkInDate)}</p>
              </div>
              
              <div>
                <span className="text-sm text-gray-500">Trả phòng</span>
                <p className="font-medium">{formatDate(checkOutDate)}</p>
              </div>
              
              <div className="md:col-span-2">
                <span className="text-sm text-gray-500">Tổng tiền</span>
                <p className="text-lg font-bold">{formatPrice(totalPrice)}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4 text-center">
            <p className="text-gray-600">
              Nếu bạn có bất kỳ câu hỏi nào về đặt phòng của mình, vui lòng liên hệ đội ngũ dịch vụ khách hàng của chúng tôi.
            </p>
            
            <Button 
              className="bg-blue-600 hover:bg-blue-700 px-8"
              onClick={goToBookings}
            >
              Xem đặt phòng của tôi
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 