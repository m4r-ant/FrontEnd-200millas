import CustomerHeader from "@/components/customer-header"
import CustomerFooter from "@/components/customer-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SobreNosotrosPage() {
  return (
    <div className="min-h-screen bg-white">
      <CustomerHeader />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1000a3] mb-4">
            Sobre Nosotros
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Somos más que un restaurante, somos pasión por la comida marina peruana.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#1000a3]">Nuestra Historia</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                200 Millas nació con la visión de llevar la auténtica comida marina peruana a cada mesa del Perú. 
                Fundados en 2020, comenzamos como un pequeño local dedicado a preservar las tradiciones culinarias 
                de nuestras costas.
              </p>
              <p>
                Hoy, continuamos con esa misma pasión, usando solo los ingredientes más frescos y las técnicas 
                tradicionales que han hecho de la comida marina peruana un orgullo nacional.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#1000a3]">Nuestra Misión</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                Proporcionar comida marina fresca, deliciosa y accesible a todos nuestros clientes, manteniendo 
                la calidad y el sabor auténtico en cada bocado.
              </p>
              <p>
                Creemos en la rapidez sin comprometer la calidad, por eso ofrecemos un servicio express que 
                respeta los tiempos de nuestros clientes sin sacrificar la excelencia culinaria.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-[#e2e200] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#1000a3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <CardTitle className="text-[#1000a3]">Calidad</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Solo usamos ingredientes frescos seleccionados cuidadosamente
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-[#e2e200] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#1000a3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <CardTitle className="text-[#1000a3]">Rapidez</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Servicio express sin comprometer el sabor ni la calidad
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-[#e2e200] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#1000a3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <CardTitle className="text-[#1000a3]">Pasión</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Amor por la comida marina peruana en cada preparación
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <CustomerFooter />
    </div>
  )
}
