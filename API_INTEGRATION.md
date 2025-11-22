# Integración de API - 200 Millas

## Configuración

1. Copia `.env.example` a `.env.local`
2. Actualiza `NEXT_PUBLIC_API_URL` con la URL de tu backend

## Endpoints Requeridos

### Órdenes
- `POST /api/orders` - Crear nueva orden
- `GET /api/orders` - Listar órdenes (con filtros)
- `GET /api/orders/{id}` - Obtener detalles de orden
- `PATCH /api/orders/{id}/status` - Actualizar estado

### Menú
- `GET /api/menu/categories` - Listar categorías
- `GET /api/menu/items` - Listar items (con filtro de categoría)

### Workflow
- `GET /api/workflow/{orderId}/steps` - Obtener pasos del workflow
- `PATCH /api/workflow/{orderId}/steps/{stepId}` - Actualizar paso

### Autenticación
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Dashboard
- `GET /api/dashboard/summary` - Resumen de métricas
- `GET /api/dashboard/metrics` - Métricas detalladas

## Estructura de Datos

### Order
\`\`\`json
{
  "id": "string",
  "customerId": "string",
  "items": [
    {
      "id": "string",
      "menuItemId": "string",
      "name": "string",
      "quantity": "number",
      "price": "number"
    }
  ],
  "status": "pending|confirmed|cooking|ready|dispatched|delivered|cancelled",
  "totalPrice": "number",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601",
  "deliveryAddress": "string",
  "estimatedDeliveryTime": "string"
}
\`\`\`

### WorkflowStep
\`\`\`json
{
  "id": "string",
  "orderId": "string",
  "stepType": "cooking|packing|delivery",
  "status": "pending|in_progress|completed",
  "assignedTo": "string",
  "startTime": "ISO8601",
  "endTime": "ISO8601",
  "notes": "string"
}
\`\`\`

## Páginas Disponibles

- `/` - Inicio (menú público)
- `/cliente` - Interfaz para hacer pedidos
- `/restaurante` - Panel de gestión de pedidos
- `/pedidos` - Seguimiento de pedidos
- `/dashboard` - Métricas y resumen
- `/carta` - Catálogo de productos
- `/cobertura` - Ubicaciones y horarios

## Autenticación Multi-tenancy

El sistema está preparado para multi-tenancy. Cada tenant debe:
1. Tener su propio `TENANT_ID`
2. Incluir el tenant en las requests (header o query param)
3. Implementar Row Level Security en la base de datos

## Real-time Updates

Para actualizaciones en tiempo real, considera:
- WebSockets
- Server-Sent Events (SSE)
- AWS AppSync
- EventBridge para eventos asíncronos
