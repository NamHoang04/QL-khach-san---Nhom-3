"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Room, getRooms, RoomType, getRoomTypes } from "@/lib/room-service"
import { Service, getServices } from "@/lib/service-service"
import { formatCurrency } from "@/lib/utils"
import { BedDouble, Bath, Wifi, Users, Star, Utensils, Waves, ParkingSquare } from "lucide-react"
import { useRouter } from "next/navigation"

export default function GuestHomePage() {
  const router = useRouter()
  const [featuredRooms, setFeaturedRooms] = useState<Room[]>([])
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])
  
  useEffect(() => {
    async function fetchData() {
      try {
        const [roomsData, roomTypesData] = await Promise.all([
            getRooms(),
            getRoomTypes()
        ]);
        setFeaturedRooms(roomsData.slice(0, 3)) // Show first 3 rooms
        setRoomTypes(roomTypesData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      }
    }
    fetchData()
  }, [])

  const getCapacityForRoom = (room: Room) => {
    const roomType = roomTypes.find(rt => rt.id === room.roomTypeId);
    return roomType?.capacity || 2; // default to 2 if not found
  }

  const services = [
    { name: "Wifi miễn phí", icon: <Wifi/> },
    { name: "Hồ bơi", icon: <Waves/> },
    { name: "Nhà hàng", icon: <Utensils/> },
    { name: "Bãi đỗ xe", icon: <ParkingSquare/> },
  ]

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full flex items-center justify-center text-center text-white rounded-lg overflow-hidden -mt-8 -mx-8">
        <Image
          src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1b/42/63/a8/s-nh-don-khanh-du-c-thi.jpg?w=1200&h=-1&s=1"
          alt="Sảnh đón khách sạn"
          layout="fill"
          objectFit="cover"
          priority
          className="z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
        <div className="z-20 space-y-4 max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">Trải nghiệm kỳ nghỉ hoàn hảo</h1>
          <p className="text-lg md:text-xl text-gray-200">Khám phá sự kết hợp giữa sang trọng và tiện nghi tại khách sạn hàng đầu của chúng tôi.</p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-6 text-lg" onClick={() => router.push('/customer/search-room')}>
            Tìm phòng ngay
          </Button>
        </div>
      </section>

      {/* Featured Rooms Section */}
      <section id="featured-rooms">
        <h2 className="text-3xl font-bold text-center mb-8">Phòng Nổi Bật</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredRooms.map(room => (
            <Card key={room.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
              <div className="relative h-60 w-full">
                <Image
                  src={room.images?.[0] || "https://q-xx.bstatic.com/xdata/images/hotel/840x460/499599481.jpg?k=3f2e99fcf989570612ed6ed99d4c0b8fd2550a12b55098ce10492a591d0ab26e&o="}
                  alt={room.roomTypeName || 'Room image'}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{room.roomTypeName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Users size={16} /> <span>{getCapacityForRoom(room)} khách</span>
                  </div>
                  <div className="text-xl font-bold text-blue-600">
                    {formatCurrency(room.pricePerNight || 1000000)}
                    <span className="text-sm font-normal text-gray-500">/đêm</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="bg-gray-100 py-16 rounded-lg">
        <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Dịch Vụ & Tiện Ích</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {services.map((service, index) => (
                    <div key={index} className="flex flex-col items-center space-y-3">
                        <div className="p-4 bg-white rounded-full shadow-md text-blue-600">
                            {service.icon}
                        </div>
                        <p className="font-semibold text-lg">{service.name}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

       {/* Testimonials Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Khách hàng nói gì</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <p className="text-gray-600">"Dịch vụ tuyệt vời và phòng ốc cực kỳ sạch sẽ. Tôi chắc chắn sẽ quay trở lại!"</p>
              <p className="mt-4 font-semibold">- Anh Minh</p>
            </Card>
            <Card className="p-6 text-center">
              <p className="text-gray-600">"Vị trí thuận tiện, nhân viên thân thiện. Một trải nghiệm đáng nhớ."</p>
              <p className="mt-4 font-semibold">- Chị Lan</p>
            </Card>
            <Card className="p-6 text-center">
              <p className="text-gray-600">"Hồ bơi và nhà hàng rất tuyệt. Gia đình tôi đã có một kỳ nghỉ cuối tuần hoàn hảo."</p>
              <p className="mt-4 font-semibold">- Gia đình Bác Hùng</p>
            </Card>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="text-center bg-blue-600 text-white py-16 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Sẵn sàng cho kỳ nghỉ của bạn?</h2>
          <p className="max-w-xl mx-auto mb-8">Đừng chần chừ, hãy đặt phòng ngay hôm nay để nhận được những ưu đãi tốt nhất.</p>
          <Button size="lg" variant="secondary" className="rounded-full px-8 py-6 text-lg" onClick={() => router.push('/customer/search-room')}>
            Đặt phòng ngay
          </Button>
      </section>
    </div>
  )
} 