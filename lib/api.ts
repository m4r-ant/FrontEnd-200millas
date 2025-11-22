const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

const getAuthHeaders = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  }
}

export const apiClient = {
  // Orders endpoints
  orders: {
    create: async (orderData: any) => {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(orderData),
      })
      if (!response.ok) throw new Error("Failed to create order")
      return response.json()
    },
    getById: async (orderId: string) => {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error("Failed to fetch order")
      return response.json()
    },
    getAll: async (filters?: any) => {
      const params = new URLSearchParams(filters)
      const response = await fetch(`${API_BASE_URL}/orders?${params}`, {
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error("Failed to fetch orders")
      return response.json()
    },
    updateStatus: async (orderId: string, status: string) => {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, updatedAt: new Date().toISOString() }),
      })
      if (!response.ok) throw new Error("Failed to update order status")
      return response.json()
    },
  },

  // Menu endpoints
  menu: {
    getCategories: async () => {
      const response = await fetch(`${API_BASE_URL}/menu/categories`, {
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error("Failed to fetch categories")
      return response.json()
    },
    getItems: async (categoryId?: string) => {
      const url = categoryId ? `${API_BASE_URL}/menu/items?category=${categoryId}` : `${API_BASE_URL}/menu/items`
      const response = await fetch(url, {
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error("Failed to fetch menu items")
      return response.json()
    },
  },

  // Workflow endpoints - Enhanced with POST for step updates
  workflow: {
    getSteps: async (orderId: string) => {
      const response = await fetch(`${API_BASE_URL}/workflow${orderId ? `/${orderId}/steps` : ""}`, {
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error("Failed to fetch workflow steps")
      return response.json()
    },
    updateStep: async (orderId: string, stepId: string, data: any) => {
      const response = await fetch(`${API_BASE_URL}/workflow/${orderId}/steps/${stepId}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...data,
          updatedAt: new Date().toISOString(),
        }),
      })
      if (!response.ok) throw new Error("Failed to update workflow step")
      return response.json()
    },
  },

  // Auth endpoints
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      if (!response.ok) throw new Error("Login failed")
      return response.json()
    },
    logout: async () => {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error("Logout failed")
      return response.json()
    },
  },

  // Dashboard endpoints
  dashboard: {
    getSummary: async () => {
      const response = await fetch(`${API_BASE_URL}/dashboard/summary`, {
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error("Failed to fetch dashboard summary")
      return response.json()
    },
    getMetrics: async (dateRange?: any) => {
      const params = new URLSearchParams(dateRange)
      const response = await fetch(`${API_BASE_URL}/dashboard/metrics?${params}`, {
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error("Failed to fetch metrics")
      return response.json()
    },
  },
}
