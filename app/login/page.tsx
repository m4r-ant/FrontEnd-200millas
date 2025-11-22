"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import CustomerHeader from "@/components/customer-header"
import CustomerFooter from "@/components/customer-footer"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulated login - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // For demo purposes, accept any email/password
      // In production, this should call the actual login API
      await login(email, password)
      
      toast.success("¡Bienvenido de nuevo!")
      router.push("/")
    } catch (error) {
      toast.error("Error al iniciar sesión", {
        description: "Verifica tus credenciales e intenta nuevamente",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    setIsLoading(true)

    try {
      // Simulated register - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      toast.success("¡Cuenta creada exitosamente!")
      toast.info("Ahora puedes iniciar sesión", {
        description: "Usa tus credenciales para acceder",
      })
      setShowRegister(false)
      setEmail("")
      setPassword("")
      setName("")
      setConfirmPassword("")
    } catch (error) {
      toast.error("Error al crear cuenta")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    // Simulated Google login
    toast.info("Login con Google", {
      description: "Esta función estará disponible pronto",
    })
  }

  const handleWhatsAppLogin = () => {
    // Simulated WhatsApp verification
    toast.info("Verificación por WhatsApp", {
      description: "Esta función estará disponible pronto",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1000a3] to-[#2000c3]">
      <CustomerHeader />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#1000a3] mb-2">
              {showRegister ? "Crear Cuenta" : "Inicia Sesión"}
            </h1>
            <p className="text-gray-600">
              {showRegister ? "Únete a 200 Millas" : "Accede a tu cuenta"}
            </p>
          </div>

          {!showRegister ? (
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <div className="flex justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                  <a href="#" className="text-sm text-[#1000a3] hover:underline">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="mt-2"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#e2e200] text-[#1000a3] hover:bg-[#e2e200]/90 font-bold text-lg py-6"
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-6">
              <div>
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan Pérez"
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="mt-2"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#e2e200] text-[#1000a3] hover:bg-[#e2e200]/90 font-bold text-lg py-6"
              >
                {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
              </Button>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t"></div>
            <span className="px-4 text-sm text-gray-500">O</span>
            <div className="flex-1 border-t"></div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full border-2 border-gray-300 hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continuar con Google
            </Button>

            <Button
              onClick={handleWhatsAppLogin}
              variant="outline"
              className="w-full border-2 border-gray-300 hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .808 4.5.007 10.184a11.717 11.717 0 003.285 11.689l-4.067 14.849 15.195-4.068a11.773 11.773 0 005.867 1.55h.005c6.554 0 11.918-5.342 12.545-12.063.616-6.616-4.846-12.404-11.456-12.404Z"/>
              </svg>
              Continuar con WhatsApp
            </Button>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            {!showRegister ? (
              <p className="text-gray-600">
                ¿No tienes una cuenta?{" "}
                <button
                  onClick={() => setShowRegister(true)}
                  className="text-[#1000a3] hover:underline font-semibold"
                >
                  Regístrate aquí
                </button>
              </p>
            ) : (
              <p className="text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <button
                  onClick={() => setShowRegister(false)}
                  className="text-[#1000a3] hover:underline font-semibold"
                >
                  Inicia sesión
                </button>
              </p>
            )}
          </div>
        </div>
      </main>
      <CustomerFooter />
    </div>
  )
}
