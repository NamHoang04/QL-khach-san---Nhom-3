"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Info, Trash2, PlusCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { getBookings, deleteBooking, Booking, BookingUpsertDTO, createBooking, updateBooking } from "@/lib/booking-service"
import { Room, getRooms } from "@/lib/room-service"
import { DeleteConfirmationDialog } from "@/components/delete-confirmation-dialog"
import { BookingDialog } from "@/components/booking-dialog"
import { BookingDetailsDialog } from "@/components/booking-details-dialog"

export default function AdminBookingsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBookingsAndRooms = useCallback(async () => {
    try {
      setLoading(true)
      const [bookingsData, roomsData] = await Promise.all([
        getBookings(),
        getRooms(),
      ])
      setBookings(bookingsData)
      setRooms(roomsData)
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
    fetchBookingsAndRooms()
  }, [fetchBookingsAndRooms])

  const handleSave = async (data: BookingUpsertDTO) => {
    try {
      if (selectedBooking) {
        await updateBooking(selectedBooking.id, data)
        toast.success(`Đã cập nhật đặt phòng ${selectedBooking.bookingCode}.`)
      } else {
        await createBooking(data)
        toast.success(`Đã tạo đặt phòng mới.`)
      }
      fetchBookingsAndRooms()
      setIsDialogOpen(false)
    } catch (err: any) {
        const errorMessage = err?.data?.message || err?.message || "Đã có lỗi xảy ra."
        toast.error(`Lưu đặt phòng thất bại: ${errorMessage}`)
    }
  }

  const handleDelete = async () => {
    if (!selectedBooking) return
    try {
      await deleteBooking(selectedBooking.id)
      toast.success(`Đã xóa đặt phòng ${selectedBooking.bookingCode}.`)
      fetchBookingsAndRooms()
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || "Đã có lỗi xảy ra."
      toast.error(`Xóa đặt phòng thất bại: ${errorMessage}`)
    } finally {
      setIsDeleteDialogOpen(false)
    }
  }

  const openEditDialog = (booking: Booking | null = null) => {
    setSelectedBooking(booking)
    setIsDialogOpen(true)
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
    openEditDialog(selectedBooking);
  }

  const getRoomName = (roomId: number) => {
    const room = rooms.find(r => String(r.id) === String(roomId));
    return room ? room.roomNumber : `Phòng ${roomId}`;
  };
  
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

  const filteredBookings = bookings.filter(b =>
    b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h1 className="text-3xl font-bold">Quản lý Đặt phòng</h1>
        <p className="text-gray-600">Thêm, sửa, xóa và quản lý các đặt phòng của khách sạn</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm theo tên khách hoặc mã..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            onClick={() => openEditDialog()}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
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
                    <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{getRoomName(booking.roomId)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">Nhận: {formatDate(booking.checkIn)}</div>
                    <div className="text-sm text-gray-500">Trả: {formatDate(booking.checkOut)}</div>
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(booking.totalPrice)}</div>
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap">
                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
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
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    Không tìm thấy đặt phòng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isDialogOpen && (
        <BookingDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSave}
          booking={selectedBooking}
          rooms={rooms}
        />
      )}

      {isDetailsDialogOpen && selectedBooking && (
        <BookingDetailsDialog
          isOpen={isDetailsDialogOpen}
          onClose={() => setIsDetailsDialogOpen(false)}
          onEdit={handleEditFromDetails}
          booking={selectedBooking}
          roomName={getRoomName(selectedBooking.roomId)}
        />
      )}

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Xác nhận xóa đặt phòng"
        description={`Bạn có chắc chắn muốn xóa đặt phòng ${selectedBooking?.bookingCode}?`}
      />
    </div>
  )
} 