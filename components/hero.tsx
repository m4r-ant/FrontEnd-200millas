"use client"

import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative h-96 flex items-center justify-center overflow-hidden">
      {/* Imagen de fondo */}
      <div className="absolute inset-0">
        <img src="/promo-familiar-cevichero.jpg" alt="200 Millas - Somos Ceviche" className="w-full h-full object-cover" />
      </div>

      {/* Overlay azul semi-transparente */}
      <div className="absolute inset-0 bg-[#1000a3]/70"></div>

      <div className="relative z-10 text-center px-4">
        <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-4 drop-shadow-2xl">SOMOS CEVICHE</h2>
        <p className="text-xl text-white/95 mb-6 font-display drop-shadow-lg">La mejor comida marina rápida del Perú</p>
        <Link href="/carta">
          <button className="bg-[#e2e200] text-[#1000a3] px-8 py-3 rounded font-display font-bold text-lg hover:bg-[#e2e200]/90 transition shadow-2xl cursor-pointer">
            PIDE AQUÍ
          </button>
        </Link>
      </div>
    </section>
  )
}
