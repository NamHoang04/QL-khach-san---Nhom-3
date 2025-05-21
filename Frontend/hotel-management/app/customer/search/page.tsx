"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Star, Filter, Search, Wifi, Coffee, Bath, Users, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function RoomSearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([500000, 3000000])
  const [sortOption, setSortOption] = useState("recommended")
  const [showFiltersMobile, setShowFiltersMobile] = useState(false)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  
  // Sample room types for filtering
  const roomTypes = [
    { id: "standard", label: "Standard" },
    { id: "deluxe", label: "Deluxe" },
    { id: "suite", label: "Suite" },
    { id: "family", label: "Family" },
  ]
  
  // Sample amenities for filtering
  const amenities = [
    { id: "wifi", label: "Wifi miễn phí", icon: Wifi },
    { id: "breakfast", label: "Bữa sáng miễn phí", icon: Coffee },
    { id: "bath", label: "Bồn tắm spa", icon: Bath },
  ]
  
  // Sample rooms data
  const rooms = [
    {
      id: "1",
      name: "Phòng Deluxe View Biển",
      type: "deluxe",
      image: "/room-1.jpg",
      price: 1200000,
      discountPrice: 960000,
      discount: "20%",
      rating: 4.8,
      capacity: 2,
      amenities: ["wifi", "breakfast"],
      description: "Phòng sang trọng với tầm nhìn ra biển, không gian rộng rãi và tiện nghi cao cấp."
    },
    {
      id: "2",
      name: "Phòng Suite Gia Đình",
      type: "suite",
      image: "/room-2.jpg",
      price: 2000000,
      rating: 4.9,
      capacity: 4,
      amenities: ["wifi", "breakfast", "bath"],
      description: "Phòng suite rộng rãi với 2 phòng ngủ, phù hợp cho gia đình có trẻ em."
    },
    {
      id: "3",
      name: "Phòng Standard Tiết Kiệm",
      type: "standard",
      image: "/room-3.jpg",
      price: 750000,
      rating: 4.5,
      capacity: 2,
      amenities: ["wifi"],
      description: "Phòng tiêu chuẩn thoải mái với đầy đủ tiện nghi cơ bản cho du khách."
    },
    {
      id: "4",
      name: "Phòng Family Lớn",
      type: "family",
      image: "/room-4.jpg",
      price: 1800000,
      rating: 4.7,
      capacity: 5,
      amenities: ["wifi", "breakfast"],
      description: "Phòng gia đình rộng rãi với 2 giường lớn, phù hợp cho gia đình đông người."
    },
    {
      id: "5",
      name: "Phòng Deluxe Hướng Vườn",
      type: "deluxe",
      image: "/room-5.jpg",
      price: 1100000,
      rating: 4.6,
      capacity: 2,
      amenities: ["wifi", "breakfast"],
      description: "Phòng deluxe yên tĩnh với tầm nhìn ra khu vườn xanh mát của khách sạn."
    },
    {
      id: "6",
      name: "Phòng Suite Cao Cấp",
      type: "suite",
      image: "/room-6.jpg",
      price: 2500000,
      rating: 5.0,
      capacity: 3,
      amenities: ["wifi", "breakfast", "bath"],
      description: "Phòng suite cao cấp nhất với không gian rộng rãi và dịch vụ đẳng cấp 5 sao."
    },
  ]

  // Filter rooms based on search criteria
  const filteredRooms = rooms.filter(room => {
    // Filter by search query
    const matchesSearch = 
      searchQuery === "" || 
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Filter by price range
    const matchesPrice = 
      room.price >= priceRange[0] && room.price <= priceRange[1]
    
    // Filter by amenities if any are selected
    const matchesAmenities = 
      selectedAmenities.length === 0 || 
      selectedAmenities.every(amenity => room.amenities.includes(amenity))
    
    return matchesSearch && matchesPrice && matchesAmenities
  })

  // Sort rooms based on selected option
  const sortedRooms = [...filteredRooms].sort((a, b) => {
    switch (sortOption) {
      case "price-asc":
        return a.price - b.price
      case "price-desc":
        return b.price - a.price
      case "rating-desc":
        return b.rating - a.rating
      default: // recommended - mixed sort
        return (b.rating * 0.7) - (a.rating * 0.7) + (a.price * 0.3) - (b.price * 0.3)
    }
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
  }

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenityId) 
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    )
  }

  const resetFilters = () => {
    setSelectedAmenities([])
    setPriceRange([500000, 3000000])
    setSearchQuery("")
  }

  // Sidebar filter component
  const FiltersSidebar = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Khoảng giá</h3>
        <div className="px-2">
          <Slider
            defaultValue={priceRange}
            min={500000}
            max={3000000}
            step={100000}
            onValueChange={setPriceRange}
            className="mb-6"
          />
          <div className="flex justify-between text-sm">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="font-medium mb-3">Loại phòng</h3>
        <div className="grid grid-cols-2 gap-2">
          {roomTypes.map(type => (
            <div 
              key={type.id} 
              className={`
                p-2 border rounded-md text-center cursor-pointer transition
                ${selectedAmenities.includes(type.id) 
                  ? "bg-blue-50 border-blue-200" 
                  : "hover:bg-gray-50"
                }
              `}
              onClick={() => toggleAmenity(type.id)}
            >
              {type.label}
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="font-medium mb-3">Tiện nghi</h3>
        <div className="space-y-3">
          {amenities.map(amenity => (
            <div key={amenity.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`sidebar-${amenity.id}`}
                checked={selectedAmenities.includes(amenity.id)}
                onCheckedChange={() => toggleAmenity(amenity.id)}
              />
              <label 
                htmlFor={`sidebar-${amenity.id}`}
                className="flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <amenity.icon className="h-4 w-4 mr-2 text-gray-500" />
                {amenity.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      <Button 
        variant="outline" 
        className="w-full"
        onClick={resetFilters}
      >
        Đặt lại bộ lọc
      </Button>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto" style={{ width: 'auto', height: 'auto' }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Link href="/customer" className="text-blue-600 hover:underline flex items-center">
            <ChevronLeft className="h-4 w-4" />
            <span>Quay lại</span>
          </Link>
        </div>
        <h1 className="text-3xl font-bold">Tìm kiếm phòng</h1>
        <p className="text-gray-600">Tìm kiếm và lọc các loại phòng theo nhu cầu của bạn</p>
      </div>

      {/* Main Search input */}
      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm phòng..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center">
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  <span>Sắp xếp</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Đề xuất</SelectItem>
                <SelectItem value="price-asc">Giá: Thấp - Cao</SelectItem>
                <SelectItem value="price-desc">Giá: Cao - Thấp</SelectItem>
                <SelectItem value="rating-desc">Đánh giá cao nhất</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              className="gap-2 md:hidden"
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            >
              <Filter className="h-4 w-4" />
              <span>Bộ lọc</span>
            </Button>
          </div>
        </div>
        
        {/* Mobile filters - only show on small screens */}
        {showFiltersMobile && (
          <div className="mt-4 pt-4 border-t md:hidden">
            <FiltersSidebar />
          </div>
        )}
      </div>

      {/* Two column layout for desktop */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar - only visible on md and up */}
        <div className="hidden md:block">
          <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-8">
            <h2 className="text-lg font-semibold mb-4">Bộ lọc</h2>
            <FiltersSidebar />
          </div>
        </div>
        
        {/* Results Column */}
        <div className="md:col-span-3">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              Tìm thấy {sortedRooms.length} phòng
            </h2>
          </div>
          
          <div className="space-y-4">
            {sortedRooms.map((room) => (
              <Card key={room.id} className="overflow-hidden hover:shadow-md transition">
                <div className="flex flex-col md:flex-row">
                  <div className="relative md:w-2/5 bg-blue-100 flex items-center justify-center" style={{ minHeight: '200px', height: 'auto' }}>
                    <div className="text-blue-600 font-medium">Hình ảnh phòng</div>
                    {room.discount && (
                      <Badge className="absolute top-2 right-2 bg-green-600">
                        Giảm {room.discount}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="flex flex-col p-5 md:w-3/5">
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-xl">{room.name}</h3>
                        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          <span className="text-xs font-medium ml-1 text-yellow-700">{room.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">{room.description}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <div className="flex items-center text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                          <Users className="h-4 w-4 mr-1" />
                          {room.capacity} người
                        </div>
                        
                        {room.amenities.includes('wifi') && (
                          <div className="flex items-center text-sm bg-gray-100 px-3 py-1 rounded-full">
                            <Wifi className="h-4 w-4 mr-1" />
                            Wifi
                          </div>
                        )}
                        
                        {room.amenities.includes('breakfast') && (
                          <div className="flex items-center text-sm bg-gray-100 px-3 py-1 rounded-full">
                            <Coffee className="h-4 w-4 mr-1" />
                            Bữa sáng
                          </div>
                        )}
                        
                        {room.amenities.includes('bath') && (
                          <div className="flex items-center text-sm bg-gray-100 px-3 py-1 rounded-full">
                            <Bath className="h-4 w-4 mr-1" />
                            Bồn tắm
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-end mt-4 pt-4 border-t">
                      <div>
                        {room.discountPrice ? (
                          <div className="flex items-baseline gap-2">
                            <span className="font-bold text-xl text-blue-700">{formatPrice(room.discountPrice)}</span>
                            <span className="text-sm text-gray-500 line-through">{formatPrice(room.price)}</span>
                            <span className="text-gray-500"> / đêm</span>
                          </div>
                        ) : (
                          <div>
                            <span className="font-bold text-xl text-blue-700">{formatPrice(room.price)}</span>
                            <span className="text-gray-500"> / đêm</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3 mt-3 sm:mt-0">
                        <Link href={`/customer/room/${room.id}`}>
                          <Button className="bg-blue-600 hover:bg-blue-700">Xem chi tiết</Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
            
            {sortedRooms.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg border shadow-sm">
                <h3 className="text-xl font-medium mb-2">Không tìm thấy phòng</h3>
                <p className="text-gray-500 mb-4">Không có phòng nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
                <Button 
                  variant="outline" 
                  onClick={resetFilters}
                >
                  Đặt lại bộ lọc
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 