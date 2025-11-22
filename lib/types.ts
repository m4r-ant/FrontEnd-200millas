// Type definitions for API communication
export interface Order {
  id: string
  customerId: string
  items: OrderItem[]
  status: OrderStatus
  totalPrice: number
  createdAt: string
  updatedAt: string
  deliveryAddress: string
  estimatedDeliveryTime: string
}

export interface OrderItem {
  id: string
  menuItemId: string
  name: string
  quantity: number
  price: number
  specialInstructions?: string
}

export type OrderStatus = "pending" | "confirmed" | "cooking" | "ready" | "dispatched" | "delivered" | "cancelled"

export interface WorkflowStep {
  id: string
  orderId: string
  stepType: "cooking" | "packing" | "delivery"
  status: "pending" | "in_progress" | "completed"
  assignedTo?: string
  startTime?: string
  endTime?: string
  notes?: string
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  available: boolean
  configuracionOpciones?: OptionConfig[]
}

export interface OptionConfig {
  id: string
  name: string
  type: "radio" | "checkbox" | "number"
  required: boolean
  options: {
    id: string
    name: string
    price: number
    image?: string
  }[]
  maxSelections?: number
  defaultSelection?: string
}

export interface MenuCategory {
  id: string
  name: string
  description?: string
  image?: string
}

export interface User {
  id: string
  email: string
  name: string
  role: "customer" | "cook" | "dispatcher" | "driver" | "admin"
  tenantId: string
}

export interface DashboardSummary {
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  totalRevenue: number
  averageOrderTime: number
}
