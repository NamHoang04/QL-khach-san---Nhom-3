"use client"

import { useState, useEffect } from "react"
import { AddServiceDialog } from "@/components/add-service-dialog"
import { EditServiceDialog } from "@/components/edit-service-dialog"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { Search, CheckCircle, XCircle, Info } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface Service {
  id: string
  code: string
  name: string
  description: string
  price: string
  status: string
}

export default function AdminServicesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  
  // Sample services data
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      code: "SV001",
      name: "Dịch vụ giặt ủi",
      description: "Dịch vụ giặt ủi quần áo nhanh chóng, giao tận phòng",
      price: "150,000",
      status: "active"
    },
    {
      id: "2",
      code: "SV002",
      name: "Spa",
      description: "Dịch vụ spa cao cấp với đầy đủ các liệu pháp thư giãn",
      price: "500,000",
      status: "active"
    },
    {
      id: "3",
      code: "SV003",
      name: "Đưa đón sân bay",
      description: "Dịch vụ đưa đón khách hàng từ/đến sân bay",
      price: "350,000",
      status: "inactive"
    }
  ])

  // Function to generate a new service code
  const generateServiceCode = () => {
    const nextNumber = services.length + 1
    return `SV${nextNumber.toString().padStart(3, '0')}`
  }

  const handleAddService = (serviceData: any) => {
    // Validate that required fields are filled - this is now also done in the component
    if (!serviceData.name || !serviceData.price) {
      toast.error(
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-500" />
          <span>Vui lòng điền đầy đủ tên và giá dịch vụ</span>
        </div>
      )
      return
    }
    
    try {
      const newService = {
        id: `${services.length + 1}`,
        code: generateServiceCode(),
        name: serviceData.name,
        description: serviceData.description || "",
        price: serviceData.price,
        status: serviceData.status || "active"
      }
      
      setServices([...services, newService])
      
      // Show success toast with check icon
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Dịch vụ đã được thêm thành công!</span>
        </div>
      )
    } catch (error) {
      // Show error toast if something unexpected happens
      toast.error(
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-500" />
          <span>Có lỗi xảy ra khi thêm dịch vụ. Vui lòng thử lại!</span>
        </div>
      )
      console.error("Error adding service:", error)
    }
  }

  const handleEditService = (serviceData: Service) => {
    // Validate that required fields are filled - this is now also done in the component
    if (!serviceData.name || !serviceData.price) {
      toast.error(
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-500" />
          <span>Vui lòng điền đầy đủ tên và giá dịch vụ</span>
        </div>
      )
      return
    }
    
    try {
      setServices(services.map(service => 
        service.id === serviceData.id ? serviceData : service
      ))
      
      // Show success toast with check icon
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Dịch vụ đã được cập nhật thành công!</span>
        </div>
      )
    } catch (error) {
      // Show error toast if something unexpected happens
      toast.error(
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-500" />
          <span>Có lỗi xảy ra khi cập nhật dịch vụ. Vui lòng thử lại!</span>
        </div>
      )
      console.error("Error updating service:", error)
    }
  }

  const handleDeleteService = () => {
    if (selectedService) {
      try {
        setServices(services.filter(service => service.id !== selectedService.id))
        setIsDeleteDialogOpen(false)
        setSelectedService(null)
        
        // Show success toast with check icon
        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Dịch vụ đã được xóa thành công!</span>
          </div>
        )
      } catch (error) {
        // Show error toast if something unexpected happens
        toast.error(
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            <span>Có lỗi xảy ra khi xóa dịch vụ. Vui lòng thử lại!</span>
          </div>
        )
        console.error("Error deleting service:", error)
      }
    } else {
      // Show info toast if no service is selected
      toast(
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-500" />
          <span>Không có dịch vụ nào được chọn để xóa</span>
        </div>
      )
    }
  }

  const openEditDialog = (service: Service) => {
    setSelectedService(service)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (service: Service) => {
    setSelectedService(service)
    setIsDeleteDialogOpen(true)
  }

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.description.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // Show toast notification about search results when search query changes
  useEffect(() => {
    if (searchQuery.trim() !== '') {
      if (filteredServices.length === 0) {
        toast(
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            <span>Không tìm thấy dịch vụ nào phù hợp với từ khóa "{searchQuery}"</span>
          </div>
        )
      } else if (filteredServices.length < services.length) {
        toast(
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            <span>Đã tìm thấy {filteredServices.length} dịch vụ phù hợp</span>
          </div>
        )
      }
    }
  }, [searchQuery, filteredServices.length, services.length])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Quản lý Dịch vụ</h1>
        <p className="text-gray-600">Xem và quản lý các dịch vụ của khách sạn</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm dịch vụ..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            />
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setIsAddDialogOpen(true)}
          >
            Thêm dịch vụ mới
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã dịch vụ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên dịch vụ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá (VNĐ)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredServices.map((service) => (
                <tr key={service.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{service.code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{service.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 line-clamp-2">{service.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{service.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {service.status === 'active' ? 'Đang hoạt động' : 'Tạm ngưng'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button 
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => openEditDialog(service)}
                    >
                      Sửa
                    </Button>
                    <Button 
                      variant="ghost"
                      className="text-red-600 hover:text-red-900"
                      onClick={() => openDeleteDialog(service)}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
              
              {filteredServices.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Không tìm thấy dịch vụ nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{filteredServices.length}</span> của <span className="font-medium">{filteredServices.length}</span> kết quả
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="px-3 py-1" disabled>
              Trước
            </Button>
            <Button className="px-3 py-1 bg-blue-600 text-white">
              1
            </Button>
            <Button variant="outline" className="px-3 py-1" disabled>
              Tiếp
            </Button>
          </div>
        </div>
      </div>

      {/* Add Service Dialog */}
      <AddServiceDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleAddService}
      />

      {/* Edit Service Dialog */}
      {selectedService && (
        <EditServiceDialog
          service={selectedService}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleEditService}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteService}
        title="Xác nhận xóa dịch vụ"
        description={`Bạn có chắc chắn muốn xóa dịch vụ "${selectedService?.name}" không? Hành động này không thể hoàn tác.`}
      />
    </div>
  )
} 