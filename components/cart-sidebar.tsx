"use client"
import type { CartItemWithOptions } from "@/lib/cart-context"

interface CartSidebarProps {
  items: CartItemWithOptions[]
  onRemove: (itemId: string) => void
  onQuantityChange: (itemId: string, quantity: number) => void
  onCheckout: () => void
  isLoading?: boolean
}

const formatCurrency = (value: number) => `S/. ${value.toFixed(2)}`

export default function CartSidebar({ items, onRemove, onQuantityChange, onCheckout, isLoading }: CartSidebarProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="sticky top-20 h-fit rounded-lg border border-gray-200 bg-gray-50 p-6">
      <h2 className="mb-4 text-2xl font-bold text-[#1000a3]">Carrito</h2>

      {items.length === 0 ? (
        <p className="py-8 text-center text-gray-500">Tu carrito está vacío</p>
      ) : (
        <>
          <div className="mb-4 max-h-96 space-y-3 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex items-start justify-between border-b pb-3">
                <div className="flex-1 pr-3">
                  <p className="text-sm font-semibold">{item.name}</p>
                  <p className="text-xs text-gray-600">{formatCurrency(item.price)}</p>
                  {Object.keys(item.selectedOptions).length > 0 && (
                    <div className="mt-2 space-y-2 rounded-lg bg-white p-2 text-xs text-gray-600 shadow-sm">
                      {Object.entries(item.selectedOptions).map(([groupId, selections]) => (
                        <div key={`${item.id}-${groupId}`} className="space-y-1">
                          <p className="font-semibold text-gray-700">
                            {selections?.[0]?.groupName || groupId}
                          </p>
                          <ul className="space-y-1">
                            {selections.map((selection) => (
                              <li key={`${selection.optionId}`} className="flex justify-between gap-2 text-gray-500">
                                <span>
                                  {selection.quantity}× {selection.name || selection.optionId}
                                </span>
                                {selection.price > 0 && (
                                  <span className="font-medium text-[#1000a3]">
                                    +{formatCurrency(selection.price * selection.quantity)}
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                    className="h-6 w-6 rounded bg-gray-300 text-xs font-bold hover:bg-gray-400"
                    aria-label={`Disminuir ${item.name}`}
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-sm font-bold">{item.quantity}</span>
                  <button
                    onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                    className="h-6 w-6 rounded bg-gray-300 text-xs font-bold hover:bg-gray-400"
                    aria-label={`Aumentar ${item.name}`}
                  >
                    +
                  </button>
                  <button
                    onClick={() => onRemove(item.id)}
                    className="ml-2 text-xs text-red-500 hover:text-red-700"
                    aria-label={`Eliminar ${item.name}`}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 border-t pt-4">
            <div className="flex justify-between">
              <span className="font-semibold">Subtotal:</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Delivery:</span>
              <span>S/. 5.00</span>
            </div>
            <div className="flex justify-between border-t pt-3">
              <span className="text-lg font-bold">Total:</span>
              <span className="text-2xl font-bold text-[#1000a3]">{formatCurrency(total + 5)}</span>
            </div>
            <button
              onClick={onCheckout}
              disabled={isLoading}
              className="w-full rounded-lg bg-[#1000a3] py-3 font-bold text-white transition hover:bg-[#1008b6] disabled:opacity-50"
            >
              {isLoading ? "Procesando..." : "Confirmar Pedido"}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
