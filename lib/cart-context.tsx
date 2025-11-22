"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface SelectedOptionSummary {
  optionId: string
  name: string
  price: number
  quantity: number
  groupName?: string
}

export type SelectedOptionsByGroup = Record<string, SelectedOptionSummary[]>

// Define the structure of an item in the cart with its options
export interface CartItemWithOptions {
  id: string
  menuItemId: string
  name: string
  description: string
  price: number
  image: string
  quantity: number
  basePrice: number // Original price before extras
  selectedOptions: SelectedOptionsByGroup
  specialInstructions?: string
}

interface CartContextType {
  items: CartItemWithOptions[]
  addItem: (item: CartItemWithOptions) => void
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const normalizeSelectedOptionsSchema = (value: unknown): SelectedOptionsByGroup => {
  const result: SelectedOptionsByGroup = {}

  if (!value || typeof value !== "object") {
    return result
  }

  Object.entries(value as Record<string, unknown>).forEach(([groupId, raw]) => {
    if (!groupId) return

    if (Array.isArray(raw)) {
      // Already in new structure (array of summaries)
      const mapped = raw
        .map((entry) => {
          if (entry && typeof entry === "object") {
            const optionId = String((entry as SelectedOptionSummary).optionId ?? "")
            const quantity = Number((entry as SelectedOptionSummary).quantity ?? 0)
            if (!optionId || quantity <= 0) return null
            return {
              optionId,
              name: (entry as SelectedOptionSummary).name ?? "",
              price: Number((entry as SelectedOptionSummary).price ?? 0),
              quantity,
              groupName: (entry as SelectedOptionSummary).groupName ?? "",
            }
          }

          const optionId = String(entry)
          if (!optionId) return null
          return {
            optionId,
            name: "",
            price: 0,
            quantity: 1,
            groupName: "",
          }
        })
        .filter(Boolean) as SelectedOptionSummary[]

      if (mapped.length > 0) {
        result[groupId] = mapped
      }
    } else if (typeof raw === "string") {
      result[groupId] = [
        {
          optionId: raw,
          name: "",
          price: 0,
          quantity: 1,
          groupName: "",
        },
      ]
    } else if (raw && typeof raw === "object") {
      const mapped: SelectedOptionSummary[] = []
      Object.entries(raw as Record<string, unknown>).forEach(([optionId, entry]) => {
        if (!optionId) return
        if (entry && typeof entry === "object" && "quantity" in (entry as Record<string, unknown>)) {
          const quantity = Number((entry as Record<string, unknown>).quantity ?? 0)
          if (quantity > 0) {
            mapped.push({
              optionId,
              quantity,
              name: (entry as Record<string, unknown>).name ? String((entry as Record<string, unknown>).name) : "",
              price: Number((entry as Record<string, unknown>).price ?? 0),
              groupName: (entry as Record<string, unknown>).groupName ? String((entry as Record<string, unknown>).groupName) : "",
            })
          }
        } else if (typeof entry === "number" && entry > 0) {
          mapped.push({ optionId, name: "", price: 0, quantity: entry, groupName: "" })
        }
      })
      if (mapped.length > 0) {
        result[groupId] = mapped
      }
    }
  })

  return result
}

const areSelectedOptionsEqual = (a: SelectedOptionsByGroup, b: SelectedOptionsByGroup) => {
  const entriesA = Object.entries(a || {}).map(([groupId, selections]) => ({
    groupId,
    selections: [...(selections ?? [])]
      .map((selection) => ({ optionId: selection.optionId, quantity: selection.quantity }))
      .sort((left, right) => left.optionId.localeCompare(right.optionId)),
  }))

  const entriesB = Object.entries(b || {}).map(([groupId, selections]) => ({
    groupId,
    selections: [...(selections ?? [])]
      .map((selection) => ({ optionId: selection.optionId, quantity: selection.quantity }))
      .sort((left, right) => left.optionId.localeCompare(right.optionId)),
  }))

  if (entriesA.length !== entriesB.length) {
    return false
  }

  entriesA.sort((left, right) => left.groupId.localeCompare(right.groupId))
  entriesB.sort((left, right) => left.groupId.localeCompare(right.groupId))

  for (let index = 0; index < entriesA.length; index += 1) {
    const entryA = entriesA[index]
    const entryB = entriesB[index]

    if (entryA.groupId !== entryB.groupId) {
      return false
    }

    if (entryA.selections.length !== entryB.selections.length) {
      return false
    }

    for (let innerIndex = 0; innerIndex < entryA.selections.length; innerIndex += 1) {
      const selectionA = entryA.selections[innerIndex]
      const selectionB = entryB.selections[innerIndex]

      if (selectionA.optionId !== selectionB.optionId || selectionA.quantity !== selectionB.quantity) {
        return false
      }
    }
  }

  return true
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItemWithOptions[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart) as CartItemWithOptions[]
        const normalized = parsed.map((item) => ({
          ...item,
          selectedOptions: normalizeSelectedOptionsSchema(item.selectedOptions),
        }))
        setItems(normalized)
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("cart", JSON.stringify(items))
    } else {
      localStorage.removeItem("cart")
    }
  }, [items])

  const addItem = (incomingItem: CartItemWithOptions) => {
    const normalizedIncoming: CartItemWithOptions = {
      ...incomingItem,
      selectedOptions: normalizeSelectedOptionsSchema(incomingItem.selectedOptions),
    }

    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.menuItemId === normalizedIncoming.menuItemId &&
          areSelectedOptionsEqual(item.selectedOptions, normalizedIncoming.selectedOptions)
      )

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems]
        const existing = updatedItems[existingItemIndex]
        updatedItems[existingItemIndex] = {
          ...existing,
          quantity: existing.quantity + normalizedIncoming.quantity,
          price: normalizedIncoming.price,
          basePrice: normalizedIncoming.basePrice,
          selectedOptions: normalizedIncoming.selectedOptions,
        }
        return updatedItems
      }

      return [...prevItems, normalizedIncoming]
    })
  }

  const removeItem = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const getItemCount = () => {
    return items.reduce((sum, item) => sum + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

