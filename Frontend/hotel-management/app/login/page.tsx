'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/api';
import { API_CONFIG, AUTH_CONFIG } from '@/lib/config';
import { jwtDecode } from 'jwt-decode';
import { AlertTriangle, Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface JwtPayload {
    sub: string;
    role?: string;
    exp: number;
    [key: string]: any;
}

export default function LoginPage() {
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const username = formData.get('username') as string;
            const password = formData.get('password') as string;

            if (!username.trim() || !password.trim()) {
                setError('Vui lòng nhập đầy đủ thông tin đăng nhập');
                setLoading(false);
                return;
            }

            const response = await api.post(API_CONFIG.endpoints.login, {
                username,
                password,
            });

            const token = (response.data as any)?.data?.token;

            if (!token) {
                const apiMessage =
                    (response.data as any)?.message || 'phản hồi không hợp lệ';
                throw new Error(`Đăng nhập thất bại: ${apiMessage}`);
            }

            const decoded = jwtDecode<JwtPayload>(token);
            const role = (
                decoded.role ||
                decoded[
                    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
                ]
            )?.toLowerCase();

            if (!role) {
                throw new Error(
                    'Không tìm thấy thông tin vai trò người dùng trong token',
                );
            }

            localStorage.setItem(AUTH_CONFIG.tokenKey, token);

            const expiryDate = new Date();
            expiryDate.setTime(expiryDate.getTime() + 24 * 60 * 60 * 1000); // 24 hours
            document.cookie = `token=${token}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Strict`;

            let redirectPath;
            switch (role) {
                case 'admin':
                case 'administrator':
                    redirectPath = '/admin/dashboard';
                    break;
                case 'staff':
                    redirectPath = '/staff/dashboard';
                    break;
                case 'customer':
                    redirectPath = '/customer/dashboard';
                    break;
                default:
                    throw new Error(`Vai trò không hợp lệ: ${role}`);
            }
            window.location.href = redirectPath;
        } catch (err: any) {
            console.error('Login error:', err);
            const errorMessage =
                err?.response?.data?.message ||
                err?.message ||
                'Tài khoản hoặc mật khẩu không chính xác.';
            setError(errorMessage);
            localStorage.removeItem(AUTH_CONFIG.tokenKey);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full">
            <Image
                src="/images/khach-san-14.jpg"
                alt="Background"
                fill
                className="absolute inset-0 -z-10 object-cover"
            />
            <div className="flex items-center justify-center min-h-screen p-4 bg-black/20">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">
                            ĐĂNG NHẬP
                        </CardTitle>
                        <CardDescription>
                            Nhập tài khoản của bạn để tiếp tục
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="grid gap-4" onSubmit={handleSubmit}>
                            {error && (
                                <Alert variant="destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>Lỗi</AlertTitle>
                                    <AlertDescription>
                                        {error}
                                    </AlertDescription>
                                </Alert>
                            )}
                            <div className="grid gap-2">
                                <Label htmlFor="username">Tên đăng nhập</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="tendangnhap"
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="grid gap-2 relative">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Mật khẩu</Label>
                                    <Link
                                        href="/forgot-password"
                                        className="ml-auto inline-block text-sm underline"
                                    >
                                        Quên mật khẩu?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    className="absolute right-2.5 top-9"
                                    onClick={() =>
                                        setShowPassword((prev) => !prev)
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col items-center">
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Bạn chưa có tài khoản?{' '}
                            <Link
                                href="/register"
                                className="font-medium text-blue-600 hover:underline"
                            >
                                Đăng ký
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
