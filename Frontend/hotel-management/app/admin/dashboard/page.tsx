"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isAuthenticated } from '@/lib/auth-service';

export default function AdminDashboard() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Kiểm tra token trước
                if (!isAuthenticated()) {
                    router.push('/login');
                    return;
                }

                // Sau đó mới kiểm tra user
                const user = getCurrentUser();
                if (!user || user.role.toLowerCase() !== 'admin') {
                    router.push('/login');
                    return;
                }

                setIsLoading(false);
            } catch (error) {
                console.error('Authentication error:', error);
                router.push('/login');
            }
        };

        checkAuth();
    }, []); // Empty dependency array means this only runs once on mount

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Quản lý phòng</h2>
                    <p className="text-gray-600">Quản lý thông tin phòng và loại phòng</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Quản lý đặt phòng</h2>
                    <p className="text-gray-600">Xem và xử lý các yêu cầu đặt phòng</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">Quản lý khách hàng</h2>
                    <p className="text-gray-600">Xem thông tin và lịch sử khách hàng</p>
                </div>
            </div>
        </div>
    );
} 