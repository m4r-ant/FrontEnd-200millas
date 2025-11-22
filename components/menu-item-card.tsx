"use client"
import { useState } from "react"
import type { MenuItem } from "@/lib/types"

interface MenuItemCardProps {
  item: MenuItem
  onAddToCart: (item: MenuItem) => void
}

export default function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(1)

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      onAddToCart(item)
    }
    setQuantity(1)
  }

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition bg-white">
      <div className="relative">
        <img
          src={item.image || "/placeholder.svg?height=200&width=300&query=food"}
          alt={item.name}
          className="w-full h-40 object-cover"
        />
        {!item.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold">No disponible</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-blue-900">S/. {item.price.toFixed(2)}</span>
          {item.available && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-6 h-6 bg-gray-300 rounded text-xs font-bold hover:bg-gray-400"
              >
                -
              </button>
              <span className="w-6 text-center text-sm font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-6 h-6 bg-gray-300 rounded text-xs font-bold hover:bg-gray-400"
              >
                +
              </button>
              <button
                onClick={handleAdd}
                className="bg-yellow-400 text-black px-3 py-1 rounded font-bold hover:bg-yellow-500 text-sm ml-2"
              >
                Agregar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
