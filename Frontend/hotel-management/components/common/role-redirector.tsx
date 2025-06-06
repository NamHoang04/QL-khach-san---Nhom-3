"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserType } from '@/lib/auth-service';

export const RoleRedirector = () => {
  const router = useRouter();

  useEffect(() => {
    const userType = getUserType();
    if (userType) {
      switch (userType.toLowerCase()) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'staff':
          router.push('/staff/dashboard');
          break;
        case 'customer':
          router.push('/customer/dashboard');
          break;
        default:
          router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  return null;
}; 