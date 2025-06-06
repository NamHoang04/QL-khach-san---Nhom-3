"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-service';

export default function StaffDashboard() {
    const router = useRouter();

    useEffect(() => {
        const user = getCurrentUser();
        if (!user || !['manager', 'receptionist', 'staff'].includes(user.role.toLowerCase())) {
            router.push('/login');
        }
    }, [router]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Staff Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Quản lý đặt phòng</h2>
                    <p className="text-gray-600">Xử lý các yêu cầu đặt phòng</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Quản lý khách hàng</h2>
                    <p className="text-gray-600">Xem và cập nhật thông tin khách hàng</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Quản lý hóa đơn</h2>
                    <p className="text-gray-600">Xem và xử lý hóa đơn</p>
                </div>
            </div>
        </div>
    );
}
