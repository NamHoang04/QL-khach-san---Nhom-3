"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useAuth } from "./auth-context"
import { toast } from "sonner"

// Types for saved items
export interface SavedRoom {
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

export interface SavedService {
  id: number
  serviceId: number
  serviceName: string
  price: number
  category: string
  imageUrl?: string
  description?: string
  savedAt: string
  isFixedQuantity?: boolean
}

interface SavedContextType {
  savedRooms: SavedRoom[]
  savedServices: SavedService[]
  loading: boolean
  saveRoom: (room: any) => void
  saveService: (service: any) => void
  removeRoom: (roomId: number) => void
  removeService: (serviceId: number) => void
  isSavedRoom: (roomId: number) => boolean
  isSavedService: (serviceId: number) => boolean
}

const SavedContext = createContext<SavedContextType | undefined>(undefined)

export const SavedProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [savedRooms, setSavedRooms] = useState<SavedRoom[]>([])
  const [savedServices, setSavedServices] = useState<SavedService[]>([])
  const [loading, setLoading] = useState(true)

  // Load saved items from localStorage on initial render
  useEffect(() => {
    const loadSavedItems = () => {
      setLoading(true)
      try {
        // Get saved rooms from localStorage
        const savedRoomsData = localStorage.getItem('saved_rooms')
        if (savedRoomsData) {
          setSavedRooms(JSON.parse(savedRoomsData))
        }

        // Get saved services from localStorage
        const savedServicesData = localStorage.getItem('saved_services')
        if (savedServicesData) {
          setSavedServices(JSON.parse(savedServicesData))
        }
      } catch (error) {
        console.error("Error loading saved items:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSavedItems()
  }, [user?.id])

  // Save a room to favorites
  const saveRoom = (room: any) => {
    // Create a saved room object
    const savedRoom: SavedRoom = {
      id: Date.now(), // Generate a unique ID
      roomId: room.id,
      roomNumber: room.roomNumber || `${room.id}`,
      roomType: room.name || room.type || "Room",
      price: room.price,
      imageUrl: room.imageUrl || room.image,
      description: room.description,
      capacity: room.capacity || 2,
      savedAt: new Date().toISOString()
    }

    // Update state
    setSavedRooms(prev => {
      // Check if room is already saved
      const isAlreadySaved = prev.some(item => item.roomId === room.id)
      if (isAlreadySaved) {
        return prev
      }
      const newSavedRooms = [...prev, savedRoom]
      
      // Save to localStorage
      localStorage.setItem('saved_rooms', JSON.stringify(newSavedRooms))
      
      // Show toast notification
      toast.success("Đã lưu phòng vào danh sách yêu thích")
      
      return newSavedRooms
    })
  }

  // Save a service to favorites
  const saveService = (service: any) => {
    // Create a saved service object
    const savedService: SavedService = {
      id: Date.now(), // Generate a unique ID
      serviceId: service.id,
      serviceName: service.name || service.serviceName,
      price: service.price,
      category: service.category || "other",
      imageUrl: service.imageUrl || service.image,
      description: service.description,
      savedAt: new Date().toISOString(),
      isFixedQuantity: service.isFixedQuantity
    }

    // Update state
    setSavedServices(prev => {
      // Check if service is already saved
      const isAlreadySaved = prev.some(item => item.serviceId === service.id)
      if (isAlreadySaved) {
        return prev
      }
      const newSavedServices = [...prev, savedService]
      
      // Save to localStorage
      localStorage.setItem('saved_services', JSON.stringify(newSavedServices))
      
      // Show toast notification
      toast.success("Đã lưu dịch vụ vào danh sách yêu thích")
      
      return newSavedServices
    })
  }

  // Remove a room from favorites
  const removeRoom = (roomId: number) => {
    setSavedRooms(prev => {
      // Filter to keep rooms that don't match the one being removed
      const newSavedRooms = prev.filter(room => {
        // Convert both IDs to strings for consistent comparison
        return room.roomId.toString() !== roomId.toString();
      });
      
      // Save to localStorage
      localStorage.setItem('saved_rooms', JSON.stringify(newSavedRooms))
      
      // Show toast notification
      toast.success("Đã xóa phòng khỏi danh sách yêu thích")
      
      return newSavedRooms
    })
  }

  // Remove a service from favorites
  const removeService = (serviceId: number) => {
    setSavedServices(prev => {
      // Filter to keep services that don't match the one being removed
      const newSavedServices = prev.filter(service => {
        // Convert both IDs to strings for consistent comparison
        return service.serviceId.toString() !== serviceId.toString();
      });
      
      // Save to localStorage
      localStorage.setItem('saved_services', JSON.stringify(newSavedServices))
      
      // Show toast notification
      toast.success("Đã xóa dịch vụ khỏi danh sách yêu thích")
      
      return newSavedServices
    })
  }

  // Check if a room is saved
  const isSavedRoom = (roomId: number): boolean => {
    // Convert to string for consistent comparison
    return savedRooms.some(room => room.roomId.toString() === roomId.toString());
  }

  // Check if a service is saved
  const isSavedService = (serviceId: number): boolean => {
    // Also account for type conversions between string and number representations
    return savedServices.some(service => 
      service.serviceId === serviceId || 
      service.serviceId === Number(serviceId) || 
      service.serviceId.toString() === serviceId.toString()
    );
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
    isSavedService
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