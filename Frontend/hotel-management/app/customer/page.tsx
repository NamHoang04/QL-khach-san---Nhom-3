"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, Calendar, Users, ArrowRight, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

export default function CustomerDashboard() {
  // Sample featured rooms data
  const featuredRooms = [
    {
      id: "1",
      name: "Phòng Deluxe View Biển",
      image: "/room-1.jpg",
      price: "1,200,000",
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

  // Sample promotional offers
  const promotions = [
    {
      id: "1",
      title: "Ưu đãi mùa hè - Giảm 30%",
      image: "/promo-1.jpg",
      description: "Đặt phòng trước 30/7 và nhận giảm giá 30% cho kỳ nghỉ mùa hè của bạn."
    },
    {
      id: "2",
      title: "Gói nghỉ dưỡng gia đình",
      image: "/promo-2.jpg",
      description: "Đặt phòng Suite và nhận ưu đãi bữa sáng miễn phí cho cả gia đình."
    },
  ]

  return (
    <div className="space-y-10">
      {/* Hero Section with Search */}
      <div className="relative rounded-xl overflow-hidden h-[500px]">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        
        {/* Placeholder for hero image */}
        <div className="absolute inset-0 bg-blue-900 flex items-center justify-center text-white text-4xl font-light">
          Scenic Hotel View
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 z-20 p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Chào mừng đến với khách sạn của chúng tôi</h1>
          <p className="text-xl mb-6 max-w-2xl">Trải nghiệm dịch vụ lưu trú đẳng cấp với tiện nghi hiện đại và dịch vụ chuyên nghiệp</p>
          
          {/* Search Box */}
          <div className="bg-white rounded-lg p-4 flex flex-col md:flex-row gap-4 text-black max-w-4xl">
            <div className="flex-1 flex items-center gap-2">
              <Search className="h-5 w-5 text-gray-500" />
              <Input placeholder="Tìm kiếm phòng..." className="border-0 focus-visible:ring-0" />
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <Select>
                <SelectTrigger className="w-[180px] border-0">
                  <SelectValue placeholder="Ngày nhận phòng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Hôm nay</SelectItem>
                  <SelectItem value="tomorrow">Ngày mai</SelectItem>
                  <SelectItem value="nextweek">Tuần sau</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <Select>
                <SelectTrigger className="w-[180px] border-0">
                  <SelectValue placeholder="Ngày trả phòng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tomorrow">Ngày mai</SelectItem>
                  <SelectItem value="plus2">2 ngày nữa</SelectItem>
                  <SelectItem value="plus3">3 ngày nữa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-500" />
              <Select>
                <SelectTrigger className="w-[180px] border-0">
                  <SelectValue placeholder="Số người" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 người</SelectItem>
                  <SelectItem value="2">2 người</SelectItem>
                  <SelectItem value="3">3 người</SelectItem>
                  <SelectItem value="4">4 người</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button className="bg-blue-600 hover:bg-blue-700 ml-auto">
              Tìm kiếm
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Rooms Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Phòng nổi bật</h2>
          <Link href="/customer/search" className="text-blue-600 hover:underline flex items-center">
            Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredRooms.map((room) => (
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
      </section>

      {/* Promotions Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Ưu đãi đặc biệt</h2>
          <Link href="/customer/promotions" className="text-blue-600 hover:underline flex items-center">
            Xem tất cả <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {promotions.map((promo) => (
            <Card key={promo.id} className="overflow-hidden hover:shadow-lg transition">
              <div className="flex flex-col md:flex-row">
                <div className="relative h-40 md:w-1/3 bg-gray-200 flex items-center justify-center">
                  <div className="text-gray-400">Promo Image</div>
                </div>
                <CardContent className="p-5 md:w-2/3">
                  <h3 className="font-bold text-lg mb-2">{promo.title}</h3>
                  <p className="text-gray-500 text-sm mb-4">{promo.description}</p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Đặt ngay
                  </Button>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Services Highlight */}
      <section className="bg-blue-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Dịch vụ của chúng tôi</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
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