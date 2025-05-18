"use client"

import { RoleRedirector } from "@/components/common/role-redirector"
import { useAuth } from "@/lib/auth-context"
import { redirect } from "next/navigation"

export default function Home() {
  const { isAuthenticated } = useAuth()
  
  // Nếu đã đăng nhập, chuyển hướng tới trang phù hợp (admin/staff)
  if (isAuthenticated) {
    return <RoleRedirector />
  }
  
  // Nếu chưa đăng nhập, chuyển hướng tới trang đăng nhập
  redirect("/login")
}
