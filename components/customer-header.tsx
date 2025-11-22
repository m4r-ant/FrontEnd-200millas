"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import CartSidebar from "@/components/cart-sidebar"

export default function CustomerHeader() {
  const { items, removeItem, updateQuantity, clearCart, getTotal, getItemCount } = useCart()
  const { isAuthenticated, user, logout } = useAuth()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const pathname = usePathname()
  const iconSize = "h-7 w-7";

  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = "/login"
      return
    }
    // Open checkout modal or redirect to checkout page
    setIsCartOpen(false)
    window.location.href = "/checkout"
  }

  return (
    <header className="bg-[#1000a3] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-200millas.svg"
              alt="200 Millas"
              width={150}
              height={50}
              priority
              style={{ filter: 'none' }}
            />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={`transition text-[20px] font-display font-bold cursor-pointer ${
                pathname === '/' ? 'text-[#e2e200] underline decoration-[#e2e200] underline-offset-4' : 'text-white hover:text-[#e2e200]'
              }`}
            >
              Inicio
            </Link>
            <Link
              href="/carta"
              className={`transition text-[20px] font-display font-bold cursor-pointer ${
                pathname === '/carta' ? 'text-[#e2e200] underline decoration-[#e2e200] underline-offset-4' : 'text-white hover:text-[#e2e200]'
              }`}
            >
              Carta
            </Link>
            <Link
              href="#"
              className={`transition text-[20px] font-display font-bold cursor-pointer ${
                pathname === '/cobertura' ? 'text-[#e2e200] underline decoration-[#e2e200] underline-offset-4' : 'text-white hover:text-[#e2e200]'
              }`}
            >
              Cobertura
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-8">
            {/* User menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/perfil"
                  className="text-sm hover:text-[#e2e200] transition hidden md:block cursor-pointer"
                >
                  {user?.name || "Mi Perfil"}
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-white hover:text-[#e2e200] hover:bg-[#1000a3]/90 cursor-pointer"
                >
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <Link href="/login" className="hidden md:flex items-center space-x-2 text-white hover:text-[#e2e200] transition text-[20px] font-display font-bold cursor-pointer">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Ingresar</span>
              </Link>
            )}

            {/* Cart button */}
            <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Abrir carrito"
                  className="p-2 cursor-pointer"
                >
                  {getItemCount() === 0 ? (
                    <ShoppingCart className={`${iconSize} text-white`} />
                  ) : (
                    <div className="flex items-center gap-1 rounded-md bg-[#e2e200] px-2 py-1">
                      <ShoppingCart className={`${iconSize} text-[#1000a3]`} />
                      <span className="font-bold text-[#1000a3]">{getItemCount()}</span>
                    </div>
                  )}
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-96">
                <SheetHeader>
                  <SheetTitle>Tu Pedido</SheetTitle>
                  <SheetDescription>
                    Revisa tu carrito y continúa con el pedido
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <CartSidebar
                    items={items}
                    onRemove={removeItem}
                    onQuantityChange={updateQuantity}
                    onCheckout={handleCheckout}
                  />
                </div>
              </SheetContent>
            </Sheet>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              className="md:hidden text-white hover:bg-[#1000a3]/90"
              size="sm"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}


