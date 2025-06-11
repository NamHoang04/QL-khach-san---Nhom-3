"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, FileDown, Edit, Trash2, Printer, CheckCircle, XCircle, Info } from "lucide-react"
import { NewInvoiceDialog } from "@/components/new-invoice-dialog"
import { InvoicePrint } from "@/components/invoice-print"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { toast } from "sonner"
import * as XLSX from 'xlsx'
import { getInvoices, deleteInvoice, Invoice, createInvoice } from "@/lib/invoice-service"
import { getBookings, Booking } from "@/lib/booking-service"
import { getServicesForBooking } from "@/lib/booking-service-service"
import { getRooms, getRoomTypes, Room, RoomType } from "@/lib/room-service"
import { differenceInDays } from 'date-fns'
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"

export default function AdminInvoicesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAndProcessData = useCallback(async () => {
    try {
      setLoading(true);
      const [invoicesData, bookingsData, roomsData, roomTypesData] = await Promise.all([
        getInvoices(), 
        getBookings(),
        getRooms(),
        getRoomTypes(),
      ]);
      
      const invoicedBookingIds = new Set(invoicesData.map(inv => String(inv.bookingId)));
      const bookingsToInvoice = bookingsData.filter(b => b.status === 'CheckedOut' && !invoicedBookingIds.has(String(b.id)));
      
      if (bookingsToInvoice.length > 0) {
        const creationPromises = bookingsToInvoice.map(async (booking) => {
          // Fetch services for each specific booking
          const servicesForBooking = await getServicesForBooking(booking.id);
          
          // Find room and room type
          const room = roomsData.find(r => String(r.id) === String(booking.roomId));
          const roomType = room ? roomTypesData.find(rt => String(rt.id) === String(room.roomTypeId)) : undefined;

          // Calculate room cost
          let roomCost = 0;
          if (roomType && booking.checkIn && booking.checkOut) {
            const checkInDate = new Date(booking.checkIn);
            const checkOutDate = new Date(booking.checkOut);
            // Ensure difference is at least 1 day
            const numberOfDays = Math.max(1, differenceInDays(checkOutDate, checkInDate));
            roomCost = (roomType.basePrice || 0) * numberOfDays;
          } else {
            // Fallback to booking's total price if room/type not found
            roomCost = booking.totalPrice || 0;
          }

          const invoiceServices = servicesForBooking.map(bs => ({
            serviceId: bs.serviceId,
            serviceName: bs.serviceName || 'Dịch vụ', // Fallback name
            quantity: bs.quantity,
            price: bs.price,
            amount: bs.quantity * bs.price
          }));
          
          const totalServicesAmount = invoiceServices.reduce((sum, s) => sum + s.amount, 0);
          const totalAmount = roomCost + totalServicesAmount;

          const newInvoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'> = {
            bookingId: String(booking.id),
            customerId: booking.customerId,
            customerName: booking.customerName,
            roomId: String(booking.roomId),
            roomNumber: booking.roomNumber,
            checkInDate: booking.checkIn,
            checkOutDate: booking.checkOut,
            totalAmount: totalAmount,
            paidAmount: 0,
            paymentStatus: 'unpaid',
            invoiceDate: new Date().toISOString(), // Use current date
            services: invoiceServices 
          };
          return createInvoice(newInvoice);
        });

        const newInvoices = await Promise.all(creationPromises);
        toast.success(`Đã tự động tạo ${newInvoices.length} hóa đơn mới cho các đặt phòng đã trả phòng.`);
        // Refetch invoices to get the final list
        const updatedInvoices = await getInvoices();
        setInvoices(updatedInvoices);
      } else {
        setInvoices(invoicesData);
      }

      setError(null);
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || "Lỗi kết nối đến máy chủ.";
      setError(errorMessage);
      toast.error(`Không thể xử lý dữ liệu: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndProcessData()
  }, [fetchAndProcessData])

  // Revenue calculation functions
  const getTotalRevenue = () => {
    return invoices.reduce((total, invoice) => total + invoice.totalAmount, 0)
  }
  
  const getPaidInvoicesCount = () => {
    return invoices.filter(invoice => invoice.paymentStatus === 'paid').length
  }
  
  const getPendingInvoicesCount = () => {
    return invoices.filter(invoice => invoice.paymentStatus !== 'paid').length
  }
  
  const getAverageInvoiceValue = () => {
    const totalRevenue = getTotalRevenue()
    return invoices.length > 0 ? totalRevenue / invoices.length : 0
  }
  
  const getTotalPaidRevenue = () => {
    return invoices
      .filter(invoice => invoice.paymentStatus === 'paid')
      .reduce((total, invoice) => total + invoice.totalAmount, 0)
  }
  
  const getRevenueGrowthPercentage = () => {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const currentYear = currentDate.getFullYear()
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear
    
    const isFromMonth = (dateString: string, month: number, year: number) => {
      const date = new Date(dateString)
      return date.getMonth() === month && date.getFullYear() === year
    }
    
    const currentMonthInvoices = invoices.filter(invoice => 
      isFromMonth(invoice.invoiceDate, currentMonth, currentYear)
    )
    
    const previousMonthInvoices = invoices.filter(invoice => 
      isFromMonth(invoice.invoiceDate, previousMonth, previousYear)
    )
    
    const currentMonthTotal = currentMonthInvoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0)
    const previousMonthTotal = previousMonthInvoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0)
    
    if (previousMonthTotal === 0) return currentMonthTotal > 0 ? 100 : 0
    
    const growthPercentage = ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100
    return Math.round(growthPercentage)
  }
  
  const getCurrentMonthInvoiceCount = () => {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()
    
    return invoices.filter(invoice => {
      const date = new Date(invoice.invoiceDate)
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear
    }).length
  }

  const handleAddInvoice = () => {
    fetchAndProcessData();
  }

  const handleDeleteInvoice = async () => {
    if (selectedInvoice && selectedInvoice.id) {
      try {
        await deleteInvoice(selectedInvoice.id);
        toast.success(`Đã xóa hóa đơn ${selectedInvoice.id}.`);
        fetchAndProcessData(); // Refetch invoices after deletion
        setIsDeleteDialogOpen(false);
      } catch (error) {
        toast.error("Xóa hóa đơn thất bại.");
        console.error("Error deleting invoice:", error);
      }
    }
  };

  const openPrintDialog = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsPrintDialogOpen(true)
  }

  const openDeleteDialog = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setIsDeleteDialogOpen(true)
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(invoices.map(invoice => ({
      "Mã Hóa Đơn": invoice.id,
      "Tên Khách Hàng": invoice.customerName,
      "Ngày Tạo": formatDate(invoice.invoiceDate),
      "Tổng Tiền": invoice.totalAmount,
      "Trạng Thái": invoice.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Hóa Đơn");
    XLSX.writeFile(workbook, "DanhSachHoaDon.xlsx");
  }

  const filteredInvoices = invoices.filter(invoice => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    
    const customerName = invoice.customerName || "";

    return (
      String(invoice.id).toLowerCase().includes(query) ||
      customerName.toLowerCase().includes(query) ||
      String(invoice.bookingId).toLowerCase().includes(query)
    );
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
  }
  
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  if (loading) {
    return <div className="flex items-center justify-center h-full"><Spinner size="large" /></div>
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10"><p>Đã xảy ra lỗi: {error}</p></div>
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
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
        
        {/* <div className="bg-white rounded-lg shadow p-4 flex-1">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Doanh thu trung bình/hóa đơn</h3>
          <p className="text-3xl font-bold text-blue-600">
            {formatCurrency(getAverageInvoiceValue())}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            <span className={getRevenueGrowthPercentage() >= 0 ? 'text-green-500' : 'text-red-500'}>
              {getRevenueGrowthPercentage() >= 0 ? '+' : ''}{getRevenueGrowthPercentage()}%
            </span> so với tháng trước
          </p>
        </div> */}
      </div>
      
      <div className="flex-grow container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm theo tên khách hoặc mã HĐ..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-80"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center gap-2">
              <Button 
                className="bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center gap-2"
                onClick={exportToExcel}
              >
                <FileDown size={18} />
                Xuất Excel
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                onClick={() => setIsAddDialogOpen(true)}
              >
                Tạo hóa đơn
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã Hóa Đơn</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách Hàng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày Tạo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng Tiền</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{invoice.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{invoice.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(invoice.invoiceDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-semibold">{formatCurrency(invoice.totalAmount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        invoice.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {invoice.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="ghost" className="text-gray-500 hover:text-blue-600" onClick={() => openPrintDialog(invoice)}>
                        <Printer size={16} />
                      </Button>
                      <Button variant="ghost" className="text-gray-500 hover:text-red-600" onClick={() => openDeleteDialog(invoice)}>
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      Không tìm thấy hóa đơn nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isAddDialogOpen && (
        <NewInvoiceDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSave={handleAddInvoice}
        />
      )}
      
      {isPrintDialogOpen && selectedInvoice && (
        <InvoicePrint
          invoice={selectedInvoice}
          isOpen={isPrintDialogOpen}
          onClose={() => setIsPrintDialogOpen(false)}
        />
      )}

      {isDeleteDialogOpen && selectedInvoice && (
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDeleteInvoice}
          title="Xác nhận xóa hóa đơn"
          description={`Bạn có chắc chắn muốn xóa hóa đơn ${selectedInvoice.id}? Thao tác này không thể hoàn tác.`}
        />
      )}
    </div>
  )
} 