"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ChevronLeft, Clock, MapPin, Phone, AlertCircle } from "lucide-react"
import { apiClient } from "@/lib/api"
import Header from "@/components/header"

const statusConfig = {
  pending: { label: "Pendiente", color: "bg-red-100 text-red-800", icon: "⏳" },
  cooking: { label: "Cocinando", color: "bg-orange-100 text-orange-800", icon: "👨‍🍳" },
  ready: { label: "Listo", color: "bg-green-100 text-green-800", icon: "✓" },
  dispatched: { label: "En Ruta", color: "bg-blue-100 text-blue-800", icon: "🚗" },
  delivered: { label: "Entregado", color: "bg-gray-100 text-gray-800", icon: "📦" },
}

export default function PedidosPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState("")
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders()
    }
  }, [isAuthenticated])

  const fetchOrders = async () => {
    try {
      setDataLoading(true)
      setError("")
      const data = await apiClient.orders.getAll()
      setOrders(data || [])
    } catch (err) {
      console.error("[v0] Error fetching orders:", err)
      setError("Error al cargar los pedidos")
    } finally {
      setDataLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId)
      await apiClient.orders.updateStatus(orderId, newStatus)

      // Update local state
      setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
    } catch (err) {
      console.error("[v0] Error updating order status:", err)
      setError("Error al actualizar el estado del pedido")
    } finally {
      setUpdatingOrderId(null)
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === "all" || order.status === filter
    const matchesSearch =
      order.id.includes(searchTerm) || order.customer?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  if (isLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-slate-600">Cargando pedidos...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header */}
        <div className="bg-blue-900 text-white p-6 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:bg-blue-800">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Gestión de Pedidos</h1>
              <p className="text-blue-100 mt-1">Total: {orders.length} pedidos</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-8">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Search and Filter */}
          <div className="mb-6 flex gap-4 flex-col md:flex-row">
            <Input
              placeholder="Buscar por ID o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:w-64"
            />
            <div className="flex gap-2 flex-wrap">
              {["all", "pending", "cooking", "ready", "dispatched", "delivered"].map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? "default" : "outline"}
                  onClick={() => setFilter(status)}
                  className={filter === status ? "bg-blue-900" : ""}
                >
                  {status === "all" ? "Todos" : statusConfig[status as keyof typeof statusConfig]?.label || status}
                </Button>
              ))}
            </div>
          </div>

          {/* Orders Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{order.id}</CardTitle>
                      <CardDescription>{order.createdAt}</CardDescription>
                    </div>
                    <Badge className={statusConfig[order.status as keyof typeof statusConfig]?.color}>
                      {statusConfig[order.status as keyof typeof statusConfig]?.label}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Customer Info */}
                  <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                    <p className="font-semibold text-slate-900">{order.customer}</p>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4" />
                      {order.phone}
                    </div>
                    <div className="flex items-start gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 mt-0.5" />
                      {order.address}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    <p className="font-semibold text-slate-900">Artículos:</p>
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-sm text-slate-600">
                        <span>
                          {item.qty}x {item.name}
                        </span>
                        <span>S/. {(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 flex justify-between font-semibold text-slate-900">
                      <span>Total:</span>
                      <span>S/. {order.total?.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Time Estimate */}
                  <div className="flex items-center gap-2 text-sm bg-blue-50 p-3 rounded-lg text-blue-700">
                    <Clock className="w-4 h-4" />
                    Tiempo estimado: {order.estimatedTime}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4">
                    {order.status === "pending" && (
                      <Button
                        onClick={() => updateOrderStatus(order.id, "cooking")}
                        disabled={updatingOrderId === order.id}
                        className="flex-1 bg-orange-600 hover:bg-orange-700"
                      >
                        {updatingOrderId === order.id ? "Actualizando..." : "Iniciar Preparación"}
                      </Button>
                    )}
                    {order.status === "cooking" && (
                      <Button
                        onClick={() => updateOrderStatus(order.id, "ready")}
                        disabled={updatingOrderId === order.id}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        {updatingOrderId === order.id ? "Actualizando..." : "Marcar Listo"}
                      </Button>
                    )}
                    {order.status === "ready" && (
                      <Button
                        onClick={() => updateOrderStatus(order.id, "dispatched")}
                        disabled={updatingOrderId === order.id}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                      >
                        {updatingOrderId === order.id ? "Actualizando..." : "Enviar"}
                      </Button>
                    )}
                    {order.status === "dispatched" && (
                      <Button
                        onClick={() => updateOrderStatus(order.id, "delivered")}
                        disabled={updatingOrderId === order.id}
                        className="flex-1 bg-gray-600 hover:bg-gray-700"
                      >
                        {updatingOrderId === order.id ? "Actualizando..." : "Entregado"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredOrders.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-slate-600">No hay pedidos que coincidan con los filtros</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
