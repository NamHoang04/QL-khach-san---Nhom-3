'use client';

import { useState } from 'react';
import { API_CONFIG, AUTH_CONFIG } from '@/lib/config';
import { api } from '@/lib/api';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
    sub: string;
    role?: string;
    exp: number;
    [key: string]: any;
}

export default function LoginPage() {
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState(false);

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

            // The token is nested inside response.data.data
            const token = (response.data as any)?.data?.token;

            if (!token) {
                const apiMessage = (response.data as any)?.message || 'phản hồi không hợp lệ';
                throw new Error(`Đăng nhập thất bại: ${apiMessage}`);
            }

            // Decode token to get role
            const decoded = jwtDecode<JwtPayload>(token);
            const role = (decoded.role ||
                        decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'])?.toLowerCase();

            if (!role) {
                throw new Error('Không tìm thấy thông tin vai trò người dùng trong token');
            }

            // Save token to localStorage for the API interceptor
            localStorage.setItem(AUTH_CONFIG.tokenKey, token);

            // Save token to cookie for middleware
            const expiryDate = new Date();
            expiryDate.setTime(expiryDate.getTime() + (24 * 60 * 60 * 1000)); // 24 hours
            document.cookie = `token=${token}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Strict`;

            // Redirect based on role
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
            const errorMessage = err?.data?.message || err?.data || err?.message || 'Tài khoản hoặc mật khẩu không chính xác.';
            setError(errorMessage);
            localStorage.removeItem(AUTH_CONFIG.tokenKey);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Hotel Management
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Please sign in to continue
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username" className="sr-only">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Username"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                                loading
                                    ? 'bg-indigo-400 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                            }`}
                        >
                            {loading ? (
                                <span>Đang đăng nhập...</span>
                            ) : (
                                <span>Đăng nhập</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
