"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { get } from "@/lib/api-service"
import { shouldUseMockData } from "@/lib/config"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  CalendarClock,
  Banknote,
  Loader2,
  Search
} from "lucide-react"
import { format } from "date-fns"

interface Invoice {
  id: number
  invoiceCode: string
  bookingId: number
  bookingCode: string
  createdAt: string
  totalAmount: number
  status: string
  paymentMethod?: string | null
}

export default function PaymentsPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState(tabParam || "pending")
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  
  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user?.id) return
      
      try {
        setLoading(true)
        
        if (shouldUseMockData()) {
          // Mock data
          const mockInvoices: Invoice[] = [
            {
              id: 1,
              invoiceCode: "INV0001",
              bookingId: 1,
              bookingCode: "BK0001",
              createdAt: "2023-12-01T10:00:00",
              totalAmount: 1200000,
              status: "Paid",
              paymentMethod: "Credit Card"
            },
            {
              id: 2,
              invoiceCode: "INV0002",
              bookingId: 2,
              bookingCode: "BK0002",
              createdAt: "2023-12-20T14:30:00",
              totalAmount: 2000000,
              status: "Pending",
              paymentMethod: undefined
            },
            {
              id: 3,
              invoiceCode: "INV0003",
              bookingId: 3,
              bookingCode: "BK0003",
              createdAt: "2023-11-10T09:15:00",
              totalAmount: 1500000,
              status: "Cancelled",
              paymentMethod: undefined
            },
            {
              id: 4,
              invoiceCode: "INV0004",
              bookingId: 4,
              bookingCode: "BK0004",
              createdAt: "2023-12-15T16:45:00",
              totalAmount: 3500000,
              status: "Paid",
              paymentMethod: "Bank Transfer"
            }
          ]
          setInvoices(mockInvoices)
        } else {
          // Real API call
          const data = await get<Invoice[]>(`Invoices/customer/${user.id}`)
          setInvoices(data)
        }
      } catch (err) {
        console.error("Error fetching invoices:", err)
        setError("Không thể tải dữ liệu thanh toán. Vui lòng thử lại sau.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchInvoices()
  }, [user])
  
  // Check for pending booking in localStorage and add it to invoices
  useEffect(() => {
    const pendingBookingString = localStorage.getItem("pendingBooking")
    if (pendingBookingString) {
      try {
        const pendingBooking = JSON.parse(pendingBookingString)
        
        // Create a new invoice from the pending booking
        const newInvoice: Invoice = {
          id: Math.floor(Math.random() * 1000000), // Generate temporary id
          invoiceCode: `INV${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`,
          bookingId: Math.floor(Math.random() * 1000000),
          bookingCode: `BK${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`,
          createdAt: pendingBooking.createdAt || new Date().toISOString(),
          totalAmount: pendingBooking.totalAmount,
          status: "Pending",
          paymentMethod: null
        }
        
        // Add to invoices (avoid duplicates by checking if we already have a similar invoice)
        setInvoices(prev => {
          const similar = prev.find(inv => 
            inv.totalAmount === newInvoice.totalAmount && 
            inv.status.toLowerCase() === "pending"
          )
          return similar ? prev : [...prev, newInvoice]
        })
      } catch (error) {
        console.error("Error parsing pending booking:", error)
      }
    }
  }, [])
  
  // Get status badge color and icon based on status
  const getStatusDetails = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle2 className="w-4 h-4 text-green-600" />
        }
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: <Clock className="w-4 h-4 text-yellow-600" />
        }
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <XCircle className="w-4 h-4 text-red-600" />
        }
      case 'processing':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
        }
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: <AlertCircle className="w-4 h-4 text-gray-600" />
        }
    }
  }
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm')
  }
  
  // Format price as VND
  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + ' ₫'
  }
  
  // Filter invoices by status
  const pendingInvoices = invoices.filter(invoice => 
    invoice.status.toLowerCase() === 'pending'
  )
  
  const paidInvoices = invoices.filter(invoice => 
    invoice.status.toLowerCase() === 'paid'
  )
  
  const otherInvoices = invoices.filter(invoice => 
    !['pending', 'paid'].includes(invoice.status.toLowerCase())
  )
  
  const renderInvoiceList = (invoiceList: Invoice[]) => {
    if (!invoiceList.length) {
      return (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <CalendarClock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700">Không có hóa đơn nào</h3>
          <p className="text-gray-500 mt-1">Không tìm thấy hóa đơn nào trong danh mục này</p>
        </div>
      )
    }
    
    return (
      <div className="space-y-4">
        {invoiceList.map(invoice => {
          const statusDetails = getStatusDetails(invoice.status)
          
          return (
            <div key={invoice.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-medium">Hóa đơn #{invoice.invoiceCode}</h3>
                      <Badge variant="outline">Đặt phòng #{invoice.bookingCode}</Badge>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                      {formatDate(invoice.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${statusDetails.color}`}>
                      {statusDetails.icon}
                      <span className="ml-1">{invoice.status}</span>
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <div>
                    <div className="text-sm text-gray-500">Tổng tiền</div>
                    <div className="font-medium text-lg">{formatPrice(invoice.totalAmount)}</div>
                    {invoice.paymentMethod && (
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        <CreditCard className="w-3 h-3 mr-1" />
                        {invoice.paymentMethod}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    {invoice.status.toLowerCase() === 'pending' && (
                      <Link href={`/customer/payments/invoice/${invoice.id}`}>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Banknote className="w-4 h-4 mr-1" />
                          Thanh toán
                        </Button>
                      </Link>
                    )}
                    
                    {invoice.status.toLowerCase() !== 'pending' && (
                      <Link href={`/customer/payments/invoice/${invoice.id}`}>
                        <Button size="sm" variant="outline">
                          <Search className="w-4 h-4 mr-1" />
                          Xem chi tiết
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
  
  return (
    <div className="container max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>
      
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
          <span className="ml-2 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
          {error}
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="pending" className="relative">
              Chờ thanh toán
              {pendingInvoices.length > 0 && (
                <span className="absolute top-0 right-1 transform -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingInvoices.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="paid">Đã thanh toán</TabsTrigger>
            <TabsTrigger value="other">Khác</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending">
            {renderInvoiceList(pendingInvoices)}
          </TabsContent>
          
          <TabsContent value="paid">
            {renderInvoiceList(paidInvoices)}
          </TabsContent>
          
          <TabsContent value="other">
            {renderInvoiceList(otherInvoices)}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
} 