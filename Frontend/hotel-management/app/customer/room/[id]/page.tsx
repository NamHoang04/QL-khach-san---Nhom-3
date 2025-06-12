"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { 
  Calendar, Users, Check, Star, Wifi, Coffee, Bath, Thermometer,
  Utensils, PanelTop, ChevronLeft, Send, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { get } from "@/lib/api"
import { formatCurrency } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

// Kiểu dữ liệu cho một phòng chi tiết
interface RoomDetails {
  id: number;
  roomNumber: string;
  description: string;
  status: string;
  roomTypeId: number;
  roomTypeName: string;
  price: number;
  amenities: { id: number; name: string; description: string }[];
  images: { id: number; imageUrl: string; isPrimary: boolean }[];
  capacity: number;
  rating?: number;
  reviewsCount?: number;
}

export default function RoomDetailPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const roomId = params.id as string
  const shouldFocusBooking = searchParams.get('book') === 'true'

  const [room, setRoom] = useState<RoomDetails | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [guests, setGuests] = useState("2")

  useEffect(() => {
    if (!roomId) return;

    const fetchRoomDetails = async () => {
      try {
        const response = await get<RoomDetails>(`/Rooms/${roomId}`)
        setRoom(response.data)
        if (response.data.images && response.data.images.length > 0) {
          const primaryImage = response.data.images.find(img => img.isPrimary) || response.data.images[0];
          setSelectedImage(primaryImage.imageUrl);
        }
      } catch (err) {
        console.error("Failed to fetch room details:", err)
        setError("Không tìm thấy phòng hoặc đã có lỗi xảy ra.")
        toast.error("Không thể tải chi tiết phòng.")
      }
    }

    fetchRoomDetails()
  }, [roomId])
  
  useEffect(() => {
    if (shouldFocusBooking && room) {
      document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [shouldFocusBooking, room])
  
  const handleBookNow = () => {
    if (!room || !checkInDate || !checkOutDate) {
      toast.error("Vui lòng chọn ngày nhận và trả phòng.")
      return
    }
    
    const nights = Math.ceil((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24));
    if (nights <= 0) {
      toast.error("Ngày trả phòng phải sau ngày nhận phòng.");
      return;
    }

    const bookingData = {
      roomId: room.id,
      roomName: room.roomTypeName,
      roomImage: room.images?.[0]?.imageUrl || '',
      checkInDate,
      checkOutDate,
      nights,
      guests: parseInt(guests),
      pricePerNight: room.price,
      totalPrice: room.price * nights
    };
    
    localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
    router.push('/customer/booking');
  }

  if (error || !room) {
    return (
      <div className="max-w-7xl mx-auto p-4 text-center">
        <h2 className="text-2xl font-bold text-red-600">Đã có lỗi xảy ra</h2>
        <p className="mt-2">{error}</p>
        <Button asChild className="mt-4">
          <Link href="/customer/search">Quay lại tìm kiếm</Link>
        </Button>
      </div>
    )
  }

  const primaryImage = room.images?.find(img => img.isPrimary) || room.images?.[0];
  const otherImages = room.images?.filter(img => img.imageUrl !== primaryImage?.imageUrl);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-4">
        <Link href="/customer/search" className="flex items-center text-blue-600 hover:underline">
          <ChevronLeft className="w-4 h-4 mr-1" /> Quay lại tìm kiếm
        </Link>
      </div>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">{room.roomTypeName}</h1>
          <p className="text-gray-600">Phòng số: {room.roomNumber}</p>
        </div>
        
        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden">
            <Image 
              src={selectedImage || "https://pix10.agoda.net/hotelImages/64245759/0/3c838e373c273ed83083a28c20530173.jpg?ce=2&s=702x392"}
              alt={room.roomTypeName}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {otherImages?.slice(0, 4).map((image, index) => (
              <div 
                key={image.id}
                className="relative h-full rounded-lg overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(image.imageUrl)}
              >
                 <Image 
                  src={image.imageUrl || "https://pix10.agoda.net/hotelImages/64245759/0/3c838e373c273ed83083a28c20530173.jpg?ce=2&s=702x392"}
                  alt={`${room.roomTypeName} - view ${index + 2}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Thông tin chi tiết</h2>
                <p className="text-gray-700 mb-6">{room.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-6">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" /> 
                    <span>Sức chứa: <strong>{room.capacity} người</strong></span>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <h2 className="text-xl font-bold mb-4">Tiện nghi</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {room.amenities?.map((amenity) => (
                    <div key={amenity.id} className="flex items-center">
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                      <span className="text-sm">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="sticky top-6" id="booking-section">
              <CardContent className="p-4">
                <div className="mb-4">
                  <span className="text-2xl font-bold text-blue-700">{formatCurrency(room.price)}</span>
                  <span className="text-gray-500"> / đêm</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Ngày nhận phòng</label>
                    <Input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} min={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Ngày trả phòng</label>
                    <Input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} min={checkInDate || new Date().toISOString().split('T')[0]} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Số lượng khách</label>
                    <Select value={guests} onValueChange={setGuests}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {[...Array(room.capacity)].map((_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)}>{i + 1} người</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleBookNow}>Đặt ngay</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

const getRoomImageUrl = (index: number) => "https://pix10.agoda.net/hotelImages/64245759/0/3c838e373c273ed83083a28c20530173.jpg?ce=2&s=702x392";