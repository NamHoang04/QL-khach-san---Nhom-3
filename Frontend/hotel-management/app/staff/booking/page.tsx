"use client"

import { useState, useEffect } from "react"
import { NewBookingDialog } from "@/components/new-booking-dialog"
import { EditBookingDialog } from "@/components/edit-booking-dialog"
import { BookingData, createBooking, deleteBooking, getBookings, updateBooking } from "@/lib/booking-service"
import { format } from "date-fns"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { AuthGuard } from "@/components/auth-guard"

export default function StaffBookingPage() {
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [bookings, setBookings] = useState<BookingData[]>([])
  const [filteredBookings, setFilteredBookings] = useState<BookingData[]>([])
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const bookingsPerPage = 5

  // Fetch bookings
  useEffect(() => {
    fetchBookings()
  }, [])

  // Filter bookings when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredBookings(bookings)
    } else {
      const term = searchTerm.toLowerCase()
      const filtered = bookings.filter(
        (booking) =>
          booking.customerName.toLowerCase().includes(term) ||
          booking.id?.toLowerCase().includes(term) ||
          booking.phone.toLowerCase().includes(term) ||
          (booking.email?.toLowerCase() || "").includes(term)
      )
      setFilteredBookings(filtered)
    }
  }, [searchTerm, bookings])

  const fetchBookings = async () => {
    setIsLoading(true)
    try {
      const data = await getBookings()
      setBookings(data)
      setFilteredBookings(data)
    } catch (error) {
      toast.error("Không thể tải dữ liệu đặt phòng")
      console.error("Error fetching bookings:", error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleSaveBooking = async (booking: BookingData) => {
    try {
      await createBooking(booking)
      fetchBookings()
      toast.success("Đã tạo đặt phòng thành công!")
    } catch (error) {
      toast.error("Lỗi khi tạo đặt phòng")
      console.error("Error creating booking:", error)
    }
  }
  
  const handleEditBooking = async (booking: BookingData) => {
    if (!booking.id) return
    
    try {
      await updateBooking(booking.id, booking)
      fetchBookings()
      toast.success("Đã cập nhật đặt phòng thành công!")
    } catch (error) {
      toast.error("Lỗi khi cập nhật đặt phòng")
      console.error("Error updating booking:", error)
    }
  }
  
  const handleDeleteBooking = async () => {
    if (!selectedBooking?.id) return
    
    try {
      await deleteBooking(selectedBooking.id)
      fetchBookings()
      setIsDeleteDialogOpen(false)
      toast.success("Đã xóa đặt phòng thành công!")
    } catch (error) {
      toast.error("Lỗi khi xóa đặt phòng")
      console.error("Error deleting booking:", error)
    }
  }
  
  const openEditDialog = (booking: BookingData) => {
    setSelectedBooking(booking)
    setIsEditDialogOpen(true)
  }
  
  const openDeleteDialog = (booking: BookingData) => {
    setSelectedBooking(booking)
    setIsDeleteDialogOpen(true)
  }
  
  // Pagination
  const indexOfLastBooking = currentPage * bookingsPerPage
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking)
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage)
  
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            Chờ xác nhận
          </Badge>
        )
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Đã xác nhận
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Đã hủy
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Đã hoàn thành
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            {status}
          </Badge>
        )
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy")
    } catch (error) {
      return dateString
    }
  }

  return (
    <AuthGuard requiredRole="staff">
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Quản lý Đặt phòng</h1>
          <p className="text-gray-600">Xem và quản lý danh sách đặt phòng</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm đặt phòng..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div>
              <button 
                onClick={() => setIsBookingDialogOpen(true)}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Tạo đặt phòng mới
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {isLoading ? (
              <div className="text-center py-10">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Đang tải dữ liệu...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500">Không có dữ liệu đặt phòng</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mã đặt phòng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày check-in
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày check-out
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loại phòng
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
                  {currentBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{booking.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.customerName}</div>
                        <div className="text-sm text-gray-500">{booking.email || booking.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(booking.checkInDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(booking.checkOutDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.roomType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStatusBadge(booking.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          className="text-blue-600 hover:text-blue-900 mr-3"
                          onClick={() => openEditDialog(booking)}
                        >
                          Chỉnh sửa
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => openDeleteDialog(booking)}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          {/* Pagination */}
          {filteredBookings.length > 0 && (
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Hiển thị <span className="font-medium">{indexOfFirstBooking + 1}</span> đến{" "}
                <span className="font-medium">
                  {Math.min(indexOfLastBooking, filteredBookings.length)}
                </span>{" "}
                của <span className="font-medium">{filteredBookings.length}</span> kết quả
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage((old) => Math.max(old - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded text-sm ${
                    currentPage === 1
                      ? "border text-gray-400 cursor-not-allowed"
                      : "border hover:bg-gray-100"
                  }`}
                >
                  Trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded text-sm ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "border hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((old) => Math.min(old + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded text-sm ${
                    currentPage === totalPages
                      ? "border text-gray-400 cursor-not-allowed"
                      : "border hover:bg-gray-100"
                  }`}
                >
                  Tiếp
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Dialog components */}      
        <NewBookingDialog
          open={isBookingDialogOpen}
          onOpenChange={setIsBookingDialogOpen}
          onSave={handleSaveBooking}
        />
        
        <EditBookingDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSave={handleEditBooking}
          booking={selectedBooking}
        />
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xóa đặt phòng này không? Thao tác này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteBooking}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AuthGuard>
  )
}
