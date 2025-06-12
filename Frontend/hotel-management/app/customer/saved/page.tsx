"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useSaved, SavedRoom, SavedService } from "@/lib/saved-context"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Trash2, Heart, Star, Hotel, Coffee, Search, CalendarDays, Utensils, Car, Dumbbell, Waves, Wifi, ShoppingBag, ChevronLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SavedPage() {
  const router = useRouter()
  const { savedRooms, savedServices, loading: savedLoading, removeRoom, removeService } = useSaved()

  const formatPrice = (price: number): string => {
    return price.toLocaleString('vi-VN') + ' ₫'
  }
  
  const getServiceIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'food':
        return <Utensils className="w-5 h-5 text-gray-500" />
      case 'transport':
        return <Car className="w-5 h-5 text-gray-500" />
      case 'spa':
        return <Waves className="w-5 h-5 text-gray-500" />
      case 'laundry':
        return <ShoppingBag className="w-5 h-5 text-gray-500" />
      default:
        return <Coffee className="w-5 h-5 text-gray-500" />
    }
  }
  
  const bookRoom = (roomId: number) => {
    router.push(`/customer/room/${roomId}`)
  }
  
  const handleBookService = (serviceId: number) => {
    router.push(`/customer/services?serviceId=${serviceId}`)
  }
  
  const renderRooms = () => {
    if (!savedRooms.length) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700">Chưa có phòng nào được lưu</h3>
          <p className="text-gray-500 mt-1 mb-4">Bạn chưa lưu phòng nào vào danh sách yêu thích.</p>
          <Link href="/customer/search">
            <Button>
              <Search className="w-4 h-4 mr-2" />
              Tìm phòng ngay
            </Button>
          </Link>
        </div>
      )
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedRooms.map((saved) => {
          const room = saved.room
          const roomType = room.roomType
          return (
            <Card key={saved.id} className="overflow-hidden group">
              <div className="relative">
                <Image
                  src={roomType.image || '/placeholder-image.png'}
                  alt={roomType.name}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <Button 
                  size="icon" 
                  variant="destructive"
                  className="absolute top-3 right-3 h-8 w-8"
                  onClick={() => removeRoom(room.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="p-4">
                <CardTitle className="text-lg font-bold hover:text-blue-600 transition-colors">
                  <Link href={`/customer/room/${room.id}`}>{roomType.name}</Link>
                </CardTitle>
                <CardDescription className="text-sm mt-1">Phòng {room.roomNumber}</CardDescription>
              
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>5.0</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="w-4 h-4" />
                    <span>{roomType.capacity} khách</span>
                  </div>
                </div>
                
                <p className="text-lg font-semibold text-blue-600 mt-4">{formatPrice(roomType.price)} / đêm</p>

                <Button className="w-full mt-4" onClick={() => bookRoom(room.id)}>
                  Đặt ngay
                  </Button>
            </CardContent>
          </Card>
          )
        })}
      </div>
    )
  }
  
  const renderServices = () => {
    if (!savedServices.length) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700">Chưa có dịch vụ nào được lưu</h3>
          <p className="text-gray-500 mt-1 mb-4">Bạn chưa lưu dịch vụ nào vào danh sách yêu thích.</p>
          <Link href="/customer/services">
            <Button>
              <Search className="w-4 h-4 mr-2" />
              Khám phá dịch vụ
            </Button>
          </Link>
        </div>
      )
    }
    
    return (
      <div className="space-y-4">
        {savedServices.map((saved) => {
          const service = saved.service
          return (
            <Card key={saved.id} className="flex items-start p-4 gap-4 group">
              <div className="w-24 h-24 relative flex-shrink-0">
                <Image
                  src={service.imageUrl || '/placeholder-image.png'}
                  alt={service.name}
                  fill
                  className="rounded-lg object-cover"
                />
                </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-md font-bold hover:text-blue-600 transition-colors">
                      <Link href={`/customer/services?serviceId=${service.id}`}>{service.name}</Link>
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      {getServiceIcon(service.category)}
                      <span className="capitalize">{service.category}</span>
            </div>
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost"
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50"
                    onClick={() => removeService(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
              </div>
              
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{service.description}</p>
              
                <div className="flex justify-between items-center mt-3">
                  <p className="text-md font-semibold text-blue-600">{formatPrice(service.price)}</p>
                  <Button variant="outline" size="sm" onClick={() => handleBookService(service.id)}>
                  Đặt dịch vụ
                </Button>
                </div>
              </div>
          </Card>
          )
        })}
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-4">
        <Link href="/customer" className="text-blue-600 hover:underline flex items-center">
          <ChevronLeft className="h-4 w-4" />
          <span>Quay lại</span>
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-4">Danh sách yêu thích</h1>
      <p className="text-gray-500 mb-6">Quản lý các phòng và dịch vụ bạn đã lưu.</p>

      {savedLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        </div>
      ) : (
        <Tabs defaultValue="rooms" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rooms">
              <Hotel className="w-4 h-4 mr-2" />
              Phòng đã lưu ({savedRooms.length})
            </TabsTrigger>
            <TabsTrigger value="services">
              <Coffee className="w-4 h-4 mr-2" />
              Dịch vụ đã lưu ({savedServices.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="rooms" className="mt-6">
            {renderRooms()}
          </TabsContent>
          <TabsContent value="services" className="mt-6">
            {renderServices()}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
} 