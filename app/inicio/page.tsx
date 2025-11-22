"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import Header from "@/components/header"
import { ClipboardList, Workflow, UtensilsCrossed, BarChart3, Settings } from "lucide-react"

export default function Inicio() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const navigationItems = [
    {
      title: "Pedidos",
      description: "Gestiona todos los pedidos del restaurante",
      icon: ClipboardList,
      href: "/pedidos",
      color: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
    },
    {
      title: "Workflow",
      description: "Sigue el flujo de preparación de pedidos",
      icon: Workflow,
      href: "/workflow",
      color: "bg-green-600",
      hoverColor: "hover:bg-green-700",
    },
    {
      title: "Menú",
      description: "Administra los items del menú",
      icon: UtensilsCrossed,
      href: "/menu",
      color: "bg-purple-600",
      hoverColor: "hover:bg-purple-700",
    },
    {
      title: "Reportes",
      description: "Visualiza reportes y estadísticas",
      icon: BarChart3,
      href: "/reportes",
      color: "bg-orange-600",
      hoverColor: "hover:bg-orange-700",
    },
    {
      title: "Dashboard",
      description: "Panel de control y métricas",
      icon: BarChart3,
      href: "/",
      color: "bg-indigo-600",
      hoverColor: "hover:bg-indigo-700",
    },
    {
      title: "Configuración",
      description: "Ajustes del restaurante",
      icon: Settings,
      href: "/configuracion",
      color: "bg-slate-600",
      hoverColor: "hover:bg-slate-700",
    },
  ]

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header Section */}
        <div className="bg-blue-900 text-white p-8 shadow-lg">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">200 Millas</h1>
            <p className="text-blue-100 text-lg">Sistema de Gestión de Pedidos</p>
          </div>
        </div>

        {/* Navigation Grid */}
        <div className="max-w-7xl mx-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href}>
                  <div className="h-full bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:scale-105">
                    {/* Color Header */}
                    <div
                      className={`${item.color} h-24 flex items-center justify-center ${item.hoverColor} transition-colors`}
                    >
                      <Icon className="w-12 h-12 text-white" />
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                      <p className="text-slate-600 text-sm">{item.description}</p>
                    </div>

                    {/* Footer */}
                    <div className="px-6 pb-4">
                      <div className="inline-block bg-yellow-400 text-blue-900 px-4 py-2 rounded font-semibold text-sm hover:bg-yellow-300 transition-colors">
                        Acceder →
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
