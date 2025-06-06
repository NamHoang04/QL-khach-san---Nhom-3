'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login, getRoleFromToken, isAuthenticated, hasRole } from '@/lib/auth-service';
import type { LoginCredentials } from '@/lib/auth-service';
import { jwtDecode } from 'jwt-decode';

interface CustomJwtPayload {
    sub?: string;
    nameid?: string;
    unique_name?: string;
    name?: string;
    email?: string;
    given_name?: string;
    role?: string;
}

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [userType, setUserType] = useState<'admin' | 'staff' | 'customer'>('customer');

    // Tự động redirect nếu đã đăng nhập
    useEffect(() => {
        const checkAuth = async () => {
            if (isAuthenticated()) {
                const role = getRoleFromToken();
                if (role) {
                    await redirectBasedOnRole(role);
                }
            }
        };
        checkAuth();
    }, []);

    const redirectBasedOnRole = async (role: string) => {
        const roleLower = role.toLowerCase();
        let redirectPath = '';

        // Kiểm tra và xác định đường dẫn dựa trên role
        if (hasRole('admin')) {
            redirectPath = '/admin/dashboard';
        } else if (hasRole('staff')) {
            redirectPath = '/staff/dashboard';
        } else if (hasRole('customer')) {
            redirectPath = '/customer/dashboard';
        } else {
            setError('Vai trò không hợp lệ');
            return;
        }

        if (redirectPath) {
            try {
                await router.push(redirectPath);
            } catch (error) {
                console.error('Redirect error:', error);
                setError('Không thể chuyển hướng đến trang dashboard');
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const credentials: LoginCredentials = {
            username: formData.get('username') as string,
            password: formData.get('password') as string,
        };

        // Xác định endpoint API dựa trên userType
        let apiEndpoint = '';
        if (userType === 'admin') apiEndpoint = '/api/Admins/login';
        else if (userType === 'staff') apiEndpoint = '/api/Staff/login';
        else apiEndpoint = '/api/Auth/login';

        try {
            // Gọi API trực tiếp thay vì dùng login() cũ
            const responseRaw = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });
            const response = await responseRaw.json();

            if (response.success && response.data?.token) {
                const decoded = jwtDecode<CustomJwtPayload>(response.data.token);
                if (!decoded) {
                    setError('Không thể xác thực token');
                    setLoading(false);
                    return;
                }
                const role = getRoleFromToken(response.data.token) || userType;
                if (!role) {
                    setError('Không thể xác định vai trò người dùng');
                    setLoading(false);
                    return;
                }
                const userInfo = {
                    id: decoded.sub || decoded.nameid,
                    username: decoded.unique_name || decoded.name,
                    role: role,
                    email: decoded.email,
                    fullName: decoded.given_name
                };
                localStorage.setItem('user', JSON.stringify(userInfo));
                await redirectBasedOnRole(role);
            } else {
                setError(response.message || 'Đăng nhập thất bại');
                setLoading(false);
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || 'Đã xảy ra lỗi khi đăng nhập');
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
                    <div className="mb-4">
                        <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">Đối tượng đăng nhập</label>
                        <select
                            id="userType"
                            name="userType"
                            value={userType}
                            onChange={e => setUserType(e.target.value as 'admin' | 'staff' | 'customer')}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            <option value="admin">Admin</option>
                            <option value="staff">Staff</option>
                            <option value="customer">Customer</option>
                        </select>
                    </div>
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

                    {success && (
                        <div className="text-green-500 text-sm text-center">
                            {success}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
