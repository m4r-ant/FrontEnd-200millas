import CustomerHeader from "@/components/customer-header"
import CustomerFooter from "@/components/customer-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-white">
      <CustomerHeader />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1000a3] mb-4">
            Contáctanos
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Estamos aquí para ayudarte. Escríbenos y te responderemos lo antes posible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Envíanos un mensaje</CardTitle>
              <CardDescription>Llena el formulario y nos pondremos en contacto contigo</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input id="name" type="text" placeholder="Juan Pérez" required className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input id="email" type="email" placeholder="tu@email.com" required className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" type="tel" placeholder="+51 987 654 321" className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="subject">Asunto</Label>
                  <Input id="subject" type="text" placeholder="Consulta sobre..." required className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea id="message" placeholder="Tu mensaje aquí..." required className="mt-2" rows={5} />
                </div>
                <Button type="submit" className="w-full bg-[#1000a3] hover:bg-[#1008b6] text-white font-bold">
                  Enviar mensaje
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-[#1000a3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Ubicación</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">Jr. Principal 123, Cercado de Lima</p>
                <p className="text-sm text-gray-500 mt-2">Lima, Perú</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-[#1000a3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Teléfono</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">+51 987 654 321</p>
                <p className="text-sm text-gray-500 mt-2">Lun - Dom: 9:00 AM - 10:00 PM</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <svg className="w-6 h-6 text-[#1000a3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Correo</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">info@200millas.pe</p>
                <p className="text-sm text-gray-500 mt-2">Respondemos en menos de 24 horas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Horarios de atención</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Lunes - Viernes</span>
                    <span className="font-semibold">9:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábado</span>
                    <span className="font-semibold">10:00 AM - 11:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingo</span>
                    <span className="font-semibold">10:00 AM - 10:00 PM</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <CustomerFooter />
    </div>
  )
}
