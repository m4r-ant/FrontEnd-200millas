"use client"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"

export default function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
      >
        <div className="w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-semibold hidden sm:inline">{user?.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b">
            <p className="font-semibold">{user?.name}</p>
            <p className="text-xs text-gray-600">{user?.email}</p>
            <p className="text-xs text-gray-500 capitalize">Rol: {user?.role}</p>
          </div>
          <div className="p-2 space-y-1">
            {user?.role === "admin" && (
              <Link href="/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-100 rounded transition">
                Dashboard
              </Link>
            )}
            {user?.role === "cook" || user?.role === "dispatcher" || user?.role === "driver" ? (
              <Link href="/restaurante" className="block px-4 py-2 text-sm hover:bg-gray-100 rounded transition">
                Panel de Trabajo
              </Link>
            ) : (
              <Link href="/pedidos" className="block px-4 py-2 text-sm hover:bg-gray-100 rounded transition">
                Mis Pedidos
              </Link>
            )}
            <button
              onClick={() => {
                logout()
                setIsOpen(false)
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
