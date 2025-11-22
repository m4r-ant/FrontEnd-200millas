import type React from "react"
import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { CartProvider } from "@/lib/cart-context"
import { Toaster } from "sonner"
import "./globals.css"

const roboto = Roboto({
  weight: ["400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-display",
})

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "200 Millas - Fast Food Marino",
  description: "Somos Ceviche - Comida Marina Rápida",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${roboto.variable} ${inter.variable} font-sans antialiased`}>
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
        <Toaster position="top-center" />
        <Analytics />
      </body>
    </html>
  )
}
