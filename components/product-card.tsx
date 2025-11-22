import Image from "next/image"
import type { MenuItem } from "@/lib/types"

interface ProductCardProps {
  menuItem: MenuItem;
  onSelect: (menuItem: MenuItem) => void;
}

export function ProductCard({ menuItem, onSelect }: ProductCardProps) {
  const isAvailable = menuItem.available ?? true;
  return (
    <button
      type="button"
      onClick={() => onSelect(menuItem)}
      className={`relative w-full text-left rounded-lg bg-[#FCF7F1] transition-transform transition-shadow duration-200 ease-in-out flex overflow-hidden ${
        isAvailable
          ? "hover:shadow-lg hover:scale-105 hover:z-10 cursor-pointer"
          : "cursor-pointer"
      }`}
    >
      <div className="relative w-48 h-44 shrink-0">
        <Image
          src={menuItem.image || "/placeholder.svg"}
          alt={menuItem.name}
          fill
          className={`object-cover ${!isAvailable ? "filter grayscale" : ""}`}
          sizes="192px"
          priority={false}
        />
      </div>
      <div className="flex-1 flex flex-col justify-between p-4 text-[#000000]">
        <div>
          <h4 className="font-display font-bold text-base md:text-lg leading-snug line-clamp-2">{menuItem.name}</h4>
          <p className="mt-1 text-sm md:text-[15px] leading-snug opacity-80 line-clamp-2">{menuItem.description}</p>
        </div>
        <div className="mt-3 flex items-center justify-end">
          <span className="font-bold text-lg md:text-xl">S/ {menuItem.price.toFixed(2)}</span>
        </div>
      </div>
    </button>
  )
}


