"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"

interface MenuCardProps {
  name: string
  price: string
  image: string
}

export default function MenuCard({ name, price, image }: MenuCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition transform hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gray-200">
        <img src={image || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
        {isHovered && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <button className="bg-primary text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-primary/90 transition">
              <ShoppingCart size={20} />
              Agregar
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-foreground mb-2">{name}</h3>
        <p className="text-2xl font-bold text-primary">{price}</p>
      </div>
    </div>
  )
}
