"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ChevronLeft, Plus, Edit2, Trash2 } from "lucide-react"

const mockMenuItems = [
  {
    id: 1,
    name: "Ceviche Mixto",
    category: "Ceviches",
    price: 46.9,
    available: true,
    description: "Ceviche de pescado y mariscos",
  },
  {
    id: 2,
    name: "Promo Doble Trío",
    category: "Promos",
    price: 46.9,
    available: true,
    description: "2 Tríos de pescado",
  },
  {
    id: 3,
    name: "Bowls Del Tigre",
    category: "Bowls",
    price: 28.9,
    available: false,
    description: "Bowl con leche de tigre",
  },
  {
    id: 4,
    name: "Fritazo Marino",
    category: "Fritazo",
    price: 35.9,
    available: true,
    description: "Variedad de fritos marinos",
  },
]

export default function MenuPage() {
  const [items, setItems] = useState(mockMenuItems)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleAvailability = (id: number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, available: !item.available } : item)))
  }

  const deleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-blue-900 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:bg-blue-800">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Gestionar Menú</h1>
              <p className="text-blue-100 mt-1">Total de items: {items.length}</p>
            </div>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Item
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Buscar por nombre o categoría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Items Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Nombre</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Categoría</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Precio</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Estado</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-slate-900">{item.name}</p>
                          <p className="text-sm text-slate-600">{item.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{item.category}</td>
                      <td className="px-6 py-4 font-semibold text-slate-900">S/. {item.price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <Badge className={item.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {item.available ? "Disponible" : "No Disponible"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button onClick={() => toggleAvailability(item.id)} variant="outline" size="sm">
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            onClick={() => deleteItem(item.id)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
