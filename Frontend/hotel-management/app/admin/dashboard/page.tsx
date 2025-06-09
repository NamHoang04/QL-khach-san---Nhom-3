"use client"

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Bảng điều khiển
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Chào buổi tối, admin! <br />
                        Bạn đang đăng nhập với vai trò: <span className="text-green-600 font-medium">Quản trị viên</span>
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Quản lý Nhân viên */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-4">Quản lý Nhân viên</h2>
                            <p className="text-gray-600 mb-4">Thêm, sửa, xóa và quản lý nhân viên</p>
                            <Link 
                                href="/admin/staff"
                                className="text-blue-600 hover:text-blue-800 flex items-center"
                            >
                                Quản lý nhân viên <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>

                        {/* Quản lý Phòng */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-4">Danh sách Phòng</h2>
                            <p className="text-gray-600 mb-4">Xem và quản lý danh sách phòng</p>
                            <Link 
                                href="/admin/rooms"
                                className="text-blue-600 hover:text-blue-800 flex items-center"
                            >
                                Xem phòng <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>

                        {/* Quản lý Dịch vụ */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-4">Dịch vụ</h2>
                            <p className="text-gray-600 mb-4">Quản lý các dịch vụ của khách sạn</p>
                            <Link 
                                href="/admin/services"
                                className="text-blue-600 hover:text-blue-800 flex items-center"
                            >
                                Quản lý dịch vụ <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>

                        {/* Quản lý Khách hàng */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-4">Khách hàng</h2>
                            <p className="text-gray-600 mb-4">Quản lý thông tin khách hàng</p>
                            <Link 
                                href="/admin/customers"
                                className="text-blue-600 hover:text-blue-800 flex items-center"
                            >
                                Quản lý khách hàng <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>

                        {/* Quản lý Hóa đơn */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-4">Hóa đơn</h2>
                            <p className="text-gray-600 mb-4">Quản lý và xem báo cáo hóa đơn</p>
                            <Link 
                                href="/admin/invoices"
                                className="text-blue-600 hover:text-blue-800 flex items-center"
                            >
                                Quản lý hóa đơn <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>

                        {/* Thông tin cá nhân */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-4">Thông tin cá nhân</h2>
                            <p className="text-gray-600 mb-4">Quản lý thông tin tài khoản</p>
                            <Link 
                                href="/admin/profile"
                                className="text-blue-600 hover:text-blue-800 flex items-center"
                            >
                                Xem thông tin <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 