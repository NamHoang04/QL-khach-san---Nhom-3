"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Edit, Trash2, PlusCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { getServices, deleteService, createService, updateService, Service, ServiceUpsertDto } from "@/lib/service-service"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { ServiceDialog } from "@/components/service-dialog"

export default function AdminServicesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getServices()
      setServices(data)
      setError(null)
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || "Lỗi kết nối đến máy chủ."
      setError(errorMessage)
      toast.error(`Không thể tải danh sách dịch vụ: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const handleSave = async (data: ServiceUpsertDto) => {
    try {
      if (selectedService) {
        await updateService(selectedService.id, data)
        toast.success(`Đã cập nhật dịch vụ ${data.name}.`)
      } else {
        await createService(data)
        toast.success(`Đã tạo dịch vụ mới: ${data.name}.`)
      }
      fetchServices()
      setIsDialogOpen(false)
    } catch (err: any) {
        const errorMessage = err?.data?.message || err?.message || "Đã có lỗi xảy ra."
        toast.error(`Lưu dịch vụ thất bại: ${errorMessage}`)
    }
  }

  const handleDelete = async () => {
    if (!selectedService) return
    try {
      await deleteService(selectedService.id)
      toast.success(`Đã xóa dịch vụ ${selectedService.name}.`)
      fetchServices()
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || "Đã có lỗi xảy ra."
      toast.error(`Xóa dịch vụ thất bại: ${errorMessage}`)
    } finally {
      setIsDeleteDialogOpen(false)
    }
  }

  const openDialog = (service: Service | null = null) => {
    setSelectedService(service)
    setIsDialogOpen(true)
  }

  const openDeleteDialog = (service: Service) => {
    setSelectedService(service)
    setIsDeleteDialogOpen(true)
  }
  
  const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Spinner size="large" /></div>
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10"><p>Đã xảy ra lỗi: {error}</p></div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Quản lý Dịch vụ</h1>
        <p className="text-gray-600">Thêm, sửa, xóa và quản lý các dịch vụ của khách sạn</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm theo tên dịch vụ..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            onClick={() => openDialog()}
          >
            <PlusCircle size={18} />
            Thêm dịch vụ
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Dịch vụ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredServices.map((service) => (
                <tr key={service.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{service.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{service.description}</div>
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(service.price)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="ghost" className="text-blue-600 hover:text-blue-900" onClick={() => openDialog(service)}>
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" className="text-red-600 hover:text-red-900" onClick={() => openDeleteDialog(service)}>
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredServices.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Không tìm thấy dịch vụ nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isDialogOpen && (
        <ServiceDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSave}
          service={selectedService}
        />
      )}

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa dịch vụ"
        description={`Bạn có chắc chắn muốn xóa dịch vụ ${selectedService?.name}?`}
      />
    </div>
  )
} 