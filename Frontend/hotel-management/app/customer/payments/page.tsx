"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { get } from "@/lib/api"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  CalendarClock,
  Banknote,
  Loader2,
  Search,
  ChevronLeft,
  Info
} from "lucide-react"
import { format } from "date-fns"

interface Service {
  id: number
  name: string
  price: number
  quantity: number
  childQuantity?: number
  totalPrice: number
}

interface Invoice {
  id: number
  invoiceCode: string
  bookingId: number
  bookingCode: string
  createdAt: string
  totalAmount?: number
  status: string
  paymentMethod?: string | null
  roomName?: string
  checkIn?: string
  checkOut?: string
  nights?: number
  services?: Service[]
  details?: string
}

const mockInvoices: Invoice[] = [
  {
    id: 1,
    invoiceCode: 'INV-2024-001',
    bookingId: 101,
    bookingCode: 'BK-XYZ-101',
    createdAt: '2024-06-10T10:00:00Z',
    totalAmount: 4800000,
    status: 'paid',
    paymentMethod: 'Credit Card',
  },
  {
    id: 2,
    invoiceCode: 'INV-2024-002',
    bookingId: 102,
    bookingCode: 'BK-XYZ-102',
    createdAt: '2024-05-20T14:30:00Z',
    totalAmount: 2200000,
    status: 'pending',
    paymentMethod: null,
  },
  {
    id: 3,
    invoiceCode: 'INV-2024-003',
    bookingId: 103,
    bookingCode: 'BK-XYZ-103',
    createdAt: '2024-04-15T09:00:00Z',
    totalAmount: 3500000,
    status: 'cancelled',
    paymentMethod: 'Bank Transfer',
  },
];

export default function PaymentsPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(tabParam || "all")
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  useEffect(() => {
    // Simulate fetching invoices
    setLoading(true);
    setTimeout(() => {
      if (user?.id) {
        setInvoices(mockInvoices);
        } else {
        setInvoices([]);
      }
      setLoading(false);
    }, 500); // Simulate network delay
  }, [user])
  
  const getStatusDetails = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return {
          text: 'Đã thanh toán',
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle2 className="w-4 h-4 text-green-600" />
        }
      case 'pending':
        return {
          text: 'Chờ thanh toán',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Clock className="w-4 h-4 text-yellow-600" />
        }
      case 'cancelled':
        return {
          text: 'Đã hủy',
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <XCircle className="w-4 h-4 text-red-600" />
        }
      case 'processing':
        return {
            text: 'Đang xử lý',
            color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
        }
      default:
        return {
          text: status,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <AlertCircle className="w-4 h-4 text-gray-600" />
        }
    }
  }
  
  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return "N/A"
    return format(new Date(dateString), "dd/MM/yyyy 'lúc' HH:mm")
  }
  
  const formatPrice = (price: number | undefined | null) => {
    if (price === null || price === undefined) return "N/A"
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
  }

  const filteredInvoices = invoices.filter(invoice => {
    if (activeTab === 'all') return true
    return invoice.status.toLowerCase() === activeTab
  })
  
  const renderInvoiceList = (invoiceList: Invoice[]) => {
    if (invoiceList.length === 0) {
      return (
        <Card>
            <CardContent className="p-10 text-center">
                <div className="mx-auto bg-gray-100 rounded-full h-16 w-16 flex items-center justify-center">
                    <Search className="h-8 w-8 text-gray-400" />
        </div>
                <h3 className="mt-4 text-lg font-medium text-gray-800">Không tìm thấy hóa đơn</h3>
                <p className="mt-1 text-gray-500">Không có hóa đơn nào khớp với bộ lọc của bạn.</p>
            </CardContent>
        </Card>
      )
    }
    
    return (
      <div className="space-y-4">
        {invoiceList.map(invoice => {
          const statusDetails = getStatusDetails(invoice.status)
          return (
            <Card key={invoice.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row justify-between items-start p-5 pb-3">
                  <div>
                        <CardTitle className="text-lg">Hóa đơn #{invoice.invoiceCode}</CardTitle>
                        <CardDescription>Đặt phòng: {invoice.bookingCode}</CardDescription>
                    </div>
                    <Badge variant="outline" className={`${statusDetails.color} gap-1.5`}>
                      {statusDetails.icon}
                        {statusDetails.text}
                    </Badge>
                </CardHeader>
              <CardContent className="p-5 pt-0">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="font-medium text-gray-500">Ngày tạo:</div>
                    <div className="text-gray-800">{formatDate(invoice.createdAt)}</div>
                    
                    <div className="font-medium text-gray-500">Tổng tiền:</div>
                    <div className="font-bold text-blue-600">{formatPrice(invoice.totalAmount)}</div>

                    {invoice.paymentMethod && (
                        <>
                            <div className="font-medium text-gray-500">Phương thức:</div>
                            <div className="text-gray-800">{invoice.paymentMethod}</div>
                        </>
                    )}
                  </div>
              </CardContent>
              <CardFooter className="bg-gray-50 p-4 flex justify-end">
                      <Link href={`/customer/payments/invoice/${invoice.id}`}>
                    <Button variant="outline" size="sm">
                        <Info className="w-4 h-4 mr-2" />
                          Xem chi tiết
                        </Button>
                      </Link>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    )
  }

  const allCount = invoices.length
  const pendingCount = invoices.filter(i => i.status.toLowerCase() === 'pending').length
  const paidCount = invoices.filter(i => i.status.toLowerCase() === 'paid').length
  const cancelledCount = invoices.filter(i => i.status.toLowerCase() === 'cancelled').length
  
  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
        <div className="flex items-center gap-2 mb-4">
            <Link href="/customer" className="text-blue-600 hover:underline flex items-center">
                <ChevronLeft className="h-4 w-4" />
                <span>Quay lại</span>
            </Link>
        </div>
        <div className="mb-6">
            <h1 className="text-2xl font-bold">Lịch sử thanh toán</h1>
            <p className="text-gray-500 mt-1">Xem và quản lý tất cả các hóa đơn và thanh toán của bạn.</p>
        </div>

        {loading ? (
            <Card>
                <CardContent className="p-12 flex flex-col items-center justify-center">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                    <p className="text-gray-600">Đang tải lịch sử thanh toán...</p>
                </CardContent>
            </Card>
        ) : error ? (
            <Card className="border-red-200 bg-red-50">
                <CardContent className="p-6 text-center text-red-700">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                    <p>{error}</p>
                </CardContent>
            </Card>
        ) : invoices.length === 0 ? (
            <Card>
                <CardContent className="p-12 text-center">
                    <Banknote className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-700">Chưa có thanh toán nào</h3>
                    <p className="text-gray-500 mt-2 max-w-md mx-auto">Bạn chưa có hóa đơn hoặc thanh toán nào. Hãy bắt đầu bằng cách đặt phòng.</p>
                    <Link href="/customer/search">
                        <Button className="mt-6">
                            <Search className="w-4 h-4 mr-2" />
                            Tìm phòng ngay
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                    <TabsTrigger value="all">Tất cả <Badge variant="secondary" className="ml-2">{allCount}</Badge></TabsTrigger>
                    <TabsTrigger value="pending">Chờ thanh toán <Badge variant="secondary" className="ml-2 bg-yellow-100 text-yellow-800">{pendingCount}</Badge></TabsTrigger>
                    <TabsTrigger value="paid">Đã thanh toán <Badge variant="secondary" className="ml-2 bg-green-100 text-green-800">{paidCount}</Badge></TabsTrigger>
                    <TabsTrigger value="cancelled">Đã hủy <Badge variant="secondary" className="ml-2 bg-red-100 text-red-800">{cancelledCount}</Badge></TabsTrigger>
          </TabsList>
                <TabsContent value="all" className="mt-6">{renderInvoiceList(filteredInvoices)}</TabsContent>
                <TabsContent value="pending" className="mt-6">{renderInvoiceList(filteredInvoices)}</TabsContent>
                <TabsContent value="paid" className="mt-6">{renderInvoiceList(filteredInvoices)}</TabsContent>
                <TabsContent value="cancelled" className="mt-6">{renderInvoiceList(filteredInvoices)}</TabsContent>
        </Tabs>
      )}
    </div>
  )
} 