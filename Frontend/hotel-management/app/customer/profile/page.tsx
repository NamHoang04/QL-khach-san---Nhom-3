"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { get, put } from "@/lib/api-service"
import { shouldUseMockData } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { UserCircle, Phone, Mail, MapPin, ShieldCheck, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Customer {
  id: number
  customerCode: string
  fullName: string
  email: string
  phone: string
  identityNumber: string
  address: string
}

export default function ProfilePage() {
  const { user } = useAuth()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    identityNumber: "",
    address: ""
  })
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!user?.id) return
      
      try {
        setLoading(true)
        
        if (shouldUseMockData()) {
          // Use mock data
          const mockCustomer: Customer = {
            id: 1,
            customerCode: "KH00001",
            fullName: "Nguyễn Văn A",
            email: "nguyenvana@example.com",
            phone: "0901234567",
            identityNumber: "079123456789",
            address: "123 Đường Nguyễn Huệ, Quận 1, TP.HCM"
          }
          setCustomer(mockCustomer)
          setFormData({
            fullName: mockCustomer.fullName,
            email: mockCustomer.email,
            phone: mockCustomer.phone,
            identityNumber: mockCustomer.identityNumber,
            address: mockCustomer.address
          })
        } else {
          // Get real data from API
          const data = await get<Customer>(`Customers/${user.id}`)
          setCustomer(data)
          setFormData({
            fullName: data.fullName,
            email: data.email || "",
            phone: data.phone || "",
            identityNumber: data.identityNumber || "",
            address: data.address || ""
          })
        }
      } catch (err) {
        console.error("Error fetching customer data:", err)
        setError("Không thể tải thông tin khách hàng. Vui lòng thử lại sau.")
      } finally {
        setLoading(false)
      }
    }
    
    fetchCustomerData()
  }, [user])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!customer) return
    
    try {
      setSaving(true)
      
      // Basic validation
      if (!formData.fullName) {
        toast.error("Vui lòng nhập họ tên")
        return
      }
      
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        toast.error("Email không hợp lệ")
        return
      }
      
      if (shouldUseMockData()) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Update local state
        setCustomer({
          ...customer,
          ...formData
        })
        
        toast.success("Cập nhật thông tin thành công")
      } else {
        // Update via API
        await put(`Customers/${customer.id}`, {
          ...customer,
          ...formData
        })
        
        toast.success("Cập nhật thông tin thành công")
      }
    } catch (err) {
      console.error("Error updating profile:", err)
      toast.error("Không thể cập nhật thông tin. Vui lòng thử lại sau.")
    } finally {
      setSaving(false)
    }
  }
  
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!customer) return
    
    try {
      setSaving(true)
      
      // Validation
      if (!passwordData.currentPassword) {
        toast.error("Vui lòng nhập mật khẩu hiện tại")
        return
      }
      
      if (!passwordData.newPassword) {
        toast.error("Vui lòng nhập mật khẩu mới")
        return
      }
      
      if (passwordData.newPassword.length < 6) {
        toast.error("Mật khẩu mới phải có ít nhất 6 ký tự")
        return
      }
      
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error("Xác nhận mật khẩu không khớp")
        return
      }
      
      if (shouldUseMockData()) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        toast.success("Cập nhật mật khẩu thành công")
        
        // Reset form
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        })
      } else {
        // Call API to update password
        await put(`Customers/${customer.id}/password`, {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
        
        toast.success("Cập nhật mật khẩu thành công")
        
        // Reset form
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        })
      }
    } catch (err) {
      console.error("Error updating password:", err)
      toast.error("Không thể cập nhật mật khẩu. Vui lòng kiểm tra lại thông tin.")
    } finally {
      setSaving(false)
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
        <span className="ml-2 text-gray-600">Đang tải thông tin...</span>
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
  
  return (
    <div className="container max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Hồ sơ cá nhân</h1>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>
                Quản lý thông tin cá nhân của bạn
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handleProfileUpdate}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <UserCircle className="w-5 h-5 text-gray-500" />
                    <Label htmlFor="fullName">Họ và tên</Label>
                  </div>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Nhập họ và tên"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <Label htmlFor="email">Email</Label>
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Nhập email"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <Label htmlFor="phone">Số điện thoại</Label>
                  </div>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-gray-500" />
                    <Label htmlFor="identityNumber">CMND/CCCD</Label>
                  </div>
                  <Input
                    id="identityNumber"
                    name="identityNumber"
                    value={formData.identityNumber}
                    onChange={handleInputChange}
                    placeholder="Nhập số CMND/CCCD"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <Label htmlFor="address">Địa chỉ</Label>
                  </div>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Nhập địa chỉ"
                    rows={3}
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  className="ml-auto"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang lưu...
                    </>
                  ) : "Lưu thay đổi"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Đổi mật khẩu</CardTitle>
              <CardDescription>
                Cập nhật mật khẩu để bảo vệ tài khoản của bạn
              </CardDescription>
            </CardHeader>
            
            <form onSubmit={handlePasswordUpdate}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Mật khẩu mới</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nhập mật khẩu mới"
                  />
                  <p className="text-xs text-gray-500">Mật khẩu phải có ít nhất 6 ký tự</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nhập lại mật khẩu mới"
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  type="submit" 
                  className="ml-auto"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : "Cập nhật mật khẩu"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 