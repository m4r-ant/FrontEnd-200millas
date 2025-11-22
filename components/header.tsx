"use client"

import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LogOut, Menu, ShoppingCart, X } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart-context"

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const { getItemCount } = useCart()
  const cartItemCount = getItemCount()
  const iconSize = "h-7 w-7";

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img
              src="https://quickeat-api.s3.amazonaws.com/media/200millas/ux_web/base_assets/200millas_header_logo_img_05062025_17_55_47.svgxml"
              alt="200 Millas Logo"
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            <Link href="/" className="hover:text-yellow-300 transition font-medium">
              Dashboard
            </Link>
            <Link href="/pedidos" className="hover:text-yellow-300 transition font-medium">
              Pedidos
            </Link>
            <Link href="/workflow" className="hover:text-yellow-300 transition font-medium">
              Workflow
            </Link>
          </nav>

          {/* User Info and Logout */}
          <div className="hidden md:flex gap-4 items-center">
            {cartItemCount === 0 ? (
              // ESTADO VACÍO (Icono AZUL, con cursor)
              <button
                className="relative cursor-pointer rounded-full p-2 text-[#1000a3] transition-all"
                aria-label="Ver carrito (vacío)"
              >
                <ShoppingCart className={iconSize} />
              </button>
            ) : (
              // ESTADO CON ITEMS (Caja AMARILLA, Icono AZUL, con cursor)
              <button
                className="relative cursor-pointer rounded-md bg-[#e2e200] px-2 py-1 flex items-center gap-1 text-[#1000a3] transition-all"
                aria-label={`Ver carrito (${cartItemCount} items)`}
              >
                <ShoppingCart className={iconSize} />
                <span className="text-base font-bold">{cartItemCount}</span>
              </button>
            )}
            <div className="text-right">
              <p className="text-sm font-medium">{user?.name || "Trabajador"}</p>
              <p className="text-xs text-blue-100">{user?.role || "Rol"}</p>
            </div>
            <Button onClick={handleLogout} variant="ghost" className="text-white hover:bg-blue-800" size="sm">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-4 bg-blue-800">
            <Link href="/" className="text-white hover:text-yellow-300 px-4 py-2">
              Dashboard
            </Link>
            <Link href="/pedidos" className="text-white hover:text-yellow-300 px-4 py-2">
              Pedidos
            </Link>
            <Link href="/workflow" className="text-white hover:text-yellow-300 px-4 py-2">
              Workflow
            </Link>
            <div className="px-4 py-2 border-t border-blue-700">
              <p className="text-sm font-medium mb-2">{user?.name || "Trabajador"}</p>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="text-white hover:bg-blue-700 w-full justify-start"
                size="sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
