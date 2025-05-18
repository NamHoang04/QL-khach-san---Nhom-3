import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Booking Management | Admin Panel",
  description: "Manage hotel bookings and reservations",
}

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 