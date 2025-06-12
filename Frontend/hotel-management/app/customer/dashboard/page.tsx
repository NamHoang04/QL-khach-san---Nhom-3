"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star, Loader2, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { get } from "@/lib/api"
import { formatCurrency } from "@/lib/utils"
import { toast } from "sonner"
import { useSaved } from "@/lib/saved-context"

// Định nghĩa kiểu dữ liệu cho Room và Service
interface Room {
  id: string;
  roomNumber: string;
  image: string; // Sẽ dùng ảnh từ Unsplash hoặc ảnh mặc định
  roomTypeName: string;
  basePrice: number;
  rating?: number; // Giả sử có rating
  description?: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  icon?: string; // Icon emoji
  rating?: number; // Giả sử có rating
}

// Mock Data
const mockFeaturedRooms: Room[] = [
  {
    id: '1',
    roomNumber: '101',
    image: 'https://source.unsplash.com/random/800x600/?hotel,deluxe-room',
    roomTypeName: 'Phòng Deluxe Nhìn Ra Thành Phố',
    basePrice: 2500000,
    rating: 4.8,
    description: 'Tận hưởng không gian sang trọng và tầm nhìn tuyệt đẹp từ phòng Deluxe của chúng tôi.'
  },
  {
    id: '2',
    roomNumber: '205',
    image: 'https://source.unsplash.com/random/800x600/?hotel,suite',
    roomTypeName: 'Suite Gia Đình Rộng Rãi',
    basePrice: 4200000,
    rating: 4.9,
    description: 'Suite rộng rãi với hai phòng ngủ, lý tưởng cho các kỳ nghỉ của gia đình.'
  },
  {
    id: '3',
    roomNumber: '302',
    image: 'https://source.unsplash.com/random/800x600/?hotel,ocean-view-room',
    roomTypeName: 'Phòng Premier Hướng Biển',
    basePrice: 3800000,
    rating: 4.7,
    description: 'Thư giãn với ban công riêng và tầm nhìn bao quát ra đại dương xanh.'
  }
];

const mockFeaturedServices: Service[] = [
  {
    id: '1',
    name: 'Spa & Massage',
    description: 'Thư giãn và phục hồi năng lượng với các liệu pháp spa chuyên nghiệp.',
    price: 800000,
    icon: '💆‍♀️',
    rating: 4.9
  },
  {
    id: '2',
    name: 'Nhà Hàng Cao Cấp',
    description: 'Khám phá ẩm thực tinh tế với thực đơn đa dạng từ Á đến Âu.',
    price: 1200000,
    icon: '🍽️',
    rating: 4.8
  },
  {
    id: '3',
    name: 'Hồ Bơi Vô Cực',
    description: 'Đắm mình trong làn nước mát và ngắm nhìn toàn cảnh thành phố.',
    price: 0, // Assuming free for guests
    icon: '🏊‍♂️',
    rating: 4.9
  },
  {
    id: '4',
    name: 'Dịch Vụ Đưa Đón',
    description: 'Di chuyển thuận tiện và an toàn với dịch vụ xe riêng của chúng tôi.',
    price: 500000,
    icon: '🚗',
    rating: 4.7
  }
];

export default function CustomerDashboard() {
  const router = useRouter()
  const [featuredRooms, setFeaturedRooms] = useState<Room[]>([])
  const [featuredServices, setFeaturedServices] = useState<Service[]>([])
  const { saveRoom, removeRoom, isSavedRoom, saveService, removeService, isSavedService } = useSaved()

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setFeaturedRooms(mockFeaturedRooms);
      setFeaturedServices(mockFeaturedServices);
    }, 500); // Simulate network delay
  }, [])

  const toggleSaveRoom = (room: Room, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const roomId = parseInt(room.id, 10)
    if (isSavedRoom(roomId)) {
      removeRoom(roomId)
    } else {
      saveRoom({ ...room, id: roomId })
    }
  }

  const toggleSaveService = (service: Service, event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const serviceId = parseInt(service.id, 10)
    if (isSavedService(serviceId)) {
      removeService(serviceId)
    } else {
      saveService({ ...service, id: serviceId })
    }
  }

  // Function to handle service click
  const handleServiceClick = (serviceId: string) => {
    router.push(`/customer/services/${serviceId}`)
  }

  // Helper để tạo ảnh ngẫu nhiên nếu không có ảnh từ API
  const getRoomImageUrl = (index: number) => `https://source.unsplash.com/random/800x600/?hotel,room&${index}`

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden h-[500px]">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        <Image
          src="https://source.unsplash.com/random/1600x900/?hotel,lobby"
          alt="Scenic Hotel View"
          fill
          className="z-0 object-cover"
        />
        <div className="relative z-20 h-full flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Chào mừng đến với Khách sạn</h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl">Nơi mang đến cho bạn trải nghiệm nghỉ dưỡng đẳng cấp và khó quên.</p>
            <Button asChild size="lg" className="mt-8">
              <Link href="/customer/search">Khám phá ngay</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Rooms Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Phòng nổi bật</h2>
            <Link href="/customer/search" className="text-blue-600 hover:underline flex items-center">
              Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {featuredRooms.map((room, index) => (
                <Link key={room.id} href={`/customer/room/${room.id}`} className="block w-full max-w-sm">
                  <Card className="overflow-hidden hover:shadow-lg transition h-full">
                    <div className="relative h-48">
                      <Image
                        src={getRoomImageUrl(index)}
                        alt={room.roomTypeName}
                        fill
                        className="object-cover"
                      />
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute top-2 right-2 rounded-full h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white z-10"
                      onClick={(e) => toggleSaveRoom(room, e)}
                    >
                      <Heart className={`h-4 w-4 ${isSavedRoom(parseInt(room.id, 10)) ? "text-red-500 fill-red-500" : "text-gray-500"}`} />
                    </Button>
                    </div>
                    <CardContent className="p-5 flex flex-col">
                      <h3 className="font-bold text-lg">{room.roomTypeName}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2 mt-1">{room.description || `Phòng ${room.roomTypeName} tiện nghi.`}</p>
                      <div className="mt-auto">
                        <span className="font-bold text-lg text-blue-700">{formatCurrency(room.basePrice)}</span>
                        <span className="text-sm text-gray-500"> /đêm</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
        </div>
      </section>

      {/* Services Highlight */}
      <section className="bg-blue-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Dịch vụ của chúng tôi</h2>
          
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
              {featuredServices.map((service) => (
                <div 
                  key={service.id} 
                className="bg-white rounded-lg p-5 text-center hover:shadow-md transition w-full max-w-xs cursor-pointer flex flex-col relative"
                  onClick={() => handleServiceClick(service.id)}
                >
                 <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-2 right-2 rounded-full h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white z-10"
                    onClick={(e) => toggleSaveService(service, e)}
                  >
                    <Heart className={`h-4 w-4 ${isSavedService(parseInt(service.id, 10)) ? "text-red-500 fill-red-500" : "text-gray-500"}`} />
                  </Button>
                  <div className="text-3xl mb-2">{service.icon || '⭐'}</div>
                  <h3 className="font-bold mb-1">{service.name}</h3>
                  <p className="text-sm text-gray-500 mb-2 flex-grow">{service.description.substring(0, 60)}...</p>
                  <div className="mt-auto">
                    <span className="text-sm font-medium text-blue-600">{formatCurrency(service.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          
          <div className="text-center mt-8">
            <Link href="/customer/services">
              <Button variant="outline" className="hover:bg-blue-100">
                Xem tất cả dịch vụ
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
} 