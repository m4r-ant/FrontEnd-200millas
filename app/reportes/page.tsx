"use client"

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft, Download } from "lucide-react"

const revenueData = [
  { date: "Lun", revenue: 450, orders: 12 },
  { date: "Mar", revenue: 520, orders: 15 },
  { date: "Mié", revenue: 480, orders: 13 },
  { date: "Jue", revenue: 610, orders: 18 },
  { date: "Vie", revenue: 750, orders: 22 },
  { date: "Sab", revenue: 890, orders: 28 },
  { date: "Dom", revenue: 720, orders: 20 },
]

const categoryData = [
  { category: "Ceviches", sales: 45 },
  { category: "Promos", sales: 38 },
  { category: "Bowls", sales: 32 },
  { category: "Fritazo", sales: 28 },
  { category: "Sopas", sales: 22 },
]

export default function ReportesPage() {
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
              <h1 className="text-3xl font-bold">Reportes</h1>
              <p className="text-blue-100 mt-1">Análisis de ventas y operaciones</p>
            </div>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Download className="w-5 h-5 mr-2" />
            Descargar
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Revenue Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Ingresos y Pedidos por Día</CardTitle>
            <CardDescription>Últimos 7 días</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#0066cc" name="Ingresos (S/.)" />
                <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#ff6b35" name="Pedidos" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Sales */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas por Categoría</CardTitle>
            <CardDescription>Productos más vendidos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#0066cc" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
