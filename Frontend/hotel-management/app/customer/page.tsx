"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

export default function CustomerDashboard() {
  const router = useRouter()
  
  // Sample featured rooms data
  const featuredRooms = [
    {
      id: "1",
      name: "Phòng Deluxe View Biển",
      image: "/room-1.jpg",
      price: "1,200,000",
      discountPrice: "960,000",
      rating: 4.8,
      reviews: 5,
      description: "Phòng sang trọng với tầm nhìn ra biển, không gian rộng rãi và tiện nghi cao cấp."
    },
    {
      id: "2",
      name: "Phòng Suite Gia Đình",
      image: "/room-2.jpg",
      price: "2,000,000",
      rating: 4.9,
      reviews: 5,
      description: "Phòng suite rộng rãi với 2 phòng ngủ, phù hợp cho gia đình có trẻ em."
    },
    {
      id: "3",
      name: "Phòng Standard Tiết Kiệm",
      image: "/room-3.jpg",
      price: "750,000",
      rating: 4.5,
      reviews: 5,
      description: "Phòng tiêu chuẩn thoải mái với đầy đủ tiện nghi cơ bản cho du khách."
    },
  ]

  // Sample services data
  const featuredServices = [
    {
      id: "1",
      title: "Nhà hàng",
      icon: "🍽️",
      image: "/service-restaurant.jpg",
      description: "Thưởng thức ẩm thực đa dạng từ các món Á đến Âu với đầu bếp 5 sao.",
      price: "250,000",
      rating: 4.7
    },
    {
      id: "2",
      title: "Spa & Massage",
      icon: "💆",
      image: "/service-spa.jpg",
      description: "Thư giãn và làm đẹp với các liệu pháp spa cao cấp và dịch vụ massage chuyên nghiệp.",
      price: "450,000",
      rating: 4.9
    },
    {
      id: "3",
      title: "Hồ bơi",
      icon: "🏊",
      image: "/service-pool.jpg",
      description: "Tắm và giải trí tại hồ bơi vô cực với tầm nhìn panorama ra biển.",
      price: "120,000",
      rating: 4.6
    },
    {
      id: "4",
      title: "Phòng Gym",
      icon: "🏋️",
      image: "/service-gym.jpg",
      description: "Tập luyện không giới hạn với các thiết bị hiện đại và huấn luyện viên chuyên nghiệp.",
      price: "100,000",
      rating: 4.5
    },
    {
      id: "5",
      title: "Tour & Dã Ngoại",
      icon: "🧳",
      image: "/service-tour.jpg",
      description: "Khám phá cảnh đẹp địa phương với dịch vụ tour được thiết kế riêng.",
      price: "800,000",
      rating: 4.8
    },
    {
      id: "6",
      title: "Tiệc & Sự Kiện",
      icon: "🎉",
      image: "/service-event.jpg",
      description: "Tổ chức tiệc, hội nghị, và sự kiện đặc biệt với dịch vụ chuyên nghiệp.",
      price: "5,000,000",
      rating: 4.9
    }
  ]

  const [searchQuery, setSearchQuery] = useState("")
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  // Function to handle service click
  const handleServiceClick = (serviceId: string) => {
    router.push(`/customer/services/${serviceId}`)
  }

  return (
    <div className="w-full">
      {/* Hero Section with Search */}
      <div className="relative overflow-hidden h-[500px]">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        
        {/* Placeholder for hero image */}
        <div className="absolute inset-0 bg-blue-900 flex items-center justify-center text-white text-4xl font-light">
          Scenic Hotel View
        </div>
        
        {/* Center content in hero if needed */}
        <div className="relative z-20 h-full flex items-center justify-center">
          <div className="max-w-7xl w-full mx-auto px-6">
            {/* Hero content can go here if needed */}
          </div>
        </div>
      </div>

      {/* Featured Rooms Section */}
      <section className="mt-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Phòng nổi bật</h2>
            <Link href="/customer/search" className="text-blue-600 hover:underline flex items-center">
              Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {featuredRooms.map((room) => (
              <Link 
                key={room.id} 
                href={`/customer/room/${room.id}`}
                className="block w-full max-w-sm"
              >
                <Card className="overflow-hidden hover:shadow-lg transition h-full">
                  <div className="relative h-48 bg-blue-100 flex items-center justify-center">
                    <div className="text-blue-600 font-medium">Hình ảnh phòng</div>
                  </div>
                  <CardContent className="p-5 flex flex-col h-[calc(100%-12rem)]">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-lg">{room.name}</h3>
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span className="text-xs font-medium ml-1 text-yellow-700">{room.rating}</span>
                        <span className="text-xs font-medium ml-1 text-gray-500">({room.reviews})</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{room.description}</p>
                    <div className="mt-auto">
                      {room.discountPrice ? (
                        <div className="flex items-baseline gap-2">
                          <span className="font-bold text-lg text-blue-700">{room.price} VNĐ</span>
                        
                        </div>
                      ) : (
                        <span className="font-bold text-lg text-blue-700">{room.price} VNĐ</span>
                      )}
                      <span className="text-sm text-gray-500">/đêm</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Highlight */}
      <section className="bg-blue-50 p-8 mt-10 mb-6">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-6 text-center">Dịch vụ của chúng tôi</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            {featuredServices.slice(0, 4).map((service) => (
              <div 
                key={service.id} 
                className="bg-white rounded-lg p-5 text-center hover:shadow-md transition w-full max-w-xs cursor-pointer"
                onClick={() => handleServiceClick(service.id)}
              >
                <div className="text-3xl mb-2">{service.icon}</div>
                <h3 className="font-bold mb-1">{service.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{service.description.substring(0, 60)}...</p>
                <div className="flex items-center justify-center mt-3">
                  <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full mr-2">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    <span className="text-xs font-medium ml-1 text-yellow-700">{service.rating}</span>
                  </div>
                  <span className="text-sm font-medium text-blue-600">{service.price} VNĐ</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-6">
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