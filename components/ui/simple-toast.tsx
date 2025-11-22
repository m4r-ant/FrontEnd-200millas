"use client"

import { Info, X } from "lucide-react"
import { useEffect } from "react"

interface SimpleToastProps {
  message: string
  type: "error" | "success"
  onClose: () => void
  duration?: number
}

export function SimpleToast({ message, type, onClose, duration = 3000 }: SimpleToastProps) {
  const bgColor = type === "error" ? "bg-red-600" : "bg-green-600"

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [onClose, duration])


  return (
    <div className="fixed top-5 right-5 z-[100] animate-in slide-in-from-top">
      <div
        className={`flex items-center justify-between gap-4 p-4 pr-3 rounded-lg text-white shadow-lg ${bgColor}`}
      >
        <div className="flex items-center gap-3">
            <div className="bg-white/20 p-1 rounded-full">
                <Info className="h-5 w-5" />
            </div>
            <span className="font-semibold">{message}</span>
        </div>
        <button onClick={onClose} aria-label="Cerrar notificacion" className="p-1 rounded-full hover:bg-white/20 cursor-pointer">
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
