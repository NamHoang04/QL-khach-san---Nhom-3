import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Quản lý Phòng | Hotel Management",
}

export default function RoomsManagementLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 