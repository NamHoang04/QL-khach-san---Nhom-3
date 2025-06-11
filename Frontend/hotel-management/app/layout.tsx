import { SidebarProvider } from "@/components/sidebar-provider"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { SavedProvider } from "@/lib/saved-context"
import { Toaster } from "sonner"

export const metadata = {
  title: 'Hotel Management',
  description: 'Hotel Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          <SavedProvider>
            <SidebarProvider>
              <main className="flex-1">
                {children}
              </main>
              <Toaster position="top-right" richColors />
            </SidebarProvider>
          </SavedProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
