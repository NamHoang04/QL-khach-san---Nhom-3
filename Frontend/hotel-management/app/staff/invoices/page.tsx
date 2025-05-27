"use client"

import { useState } from "react"
import { Search, FileDown, Edit, Trash2, Printer, CheckCircle, XCircle, Info } from "lucide-react"
import { NewInvoiceDialog } from "@/components/new-invoice-dialog"
import { InvoicePrint } from "@/components/invoice-print"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { toast } from "sonner"
import * as XLSX from 'xlsx'
import { AuthGuard } from "@/components/auth-guard"

interface InvoiceItem {
  id: string
  name: string
  quantity: number
  price: number
  amount: number
}

interface Invoice {
  id: string
  customerName: string
  customerEmail: string
  issueDate: string
  total: number
  status: "pending" | "paid"
  items: InvoiceItem[]
  subtotal: number
  tax: number
}

export default function StaffInvoicesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  
  // Sample invoices data
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "INV00123",
      customerName: "Nguyễn Văn A",
      customerEmail: "nguyenvana@gmail.com",
      issueDate: "05/06/2024",
      total: 4500000,
      status: "paid",
      items: [
        { id: "1", name: "Phòng Standard - 2 đêm", quantity: 2, price: 1500000, amount: 3000000 },
        { id: "2", name: "Dịch vụ giặt ủi", quantity: 1, price: 150000, amount: 150000 },
        { id: "3", name: "Bữa sáng buffet", quantity: 4, price: 250000, amount: 1000000 }
      ],
      subtotal: 4150000,
      tax: 350000
    },
    {
      id: "INV00124",
      customerName: "Trần Thị B",
      customerEmail: "tranthib@gmail.com",
      issueDate: "04/06/2024",
      total: 7200000,
      status: "pending",
      items: [
        { id: "1", name: "Phòng Deluxe - 3 đêm", quantity: 3, price: 2000000, amount: 6000000 },
        { id: "2", name: "Đưa đón sân bay", quantity: 1, price: 350000, amount: 350000 },
        { id: "3", name: "Bữa tối tại nhà hàng", quantity: 2, price: 350000, amount: 700000 }
      ],
      subtotal: 7050000,
      tax: 150000
    },
    {
      id: "INV00125",
      customerName: "Lê Văn C",
      customerEmail: "levanc@gmail.com",
      issueDate: "03/06/2024",
      total: 12500000,
      status: "paid",
      items: [
        { id: "1", name: "Phòng Suite - 5 đêm", quantity: 5, price: 2000000, amount: 10000000 },
        { id: "2", name: "Spa", quantity: 2, price: 500000, amount: 1000000 },
        { id: "3", name: "Tour tham quan thành phố", quantity: 1, price: 1500000, amount: 1500000 }
      ],
      subtotal: 12000000,
      tax: 500000
    }
  ])

  // Calculation functions
  const calculateSubtotal = (items: InvoiceItem[]) => {
    return items.reduce((total, item) => total + item.amount, 0)
  }
  
  const calculateTax = (items: InvoiceItem[]) => {
    return calculateSubtotal(items) * 0.08
  }
  
  const calculateTotal = (items: InvoiceItem[]) => {
    const subtotal = calculateSubtotal(items)
    return subtotal + (subtotal * 0.08)
  }

  // Calculate revenue statistics
  const getTotalRevenue = () => {
    return invoices.reduce((total, invoice) => total + invoice.total, 0)
  }
  
  const getPaidInvoicesCount = () => {
    return invoices.filter(invoice => invoice.status === 'paid').length
  }
  
  const getPendingInvoicesCount = () => {
    return invoices.filter(invoice => invoice.status === 'pending').length
  }
  
  const getAverageInvoiceValue = () => {
    return invoices.length > 0 ? getTotalRevenue() / invoices.length : 0
  }
  
  const getTotalPaidRevenue = () => {
    return invoices
      .filter(invoice => invoice.status === 'paid')
      .reduce((total, invoice) => total + invoice.total, 0)
  }
  
  const getRevenueGrowthPercentage = () => {
    // Get current month and previous month
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const currentYear = currentDate.getFullYear()
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear
    
    // Function to check if a date string is from a specific month and year
    const isFromMonth = (dateString: string, month: number, year: number) => {
      const date = new Date(dateString.split('/').reverse().join('-'))
      return date.getMonth() === month && date.getFullYear() === year
    }
    
    // Get invoices from current month and previous month
    const currentMonthInvoices = invoices.filter(invoice => 
      isFromMonth(invoice.issueDate, currentMonth, currentYear)
    )
    
    const previousMonthInvoices = invoices.filter(invoice => 
      isFromMonth(invoice.issueDate, previousMonth, previousYear)
    )
    
    // Calculate average invoice values
    const currentMonthAverage = currentMonthInvoices.length > 0 
      ? currentMonthInvoices.reduce((sum, invoice) => sum + invoice.total, 0) / currentMonthInvoices.length 
      : 0
    
    const previousMonthAverage = previousMonthInvoices.length > 0 
      ? previousMonthInvoices.reduce((sum, invoice) => sum + invoice.total, 0) / previousMonthInvoices.length 
      : 0
    
    // Calculate growth percentage
    if (previousMonthAverage === 0) return 0
    
    const growthPercentage = ((currentMonthAverage - previousMonthAverage) / previousMonthAverage) * 100
    return Math.round(growthPercentage)
  }
  
  // Get invoice counts by month
  const getCurrentMonthInvoiceCount = () => {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()
    
    return invoices.filter(invoice => {
      const date = new Date(invoice.issueDate.split('/').reverse().join('-'))
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    }).length
  }

  const handleAddInvoice = (invoiceData: any) => {
    try {
      const newInvoice: Invoice = {
        id: `INV00${invoices.length + 126}`,
        customerName: invoiceData.customerName,
        customerEmail: invoiceData.customerEmail,
        issueDate: new Date().toLocaleDateString('vi-VN'),
        total: calculateTotal(invoiceData.items),
        status: invoiceData.status === 'paid' ? 'paid' : 'pending',
        items: invoiceData.items,
        subtotal: calculateSubtotal(invoiceData.items),
        tax: calculateTax(invoiceData.items)
      }
      
      setInvoices([...invoices, newInvoice])
      
      // Show success toast
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Hóa đơn đã được tạo thành công!</span>
        </div>
      )
    } catch (error) {
      // Show error toast
      toast.error(
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-500" />
          <span>Có lỗi xảy ra khi tạo hóa đơn. Vui lòng thử lại!</span>
        </div>
      )
      console.error("Error creating invoice:", error)
    }
  }

  const handleDeleteInvoice = () => {
    if (selectedInvoice) {
      try {
        setInvoices(invoices.filter(invoice => invoice.id !== selectedInvoice.id))
        setIsDeleteDialogOpen(false)
        setSelectedInvoice(null)
        
        // Show success toast
        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Hóa đơn đã được xóa thành công!</span>
          </div>
        )
      } catch (error) {
        // Show error toast
        toast.error(
          <div className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-500" />
            <span>Có lỗi xảy ra khi xóa hóa đơn. Vui lòng thử lại!</span>
          </div>
        )
        console.error("Error deleting invoice:", error)
      }
    }
  }

  const openPrintDialog = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsPrintDialogOpen(true)
    
    // Show info toast
    toast(
      <div className="flex items-center gap-2">
        <Info className="h-5 w-5 text-blue-500" />
        <span>Đang chuẩn bị hóa đơn để in...</span>
      </div>
    )
  }

  const openDeleteDialog = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsDeleteDialogOpen(true)
  }

  const exportToExcel = () => {
    try {
      const ws = XLSX.utils.json_to_sheet(invoices.map(invoice => ({
        'Mã HĐ': invoice.id,
        'Khách hàng': invoice.customerName,
        'Email': invoice.customerEmail,
        'Ngày tạo': invoice.issueDate,
        'Tổng tiền': formatCurrency(invoice.total),
        'Trạng thái': invoice.status === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'
      })))
      
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Invoices')
      
      // Generate Excel file and trigger download
      XLSX.writeFile(wb, 'danh_sach_hoa_don.xlsx')
      
      // Show success toast
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Đã xuất dữ liệu ra file Excel thành công!</span>
        </div>
      )
    } catch (error) {
      // Show error toast
      toast.error(
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-500" />
          <span>Có lỗi xảy ra khi xuất dữ liệu. Vui lòng thử lại!</span>
        </div>
      )
      console.error("Error exporting to Excel:", error)
    }
  }

  const filteredInvoices = invoices.filter(invoice => 
    invoice.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    invoice.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
      .replace('₫', 'VNĐ')
  }

  return (
    <AuthGuard requiredRole="staff">
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Quản lý Hóa đơn</h1>
          <p className="text-gray-600">Xem và quản lý hóa đơn thanh toán</p>
        </div>
        
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="bg-white rounded-lg shadow p-4 flex-1">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Tổng doanh thu</h3>
            <p className="text-3xl font-bold text-blue-600">{formatCurrency(getTotalRevenue())}</p>
            <p className="text-sm text-gray-500 mt-1">Đã thanh toán: {formatCurrency(getTotalPaidRevenue())}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 flex-1">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Số hóa đơn tháng này</h3>
            <p className="text-3xl font-bold text-blue-600">{getCurrentMonthInvoiceCount()}</p>
            <p className="text-sm text-gray-500 mt-1">Đã thanh toán: {getPaidInvoicesCount()} | Chờ thanh toán: {getPendingInvoicesCount()}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-4 flex-1">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Doanh thu trung bình/hóa đơn</h3>
            <p className="text-3xl font-bold text-blue-600">
              {formatCurrency(getAverageInvoiceValue())}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              <span className={getRevenueGrowthPercentage() >= 0 ? 'text-green-500' : 'text-red-500'}>
                {getRevenueGrowthPercentage() >= 0 ? '+' : ''}{getRevenueGrowthPercentage()}%
              </span> so với tháng trước
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm hóa đơn..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-80"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              />
            </div>
            <div className="flex gap-2">
              <button 
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center"
                onClick={exportToExcel}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Xuất báo cáo
              </button>
              <button 
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                onClick={() => setIsAddDialogOpen(true)}
              >
                Tạo hóa đơn mới
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mã hóa đơn
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
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
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{invoice.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{invoice.customerName}</div>
                      <div className="text-sm text-gray-500">{invoice.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{invoice.issueDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatCurrency(invoice.total)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {invoice.status === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-blue-600 hover:text-blue-900 mr-2"
                        onClick={() => openPrintDialog(invoice)}
                      >
                        <Printer className="h-5 w-5" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900 mr-2"
                        onClick={() => openDeleteDialog(invoice)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                
                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      Không tìm thấy hóa đơn nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">{filteredInvoices.length}</span> của <span className="font-medium">{invoices.length}</span> kết quả
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border rounded text-sm" disabled>
                Trước
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                1
              </button>
              <button className="px-3 py-1 border rounded text-sm">
                2
              </button>
              <button className="px-3 py-1 border rounded text-sm">
                3
              </button>
              <button className="px-3 py-1 border rounded text-sm">
                ...
              </button>
              <button className="px-3 py-1 border rounded text-sm">
                8
              </button>
              <button className="px-3 py-1 border rounded text-sm">
                Tiếp
              </button>
            </div>
          </div>
        </div>

        {/* Add Invoice Dialog */}
        <NewInvoiceDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSave={handleAddInvoice}
        />

        {/* Invoice Print Dialog */}
        <InvoicePrint
          invoice={selectedInvoice}
          open={isPrintDialogOpen}
          onOpenChange={setIsPrintDialogOpen}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteInvoice}
          title="Xác nhận xóa hóa đơn"
          description={`Bạn có chắc chắn muốn xóa hóa đơn ${selectedInvoice?.id} không? Hành động này không thể hoàn tác.`}
        />
      </div>
    </AuthGuard>
  )
}
