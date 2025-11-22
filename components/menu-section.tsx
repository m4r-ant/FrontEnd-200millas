"use client"

import { useState } from "react"
import MenuCard from "./menu-card"

const categories = [
  { id: "promos", name: "Promos Fast", icon: "⚡" },
  { id: "express", name: "Express", icon: "🚀" },
  { id: "promociones", name: "Promociones", icon: "🎉" },
  { id: "sopas", name: "Sopas Power", icon: "🍲" },
  { id: "bowls", name: "Bowls del Tigre", icon: "🐯" },
  { id: "leche", name: "Leche de Tigre", icon: "🥛" },
  { id: "ceviches", name: "Ceviches", icon: "🍤" },
  { id: "fritazo", name: "Fritazo", icon: "🍟" },
  { id: "mostrimar", name: "Mostrimar", icon: "🦐" },
  { id: "combos", name: "Combos", icon: "📦" },
]

const menuItems = {
  promos: [
    { name: "Ceviche Clásico", price: "S/ 18.90", image: "/ceviche-clasico.jpg" },
    { name: "Ceviche Mixto", price: "S/ 22.90", image: "/ceviche-mixto.jpg" },
    { name: "Tiradito", price: "S/ 20.90", image: "/tiradito-peruano.jpg" },
  ],
  express: [
    { name: "Bowl Rápido", price: "S/ 16.90", image: "/bowl-marino.jpg" },
    { name: "Sándwich Marino", price: "S/ 14.90", image: "/sandwich-marino.jpg" },
    { name: "Taco Marino", price: "S/ 12.90", image: "/taco-marino.jpg" },
  ],
  ceviches: [
    { name: "Ceviche Premium", price: "S/ 28.90", image: "/ceviche-premium.jpg" },
    { name: "Ceviche Especial", price: "S/ 25.90", image: "/ceviche-especial.jpg" },
    { name: "Ceviche Tradicional", price: "S/ 19.90", image: "/ceviche-tradicional.jpg" },
  ],
  sopas: [
    { name: "Sopa de Mariscos", price: "S/ 24.90", image: "/sopa-mariscos.jpg" },
    { name: "Chupe de Camarones", price: "S/ 26.90", image: "/chupe-camarones.jpg" },
    { name: "Sopa a la Marinera", price: "S/ 23.90", image: "/sopa-marinera.jpg" },
  ],
}

export default function MenuSection() {
  const [activeCategory, setActiveCategory] = useState("promos")

  return (
    <section id="menu" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Nuestro Menú</h2>
          <p className="text-lg text-muted-foreground">Descubre nuestras deliciosas opciones de comida marina</p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-semibold transition transform hover:scale-105 ${
                activeCategory === cat.id
                  ? "bg-primary text-white shadow-lg"
                  : "bg-white text-foreground border-2 border-primary hover:border-primary/70"
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems[activeCategory as keyof typeof menuItems]?.map((item, idx) => (
            <MenuCard key={idx} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}
