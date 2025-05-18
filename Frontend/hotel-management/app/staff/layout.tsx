import { Metadata } from "next"
import { StaffAuthCheck } from "@/components/staff/auth-check"

export const metadata: Metadata = {
  title: "Staff Panel | Hotel Management",
  description: "Staff panel for the hotel management system",
}

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <StaffAuthCheck>{children}</StaffAuthCheck>
} 