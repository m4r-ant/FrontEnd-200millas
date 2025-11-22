"use client"
import type { Order } from "@/lib/types"

interface OrderCardProps {
  order: Order
  isSelected: boolean
  onClick: () => void
}

export default function OrderCard({ order, isSelected, onClick }: OrderCardProps) {
  const statusColors: Record<string, string> = {
    pending: "bg-red-100 text-red-800 border-red-300",
    confirmed: "bg-blue-100 text-blue-800 border-blue-300",
    cooking: "bg-orange-100 text-orange-800 border-orange-300",
    ready: "bg-green-100 text-green-800 border-green-300",
    dispatched: "bg-purple-100 text-purple-800 border-purple-300",
    delivered: "bg-gray-100 text-gray-800 border-gray-300",
    cancelled: "bg-gray-100 text-gray-800 border-gray-300",
  }

  return (
    <div
      onClick={onClick}
      className={`border-2 rounded-lg p-4 cursor-pointer transition ${
        isSelected ? "border-blue-900 bg-blue-50" : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg">Pedido #{order.id.slice(0, 8).toUpperCase()}</h3>
          <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString("es-PE")}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[order.status]}`}>
          {order.status.toUpperCase()}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-600">Items</p>
          <p className="font-bold">{order.items.length}</p>
        </div>
        <div>
          <p className="text-gray-600">Total</p>
          <p className="font-bold">S/. {order.totalPrice.toFixed(2)}</p>
        </div>
      </div>
    </div>
  )
}
