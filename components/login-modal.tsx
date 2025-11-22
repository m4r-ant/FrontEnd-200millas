"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simular login
    setTimeout(() => {
      console.log("Login con:", { email, password })
      setIsLoading(false)
      setEmail("")
      setPassword("")
      onClose()
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-8 relative">
        {/* Botón cerrar */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition">
          <X size={24} />
        </button>

        {/* Contenido */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-900 mb-2">Ingresar</h2>
          <p className="text-gray-600">Accede a tu cuenta de 200 Millas</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-900 text-white font-bold py-2 rounded-lg hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        {/* Enlace registro */}
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            ¿No tienes cuenta? <button className="text-blue-900 font-bold hover:underline">Regístrate aquí</button>
          </p>
        </div>
      </div>
    </div>
  )
}
