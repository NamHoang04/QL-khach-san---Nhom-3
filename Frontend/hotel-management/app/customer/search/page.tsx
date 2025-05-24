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
import { Star, Filter, Search, Wifi, Coffee, Bath, Users, ArrowUpDown, ChevronLeft, ChevronRight, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useSaved } from "@/lib/saved-context"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

export default function RoomSearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([500000, 3000000])
  const [sortOption, setSortOption] = useState("recommended")
  const [showFiltersMobile, setShowFiltersMobile] = useState(false)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [showFilterDialog, setShowFilterDialog] = useState(false)
  const { isSavedRoom, saveRoom, removeRoom } = useSaved()
  
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
      id: 1,
      name: "Phòng Standard Tiết Kiệm",
      type: "standard",
      image: "/room-1.jpg",
      price: 800000,
      rating: 4.5,
      capacity: 2,
      amenities: ["wifi"],
      description: "Phòng tiêu chuẩn thoải mái với đầy đủ tiện nghi cơ bản cho du khách.",
      reviews: 5
    },
    {
      id: 2,
      name: "Phòng Standard Đôi",
      type: "standard",
      image: "/room-2.jpg",
      price: 950000,
      rating: 4.6,
      capacity: 2,
      amenities: ["wifi", "breakfast"],
      description: "Phòng tiêu chuẩn với giường đôi và bữa sáng miễn phí.",
      reviews: 5
    },
    {
      id: 3,
      name: "Phòng Deluxe View Thành Phố",
      type: "deluxe",
      image: "/room-3.jpg",
      price: 1500000,
      rating: 4.7,
      capacity: 2,
      amenities: ["wifi", "breakfast"],
      description: "Phòng deluxe rộng rãi với tầm nhìn ra thành phố sôi động.",
      reviews: 5
    },
    {
      id: 4,
      name: "Phòng Deluxe View Biển",
      type: "deluxe",
      image: "/room-4.jpg",
      price: 1800000,
      rating: 4.8,
      capacity: 2,
      amenities: ["wifi", "breakfast", "bath"],
      description: "Phòng sang trọng với tầm nhìn ra biển, không gian rộng rãi và tiện nghi cao cấp.",
      reviews: 5
    },
    {
      id: 5,
      name: "Phòng Suite Gia Đình",
      type: "suite",
      image: "/room-5.jpg",
      price: 2500000,
      rating: 4.9,
      capacity: 4,
      amenities: ["wifi", "breakfast", "bath"],
      description: "Phòng suite rộng rãi với 2 phòng ngủ, phù hợp cho gia đình có trẻ em.",
      reviews: 5
    },
    {
      id: 6,
      name: "Phòng Suite Cao Cấp",
      type: "suite",
      image: "/room-6.jpg",
      price: 3200000,
      rating: 5.0,
      capacity: 3,
      amenities: ["wifi", "breakfast", "bath"],
      description: "Phòng suite cao cấp nhất với không gian rộng rãi và dịch vụ đẳng cấp 5 sao.",
      reviews: 5
    },
    {
      id: 7,
      name: "Phòng Family Lớn",
      type: "family",
      image: "/room-7.jpg",
      price: 2200000,
      rating: 4.7,
      capacity: 5,
      amenities: ["wifi", "breakfast"],
      description: "Phòng gia đình rộng rãi với 2 giường lớn, phù hợp cho gia đình đông người.",
      reviews: 5
    },
    {
      id: 8,
      name: "Phòng Family Kết Nối",
      type: "family",
      image: "/room-8.jpg",
      price: 2800000,
      rating: 4.8,
      capacity: 6,
      amenities: ["wifi", "breakfast", "bath"],
      description: "Hai phòng kết nối với nhau, lý tưởng cho gia đình lớn hoặc nhóm bạn.",
      reviews: 5
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
    
    // Filter by room type
    const matchesRoomType = 
      selectedAmenities.length === 0 || 
      (selectedAmenities.includes(room.type)) ||
      // For other amenities
      selectedAmenities.every(amenity => 
        roomTypes.some(rt => rt.id === amenity) ? room.type === amenity : room.amenities.includes(amenity)
      )
    
    return matchesSearch && matchesPrice && matchesRoomType
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

  // Toggle save room
  const toggleSaveRoom = (room: any, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    
    // Ensure we have a numeric ID
    const roomId = typeof room.id === 'string' ? parseInt(room.id, 10) : room.id
    
    if (isSavedRoom(roomId)) {
      removeRoom(roomId)
    } else {
      saveRoom(room)
    }
  }

  // Filter component that will be used in the dialog
  const FiltersContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Khoảng giá</h3>
        
        {/* Predefined price range buttons */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          <Button 
            type="button" 
            variant={priceRange[0] === 500000 && priceRange[1] === 1000000 ? "default" : "outline"}
            size="sm" 
            className="w-full" 
            onClick={() => setPriceRange([500000, 1000000])}
          >
            Dưới 1 triệu
          </Button>
          <Button 
            type="button" 
            variant={priceRange[0] === 1000000 && priceRange[1] === 2000000 ? "default" : "outline"}
            size="sm" 
            className="w-full" 
            onClick={() => setPriceRange([1000000, 2000000])}
          >
            1 - 2 triệu
          </Button>
          <Button 
            type="button" 
            variant={priceRange[0] === 2000000 && priceRange[1] === 3000000 ? "default" : "outline"}
            size="sm" 
            className="w-full" 
            onClick={() => setPriceRange([2000000, 3000000])}
          >
            2 - 3 triệu
          </Button>
          <Button 
            type="button" 
            variant={priceRange[0] === 3000000 && priceRange[1] === 5000000 ? "default" : "outline"}
            size="sm" 
            className="w-full" 
            onClick={() => setPriceRange([3000000, 5000000])}
          >
            3 triệu+
          </Button>
        </div>
        
        <div className="px-2">
          <div className="mb-2 flex justify-between items-center">
            <span className="text-sm font-medium">Tùy chỉnh:</span>
            <span className="text-sm bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
              {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
            </span>
          </div>
          
          <Slider
            value={priceRange}
            min={500000}
            max={5000000}
            step={100000}
            onValueChange={setPriceRange}
            className="mb-2"
          />
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>500K</span>
            <span>5M</span>
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
                id={`filter-${amenity.id}`}
                checked={selectedAmenities.includes(amenity.id)}
                onCheckedChange={() => toggleAmenity(amenity.id)}
              />
              <label 
                htmlFor={`filter-${amenity.id}`}
                className="flex items-center text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                <amenity.icon className="h-4 w-4 mr-2 text-gray-500" />
                {amenity.label}
              </label>
            </div>
          ))}
        </div>
      </div>
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
              className="gap-2"
              onClick={() => setShowFilterDialog(true)}
            >
              <Filter className="h-4 w-4" />
              <span className="hidden md:inline">Bộ lọc</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Dialog */}
      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bộ lọc tìm kiếm</DialogTitle>
            <DialogDescription>
              Chọn các bộ lọc để tìm phòng phù hợp nhất với nhu cầu của bạn.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <FiltersContent />
          </div>
          
          <DialogFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={resetFilters}
            >
              Đặt lại bộ lọc
            </Button>
            <Button 
              onClick={() => setShowFilterDialog(false)}
            >
              Áp dụng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Results Column */}
      <div>
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            Tìm thấy {sortedRooms.length} phòng
          </h2>
          
          {/* Active filters display */}
          {selectedAmenities.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedAmenities.map(amenityId => {
                const amenity = amenities.find(a => a.id === amenityId) || roomTypes.find(t => t.id === amenityId)
                return amenity ? (
                  <Badge key={amenityId} variant="secondary" className="px-2 py-1">
                    {amenity.label}
                    <button 
                      className="ml-1 hover:text-gray-700" 
                      onClick={() => toggleAmenity(amenityId)}
                    >
                      ×
                    </button>
                  </Badge>
                ) : null
              })}
              {priceRange[0] !== 500000 || priceRange[1] !== 3000000 ? (
                <Badge variant="secondary" className="px-2 py-1">
                  {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                </Badge>
              ) : null}
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          {sortedRooms.map((room) => (
            <Card key={room.id} className="overflow-hidden hover:shadow-md transition">
              <div className="flex flex-col md:flex-row">
                <div className="relative md:w-2/5 bg-blue-100 flex items-center justify-center" style={{ minHeight: '200px', height: 'auto' }}>
                  <div className="text-blue-600 font-medium">Hình ảnh phòng</div>
                  {/* Save button */}
                  <button 
                    onClick={(e) => toggleSaveRoom(room, e)}
                    className="absolute top-2 left-2 p-1.5 bg-white/80 rounded-full hover:bg-red-50 transition-colors"
                    aria-label={isSavedRoom(room.id) ? "Xóa khỏi danh sách yêu thích" : "Lưu vào danh sách yêu thích"}
                  >
                    <Heart 
                      className={`h-5 w-5 ${isSavedRoom(room.id) ? "fill-red-500 text-red-500" : "text-gray-500"}`} 
                    />
                  </button>
                </div>
                <CardContent className="flex flex-col p-5 md:w-3/5">
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-xl">{room.name}</h3>
                      <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        <span className="text-xs font-medium ml-1 text-yellow-700">{room.rating}</span>
                        {room.reviews && <span className="text-xs ml-1 text-gray-500">({room.reviews})</span>}
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
                  
                  <div className="p-5 border-t">
                    <div className="flex flex-wrap justify-between items-end gap-3">
                      <div>
                        <div className="text-gray-600 text-sm">Giá mỗi đêm</div>
                        <div className="font-bold text-xl">{formatPrice(room.price)}</div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => toggleSaveRoom(room, e)}
                          className="p-2 border rounded-md hover:bg-gray-50"
                          aria-label={isSavedRoom(room.id) ? "Xóa khỏi danh sách yêu thích" : "Lưu vào danh sách yêu thích"}
                        >
                          <Heart className={`h-5 w-5 ${isSavedRoom(room.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                        </button>
                        
                        <Link 
                          href={`/customer/room/${room.id}`}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
                        >
                          Xem chi tiết
                        </Link>
                        
                        <Link 
                          href={`/customer/room/${room.id}?book=true`}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium"
                        >
                          Đặt ngay
                        </Link>
                      </div>
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
  )
} 