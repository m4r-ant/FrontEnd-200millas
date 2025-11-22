"use client"
import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { apiClient } from "@/lib/api"
import type { DashboardSummary } from "@/lib/types"

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
    const interval = setInterval(loadDashboard, 10000)
    return () => clearInterval(interval)
  }, [])

  const loadDashboard = async () => {
    try {
      const data = await apiClient.dashboard.getSummary()
      setSummary(data)
    } catch (error) {
      console.error("Error loading dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-blue-900 mb-8">Dashboard</h1>

        {loading ? (
          <p>Cargando datos...</p>
        ) : summary ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
              <p className="text-sm opacity-90">Total de Pedidos</p>
              <p className="text-4xl font-bold">{summary.totalOrders}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg">
              <p className="text-sm opacity-90">Pedidos Pendientes</p>
              <p className="text-4xl font-bold">{summary.pendingOrders}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
              <p className="text-sm opacity-90">Pedidos Completados</p>
              <p className="text-4xl font-bold">{summary.completedOrders}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg">
              <p className="text-sm opacity-90">Ingresos Totales</p>
              <p className="text-4xl font-bold">S/. {summary.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-lg md:col-span-2 lg:col-span-4">
              <p className="text-sm opacity-90">Tiempo Promedio de Pedido</p>
              <p className="text-4xl font-bold">{summary.averageOrderTime} min</p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No hay datos disponibles</p>
        )}
      </div>
      <Footer />
    </main>
  )
}
