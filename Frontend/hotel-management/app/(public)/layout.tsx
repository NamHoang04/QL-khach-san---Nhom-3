"use client"

import { AuthProvider, useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserNav } from "@/components/common/user-nav";

function Header() {
    const { user } = useAuth();

    return (
        <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-2xl font-bold text-blue-600">
                            H-Booking
                        </Link>
                    </div>
                    <nav className="hidden md:flex md:space-x-8">
                        {/* <Link href="/#featured-rooms" className="text-gray-500 hover:text-gray-900">Phòng</Link>
                        <Link href="/#services" className="text-gray-500 hover:text-gray-900">Dịch vụ</Link> */}
                    </nav>
                    <div className="flex items-center">
                        {user ? (
                            <UserNav />
                        ) : (
                            <Button asChild>
                                <Link href="/login">Đăng nhập</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}


export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
                <footer className="bg-white mt-12">
                    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-500">
                        © {new Date().getFullYear()} H-Booking. All rights reserved.
                    </div>
                </footer>
            </div>
        </AuthProvider>
    );
} 