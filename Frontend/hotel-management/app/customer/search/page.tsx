"use client"

import { useState, useEffect, useMemo } from "react"
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
import { Star, Filter, Search, Wifi, Coffee, Bath, Users, ArrowUpDown, ChevronLeft, Heart, Loader2 } from "lucide-react"
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
import { get } from "@/lib/api"
import { formatCurrency } from "@/lib/utils"
import Image from "next/image"
import { useRouter } from "next/navigation"

// Re-defining interfaces to be self-contained for mock data usage
interface Room {
  id: number;
  roomNumber: string;
  image: string;
  description?: string;
  status: string;
  roomTypeId: number;
  roomTypeName: string;
  price: number;
  amenities: string[];
  capacity?: number;
  rating?: number;
  reviews?: number;
}

interface RoomType {
  id: number;
  name: string;
}

// Mock data from customer dashboard
const mockRooms: Room[] = [
  {
    id: 1, roomNumber: '101', image: '', description: 'Tận hưởng không gian sang trọng và tầm nhìn tuyệt đẹp.', status: 'available',
    roomTypeId: 1, roomTypeName: 'Phòng Deluxe Nhìn Ra Thành Phố', price: 2500000, amenities: ['wifi', 'tv'], capacity: 2, rating: 4.8, reviews: 120
  },
  {
    id: 2, roomNumber: '205', image: '', description: 'Suite rộng rãi với hai phòng ngủ, lý tưởng cho gia đình.', status: 'available',
    roomTypeId: 2, roomTypeName: 'Suite Gia Đình Rộng Rãi', price: 4200000, amenities: ['wifi', 'tv', 'minibar'], capacity: 4, rating: 4.9, reviews: 95
  },
  {
    id: 3, roomNumber: '302', image: '', description: 'Thư giãn với ban công riêng và tầm nhìn bao quát ra đại dương.', status: 'occupied',
    roomTypeId: 3, roomTypeName: 'Phòng Premier Hướng Biển', price: 3800000, amenities: ['wifi', 'tv', 'bath'], capacity: 2, rating: 4.7, reviews: 150
  },
  {
    id: 4, roomNumber: '102', image: '', description: 'Phòng tiêu chuẩn tiện nghi, phù hợp cho khách đi công tác.', status: 'available',
    roomTypeId: 4, roomTypeName: 'Phòng Standard', price: 1800000, amenities: ['wifi'], capacity: 2, rating: 4.5, reviews: 200
  },
];

const mockRoomTypes: RoomType[] = [
  { id: 1, name: 'Phòng Deluxe' },
  { id: 2, name: 'Suite Gia Đình' },
  { id: 3, name: 'Phòng Premier' },
  { id: 4, name: 'Phòng Standard' },
];

export default function RoomSearchPage() {
  const [allRooms, setAllRooms] = useState<Room[]>([])
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([])

  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([0, 10000000])
  const [sortOption, setSortOption] = useState("recommended")
  const [showFilterDialog, setShowFilterDialog] = useState(false)
  const [selectedRoomTypes, setSelectedRoomTypes] = useState<number[]>([])
  
  const { isSavedRoom, saveRoom, removeRoom } = useSaved()
  const router = useRouter()
  
  useEffect(() => {
    // Use mock data instead of fetching
    setTimeout(() => {
      setAllRooms(mockRooms);
      setRoomTypes(mockRoomTypes);
    }, 300); // Simulate network delay
  }, [])

  const handleBookNow = (roomId: number) => {
    router.push(`/customer/bookings?roomId=${roomId}&fromSearch=true`);
  };

  const filteredAndSortedRooms = useMemo(() => {
    let filtered = allRooms.filter(room => {
      const matchesSearch = 
        searchQuery === "" || 
        room.roomTypeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesPrice = room.price >= priceRange[0] && room.price <= priceRange[1]
      
      const matchesRoomType = selectedRoomTypes.length === 0 || selectedRoomTypes.includes(room.roomTypeId)
      
      return matchesSearch && matchesPrice && matchesRoomType
    })

    const sorted = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "rating-desc":
          return (b.rating || 0) - (a.rating || 0)
        default:
          return b.id - a.id
      }
    })

    return sorted
  }, [allRooms, searchQuery, priceRange, selectedRoomTypes, sortOption])


  const toggleRoomType = (roomTypeId: number) => {
    setSelectedRoomTypes(prev => 
      prev.includes(roomTypeId) 
        ? prev.filter(id => id !== roomTypeId)
        : [...prev, roomTypeId]
    )
  }

  const resetFilters = () => {
    setSelectedRoomTypes([])
    setPriceRange([0, 10000000])
    setSearchQuery("")
  }

  const toggleSaveRoom = (room: Room, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    
    if (isSavedRoom(room.id)) {
      removeRoom(room.id)
    } else {
      saveRoom(room)
    }
  }

  const FiltersContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-3">Khoảng giá</h3>
        <div className="px-2">
          <div className="mb-2 flex justify-between items-center">
            <span className="text-sm font-medium">Tùy chỉnh:</span>
            <span className="text-sm bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
              {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
            </span>
          </div>
          <Slider
            value={priceRange}
            min={0}
            max={10000000}
            step={100000}
            onValueChange={setPriceRange}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0đ</span>
            <span>10M+</span>
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
                ${selectedRoomTypes.includes(type.id) 
                  ? "bg-blue-50 border-blue-200" 
                  : "hover:bg-gray-50"
                }
              `}
              onClick={() => toggleRoomType(type.id)}
            >
              {type.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const getRoomImageUrl = (index: number) => `https://source.unsplash.com/random/800x600/?hotel,room,view&${index}`

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
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

      <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm theo loại phòng, mô tả..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                <span>Sắp xếp</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Mới nhất</SelectItem>
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

      <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bộ lọc tìm kiếm</DialogTitle>
            <DialogDescription>
              Tinh chỉnh tìm kiếm của bạn để tìm phòng hoàn hảo.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <FiltersContent />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={resetFilters}>Xóa bộ lọc</Button>
            <Button onClick={() => setShowFilterDialog(false)}>Xem kết quả</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedRooms.map((room, index) => (
          <RoomCard
            key={room.id}
            room={room}
            imageUrl={getRoomImageUrl(index)}
            onSave={toggleSaveRoom}
            isSaved={isSavedRoom(room.id)}
            onBookNow={handleBookNow}
          />
        ))}
      </div>
        </div>
  )
}

function RoomCard({ room, imageUrl, onSave, isSaved, onBookNow }: { 
  room: Room, 
  imageUrl: string,
  onSave: (room: Room, e?: React.MouseEvent) => void, 
  isSaved: boolean,
  onBookNow: (roomId: number) => void
}) {
  return (
    <Link href={`/customer/room/${room.id}`} className="block">
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="relative h-56 w-full">
                    <Image
            src={imageUrl}
                      alt={room.roomTypeName}
                      fill
                      className="object-cover"
                    />
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2 rounded-full h-8 w-8 bg-white/80 backdrop-blur-sm hover:bg-white"
            onClick={(e) => onSave(room, e)}
                    >
            <Heart className={`h-4 w-4 ${isSaved ? "text-red-500 fill-red-500" : "text-gray-500"}`} />
                        </Button>
                      </div>
        <CardContent className="p-4 flex flex-col flex-grow">
          <Badge 
            className={`absolute top-4 left-4 ${room.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
          >
            {room.status === 'available' ? 'Có sẵn' : 'Đã được đặt'}
          </Badge>
          
          <h3 className="text-lg font-semibold mb-2 flex-grow">{room.roomTypeName}</h3>
          <p className="text-sm text-gray-500 mb-4 h-10 overflow-hidden">{room.description}</p>
          
          <div className="flex items-center text-sm text-gray-600 mb-4 space-x-4">
            <div className="flex items-center"><Users className="w-4 h-4 mr-1"/> {room.capacity || 2} Khách</div>
            <div className="flex items-center"><Star className="w-4 h-4 mr-1 text-yellow-400"/> {room.rating || 'N/A'} ({room.reviews || 0})</div>
          </div>

          <div className="mt-auto">
            <div className="flex justify-between items-center mb-4">
                <p className="text-xl font-bold text-blue-600">{formatCurrency(room.price)}<span className="text-sm font-normal text-gray-500">/đêm</span></p>
            </div>
            <div className="flex gap-2">
                <Button className="flex-1" onClick={() => onBookNow(room.id)}>
                  Đặt ngay
                </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
} 