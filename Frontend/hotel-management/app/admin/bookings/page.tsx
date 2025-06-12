"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Info, Trash2, PlusCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { getBookings, deleteBooking, Booking } from "@/lib/booking-service"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { BookingDetailsDialog } from "@/components/booking-details-dialog"
import { NewBookingForm } from "@/components/booking-form/new-booking-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function AdminBookingsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true)
      const bookingsData = await getBookings()
      setBookings(bookingsData)
      setError(null)
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || "Lỗi kết nối đến máy chủ."
      setError(errorMessage)
      toast.error(`Không thể tải dữ liệu: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  const handleDelete = async () => {
    if (!selectedBooking) return
    try {
      await deleteBooking(selectedBooking.id)
      toast.success(`Đã xóa đặt phòng ${selectedBooking.bookingCode}.`)
      fetchAllData()
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || "Đã có lỗi xảy ra."
      toast.error(`Xóa đặt phòng thất bại: ${errorMessage}`)
    } finally {
      setIsDeleteDialogOpen(false)
    }
  }

  const openDetailsDialog = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsDetailsDialogOpen(true)
  }

  const openDeleteDialog = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsDeleteDialogOpen(true)
  }

  const handleEditFromDetails = () => {
    if (!selectedBooking) return;
    setIsDetailsDialogOpen(false);
    toast.info("Chức năng sửa đang được phát triển.")
  }

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return "N/A";
    }
    return new Intl.NumberFormat('vi-VN').format(amount);
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString('vi-VN');
  };

  const filteredBookings = bookings.filter(b => {
    const query = searchQuery.toLowerCase();
    return (b.roomNumber && b.roomNumber.toLowerCase().includes(query)) ||
    (b.roomTypeName && b.roomTypeName.toLowerCase().includes(query))
  });

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Spinner size="large" /></div>
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10"><p>Đã xảy ra lỗi: {error}</p></div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Quản lý Đặt phòng</h1>
        <p className="text-gray-600">Thêm, sửa, xóa và quản lý các đặt phòng của khách sạn</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm theo phòng, mã đặt phòng..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            onClick={() => setIsFormOpen(true)}
          >
            <PlusCircle size={18} />
            Thêm đặt phòng
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã Đặt phòng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phòng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
              
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.bookingCode}</div>
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{booking.roomNumber}</div>
                    <div className="text-sm text-gray-500">{booking.roomTypeName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Nhận: {formatDate(booking.checkIn)}</div>
                    <div className="text-sm text-gray-500">Trả: {formatDate(booking.checkOut)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                       booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                       booking.status === 'CheckedIn' ? 'bg-blue-100 text-blue-800' :
                       booking.status === 'CheckedOut' ? 'bg-gray-100 text-gray-800' :
                       booking.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                       'bg-yellow-100 text-yellow-800'
                     }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="ghost" className="text-blue-600 hover:text-blue-900" onClick={() => openDetailsDialog(booking)}>
                      <Info size={16} />
                    </Button>
                    <Button variant="ghost" className="text-red-600 hover:text-red-900" onClick={() => openDeleteDialog(booking)}>
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredBookings.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    Không tìm thấy đặt phòng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Tạo Đặt phòng mới</DialogTitle>
          </DialogHeader>
          <NewBookingForm
            onSaveSuccess={() => {
              setIsFormOpen(false)
              fetchAllData()
            }}
          />
        </DialogContent>
      </Dialog>

      {isDetailsDialogOpen && selectedBooking && (
        <BookingDetailsDialog
          isOpen={isDetailsDialogOpen}
          onClose={() => setIsDetailsDialogOpen(false)}
          onEdit={handleEditFromDetails}
          onBookingUpdate={fetchAllData}
          booking={selectedBooking}
          roomName={selectedBooking.roomNumber}
        />
      )}

      {isDeleteDialogOpen && selectedBooking && (
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
          title={`Xác nhận xóa Đặt phòng ${selectedBooking.bookingCode}`}
          description="Bạn có chắc chắn muốn xóa đặt phòng này không? Hành động này không thể hoàn tác."
        />
      )}
    </div>
  )
} 