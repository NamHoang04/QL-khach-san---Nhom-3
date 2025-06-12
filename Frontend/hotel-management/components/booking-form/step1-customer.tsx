"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CustomerData, getCustomers } from "@/lib/customer-service"
import { NewBookingData } from "./new-booking-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Step1Props {
  onNext: (data: Partial<NewBookingData>) => void
}

export function Step1_Customer({ onNext }: Step1Props) {
  const [customers, setCustomers] = useState<CustomerData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCustomers()
      .then(setCustomers)
      .finally(() => setLoading(false))
  }, [])

  const filteredCustomers = customers.filter(
    c =>
      c.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  )

  const handleSelect = (customer: CustomerData) => {
    setSelectedCustomer(customer)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bước 1: Chọn khách hàng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Tìm kiếm khách hàng theo tên, email, hoặc SĐT..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <ScrollArea className="h-64 border rounded-md">
          {loading ? (
            <p className="p-4">Đang tải danh sách khách hàng...</p>
          ) : (
            <div className="p-2 space-y-1">
              {filteredCustomers.map(customer => (
                <div
                  key={customer.id}
                  onClick={() => handleSelect(customer)}
                  className={`p-3 rounded-md cursor-pointer ${
                    selectedCustomer?.id === customer.id
                      ? "bg-blue-100 ring-2 ring-blue-500"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <p className="font-semibold">{customer.userName}</p>
                  <p className="text-sm text-gray-600">{customer.email}</p>
                  <p className="text-sm text-gray-600">{customer.phone}</p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="flex justify-end">
          <Button onClick={() => onNext({ customer: selectedCustomer! })} disabled={!selectedCustomer}>
            Tiếp theo
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 