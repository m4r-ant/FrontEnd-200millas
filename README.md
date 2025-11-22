<p align="center">
  <img src="public/logo-200millas.svg" alt="200 Millas" height="72" />
</p>

<h1 align="center">200 Millas · Frontend</h1>

<p align="center">
  Aplicación web de pedidos (Next.js 16 · TypeScript · Tailwind · shadcn/ui)
</p>

---

## Índice

- [Características](#características)
- [Stack y Arquitectura](#stack-y-arquitectura)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Inicio Rápido](#inicio-rápido)
- [Páginas Disponibles](#páginas-disponibles)
- [Variables de Entorno](#variables-de-entorno)
- [Integración con Backend](#integración-con-backend)
- [Desarrollo](#desarrollo)
- [Deployment](#deployment)
- [Contribuir](#contribuir)

## Características

- Para clientes: explorar carta por categorías, búsqueda, pedidos, historial
- Para restaurante: panel, workflow, tiempos, métricas
- Multi-tenancy, real-time ready, responsive, serverless-ready

## Stack y Arquitectura

- Next.js 16, App Router, TypeScript estricto
- Tailwind CSS + shadcn/ui
- Context API (auth, cart) + Sonner (toasts)
- Preparado para AWS (API Gateway, Lambda, EventBridge) y Vercel

## Estructura del Proyecto

```
├── app/
│   ├── layout.tsx              # Fuentes, providers, Toaster
│   ├── page.tsx                # Homepage
│   ├── carta/                  # Carta de productos
│   ├── checkout/               # Checkout
│   ├── perfil/                 # Perfil y pedidos
│   ├── login/                  # Login/registro
│   └── globals.css             # Estilos globales
├── components/
│   ├── customer-header.tsx     # Header
│   ├── customer-footer.tsx     # Footer (redes sociales)
│   ├── product-card.tsx        # Tarjeta de producto
│   ├── product-options-modal.tsx
│   └── ...
├── lib/
│   ├── api.ts                  # Cliente API
│   ├── auth-context.tsx        # Auth
│   ├── cart-context.tsx        # Carrito
│   └── types.ts                # Tipos TS
└── public/                     # Assets (imágenes, svg)
```

## Inicio Rápido

1) Clonar e instalar

```bash
git clone <repository-url>
cd 200millas-frontend
npm install
```

2) Variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_TENANT_ID=200millas
NEXT_PUBLIC_AUTH_ENABLED=true
```

3) Ejecutar

```bash
npm run dev
# http://localhost:3000
```

## Páginas Disponibles

| Ruta | Descripción | Auth |
|------|-------------|------|
| `/` | Inicio | No |
| `/carta` | Catálogo completo | No |
| `/checkout` | Checkout | Sí |
| `/perfil` | Perfil y pedidos | Sí |
| `/login` | Login/registro | No |

## Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | URL del backend | `http://localhost:3001/api` |
| `NEXT_PUBLIC_TENANT_ID` | ID del tenant | `200millas` |
| `NEXT_PUBLIC_AUTH_ENABLED` | Habilitar auth | `true` |

## Integración con Backend

Endpoints esperados (ver `API_INTEGRATION.md`):

```http
POST /api/auth/login
POST /api/auth/logout
POST /api/orders
GET  /api/orders
GET  /api/orders/{id}
PATCH /api/orders/{id}/status
GET  /api/menu/categories
GET  /api/menu/items
```

## Desarrollo

- Estilos con Tailwind v4 (utility-first)
- Componentes shadcn/ui
- Tipos en `lib/types.ts`

## Deployment

- Guía completa en `DEPLOYMENT.md`
- Recomendado: Vercel (preview + prod)

## Contribuir

1. Crea rama: `git checkout -b feat/mifeature`
2. Commits: `git commit -m "feat: mi feature"`
3. Push: `git push origin feat/mifeature`
4. PR: abre un Pull Request

---

Proyecto académico · Cloud Computing (CS2032)
