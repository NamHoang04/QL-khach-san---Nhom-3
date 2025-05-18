"use client"

import { forwardRef, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface InvoiceItem {
  id: string
  name: string
  quantity: number
  price: number
  amount: number
}

interface InvoiceData {
  id: string
  customerName: string
  customerEmail: string
  issueDate: string
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  status: string
}

interface InvoicePrintProps {
  invoice: InvoiceData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InvoicePrint({ invoice, open, onOpenChange }: InvoicePrintProps) {
  const componentRef = useRef<HTMLDivElement>(null)
  
  const handlePrint = () => {
    if (!componentRef.current) return
    
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Please allow pop-ups to print invoices')
      return
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice-${invoice?.id || ''}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .invoice-container { max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding-bottom: 20px; }
            .company-info { margin-bottom: 10px; }
            .invoice-title { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
            .customer-info { margin: 20px 0; border-bottom: 1px solid #eee; padding-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th { text-align: left; background: #f8f8f8; padding: 10px; }
            td { padding: 10px; border-top: 1px solid #eee; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .summary { margin-top: 20px; text-align: right; }
            .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            ${componentRef.current.innerHTML}
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  if (!invoice) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Xem hóa đơn</DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[600px] p-4">
          <InvoicePrintContent ref={componentRef} invoice={invoice} />
        </div>
        
        <DialogFooter>
          <Button variant="outline" className="mr-2" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handlePrint}
          >
            In hóa đơn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const InvoicePrintContent = forwardRef<HTMLDivElement, { invoice: InvoiceData }>(function InvoicePrintContent(
  { invoice },
  ref
) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
  }

  return (
    <div ref={ref} className="p-8 bg-white">
      <div className="flex justify-between items-start pb-8 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-blue-700">HOTEL MANAGEMENT</h1>
          <p className="text-gray-500">123 Đường ABC, Quận XYZ, TP.HCM</p>
          <p className="text-gray-500">Email: info@hotelmanagement.com</p>
          <p className="text-gray-500">Tel: +84 123 456 789</p>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold">HÓA ĐƠN</h2>
          <p className="text-gray-600">Số: <span className="font-semibold">{invoice.id}</span></p>
          <p className="text-gray-600">Ngày: <span className="font-semibold">{invoice.issueDate}</span></p>
          <div className="mt-2">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
              invoice.status === 'Đã thanh toán' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {invoice.status}
            </span>
          </div>
        </div>
      </div>

      <div className="py-8 border-b border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Thông tin khách hàng</h3>
        <p><span className="font-medium">Họ tên:</span> {invoice.customerName}</p>
        <p><span className="font-medium">Email:</span> {invoice.customerEmail}</p>
      </div>

      <div className="py-8">
        <h3 className="text-lg font-semibold mb-4">Chi tiết hóa đơn</h3>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-4 text-left">STT</th>
              <th className="py-2 px-4 text-left">Mô tả</th>
              <th className="py-2 px-4 text-center">Số lượng</th>
              <th className="py-2 px-4 text-right">Đơn giá</th>
              <th className="py-2 px-4 text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={item.id} className="border-t border-gray-200">
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">{item.name}</td>
                <td className="py-3 px-4 text-center">{item.quantity}</td>
                <td className="py-3 px-4 text-right">{formatCurrency(item.price)}</td>
                <td className="py-3 px-4 text-right">{formatCurrency(item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="py-4 border-t border-gray-200">
        <div className="flex justify-end">
          <div className="w-72">
            <div className="flex justify-between py-2">
              <span className="font-medium">Tạm tính:</span>
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-medium">Thuế VAT (8%):</span>
              <span>{formatCurrency(invoice.tax)}</span>
            </div>
            <div className="flex justify-between py-2 text-lg font-bold">
              <span>Tổng cộng:</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 mt-8 border-t border-gray-200 text-center text-gray-500 text-sm">
        <p>Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!</p>
        <p className="mt-2">Hotel Management © 2024 - Tất cả các quyền được bảo lưu</p>
      </div>
    </div>
  )
}) 