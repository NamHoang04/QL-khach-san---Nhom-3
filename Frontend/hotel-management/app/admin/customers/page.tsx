"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Edit, Trash2, PlusCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { getCustomers, deleteCustomer, createCustomer, updateCustomer, CustomerData, CustomerUpsertDTO } from "@/lib/customer-service"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { CustomerDialog } from "@/components/customer-dialog"

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null)
  const [customers, setCustomers] = useState<CustomerData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [allCustomers, setAllCustomers] = useState<CustomerData[]>([]) // State to hold all customers for client-side search

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getCustomers()
      setAllCustomers(data) // Store all customers
      setCustomers(data)    // Initially display all
      setError(null)
    } catch (err: any) {
      console.error("Failed to fetch customers:", err)
      const errorMessage = err.message || "Lỗi kết nối đến máy chủ."
      setError(errorMessage)
      toast.error(`Không thể tải danh sách khách hàng: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCustomers()
  }, [fetchCustomers])

  // Client-side search
  useEffect(() => {
    const filtered = allCustomers.filter(customer =>
      customer.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.customerCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.identityNumber?.includes(searchQuery)
    )
    setCustomers(filtered)
  }, [searchQuery, allCustomers])

  const handleSave = async (data: CustomerUpsertDTO) => {
    try {
      if (selectedCustomer) {
        // Update
        await updateCustomer(selectedCustomer.id, data)
        toast.success(`Đã cập nhật khách hàng "${data.userName}".`)
      } else {
        // Create
        await createCustomer(data)
        toast.success(`Đã tạo khách hàng mới "${data.userName}".`)
      }
      fetchCustomers() // Refetch all customers
      setIsDialogOpen(false)
    } catch (err: any) {
      console.error("Failed to save customer:", err)
      const errorMessage = err.response?.data?.message || err.message || "Đã có lỗi xảy ra."
      toast.error(`Lưu khách hàng thất bại: ${errorMessage}`)
    }
  }

  const handleDelete = async () => {
    if (!selectedCustomer) return
    try {
      await deleteCustomer(selectedCustomer.id)
      toast.success(`Đã xóa khách hàng "${selectedCustomer.userName}".`)
      fetchCustomers() // Refetch all customers
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Đã có lỗi xảy ra."
      toast.error(`Xóa khách hàng thất bại: ${errorMessage}`)
    } finally {
      setIsDeleteDialogOpen(false)
    }
  }

  const openDialog = (customer: CustomerData | null = null) => {
    setSelectedCustomer(customer)
    setIsDialogOpen(true)
  }

  const openDeleteDialog = (customer: CustomerData) => {
    setSelectedCustomer(customer)
    setIsDeleteDialogOpen(true)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Spinner size="large" /></div>
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10"><p>Đã xảy ra lỗi: {error}</p></div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Quản lý Khách hàng</h1>
        <p className="text-gray-600">Thêm, sửa, xóa và quản lý thông tin khách hàng</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm khách hàng..."
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
            Thêm khách hàng
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã KH</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ Tên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Liên hệ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CCCD/CMND</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{customer.customerCode}</div>
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{customer.userName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <div className="text-sm text-gray-900">{customer.email}</div>
                    <div className="text-sm text-gray-500">{customer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.identityNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="ghost" className="text-blue-600 hover:text-blue-900" onClick={() => openDialog(customer)}>
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" className="text-red-600 hover:text-red-900" onClick={() => openDeleteDialog(customer)}>
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Không tìm thấy khách hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isDialogOpen && (
        <CustomerDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSave}
          customer={selectedCustomer}
        />
      )}

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa khách hàng"
        description={`Bạn có chắc chắn muốn xóa khách hàng "${selectedCustomer?.userName}"? Hành động này không thể hoàn tác.`}
      />
    </div>
  )
} 