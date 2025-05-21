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
      discount: "20%",
      rating: 4.8,
      description: "Phòng sang trọng với tầm nhìn ra biển, không gian rộng rãi và tiện nghi cao cấp."
    },
    {
      id: "2",
      name: "Phòng Suite Gia Đình",
      image: "/room-2.jpg",
      price: "2,000,000",
      rating: 4.9,
      description: "Phòng suite rộng rãi với 2 phòng ngủ, phù hợp cho gia đình có trẻ em."
    },
    {
      id: "3",
      name: "Phòng Standard Tiết Kiệm",
      image: "/room-3.jpg",
      price: "750,000",
      rating: 4.5,
      description: "Phòng tiêu chuẩn thoải mái với đầy đủ tiện nghi cơ bản cho du khách."
    },
  ]

  const [searchQuery, setSearchQuery] = useState("")
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
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
      </div>

      {/* Featured Rooms Section */}
      <section className="mt-10 px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Phòng nổi bật</h2>
          <Link href="/customer/search" className="text-blue-600 hover:underline flex items-center">
            Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {featuredRooms.map((room) => (
            <Link 
              key={room.id} 
              href={`/customer/room/${room.id}`}
              className="block"
            >
              <Card className="overflow-hidden hover:shadow-lg transition h-full">
                <div className="relative h-48 bg-blue-100 flex items-center justify-center">
                  <div className="text-blue-600 font-medium">Hình ảnh phòng</div>
                  {room.discount && (
                    <Badge className="absolute top-2 right-2 bg-green-600">
                      Giảm {room.discount}
                    </Badge>
                  )}
                </div>
                <CardContent className="p-5 flex flex-col h-[calc(100%-12rem)]">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-lg">{room.name}</h3>
                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                      <span className="text-xs font-medium ml-1 text-yellow-700">{room.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{room.description}</p>
                  <div className="mt-auto">
                    {room.discountPrice ? (
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-lg text-blue-700">{room.discountPrice} VNĐ</span>
                        <span className="text-sm text-gray-500 line-through">{room.price} VNĐ</span>
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
      </section>

      {/* Services Highlight */}
      <section className="bg-blue-50 p-8 mt-10 mb-6 mx-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Dịch vụ của chúng tôi</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-6">
          {[
            { title: "Nhà hàng", icon: "🍽️", description: "Thưởng thức ẩm thực đa dạng" },
            { title: "Spa & Massage", icon: "💆", description: "Thư giãn và làm đẹp" },
            { title: "Hồ bơi", icon: "🏊", description: "Tắm và giải trí" },
            { title: "Phòng Gym", icon: "🏋️", description: "Tập luyện không giới hạn" }
          ].map((service, index) => (
            <div key={index} className="bg-white rounded-lg p-5 text-center hover:shadow-md transition">
              <div className="text-3xl mb-2">{service.icon}</div>
              <h3 className="font-bold mb-1">{service.title}</h3>
              <p className="text-sm text-gray-500">{service.description}</p>
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
      </section>
    </div>
  )
} 