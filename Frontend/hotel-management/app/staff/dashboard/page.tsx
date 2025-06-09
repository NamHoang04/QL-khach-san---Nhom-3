"use client"

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function StaffDashboard() {
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Bảng điều khiển
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Chào buổi tối, nhân viên! <br />
                        Bạn đang đăng nhập với vai trò: <span className="text-green-600 font-medium">Nhân viên</span>
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Quản lý Đặt phòng */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-4">Quản lý Đặt phòng</h2>
                            <p className="text-gray-600 mb-4">Tạo đơn đặt phòng mới và quản lý</p>
                            <Link href="/staff/bookings" className="text-blue-600 hover:text-blue-800 flex items-center">
                                Quản lý đặt phòng <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>

                        {/* Danh sách Phòng */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-4">Danh sách Phòng</h2>
                            <p className="text-gray-600 mb-4">Xem và kiểm tra tình trạng phòng</p>
                            <Link href="/staff/rooms" className="text-blue-600 hover:text-blue-800 flex items-center">
                                Xem phòng <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>

                        {/* Dịch vụ */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-4">Dịch vụ</h2>
                            <p className="text-gray-600 mb-4">Thêm dịch vụ cho khách hàng</p>
                            <Link href="/staff/services" className="text-blue-600 hover:text-blue-800 flex items-center">
                                Quản lý dịch vụ <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>

                        {/* Khách hàng */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-4">Khách hàng</h2>
                            <p className="text-gray-600 mb-4">Quản lý thông tin khách hàng</p>
                            <Link href="/staff/customers" className="text-blue-600 hover:text-blue-800 flex items-center">
                                Quản lý khách hàng <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                        
                        {/* Hóa đơn */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-4">Hóa đơn</h2>
                            <p className="text-gray-600 mb-4">Tạo và quản lý hóa đơn</p>
                            <Link href="/staff/invoices" className="text-blue-600 hover:text-blue-800 flex items-center">
                                Quản lý hóa đơn <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>

                        {/* Thông tin cá nhân */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-4">Thông tin cá nhân</h2>
                            <p className="text-gray-600 mb-4">Quản lý thông tin tài khoản</p>
                            <Link href="/staff/profile" className="text-blue-600 hover:text-blue-800 flex items-center">
                                Xem thông tin <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
