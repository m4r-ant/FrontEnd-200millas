"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import CustomerHeader from "@/components/customer-header"
import CustomerFooter from "@/components/customer-footer"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import { apiClient } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getTotal, clearCart } = useCart()
  const { isAuthenticated, user } = useAuth()
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery")
  const [address, setAddress] = useState("")
  const [addressDetails, setAddressDetails] = useState("")
  const [reference, setReference] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isAuthenticated) {
    router.push("/login")
    return null
  }

  const subtotal = getTotal()
  const deliveryFee = deliveryType === "delivery" ? 5.0 : 0
  const total = subtotal + deliveryFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Format the order items
      const orderItems = items.map((item) => ({
        id: item.menuItemId,
        menuItemId: item.menuItemId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        specialInstructions: item.specialInstructions,
      }))

      // Create the order object
      const order = {
        customerId: user?.id || "",
        items: orderItems,
        status: "pending",
        totalPrice: total,
        deliveryAddress: deliveryType === "delivery" ? `${address}${addressDetails ? `, ${addressDetails}` : ""}` : "",
        deliveryType: deliveryType,
        notes: notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Submit the order
      const result = await apiClient.orders.create(order)

      // Show success message
      toast.success("¡Pedido realizado con éxito!", {
        description: `Tu pedido #${result.id} ha sido recibido`,
      })

      // Clear cart
      clearCart()

      // Redirect to order tracking
      router.push(`/pedidos/${result.id}`)
    } catch (error) {
      console.error("Error creating order:", error)
      toast.error("Error al realizar el pedido", {
        description: "Por favor intenta nuevamente",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <CustomerHeader />
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h1>
            <p className="text-gray-600 mb-8">Agrega productos para continuar con tu pedido</p>
            <Button onClick={() => router.push("/carta")} className="bg-[#1000a3] hover:bg-[#1000a3]/90">
              Ver Carta
            </Button>
          </div>
        </main>
        <CustomerFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomerHeader />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#1000a3] mb-8">Finalizar Pedido</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Delivery Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información de Entrega</CardTitle>
                <CardDescription>Selecciona el tipo de entrega</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={deliveryType} onValueChange={setDeliveryType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery" className="cursor-pointer flex-1">
                      Delivery a domicilio
                      <span className="text-sm text-gray-500 ml-2">S/. 5.00</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="cursor-pointer">
                      Recoger en tienda (Gratis)
                    </Label>
                  </div>
                </RadioGroup>

                {deliveryType === "delivery" && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <Label htmlFor="address">Dirección de entrega *</Label>
                      <Input
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Ej: Av. Principal 123"
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="addressDetails">Detalles adicionales (opcional)</Label>
                      <Input
                        id="addressDetails"
                        value={addressDetails}
                        onChange={(e) => setAddressDetails(e.target.value)}
                        placeholder="Ej: Piso 3, Dpto. 301"
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="reference">Referencia</Label>
                      <Input
                        id="reference"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        placeholder="Ej: Frente al parque"
                        className="mt-2"
                      />
                    </div>
                  </div>
                )}

                {deliveryType === "pickup" && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-900">
                      Recogerás tu pedido en: <strong>Jr. Principal 123, Cercado de Lima</strong>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="phone">Teléfono de contacto *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+51 987 654 321"
                      required
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notas adicionales (opcional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Instrucciones especiales para el repartidor..."
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <div className="flex-1">
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-gray-600">Cantidad: {item.quantity}</p>
                          {item.specialInstructions && (
                            <p className="text-xs text-gray-500 italic">{item.specialInstructions}</p>
                          )}
                        </div>
                        <span className="font-semibold text-[#1000a3]">
                          S/. {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>S/. {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery</span>
                      <span>{deliveryType === "delivery" ? "S/. 5.00" : "Gratis"}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span className="text-[#1000a3]">S/. {total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#e2e200] text-[#1000a3] hover:bg-[#e2e200]/90 font-bold text-lg py-6"
                  >
                    {isSubmitting ? "Procesando..." : "Confirmar Pedido"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </main>
      <CustomerFooter />
    </div>
  )
}

