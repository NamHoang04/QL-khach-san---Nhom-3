"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { get, put } from "@/lib/api-service"
import { shouldUseMockData } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { format } from "date-fns"
import { 
  CreditCard, 
  Building, 
  Calendar, 
  Banknote, 
  ArrowLeft,
  Receipt,
  Hotel,
  User,
  Phone,
  Mail,
  Loader2,
  CheckCircle2
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface Service {
  id: number
  name: string
  price: number
  quantity: number
  childQuantity?: number
  totalPrice: number
}

interface InvoiceDetail {
  id: number
  invoiceCode: string
  customerId: number
  customerName: string
  customerPhone: string
  customerEmail: string
  bookingId: number
  bookingCode: string
  roomNumber: string
  roomType: string
  checkIn: string
  checkOut: string
  createdAt: string
  totalAmount: number
  status: string
  paymentMethod?: string
  notes?: string
  services?: Service[]
  roomPrice?: number
  servicesPrice?: number
}

export default function InvoiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const invoiceId = params.id as string
  
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [processing, setProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [cardInfo, setCardInfo] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  })
  
  useEffect(() => {
    const fetchInvoiceDetails = async () => {
      try {
        setLoading(true)
        
        // First, check localStorage for invoice with this ID
        const allInvoices = JSON.parse(localStorage.getItem("invoices") || "[]");
        const localInvoice = allInvoices.find((inv: any) => inv.id.toString() === invoiceId);
        
        // Also check for pendingPayment that might contain this invoice
        const pendingPaymentString = localStorage.getItem("pendingPayment");
        let pendingPayment = null;
        if (pendingPaymentString) {
          try {
            pendingPayment = JSON.parse(pendingPaymentString);
            // Check if this payment matches the requested invoice
            if (pendingPayment.bookingId.toString() === invoiceId) {
              // Calculate services total
              const serviceItems = pendingPayment.services || [];
              const serviceTotal = serviceItems.reduce((sum: number, service: Service) => sum + service.totalPrice, 0);
              
              // Create invoice from pendingPayment
              const invoiceFromPayment: InvoiceDetail = {
                id: parseInt(invoiceId),
                invoiceCode: `INV${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`,
                customerId: 1,
                customerName: "Khách hàng",
                customerPhone: localStorage.getItem("user_phone") || "0901234567",
                customerEmail: localStorage.getItem("user_email") || "customer@example.com",
                bookingId: pendingPayment.bookingId,
                bookingCode: pendingPayment.bookingCode,
                roomNumber: "Chờ xác nhận",
                roomType: pendingPayment.roomName,
                checkIn: pendingPayment.checkInDate,
                checkOut: pendingPayment.checkOutDate,
                createdAt: pendingPayment.created,
                totalAmount: pendingPayment.totalPrice + serviceTotal,
                roomPrice: pendingPayment.totalPrice,
                servicesPrice: serviceTotal,
                services: pendingPayment.services,
                status: "Pending",
                paymentMethod: undefined,
                notes: pendingPayment.services && pendingPayment.services.length > 0
                  ? `Bao gồm ${pendingPayment.services.length} dịch vụ đi kèm`
                  : undefined
              };
              
              setInvoice(invoiceFromPayment);
              setLoading(false);
              return;
            }
          } catch (error) {
            console.error("Error parsing pending payment:", error);
          }
        }
        
        // If we found a local invoice, use that
        if (localInvoice) {
          setInvoice(localInvoice);
          setLoading(false);
          return;
        }
        
        if (shouldUseMockData()) {
          // Mock data
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          const mockInvoice: InvoiceDetail = {
            id: parseInt(invoiceId),
            invoiceCode: `INV000${invoiceId}`,
            customerId: 1,
            customerName: "Nguyễn Văn A",
            customerPhone: "0901234567",
            customerEmail: "nguyenvana@example.com",
            bookingId: parseInt(invoiceId),
            bookingCode: `BK000${invoiceId}`,
            roomNumber: "101",
            roomType: "Deluxe King",
            checkIn: "2023-12-01T14:00:00",
            checkOut: "2023-12-05T12:00:00",
            createdAt: "2023-11-25T10:30:00",
            totalAmount: 2000000,
            roomPrice: 1800000,
            servicesPrice: 200000,
            status: parseInt(invoiceId) % 2 === 0 ? "Pending" : "Paid",
            paymentMethod: parseInt(invoiceId) % 2 === 0 ? undefined : "Credit Card",
            notes: "Bao gồm ăn sáng",
            services: [
              {
                id: 1,
                name: "Buffet sáng",
                price: 100000,
                quantity: 2,
                totalPrice: 200000
              }
            ]
          }
          
          setInvoice(mockInvoice)
        } else {
          // Real API call
          const data = await get<InvoiceDetail>(`Invoices/${invoiceId}`)
          setInvoice(data)
        }
      } catch (err) {
        console.error("Error fetching invoice details:", err)
        setError("Không thể tải thông tin hóa đơn. Vui lòng thử lại sau.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchInvoiceDetails()
  }, [invoiceId])
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy')
  }
  
  // Format time for display
  const formatDateTime = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm')
  }
  
  // Format price as VND
  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + ' ₫'
  }
  
  // Calculate number of nights
  const calculateNights = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }
  
  const handleCardInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCardInfo(prev => ({ ...prev, [name]: value }))
  }
  
  const handlePayment = async () => {
    if (!invoice) return
    
    // Basic validation
    if (paymentMethod === 'credit-card') {
      if (!cardInfo.cardName.trim()) {
        toast.error("Vui lòng nhập tên chủ thẻ")
        return
      }
      
      if (!cardInfo.cardNumber.trim() || cardInfo.cardNumber.replace(/\s/g, '').length < 15) {
        toast.error("Số thẻ không hợp lệ")
        return
      }
      
      if (!cardInfo.expiryDate.trim() || !/^\d{2}\/\d{2}$/.test(cardInfo.expiryDate)) {
        toast.error("Ngày hết hạn không hợp lệ")
        return
      }
      
      if (!cardInfo.cvv.trim() || !/^\d{3,4}$/.test(cardInfo.cvv)) {
        toast.error("Mã CVV không hợp lệ")
        return
      }
    }
    
    try {
      setProcessing(true)
      
      if (shouldUseMockData()) {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        // Update local state
        const updatedInvoice = {
          ...invoice,
          status: "Paid",
          paymentMethod: paymentMethod === 'credit-card' ? 'Credit Card' : 'Bank Transfer'
        };
        setInvoice(updatedInvoice)
        
        // Update invoice in localStorage if it exists
        const allInvoices = JSON.parse(localStorage.getItem("invoices") || "[]");
        const updatedInvoices = allInvoices.map((inv: any) => 
          inv.id.toString() === invoiceId ? updatedInvoice : inv
        );
        
        // If not in the list, add it
        if (!allInvoices.some((inv: any) => inv.id.toString() === invoiceId)) {
          updatedInvoices.push(updatedInvoice);
        }
        
        localStorage.setItem("invoices", JSON.stringify(updatedInvoices));
        
        // Clear pendingPayment if this invoice was from there
        const pendingPaymentString = localStorage.getItem("pendingPayment");
        if (pendingPaymentString) {
          const pendingPayment = JSON.parse(pendingPaymentString);
          if (pendingPayment.bookingId.toString() === invoiceId) {
            localStorage.removeItem("pendingPayment");
          }
        }
        
        setShowSuccess(true)
      } else {
        // Call API to update invoice status
        await put(`Invoices/${invoice.id}/status`, {
          status: "Paid",
          paymentMethod: paymentMethod === 'credit-card' ? 'Credit Card' : 'Bank Transfer'
        })
        
        // Fetch updated invoice
        const updatedInvoice = await get<InvoiceDetail>(`Invoices/${invoiceId}`)
        setInvoice(updatedInvoice)
        
        // Clear pendingPayment if necessary
        const pendingPaymentString = localStorage.getItem("pendingPayment");
        if (pendingPaymentString) {
          const pendingPayment = JSON.parse(pendingPaymentString);
          if (pendingPayment.bookingId.toString() === invoiceId) {
            localStorage.removeItem("pendingPayment");
          }
        }
        
        setShowSuccess(true)
      }
    } catch (err) {
      console.error("Error processing payment:", err)
      toast.error("Lỗi xử lý thanh toán. Vui lòng thử lại sau.")
    } finally {
      setProcessing(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
        <span className="ml-2 text-gray-600">Đang tải thông tin hóa đơn...</span>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
        {error}
      </div>
    )
  }
  
  if (!invoice) {
    return (
      <div className="bg-yellow-50 text-yellow-600 p-4 rounded-lg text-center">
        Không tìm thấy thông tin hóa đơn
      </div>
    )
  }
  
  if (showSuccess) {
    return (
      <div className="container max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <Link href="/customer/payments" className="text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-4 h-4 mr-1 inline" />
            Quay lại
          </Link>
        </div>
        
        <div className="bg-green-50 rounded-lg p-8 text-center border border-green-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-green-800 mb-2">Thanh toán thành công</h2>
          <p className="text-green-700 mb-6">Hóa đơn #{invoice.invoiceCode} đã được thanh toán thành công</p>
          
          <div className="bg-white rounded-lg p-4 mb-6 text-left">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Mã hóa đơn</div>
                <div className="font-medium">{invoice.invoiceCode}</div>
              </div>
              <div>
                <div className="text-gray-500">Số tiền</div>
                <div className="font-medium">{formatPrice(invoice.totalAmount)}</div>
              </div>
              <div>
                <div className="text-gray-500">Phương thức</div>
                <div className="font-medium">{invoice.paymentMethod}</div>
              </div>
              <div>
                <div className="text-gray-500">Ngày thanh toán</div>
                <div className="font-medium">{formatDateTime(new Date().toISOString())}</div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-4">
            <Link href="/customer/bookings">
              <Button variant="outline">
                Xem đặt phòng
              </Button>
            </Link>
            <Link href="/customer/payments">
              <Button>
                Xem danh sách thanh toán
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Link href="/customer/payments" className="text-blue-600 hover:text-blue-800">
          <ArrowLeft className="w-4 h-4 mr-1 inline" />
          Quay lại
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-2">Chi tiết hóa đơn</h1>
      <p className="text-gray-500 mb-6">
        <Receipt className="w-4 h-4 inline mr-1" />
        Hóa đơn #{invoice.invoiceCode}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Invoice Information */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin hóa đơn</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Mã hóa đơn</div>
                <div className="font-medium">{invoice.invoiceCode}</div>
              </div>
              <div>
                <div className="text-gray-500">Ngày tạo</div>
                <div className="font-medium">{formatDateTime(invoice.createdAt)}</div>
              </div>
              <div>
                <div className="text-gray-500">Tổng tiền</div>
                <div className="font-medium text-lg">{formatPrice(invoice.totalAmount)}</div>
              </div>
              <div>
                <div className="text-gray-500">Trạng thái</div>
                <div className="font-medium">
                  {invoice.status === 'Paid' ? (
                    <span className="text-green-600">{invoice.status}</span>
                  ) : (
                    <span className="text-yellow-600">{invoice.status}</span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin khách hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2 text-gray-500" />
              <div>
                <div className="text-gray-500 text-sm">Tên khách hàng</div>
                <div className="font-medium">{invoice.customerName}</div>
              </div>
            </div>
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2 text-gray-500" />
              <div>
                <div className="text-gray-500 text-sm">Số điện thoại</div>
                <div className="font-medium">{invoice.customerPhone || 'N/A'}</div>
              </div>
            </div>
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-gray-500" />
              <div>
                <div className="text-gray-500 text-sm">Email</div>
                <div className="font-medium">{invoice.customerEmail || 'N/A'}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Booking Details */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Chi tiết đặt phòng</CardTitle>
          <CardDescription>Mã đặt phòng: {invoice.bookingCode}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-start">
                <Hotel className="w-5 h-5 mr-2 text-gray-500 mt-0.5" />
                <div>
                  <div className="text-gray-500 text-sm">Phòng</div>
                  <div className="font-medium">{invoice.roomType}</div>
                  <div className="text-sm text-gray-500">Phòng số {invoice.roomNumber}</div>
                </div>
              </div>
              
              <div className="flex items-start">
                <Calendar className="w-5 h-5 mr-2 text-gray-500 mt-0.5" />
                <div>
                  <div className="text-gray-500 text-sm">Thời gian lưu trú</div>
                  <div className="font-medium">
                    {formatDate(invoice.checkIn)} - {formatDate(invoice.checkOut)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {calculateNights(invoice.checkIn, invoice.checkOut)} đêm
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-gray-500 text-sm mb-2">Chi tiết thanh toán</div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Tiền phòng</span>
                  <span>{formatPrice(invoice.roomPrice || (invoice.totalAmount - (invoice.servicesPrice || 0)))}</span>
                </div>
                {invoice.services && invoice.services.length > 0 && (
                  <div className="flex justify-between">
                    <span>Dịch vụ đi kèm ({invoice.services.length} dịch vụ)</span>
                    <span className="font-medium">{formatPrice(invoice.servicesPrice || 0)}</span>
                  </div>
                )}
                <div className="border-t pt-2 font-medium flex justify-between">
                  <span>Thuế và phí dịch vụ</span>
                  <span className="font-medium">{formatPrice(invoice.totalAmount * 0.1)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-medium">Tổng cộng</span>
                  <span className="font-bold text-xl">{formatPrice(invoice.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Services section */}
      {invoice.services && invoice.services.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Dịch vụ đi kèm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left pb-2">Tên dịch vụ</th>
                    <th className="text-center pb-2">Số lượng</th>
                    <th className="text-right pb-2">Giá</th>
                    <th className="text-right pb-2">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.services.map((service, index) => (
                    <tr key={index} className="border-b border-gray-100 last:border-0">
                      <td className="py-2">{service.name}</td>
                      <td className="py-2 text-center">{service.quantity}</td>
                      <td className="py-2 text-right">{formatPrice(service.price)}</td>
                      <td className="py-2 text-right font-medium">{formatPrice(service.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Payment Section (only for pending invoices) */}
      {invoice.status === 'Pending' && (
        <Card>
          <CardHeader>
            <CardTitle>Thanh toán</CardTitle>
            <CardDescription>
              Chọn phương thức thanh toán để hoàn tất đặt phòng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              value={paymentMethod} 
              onValueChange={setPaymentMethod}
              className="mb-4"
            >
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="credit-card" id="credit-card" />
                <Label htmlFor="credit-card" className="flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Thẻ tín dụng/ghi nợ
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                <Label htmlFor="bank-transfer" className="flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  Chuyển khoản ngân hàng
                </Label>
              </div>
            </RadioGroup>
            
            {paymentMethod === 'credit-card' && (
              <div className="space-y-4 border-t pt-4">
                <div className="space-y-2">
                  <Label htmlFor="cardName">Tên chủ thẻ</Label>
                  <Input
                    id="cardName"
                    name="cardName"
                    value={cardInfo.cardName}
                    onChange={handleCardInfoChange}
                    placeholder="Nguyen Van A"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Số thẻ</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    value={cardInfo.cardNumber}
                    onChange={handleCardInfoChange}
                    placeholder="4111 1111 1111 1111"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Ngày hết hạn (MM/YY)</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      value={cardInfo.expiryDate}
                      onChange={handleCardInfoChange}
                      placeholder="05/25"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cvv">Mã CVV</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      value={cardInfo.cvv}
                      onChange={handleCardInfoChange}
                      placeholder="123"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {paymentMethod === 'bank-transfer' && (
              <div className="space-y-4 border-t pt-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">Thông tin chuyển khoản</h3>
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-3">
                      <span className="text-gray-500">Ngân hàng:</span>
                      <span className="col-span-2 font-medium">BIDV - Ngân hàng Đầu tư và Phát triển Việt Nam</span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="text-gray-500">Số tài khoản:</span>
                      <span className="col-span-2 font-medium">001234567890</span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="text-gray-500">Chủ tài khoản:</span>
                      <span className="col-span-2 font-medium">CONG TY KHACH SAN ABC</span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="text-gray-500">Nội dung CK:</span>
                      <span className="col-span-2 font-medium">{invoice.invoiceCode}</span>
                    </div>
                    <div className="grid grid-cols-3">
                      <span className="text-gray-500">Số tiền:</span>
                      <span className="col-span-2 font-medium">{formatPrice(invoice.totalAmount)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-blue-700 text-sm">
                    <p>Vui lòng chuyển khoản đúng số tiền và nội dung để đơn hàng được xử lý nhanh chóng.</p>
                    <p>Sau khi chuyển khoản, vui lòng nhấn "Xác nhận đã thanh toán".</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full"
              onClick={handlePayment}
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                <>
                  <Banknote className="w-4 h-4 mr-2" />
                  {paymentMethod === 'credit-card' ? 'Thanh toán ngay' : 'Xác nhận đã thanh toán'}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Receipt for paid invoices */}
      {invoice.status === 'Paid' && (
        <Card>
          <CardHeader>
            <CardTitle>Thông tin thanh toán</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 rounded-full p-2 mr-3">
                  <CheckCircle2 className="text-green-600 w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-green-800">Thanh toán thành công</h3>
                  <p className="text-green-600 text-sm">Hóa đơn đã được thanh toán đầy đủ</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                {invoice.paymentMethod && (
                  <div>
                    <div className="text-gray-500">Phương thức thanh toán</div>
                    <div className="font-medium">{invoice.paymentMethod}</div>
                  </div>
                )}
                <div>
                  <div className="text-gray-500">Ngày thanh toán</div>
                  <div className="font-medium">
                    {/* Assuming creation date is payment date for simplicity */}
                    {formatDateTime(invoice.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/customer/bookings" className="w-full">
              <Button variant="outline" className="w-full">
                Xem đặt phòng của tôi
              </Button>
            </Link>
          </CardFooter>
        </Card>
      )}
    </div>
  )
} 