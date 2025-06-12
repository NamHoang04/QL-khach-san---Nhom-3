"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"
import { useAuth } from "./auth-context"
import { toast } from "sonner"

// Mock data
const mockSavedRooms: SavedRoom[] = [
  {
    id: 1,
    customerId: 1,
    roomId: 101,
    room: {
      id: 101,
      roomNumber: "101",
      roomType: {
        id: 1,
        name: "Phòng Deluxe Giường Đôi",
        price: 2500000,
        capacity: 2,
        description: "Phòng rộng rãi với tầm nhìn ra thành phố, được trang bị đầy đủ tiện nghi hiện đại.",
        image: "/images/rooms/deluxe.jpg",
      },
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    customerId: 1,
    roomId: 202,
    room: {
      id: 202,
      roomNumber: "202",
      roomType: {
        id: 2,
        name: "Suite Cao Cấp Hướng Biển",
        price: 4500000,
        capacity: 4,
        description: "Suite sang trọng với ban công riêng nhìn ra biển, phòng khách riêng biệt.",
        image: "/images/rooms/suite.jpg",
      },
    },
    createdAt: new Date().toISOString(),
  },
];

const mockSavedServices: SavedService[] = [
  {
    id: 1,
    customerId: 1,
    serviceId: 1,
    service: {
      id: 1,
      name: "Bữa Tối Lãng Mạn Tại Bãi Biển",
      price: 1800000,
      description: "Thưởng thức bữa tối riêng tư dưới ánh nến với các món hải sản tươi ngon.",
      category: "food",
      imageUrl: "/images/services/dinner.jpg",
      isFixedQuantity: true,
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    customerId: 1,
    serviceId: 2,
    service: {
      id: 2,
      name: "Tour Tham Quan Đảo Bằng Cano",
      price: 1200000,
      description: "Khám phá các hòn đảo hoang sơ và lặn ngắm san hô trong một ngày.",
      category: "transport",
      imageUrl: "/images/services/tour.jpg",
      isFixedQuantity: false,
    },
    createdAt: new Date().toISOString(),
  },
];

// Types for saved items from API
export interface SavedRoom {
  id: number
  customerId: number
  roomId: number
  room: {
    id: number
  roomNumber: string
    roomType: {
      id: number
      name: string
  price: number
  capacity: number
      description: string
      image: string
    }
  }
  createdAt: string
}

export interface SavedService {
  id: number
  customerId: number
  serviceId: number
  service: {
    id: number
    name: string
  price: number
    description: string
  category: string
    imageUrl: string
    isFixedQuantity: boolean
  }
  createdAt: string
}

interface SavedContextType {
  savedRooms: SavedRoom[]
  savedServices: SavedService[]
  loading: boolean
  saveRoom: (room: any) => Promise<void>
  saveService: (service: any) => Promise<void>
  removeRoom: (roomId: number, isFavoriteId?: boolean) => Promise<void>
  removeService: (serviceId: number, isFavoriteId?: boolean) => Promise<void>
  isSavedRoom: (roomId: number) => boolean
  isSavedService: (serviceId: number) => boolean
  refetchSavedItems: () => void
}

const SavedContext = createContext<SavedContextType | undefined>(undefined)

export const SavedProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth()
  const [savedRooms, setSavedRooms] = useState<SavedRoom[]>([])
  const [savedServices, setSavedServices] = useState<SavedService[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSavedItems = useCallback(async () => {
    setLoading(true);
    // Use mock data instead of fetching
    setTimeout(() => {
      setSavedRooms(mockSavedRooms);
      setSavedServices(mockSavedServices);
      setLoading(false);
    }, 500); // Simulate network delay
  }, [])

  useEffect(() => {
    fetchSavedItems()
  }, [fetchSavedItems])

  const saveRoom = async (room: any) => {
    if (isSavedRoom(room.id)) {
      toast.info("Phòng này đã có trong danh sách yêu thích của bạn.");
      return;
    }
    const newSavedRoom: SavedRoom = {
      id: Date.now(),
      customerId: 1, // Mock customer ID
      roomId: room.id,
      room: {
        id: room.id,
        roomNumber: room.roomNumber,
        roomType: room.roomType
      },
      createdAt: new Date().toISOString(),
    };
    setSavedRooms(prev => [...prev, newSavedRoom]);
    toast.success("Đã lưu phòng vào danh sách yêu thích");
  }

  const saveService = async (service: any) => {
    if (isSavedService(service.id)) {
      toast.info("Dịch vụ này đã có trong danh sách yêu thích của bạn.");
      return;
    }
     const newSavedService: SavedService = {
        id: Date.now(),
        customerId: 1, // Mock customer ID
      serviceId: service.id,
        service: {
          id: service.id,
          name: service.name || 'Dịch vụ không tên',
          price: service.price || 0,
          description: service.description || '',
          category: service.category || 'general',
          imageUrl: service.imageUrl || '',
          isFixedQuantity: service.isFixedQuantity || false,
        },
        createdAt: new Date().toISOString(),
      };
    setSavedServices(prev => [...prev, newSavedService]);
    toast.success("Đã lưu dịch vụ vào danh sách yêu thích");
  }

  const removeRoom = async (roomId: number) => {
    setSavedRooms(prev => prev.filter(r => r.room.id !== roomId))
      toast.success("Đã xóa phòng khỏi danh sách yêu thích")
  }

  const removeService = async (serviceId: number) => {
    setSavedServices(prev => prev.filter(s => s.service.id !== serviceId))
      toast.success("Đã xóa dịch vụ khỏi danh sách yêu thích")
  }

  const isSavedRoom = (roomId: number): boolean => {
    return savedRooms.some(r => r.room.id === roomId)
  }

  const isSavedService = (serviceId: number): boolean => {
    return savedServices.some(s => s.service.id === serviceId)
  }

  const value = {
    savedRooms,
    savedServices,
    loading,
    saveRoom,
    saveService,
    removeRoom,
    removeService,
    isSavedRoom,
    isSavedService,
    refetchSavedItems: fetchSavedItems
  }

  return (
    <SavedContext.Provider value={value}>
      {children}
    </SavedContext.Provider>
  )
}

export const useSaved = () => {
  const context = useContext(SavedContext)
  if (context === undefined) {
    throw new Error("useSaved must be used within a SavedProvider")
  }
  return context
} 