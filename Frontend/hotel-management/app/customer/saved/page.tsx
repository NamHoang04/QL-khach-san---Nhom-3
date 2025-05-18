"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { get } from "@/lib/api-service"
import { shouldUseMockData } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Trash2, Heart, Star, Hotel, Coffee, Search, CalendarDays, Utensils, Car, Dumbbell, Waves, Wifi, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"

interface SavedRoom {
  id: number
  roomId: number
  roomNumber: string
  roomType: string
  price: number
  imageUrl?: string
  description?: string
  capacity: number
  savedAt: string
}

interface SavedService {
  id: number
  serviceId: number
  serviceName: string
  price: number
  category: string
  imageUrl?: string
  description?: string
  savedAt: string
}

export default function SavedPage() {
  const { user } = useAuth()
  const [savedRooms, setSavedRooms] = useState<SavedRoom[]>([])
  const [savedServices, setSavedServices] = useState<SavedService[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  useEffect(() => {
    const fetchSavedItems = async () => {
      if (!user?.id) return
      
      try {
        setLoading(true)
        
        if (shouldUseMockData()) {
          // Mock data
          const mockRooms: SavedRoom[] = [
            {
              id: 1,
              roomId: 101,
              roomNumber: "101",
              roomType: "Deluxe King",
              price: 1200000,
              imageUrl: "https://images.unsplash.com/photo-1590490360182-c33d57733427",
              description: "Phòng sang trọng với tầm nhìn ra biển, không gian rộng rãi và tiện nghi cao cấp.",
              capacity: 2,
              savedAt: "2023-12-05T10:30:00"
            },
            {
              id: 2,
              roomId: 205,
              roomNumber: "205",
              roomType: "Suite",
              price: 2500000,
              imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
              description: "Phòng suite rộng rãi với phòng khách riêng biệt, phù hợp cho gia đình.",
              capacity: 4,
              savedAt: "2023-12-10T14:45:00"
            },
            {
              id: 3,
              roomId: 310,
              roomNumber: "310",
              roomType: "Superior Twin",
              price: 950000,
              imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
              description: "Phòng thoải mái với hai giường đơn, phù hợp cho bạn bè hoặc đồng nghiệp.",
              capacity: 2,
              savedAt: "2023-12-15T09:15:00"
            }
          ]
          
          const mockServices: SavedService[] = [
            {
              id: 1,
              serviceId: 1,
              serviceName: "Buffet sáng",
              price: 250000,
              category: "food",
              imageUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf",
              description: "Buffet sáng với đa dạng món ăn Á - Âu",
              savedAt: "2023-12-07T08:20:00"
            },
            {
              id: 2,
              serviceId: 4,
              serviceName: "Spa & Massage",
              price: 850000,
              category: "spa",
              imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874",
              description: "Dịch vụ spa và massage cao cấp",
              savedAt: "2023-12-12T16:30:00"
            }
          ]
          
          setSavedRooms(mockRooms)
          setSavedServices(mockServices)
        } else {
          // If API is available
          // Note: Backend needs endpoints for fetching saved items
          const roomsData = await get<SavedRoom[]>(`Favorites/rooms/${user.id}`)
          const servicesData = await get<SavedService[]>(`Favorites/services/${user.id}`)
          
          setSavedRooms(roomsData)
          setSavedServices(servicesData)
        }
      } catch (err) {
        console.error("Error fetching saved items:", err)
        setError("Không thể tải danh sách đã lưu. Vui lòng thử lại sau.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchSavedItems()
  }, [user])
  
  // Format price as VND
  const formatPrice = (price: number): string => {
    return price.toLocaleString('vi-VN') + ' ₫'
  }
  
  // Get icon for service category
  const getServiceIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'food':
        return <Utensils className="w-4 h-4" />
      case 'transport':
        return <Car className="w-4 h-4" />
      case 'fitness':
        return <Dumbbell className="w-4 h-4" />
      case 'spa':
        return <Waves className="w-4 h-4" />
      case 'connectivity':
        return <Wifi className="w-4 h-4" />
      case 'shopping':
        return <ShoppingBag className="w-4 h-4" />
      default:
        return <Coffee className="w-4 h-4" />
    }
  }
  
  const removeFromSaved = (type: 'room' | 'service', id: number) => {
    if (type === 'room') {
      setSavedRooms(prev => prev.filter(room => room.id !== id))
    } else {
      setSavedServices(prev => prev.filter(service => service.id !== id))
    }
    
    toast.success(type === 'room' ? "Đã xóa phòng khỏi danh sách yêu thích" : "Đã xóa dịch vụ khỏi danh sách yêu thích")
    
    // In a real implementation, you would call an API to remove the item from saved
    // e.g. delete(`Favorites/${type}/${id}`)
  }
  
  const renderRooms = () => {
    if (!savedRooms.length) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700">Chưa có phòng nào được lưu</h3>
          <p className="text-gray-500 mt-1 mb-4">Bạn chưa lưu phòng nào vào danh sách yêu thích</p>
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
        {savedRooms.map(room => (
          <Card key={room.id} className="overflow-hidden hover:shadow-md transition">
            <div className="relative h-48">
              {room.imageUrl ? (
                <Image
                  src={room.imageUrl}
                  alt={room.roomType}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Hotel className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <button 
                onClick={() => removeFromSaved('room', room.id)}
                className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:bg-red-50 transition"
                title="Xóa khỏi danh sách yêu thích"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
            
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{room.roomType}</h3>
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span className="text-sm ml-1">4.8</span>
                </div>
              </div>
              
              <p className="text-gray-500 text-sm mb-3 line-clamp-2">{room.description}</p>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-bold text-lg">{formatPrice(room.price)}</span>
                  <span className="text-sm text-gray-500">/đêm</span>
                </div>
                
                <Link href={`/customer/room/${room.roomId}`}>
                  <Button variant="outline" className="hover:bg-blue-50 hover:text-blue-600">
                    Chi tiết
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
  
  const renderServices = () => {
    if (!savedServices.length) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700">Chưa có dịch vụ nào được lưu</h3>
          <p className="text-gray-500 mt-1 mb-4">Bạn chưa lưu dịch vụ nào vào danh sách yêu thích</p>
          <Link href="/customer/services">
            <Button>
              <Coffee className="w-4 h-4 mr-2" />
              Xem dịch vụ
            </Button>
          </Link>
        </div>
      )
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedServices.map(service => (
          <Card key={service.id} className="overflow-hidden hover:shadow-md transition">
            <div className="relative h-40">
              {service.imageUrl ? (
                <Image
                  src={service.imageUrl}
                  alt={service.serviceName}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Coffee className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <button 
                onClick={() => removeFromSaved('service', service.id)}
                className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:bg-red-50 transition"
                title="Xóa khỏi danh sách yêu thích"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
            
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{service.serviceName}</h3>
              </div>
              
              <p className="text-gray-500 text-sm mb-3 line-clamp-2">{service.description}</p>
              
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-600">{formatPrice(service.price)}</span>
                
                <Link href="/customer/services">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Đặt dịch vụ
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }
  
  return (
    <div className="container max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Đã lưu</h1>
      
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
          <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
          {error}
        </div>
      ) : (
        <Tabs defaultValue="rooms" className="space-y-6">
          <TabsList>
            <TabsTrigger value="rooms" className="flex items-center">
              <Hotel className="w-4 h-4 mr-2" />
              Phòng đã lưu ({savedRooms.length})
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center">
              <Coffee className="w-4 h-4 mr-2" />
              Dịch vụ đã lưu ({savedServices.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="rooms">
            {renderRooms()}
          </TabsContent>
          
          <TabsContent value="services">
            {renderServices()}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
} 