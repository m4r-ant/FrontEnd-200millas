"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import CustomerHeader from "@/components/customer-header"
import CustomerFooter from "@/components/customer-footer"
import { useAuth } from "@/lib/auth-context"
import { apiClient } from "@/lib/api"
import type { Order } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { WorkflowTimeline } from "@/components/workflow-timeline"

const OrderStatusMap = {
  pending: { label: "Pendiente", color: "bg-yellow-500" },
  confirmed: { label: "Confirmado", color: "bg-blue-500" },
  cooking: { label: "Cocinando", color: "bg-orange-500" },
  ready: { label: "Listo", color: "bg-purple-500" },
  dispatched: { label: "En camino", color: "bg-green-500" },
  delivered: { label: "Entregado", color: "bg-green-600" },
  cancelled: { label: "Cancelado", color: "bg-red-500" },
}

export default function PerfilPage() {
  const router = useRouter()
  const { isAuthenticated, user, isLoading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState("pedidos")
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated && activeTab === "pedidos") {
      loadOrders()
    }
  }, [isAuthenticated, activeTab])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const data = await apiClient.orders.getAll({ customerId: user?.id })
      setOrders(data)
    } catch (error) {
      console.error("Error loading orders:", error)
      // Mock data as fallback
      setOrders([
        {
          id: "1",
          customerId: user?.id || "",
          items: [{ id: "1", menuItemId: "1", name: "Ceviche Clásico", quantity: 1, price: 18.0 }],
          status: "cooking",
          totalPrice: 23.0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deliveryAddress: "Av. Principal 123",
          estimatedDeliveryTime: "40 min",
        },
        {
          id: "2",
          customerId: user?.id || "",
          items: [{ id: "2", menuItemId: "2", name: "Ceviche Mixto", quantity: 2, price: 25.0 }],
          status: "delivered",
          totalPrice: 55.0,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 86400000).toISOString(),
          deliveryAddress: "Av. Principal 123",
          estimatedDeliveryTime: "40 min",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1000a3] mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const activeOrders = orders.filter((order) =>
    ["pending", "confirmed", "cooking", "ready", "dispatched"].includes(order.status)
  )
  const pastOrders = orders.filter((order) => ["delivered", "cancelled"].includes(order.status))

  return (
    <div className="min-h-screen bg-white">
      <CustomerHeader />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#1000a3] mb-8">Mi Perfil</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pedidos">Mis Pedidos</TabsTrigger>
            <TabsTrigger value="datos">Mis Datos</TabsTrigger>
            <TabsTrigger value="direcciones">Direcciones</TabsTrigger>
            <TabsTrigger value="configuracion">Configuración</TabsTrigger>
          </TabsList>

          {/* Mis Pedidos Tab */}
          <TabsContent value="pedidos" className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1000a3] mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando pedidos...</p>
              </div>
            ) : (
              <>
                {/* Active Orders */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">Pedidos en Proceso</h2>
                  {activeOrders.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <p className="text-gray-500">No tienes pedidos en proceso</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {activeOrders.map((order) => (
                        <Card key={order.id} className="hover:shadow-lg transition">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle>Pedido #{order.id.slice(0, 8)}</CardTitle>
                                <CardDescription>
                                  Realizado el {new Date(order.createdAt).toLocaleDateString()}
                                </CardDescription>
                              </div>
                              <Badge className={OrderStatusMap[order.status].color}>
                                {OrderStatusMap[order.status].label}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div>
                                <h4 className="font-semibold mb-2">Items:</h4>
                                <ul className="space-y-1">
                                  {order.items.map((item) => (
                                    <li key={item.id} className="text-sm text-gray-600">
                                      {item.quantity}x {item.name} - S/. {item.price.toFixed(2)}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="flex justify-between pt-3 border-t">
                                <span className="font-bold">Total:</span>
                                <span className="text-[#1000a3] font-bold">S/. {order.totalPrice.toFixed(2)}</span>
                              </div>
                              <div className="pt-3 border-t">
                                <WorkflowTimeline orderId={order.id} />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                {/* Past Orders */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">Historial</h2>
                  {pastOrders.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <p className="text-gray-500">No tienes pedidos anteriores</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {pastOrders.map((order) => (
                        <Card key={order.id} className="hover:shadow-lg transition">
                          <CardHeader>
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle>Pedido #{order.id.slice(0, 8)}</CardTitle>
                                <CardDescription>
                                  Realizado el {new Date(order.createdAt).toLocaleDateString()}
                                </CardDescription>
                              </div>
                              <Badge className={OrderStatusMap[order.status].color}>
                                {OrderStatusMap[order.status].label}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div>
                                <h4 className="font-semibold mb-2">Items:</h4>
                                <ul className="space-y-1">
                                  {order.items.map((item) => (
                                    <li key={item.id} className="text-sm text-gray-600">
                                      {item.quantity}x {item.name} - S/. {item.price.toFixed(2)}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="flex justify-between pt-3 border-t">
                                <span className="font-bold">Total:</span>
                                <span className="text-[#1000a3] font-bold">S/. {order.totalPrice.toFixed(2)}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>

          {/* Mis Datos Tab */}
          <TabsContent value="datos">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>Actualiza tu información personal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input id="name" value={user?.name || ""} disabled className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input id="email" type="email" value={user?.email || ""} disabled className="mt-2" />
                </div>
                <Button className="bg-[#1000a3] hover:bg-[#1000a3]/90">
                  Actualizar información
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Direcciones Tab */}
          <TabsContent value="direcciones">
            <Card>
              <CardHeader>
                <CardTitle>Mis Direcciones</CardTitle>
                <CardDescription>Administra tus direcciones de entrega</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">Casa</h4>
                      <p className="text-sm text-gray-600">Av. Principal 123, Lima</p>
                    </div>
                    <Badge>Casa</Badge>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Agregar nueva dirección
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuración Tab */}
          <TabsContent value="configuracion">
            <Card>
              <CardHeader>
                <CardTitle>Configuración</CardTitle>
                <CardDescription>Administra tus preferencias</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">Notificaciones push</h4>
                    <p className="text-sm text-gray-600">Recibe notificaciones sobre tus pedidos</p>
                  </div>
                  <Button variant="outline">Activar</Button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">Notificaciones por email</h4>
                    <p className="text-sm text-gray-600">Recibe actualizaciones por correo electrónico</p>
                  </div>
                  <Button variant="outline">Activar</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <CustomerFooter />
    </div>
  )
}

