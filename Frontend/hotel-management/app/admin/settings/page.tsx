"use client"

import { useState } from "react"
import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { CheckCircle, XCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Cài đặt Hệ thống | Hotel Management",
}

export default function AdminSettingsPage() {
  const handleSaveHotelInfo = () => {
    try {
      // Save hotel information logic would go here
      
      // Show success toast
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Thông tin khách sạn đã được lưu thành công!</span>
        </div>
      )
    } catch (error) {
      // Show error toast
      toast.error(
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-500" />
          <span>Có lỗi xảy ra khi lưu thông tin. Vui lòng thử lại!</span>
        </div>
      )
      console.error("Error saving hotel info:", error)
    }
  }
  
  const handleSaveBookingSettings = () => {
    try {
      // Save booking settings logic would go here
      
      // Show success toast
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Cài đặt đặt phòng đã được lưu thành công!</span>
        </div>
      )
    } catch (error) {
      // Show error toast
      toast.error(
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-500" />
          <span>Có lỗi xảy ra khi lưu cài đặt. Vui lòng thử lại!</span>
        </div>
      )
      console.error("Error saving booking settings:", error)
    }
  }
  
  const handleSaveSystemSettings = () => {
    try {
      // Save system settings logic would go here
      
      // Show success toast
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Cài đặt hệ thống đã được lưu thành công!</span>
        </div>
      )
    } catch (error) {
      // Show error toast
      toast.error(
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-500" />
          <span>Có lỗi xảy ra khi lưu cài đặt. Vui lòng thử lại!</span>
        </div>
      )
      console.error("Error saving system settings:", error)
    }
  }
  
  const handleSaveSecuritySettings = () => {
    try {
      // Save security settings logic would go here
      
      // Show success toast
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>Cài đặt bảo mật đã được lưu thành công!</span>
        </div>
      )
    } catch (error) {
      // Show error toast
      toast.error(
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-500" />
          <span>Có lỗi xảy ra khi lưu cài đặt. Vui lòng thử lại!</span>
        </div>
      )
      console.error("Error saving security settings:", error)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Cài đặt Hệ thống</h1>
        <p className="text-gray-600">Quản lý các thiết lập và cài đặt cho hệ thống</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {/* Cài đặt chung */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Thông tin khách sạn</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên khách sạn
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  defaultValue="Royal Hotel & Spa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  defaultValue="123 Nguyễn Huệ, Quận 1, TP.HCM"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  defaultValue="(+84) 28 3822 8888"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  defaultValue="info@royalhotel.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  defaultValue="https://royalhotel.com"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSaveHotelInfo}
              >
                Lưu thông tin
              </Button>
            </div>
          </div>
          
          {/* Cài đặt đặt phòng */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Cài đặt đặt phòng</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giờ nhận phòng (Check-in)
                </label>
                <select className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:outline-none">
                  <option>12:00</option>
                  <option selected>14:00</option>
                  <option>15:00</option>
                  <option>16:00</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giờ trả phòng (Check-out)
                </label>
                <select className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:outline-none">
                  <option>10:00</option>
                  <option>11:00</option>
                  <option selected>12:00</option>
                  <option>13:00</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phí hủy đặt phòng (% tổng tiền)
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  defaultValue="30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số ngày hủy không mất phí
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  defaultValue="3"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requireDeposit"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  defaultChecked
                />
                <label htmlFor="requireDeposit" className="ml-2 block text-sm text-gray-700">
                  Yêu cầu đặt cọc khi đặt phòng
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiền đặt cọc (% tổng tiền)
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  defaultValue="50"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSaveBookingSettings}
              >
                Lưu cài đặt
              </Button>
            </div>
          </div>
        </div>
        
        <div className="col-span-1">
          {/* Cài đặt hệ thống */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Cài đặt hệ thống</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngôn ngữ mặc định
                </label>
                <select className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:outline-none">
                  <option selected>Tiếng Việt</option>
                  <option>English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Múi giờ
                </label>
                <select className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:outline-none">
                  <option selected>(GMT+7) Asia/Ho_Chi_Minh</option>
                  <option>(GMT+8) Asia/Singapore</option>
                  <option>(GMT+7) Asia/Bangkok</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Định dạng ngày
                </label>
                <select className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:outline-none">
                  <option selected>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="notifications"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  defaultChecked
                />
                <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700">
                  Bật thông báo email
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="smsNotifications"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  defaultChecked
                />
                <label htmlFor="smsNotifications" className="ml-2 block text-sm text-gray-700">
                  Bật thông báo SMS
                </label>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSaveSystemSettings}
              >
                Lưu cài đặt
              </Button>
            </div>
          </div>
          
          {/* Bảo mật */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Bảo mật</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian hết hạn phiên đăng nhập (phút)
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  defaultValue="30"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="twoFactor"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="twoFactor" className="ml-2 block text-sm text-gray-700">
                  Bật xác thực hai yếu tố
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="loginAttempts"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  defaultChecked
                />
                <label htmlFor="loginAttempts" className="ml-2 block text-sm text-gray-700">
                  Giới hạn số lần đăng nhập sai
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lần đăng nhập sai tối đa
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-200 focus:outline-none"
                  defaultValue="5"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSaveSecuritySettings}
              >
                Lưu cài đặt
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 