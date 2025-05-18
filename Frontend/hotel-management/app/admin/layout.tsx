import { Metadata } from "next"
import { AdminAuthCheck } from "@/components/admin/auth-check"

export const metadata: Metadata = {
  title: "Admin Panel | Hotel Management",
  description: "Admin panel for the hotel management system",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminAuthCheck>{children}</AdminAuthCheck>
}