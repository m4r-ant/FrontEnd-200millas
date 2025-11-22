"use client"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { apiClient } from "./api"
import type { User } from "./types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  tenantId: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [tenantId, setTenantId] = useState(process.env.NEXT_PUBLIC_TENANT_ID || "200millas")

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await apiClient.auth.login(email, password)
      if (response.user) {
        setUser(response.user)
        localStorage.setItem("user", JSON.stringify(response.user))
        localStorage.setItem("token", response.token)
        setTenantId(response.user.tenantId)
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await apiClient.auth.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      localStorage.removeItem("user")
      localStorage.removeItem("token")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        tenantId,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
