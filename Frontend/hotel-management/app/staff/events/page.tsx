"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { toast } from "sonner"
import { CheckCircle, XCircle } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"

interface Event {
  id: string
  title: string
  date: string
  description: string
  timeRange: string
  location: string
}

export default function StaffEventsPage() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Tiệc cưới bãi biển",
      date: "15/06/2024",
      description: "Tổ chức tiệc cưới lãng mạn bên bờ biển với dịch vụ cao cấp và trọn gói.",
      timeRange: "19:00 - 22:00",
      location: "Bãi biển"
    },
    {
      id: "2",
      title: "Hội nghị doanh nghiệp",
      date: "20/06/2024",
      description: "Hội nghị thường niên của các doanh nghiệp trong ngành công nghệ.",
      timeRange: "08:00 - 17:00",
      location: "Phòng hội nghị A"
    },
    {
      id: "3",
      title: "Tiệc Pool Party",
      date: "25/06/2024",
      description: "Tiệc bên hồ bơi với âm nhạc sôi động, đồ uống và BBQ.",
      timeRange: "14:00 - 21:00",
      location: "Hồ bơi"
    }
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [newEvent, setNewEvent] = useState<Omit<Event, "id">>({
    title: "",
    date: "",
    description: "",
    timeRange: "",
    location: ""
  })
  const [formData, setFormData] = useState<Event>({
    id: "",
    title: "",
    date: "",
    description: "",
    timeRange: "",
    location: ""
  })
  
  // Add validation states
  const [newEventErrors, setNewEventErrors] = useState({
    title: false,
    date: false,
    location: false
  })
  
  const [editEventErrors, setEditEventErrors] = useState({
    title: false,
    date: false,
    location: false
  })

  // Validate new event form
  const validateNewEvent = () => {
    const errors = {
      title: !newEvent.title.trim(),
      date: !newEvent.date.trim(),
      location: !newEvent.location.trim()
    }
    
    setNewEventErrors(errors)
    return !Object.values(errors).some(error => error)
  }
  
  // Validate edit event form
  const validateEditEvent = () => {
    const errors = {
      title: !formData.title.trim(),
      date: !formData.date.trim(),
      location: !formData.location.trim()
    }
    
    setEditEventErrors(errors)
    return !Object.values(errors).some(error => error)
  }

  // Handlers for new event
  const handleAddEvent = () => {
    if (validateNewEvent()) {
      const event: Event = {
        id: `${events.length + 1}`,
        ...newEvent
      }
      setEvents([...events, event])
      setIsAddDialogOpen(false)
      setNewEvent({
        title: "",
        date: "",
        description: "",
        timeRange: "",
        location: ""
      })
      setNewEventErrors({
        title: false,
        date: false,
        location: false
      })
      
      // Show success toast with check icon
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Sự kiện đã được thêm thành công!</span>
        </div>
      )
    } else {
      // Show validation error toast
      toast.error(
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-500" />
          <span>Vui lòng điền đầy đủ thông tin bắt buộc!</span>
        </div>
      )
    }
  }

  const handleNewEventChange = (field: keyof Omit<Event, "id">, value: string) => {
    setNewEvent(prev => ({ ...prev, [field]: value }))
    
    // Clear error if field has value
    if (field in newEventErrors && value.trim() !== '') {
      setNewEventErrors(prev => ({ ...prev, [field]: false }))
    }
  }

  // Handlers for editing
  const openEditDialog = (event: Event) => {
    setSelectedEvent(event)
    setFormData(event)
    setIsEditDialogOpen(true)
    setEditEventErrors({
      title: false,
      date: false,
      location: false
    })
  }

  const handleEditChange = (field: keyof Event, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error if field has value
    if (field in editEventErrors && value.trim() !== '') {
      setEditEventErrors(prev => ({ ...prev, [field]: false }))
    }
  }

  const handleSaveEdit = () => {
    if (validateEditEvent()) {
      setEvents(events.map(event => 
        event.id === formData.id ? formData : event
      ))
      setIsEditDialogOpen(false)
      
      // Show success toast with check icon
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Sự kiện đã được cập nhật thành công!</span>
        </div>
      )
    } else {
      // Show validation error toast
      toast.error(
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-500" />
          <span>Vui lòng điền đầy đủ thông tin bắt buộc!</span>
        </div>
      )
    }
  }

  // Handlers for deletion
  const openDeleteDialog = (event: Event) => {
    setSelectedEvent(event)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      setEvents(events.filter(event => event.id !== selectedEvent.id))
      setIsDeleteDialogOpen(false)
      setSelectedEvent(null)
      
      // Show success toast with check icon
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Sự kiện đã được xóa thành công!</span>
        </div>
      )
    }
  }

  return (
    <AuthGuard requiredRole="staff">
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Quản lý Sự kiện</h1>
          <p className="text-gray-600">Xem và quản lý các sự kiện của khách sạn</p>
        </div>
        
        <div className="mb-6">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setIsAddDialogOpen(true)}
          >
            Tạo sự kiện mới
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-blue-50 border-b border-blue-100 flex justify-between items-center">
                <div className="text-lg font-bold text-blue-800">{event.title}</div>
                <div className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded">
                  {event.date}
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-600">{event.timeRange}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm text-gray-600">{event.location}</span>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button 
                    variant="ghost" 
                    className="text-blue-600 hover:text-blue-900 font-medium"
                    onClick={() => openEditDialog(event)}
                  >
                    Sửa
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="text-red-600 hover:text-red-900 font-medium"
                    onClick={() => openDeleteDialog(event)}
                  >
                    Xóa
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            <Button variant="outline" className="px-3 py-1" disabled>
              Trước
            </Button>
            <Button className="px-3 py-1 bg-blue-600 text-white">
              1
            </Button>
            <Button variant="outline" className="px-3 py-1">
              2
            </Button>
            <Button variant="outline" className="px-3 py-1">
              Tiếp
            </Button>
          </div>
        </div>

        {/* Add Event Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Tạo sự kiện mới</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="title">Tên sự kiện <span className="text-red-500">*</span></Label>
                <Input 
                  id="title" 
                  value={newEvent.title}
                  onChange={(e) => handleNewEventChange("title", e.target.value)}
                  className={`${newEventErrors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
                  required
                />
                {newEventErrors.title && (
                  <p className="text-red-500 text-xs mt-1">Tên sự kiện là bắt buộc</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="date">Ngày tổ chức <span className="text-red-500">*</span></Label>
                  <Input 
                    id="date" 
                    value={newEvent.date}
                    onChange={(e) => handleNewEventChange("date", e.target.value)}
                    className={`${newEventErrors.date ? 'border-red-500 focus:ring-red-500' : ''}`}
                    required
                  />
                  {newEventErrors.date && (
                    <p className="text-red-500 text-xs mt-1">Ngày tổ chức là bắt buộc</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="timeRange">Thời gian</Label>
                  <Input 
                    id="timeRange" 
                    value={newEvent.timeRange}
                    onChange={(e) => handleNewEventChange("timeRange", e.target.value)}
                    placeholder="VD: 09:00 - 12:00"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="location">Địa điểm <span className="text-red-500">*</span></Label>
                <Input 
                  id="location" 
                  value={newEvent.location}
                  onChange={(e) => handleNewEventChange("location", e.target.value)}
                  className={`${newEventErrors.location ? 'border-red-500 focus:ring-red-500' : ''}`}
                  required
                />
                {newEventErrors.location && (
                  <p className="text-red-500 text-xs mt-1">Địa điểm là bắt buộc</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea 
                  id="description" 
                  value={newEvent.description}
                  onChange={(e) => handleNewEventChange("description", e.target.value)}
                  placeholder="Nhập mô tả chi tiết về sự kiện..."
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Hủy bỏ
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleAddEvent}
                >
                  Lưu sự kiện
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Edit Event Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Chỉnh sửa sự kiện</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="edit-title">Tên sự kiện <span className="text-red-500">*</span></Label>
                <Input 
                  id="edit-title" 
                  value={formData.title}
                  onChange={(e) => handleEditChange("title", e.target.value)}
                  className={`${editEventErrors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
                  required
                />
                {editEventErrors.title && (
                  <p className="text-red-500 text-xs mt-1">Tên sự kiện là bắt buộc</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="edit-date">Ngày tổ chức <span className="text-red-500">*</span></Label>
                  <Input 
                    id="edit-date" 
                    value={formData.date}
                    onChange={(e) => handleEditChange("date", e.target.value)}
                    className={`${editEventErrors.date ? 'border-red-500 focus:ring-red-500' : ''}`}
                    required
                  />
                  {editEventErrors.date && (
                    <p className="text-red-500 text-xs mt-1">Ngày tổ chức là bắt buộc</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <Label htmlFor="edit-timeRange">Thời gian</Label>
                  <Input 
                    id="edit-timeRange" 
                    value={formData.timeRange}
                    onChange={(e) => handleEditChange("timeRange", e.target.value)}
                    placeholder="VD: 09:00 - 12:00"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="edit-location">Địa điểm <span className="text-red-500">*</span></Label>
                <Input 
                  id="edit-location" 
                  value={formData.location}
                  onChange={(e) => handleEditChange("location", e.target.value)}
                  className={`${editEventErrors.location ? 'border-red-500 focus:ring-red-500' : ''}`}
                  required
                />
                {editEventErrors.location && (
                  <p className="text-red-500 text-xs mt-1">Địa điểm là bắt buộc</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                <Label htmlFor="edit-description">Mô tả</Label>
                <Textarea 
                  id="edit-description" 
                  value={formData.description}
                  onChange={(e) => handleEditChange("description", e.target.value)}
                  placeholder="Nhập mô tả chi tiết về sự kiện..."
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Hủy bỏ
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleSaveEdit}
                >
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteEvent}
          title="Xác nhận xóa sự kiện"
          description={`Bạn có chắc chắn muốn xóa sự kiện "${selectedEvent?.title}" không? Hành động này không thể hoàn tác.`}
        />
      </div>
    </AuthGuard>
  )
}
