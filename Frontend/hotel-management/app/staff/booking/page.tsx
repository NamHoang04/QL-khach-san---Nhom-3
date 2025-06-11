"use client"

import { useState, useEffect } from "react"
import { NewBookingDialog } from "@/components/new-booking-dialog"
import { EditBookingDialog } from "@/components/edit-booking-dialog"
import { Booking, createBooking, deleteBooking, getBookings, updateBooking, BookingUpsertDTO } from "@/lib/booking-service"
import { createBookingService } from "@/lib/booking-service-service"
import { format } from "date-fns"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { AuthGuard } from "@/components/auth-guard"
import { CustomerData, getCustomers, createCustomer, CustomerUpsertDTO } from "@/lib/customer-service"
import { useAuth } from "@/lib/auth-context"

// This is a local interface for the booking form data, which is different from the API's Booking DTO
interface BookingFormData {
  id?: string;
  customerName: string;
  phone: string;
  email: string;
  checkInDate: string;
  checkOutDate: string;
  advancePayment: number;
  agreedPrice: number;
  note: string;
  roomId: string; 
  status: string;
  services?: {
    serviceId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
}

export default function StaffBookingPage() {
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth();
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
          String(booking.id).toLowerCase().includes(term) ||
          (booking.customerEmail?.toLowerCase() || "").includes(term)
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
  
const handleSaveBooking = async (formData: BookingFormData) => {
    if (!user || !user.id) {
        toast.error("Bạn phải đăng nhập để thực hiện chức năng này.");
        throw new Error("User not authenticated");
    }

    try {
        let customer: CustomerData | undefined;
        const allCustomers = await getCustomers(); 
        customer = allCustomers.find(c => c.phone === formData.phone);
        
        if (!customer) {
            toast.info("Tạo khách hàng mới...");
            const newCustomerData: CustomerUpsertDTO = { 
                customerCode: `CUST-${Date.now()}`,
                userName: formData.customerName, 
                phone: formData.phone, 
                email: formData.email,
            };
            customer = await createCustomer(newCustomerData);
            toast.success("Đã tạo khách hàng mới thành công!");
        }

        if (!customer || !customer.id) {
            throw new Error("Không thể xác định hoặc tạo khách hàng.");
        }

        const bookingToSave: BookingUpsertDTO = {
            checkIn: formData.checkInDate,
            checkOut: formData.checkOutDate,
            numberOfAdults: 2, 
            numberOfChildren: 0,
            totalPrice: formData.agreedPrice,
            status: formData.status,
            note: formData.note,
            customerId: customer.id,
            staffId: user.id.toString(),
            roomId: parseInt(formData.roomId),
        };

      const newBooking = await createBooking(bookingToSave);
      
      if (newBooking.id && formData.services && formData.services.length > 0) {
        for (const service of formData.services) {
          await createBookingService({
            bookingId: String(newBooking.id),
            serviceId: service.serviceId,
            quantity: service.quantity,
            price: service.price
          })
        }
      }
      
      fetchBookings()
    } catch (error) {
      toast.error("Lỗi khi tạo đặt phòng. Vui lòng thử lại.")
      console.error("Error creating booking:", error)
      throw error;
    }
  }
  
  const handleEditBooking = async (booking: Partial<BookingUpsertDTO>) => {
    if (!selectedBooking?.id) return;
    await updateBooking(selectedBooking.id, booking);
    toast.success("Đã cập nhật đặt phòng thành công!");
    fetchBookings();
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
  
  const openEditDialog = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsEditDialogOpen(true)
  }
  
  const openDeleteDialog = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsDeleteDialogOpen(true)
  }
  
  // Pagination
  const indexOfLastBooking = currentPage * bookingsPerPage
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking)
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage)
  
  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
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
      case "checkedin":
         return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Đã nhận phòng
          </Badge>
        )
      case "checkedout":
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            Đã trả phòng
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            Đã hủy
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
                      Phòng
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
                        <div className="text-sm font-medium text-gray-900">{booking.bookingCode}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.customerName}</div>
                        <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(booking.checkIn)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(booking.checkOut)}</div>
                      </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{booking.roomName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderStatusBadge(booking.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(booking)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteDialog(booking)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination Controls */}
          <div className="mt-4 flex justify-end">
            <nav className="flex items-center space-x-2">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                variant="outline"
              >
                Trước
              </Button>
              <span className="text-sm">
                Trang {currentPage} / {totalPages}
              </span>
              <Button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                variant="outline"
              >
                Sau
              </Button>
            </nav>
          </div>
        </div>

        <NewBookingDialog
          open={isBookingDialogOpen}
          onOpenChange={setIsBookingDialogOpen}
          onSave={handleSaveBooking}
        />
        
        {selectedBooking && (
          <EditBookingDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSave={handleEditBooking}
            booking={selectedBooking}
          />
        )}
        
        {selectedBooking && (
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc chắn muốn xóa đặt phòng này không? Hành động này không thể được hoàn tác.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteBooking}>Xóa</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )}
      </div>
    </AuthGuard>
  )
}
