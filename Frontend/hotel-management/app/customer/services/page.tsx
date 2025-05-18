"use client"

import { useState, useEffect } from "react"
import { get } from "@/lib/api-service"
import { shouldUseMockData } from "@/lib/config"
import { 
  Utensils, 
  Car, 
  Dumbbell, 
  Waves, 
  Wifi, 
  ShoppingBag, 
  Plus, 
  Sparkles,
  Loader2
} from "lucide-react"
import Image from "next/image"

interface Service {
  id: number
  name: string
  price: number
  description: string
  category?: string
  imageUrl?: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [activeCategory, setActiveCategory] = useState<string>("all")

  // Service categories
  const categories = [
    { id: "all", name: "Tất cả", icon: Sparkles },
    { id: "food", name: "Ẩm thực", icon: Utensils },
    { id: "transport", name: "Đưa đón", icon: Car },
    { id: "fitness", name: "Thể thao", icon: Dumbbell },
    { id: "spa", name: "Spa & Massage", icon: Waves },
    { id: "connectivity", name: "Kết nối", icon: Wifi },
    { id: "shopping", name: "Mua sắm", icon: ShoppingBag },
  ]

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true)
        
        if (shouldUseMockData()) {
          // Mock service data
          const mockServices: Service[] = [
            { 
              id: 1, 
              name: "Buffet sáng", 
              price: 250000, 
              description: "Buffet sáng với đa dạng món ăn Á - Âu",
              category: "food",
              imageUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf"
            },
            { 
              id: 2, 
              name: "Đưa đón sân bay", 
              price: 400000, 
              description: "Dịch vụ đưa đón sân bay sang trọng, thoải mái",
              category: "transport",
              imageUrl: "https://images.unsplash.com/photo-1549194898-0cb3ed2fa95e"
            },
            { 
              id: 3, 
              name: "Phòng Gym", 
              price: 100000, 
              description: "Phòng tập gym hiện đại với đầy đủ thiết bị",
              category: "fitness",
              imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48"
            },
            { 
              id: 4, 
              name: "Spa & Massage", 
              price: 850000, 
              description: "Dịch vụ spa và massage cao cấp",
              category: "spa",
              imageUrl: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874"
            },
            { 
              id: 5, 
              name: "WiFi cao cấp", 
              price: 50000, 
              description: "Dịch vụ WiFi tốc độ cao dành cho khách VIP",
              category: "connectivity",
              imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3"
            },
            { 
              id: 6, 
              name: "Dịch vụ giặt ủi", 
              price: 150000, 
              description: "Dịch vụ giặt ủi chuyên nghiệp",
              category: "shopping",
              imageUrl: "https://images.unsplash.com/photo-1545173168-9f1947eebb7f"
            },
            { 
              id: 7, 
              name: "Bữa tối sang trọng", 
              price: 550000, 
              description: "Bữa tối với các món ăn đặc sản địa phương",
              category: "food",
              imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0"
            },
            { 
              id: 8, 
              name: "Tour du lịch", 
              price: 1200000, 
              description: "Tour du lịch khám phá thành phố và vùng lân cận",
              category: "transport",
              imageUrl: "https://images.unsplash.com/photo-1569949381669-ecf31ae8e613"
            }
          ]
          setServices(mockServices)
        } else {
          // Real API call
          const data = await get<Service[]>('Services')
          // Add default categories if not present in API response
          const processedData = data.map(service => ({
            ...service,
            category: service.category || getRandomCategory(),
            imageUrl: service.imageUrl || getPlaceholderImage(service.name)
          }))
          setServices(processedData)
        }
      } catch (err) {
        console.error("Error fetching services:", err)
        setError("Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchServices()
  }, [])
  
  // Generate a random category for services without one
  const getRandomCategory = (): string => {
    const categoryIds = categories.filter(c => c.id !== 'all').map(c => c.id)
    return categoryIds[Math.floor(Math.random() * categoryIds.length)]
  }
  
  // Get a placeholder image for services without one
  const getPlaceholderImage = (serviceName: string): string => {
    // Use name to consistently generate the same number (for consistent images)
    const nameSum = serviceName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return `https://source.unsplash.com/random/300x200?hotel,service&sig=${nameSum}`
  }
  
  // Filter services by active category
  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter(service => service.category === activeCategory)
  
  // Format price as VND
  const formatPrice = (price: number): string => {
    return price.toLocaleString('vi-VN') + ' ₫'
  }
  
  return (
    <div className="container max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dịch vụ</h1>
      
      {/* Categories selector */}
      <div className="mb-8 overflow-x-auto pb-2 -mx-1">
        <div className="flex space-x-2">
          {categories.map((category) => {
            const CategoryIcon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap
                  ${activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
                `}
              >
                <CategoryIcon className="w-4 h-4" />
                <span>{category.name}</span>
              </button>
            )
          })}
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
          <span className="ml-2 text-gray-600">Đang tải dịch vụ...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
          {error}
        </div>
      ) : !filteredServices.length ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <h3 className="text-xl font-medium text-gray-700">Không có dịch vụ nào</h3>
          <p className="text-gray-500 mt-2">Không tìm thấy dịch vụ nào thuộc danh mục này.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all hover:shadow-md">
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={service.imageUrl || getPlaceholderImage(service.name)}
                  alt={service.name}
                  fill
                  className="object-cover"
                />
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
                  <span className="text-blue-600 font-medium">{formatPrice(service.price)}</span>
                </div>
                
                <p className="text-gray-600 mt-2 text-sm line-clamp-2">{service.description}</p>
                
                <div className="mt-4 flex justify-end">
                  <button 
                    className="flex items-center bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Đặt dịch vụ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 