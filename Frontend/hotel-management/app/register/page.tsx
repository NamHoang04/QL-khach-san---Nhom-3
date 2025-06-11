'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { api } from '@/lib/api';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const formData = new FormData(e.currentTarget);
            const username = formData.get('username') as string;
            const email = formData.get('email') as string;
            const phoneNumber = formData.get('phone') as string;
            const idCard = formData.get('id-card') as string;
            const address = formData.get('address') as string;
            const password = formData.get('password') as string;
            const confirmPassword = formData.get('confirm-password') as string;

            if (password !== confirmPassword) {
                setError('Mật khẩu không khớp. Vui lòng thử lại.');
                setLoading(false);
                return;
            }

            const response = await api.post('/Auth/register', {
                Username: username,
                Email: email,
                Phone: phoneNumber,
                IdentityNumber: idCard,
                Address: address,
                Password: password,
                ConfirmPassword: confirmPassword,
            });
            
            setSuccess('Đăng ký thành công! Bạn sẽ được chuyển hướng đến trang đăng nhập.');

            setTimeout(() => {
                router.push('/login');
            }, 500);

        } catch (err: any) {
            console.error('Registration Error Object:', err);
            let errorMessage = 'Đã xảy ra lỗi trong quá trình đăng ký.';
            if (err.response?.data) {
                const responseData = err.response.data;
                if (responseData.errors) {
                    const errorMessages = Object.values(responseData.errors).flat();
                    errorMessage = errorMessages.join(' ');
                } else if (responseData.message) {
                    errorMessage = responseData.message;
                } else if (typeof responseData === 'string') {
                    errorMessage = responseData;
                }
            } else if (err.message) {
                errorMessage = err.message;
            }
            setError(errorMessage);
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
                <Card className="w-full max-w-2xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">
                            ĐĂNG KÝ TÀI KHOẢN
                        </CardTitle>
                        <CardDescription>
                            Vui lòng điền thông tin dưới đây để tạo tài khoản mới.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                             {error && (
                                <Alert variant="destructive" className="mb-4">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>Lỗi</AlertTitle>
                                    <AlertDescription>
                                        {error}
                                    </AlertDescription>
                                </Alert>
                            )}
                             {success && (
                                <Alert variant="default" className="mb-4 bg-green-100 border-green-400">
                                     <AlertTitle>Thành công</AlertTitle>
                                     <AlertDescription>
                                         {success}
                                     </AlertDescription>
                                 </Alert>
                             )}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="username">Tên đăng nhập *</Label>
                                    <Input id="username" name="username" placeholder="Tên đăng nhập" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input id="email" name="email" type="email" placeholder="Email" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Số điện thoại *</Label>
                                    <Input id="phone" name="phone" placeholder="Số điện thoại" required />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="id-card">CCCD/CMND *</Label>
                                    <Input id="id-card" name="id-card" placeholder="Nhập CCCD/CMND" required />
                                </div>
                                <div className="grid gap-2 md:col-span-2">
                                    <Label htmlFor="address">Địa chỉ *</Label>
                                    <Input id="address" name="address" placeholder="Nhập địa chỉ của bạn" required />
                                </div>
                                <div className="grid gap-2 relative">
                                    <Label htmlFor="password">Mật khẩu *</Label>
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Nhập mật khẩu"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-2.5 top-9"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                                    </button>
                                </div>
                                <div className="grid gap-2 relative">
                                    <Label htmlFor="confirm-password">Nhập lại mật khẩu *</Label>
                                    <Input
                                        id="confirm-password"
                                        name="confirm-password"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Nhập lại mật khẩu"
                                        required
                                    />
                                     <button
                                        type="button"
                                        className="absolute right-2.5 top-9"
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                                    </button>
                                </div>
                            </div>

                            <div className="items-top flex space-x-2 mt-4">
                                <Checkbox id="terms" required />
                                <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor="terms"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Tôi đồng ý chia sẻ thông tin và đồng ý với chính sách bảo mật dữ liệu cá nhân *
                                </label>
                                </div>
                            </div>
                            <Button type="submit" className="w-full mt-6" disabled={loading}>
                                {loading ? 'Đang xử lý...' : 'Đăng ký'}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <p className="text-sm text-gray-600">
                            Đã có tài khoản?{' '}
                            <Link href="/login" className="font-medium text-blue-600 hover:underline">
                                Đăng nhập
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
} 