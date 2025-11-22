"use client"

import Link from "next/link"

const categories = [
  { id: 1, name: "Promos Fast", image: "/promosfast.png" },
  { id: 2, name: "Express", image: "/express.png" },
  { id: 3, name: "Promociones", image: "/promociones.png" },
  { id: 4, name: "Sopas Power", image: "/sopaspower.png" },
  { id: 5, name: "Bowls Del Tigre", image: "/bowlsdeltigre.png" },
  { id: 6, name: "Leche de Tigre", image: "/lechedetigre.png" },
  { id: 7, name: "Ceviches", image: "/ceviches.png" },
  { id: 8, name: "Fritazo", image: "/fritazo.png" },
  { id: 9, name: "Mostrimar", image: "/mostrimar.png" },
  { id: 10, name: "Box Marino", image: "/boxmarino.png" },
  { id: 11, name: "Dúos Marinos", image: "/duosmarinos.png" },
  { id: 12, name: "Tríos Marinos", image: "/triosmarinos.png" },
  { id: 13, name: "Dobles", image: "/dobles.png" },
  { id: 14, name: "Rondas Marinas", image: "/rondasmarinas.png" },
  { id: 15, name: "Mega Marino", image: "/megamarino.png" },
  { id: 16, name: "Familiares", image: "/familiares.png" },
]

export default function MenuCategories() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-[28px] font-display font-bold text-center text-[#1000a3] mb-12">Nuestra carta</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const isFamiliares = category.name === "Familiares"
            
            return (
              <Link 
                key={category.id} 
                href={`/carta?categoria=${category.name}`}
                className={isFamiliares ? "md:col-start-2" : ""}
              >
                <div className="relative h-48 rounded-lg overflow-hidden cursor-pointer group shadow-lg hover:shadow-2xl">
                  {/* 1. Imagen de Fondo */}
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-400 ease-in-out origin-center group-hover:scale-110 delay-150"
                  />

                  {/* 2. Overlay Azul + Texto - texto se mueve diagonalmente desde centro a esquina */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#1000a3]/80 transition-all duration-400 ease-in-out group-hover:h-full group-hover:duration-300 z-10 delay-150">
                    <div className="absolute bottom-4 left-4 transition-all duration-400 ease-in-out group-hover:bottom-1/2 group-hover:left-1/2 group-hover:-translate-x-1/2 group-hover:-translate-y-1/2 delay-150">
                      <h3 className="text-white font-display font-bold text-[22px] md:text-[24px] leading-tight drop-shadow-xl">
                        {category.name}
                      </h3>
                    </div>
                  </div>

                  {/* 4. Botón "Ordena ahora" - aparece después del overlay+texto y desaparece primero */}
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-4 opacity-0 translate-y-4 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:-translate-y-12 group-hover:delay-350 z-20 delay-0">
                    <button className="bg-[#e2e200] text-[#1000a3] font-display font-bold px-6 py-2 rounded text-sm hover:bg-[#e2e200]/90 shadow-lg cursor-pointer">
                      Ordena ahora
                    </button>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Botón "Ordenar ahora" debajo de las categorías */}
        <div className="flex justify-center mt-12">
          <Link href="/carta">
            <button className="bg-[#e2e200] text-[#1000a3] px-8 py-3 rounded font-display font-bold text-lg hover:bg-[#e2e200]/90 transition shadow-lg cursor-pointer">
              Ordenar ahora
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
