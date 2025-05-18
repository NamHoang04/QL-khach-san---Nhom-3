"use client"

import { useState } from "react"
import { Search, CheckCircle } from "lucide-react"
import { NewCustomerDialog } from "@/components/new-customer-dialog"
import { EditCustomerDialog } from "@/components/edit-customer-dialog"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface Customer {
  id: string
  code: string
  name: string
  email: string
  phone: string
  idCard: string
  address?: string
  gender: string
}

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  
  // Sample customers data
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: "1",
      code: "KH001",
      name: "Nguyễn Văn A",
      email: "nguyenvana@gmail.com",
      phone: "0901234567",
      idCard: "079201012345",
      address: "123 Đường ABC, Quận 1, TP.HCM",
      gender: "male"
    },
    {
      id: "2",
      code: "KH002",
      name: "Trần Thị B",
      email: "tranthib@gmail.com",
      phone: "0912345678",
      idCard: "079201054321",
      address: "456 Đường XYZ, Quận 2, TP.HCM",
      gender: "female"
    },
    {
      id: "3",
      code: "KH003",
      name: "Lê Văn C",
      email: "levanc@gmail.com",
      phone: "0987654321",
      idCard: "079201067890",
      address: "789 Đường DEF, Quận 3, TP.HCM",
      gender: "male"
    }
  ])

  const handleAddCustomer = (customerData: any) => {
    const newCustomer = {
      id: `${customers.length + 1}`,
      code: `KH00${customers.length + 4}`,
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
      idCard: customerData.idCard,
      address: customerData.address,
      gender: customerData.gender
    }
    
    setCustomers([...customers, newCustomer])
    
    // Show success toast with check icon
    toast.success(
      <div className="flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <span>Khách hàng đã được thêm thành công!</span>
      </div>
    )
  }

  const handleEditCustomer = (customerData: any) => {
    setCustomers(customers.map(customer => 
      customer.id === selectedCustomer?.id ? {
        ...customer,
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        idCard: customerData.idCard,
        address: customerData.address,
        gender: customerData.gender
      } : customer
    ))
    
    // Show success toast with check icon
    toast.success(
      <div className="flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-green-500" />
        <span>Khách hàng đã được cập nhật thành công!</span>
      </div>
    )
  }

  const handleDeleteCustomer = () => {
    if (selectedCustomer) {
      setCustomers(customers.filter(customer => customer.id !== selectedCustomer.id))
      setIsDeleteDialogOpen(false)
      setSelectedCustomer(null)
      
      // Show success toast with check icon
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Khách hàng đã được xóa thành công!</span>
        </div>
      )
    }
  }

  const openEditDialog = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDeleteDialogOpen(true)
  }

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery) ||
    customer.idCard.includes(searchQuery)
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Quản lý Khách hàng</h1>
        <p className="text-gray-600">Xem và quản lý thông tin khách hàng</p>
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
            <Search
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            />
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => setIsAddDialogOpen(true)}
          >
            Thêm khách hàng mới
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã KH
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Họ tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số điện thoại
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CCCD/CMND
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{customer.code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{customer.idCard}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button 
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => openEditDialog(customer)}
                    >
                      Sửa
                    </Button>
                    <Button 
                      variant="ghost"
                      className="text-red-600 hover:text-red-900"
                      onClick={() => openDeleteDialog(customer)}
                    >
                      Xóa
                    </Button>
                  </td>
                </tr>
              ))}
              
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    Không tìm thấy khách hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{filteredCustomers.length}</span> của <span className="font-medium">{customers.length}</span> kết quả
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

      {/* Add Customer Dialog */}
      <NewCustomerDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleAddCustomer}
      />

      {/* Edit Customer Dialog */}
      {selectedCustomer && (
        <EditCustomerDialog
          customer={selectedCustomer}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleEditCustomer}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteCustomer}
        title="Xác nhận xóa khách hàng"
        description={`Bạn có chắc chắn muốn xóa khách hàng "${selectedCustomer?.name}" không? Hành động này không thể hoàn tác.`}
      />
    </div>
  )
} 