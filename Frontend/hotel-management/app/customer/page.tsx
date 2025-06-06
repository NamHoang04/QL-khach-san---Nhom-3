"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-service'

export default function CustomerPage() {
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.role.toLowerCase() !== 'customer') {
      router.push('/login')
    } else {
      router.push('/customer/dashboard')
    }
  }, [router])

  return null
} 