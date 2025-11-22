# Guía de Deployment

## Arquitectura Recomendada

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                     CloudFront (CDN)                        │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│              Vercel / AWS Amplify (Frontend)                │
│                  Next.js 16 Application                     │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    API Gateway                              │
│              (REST API Endpoints)                           │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────▼────┐    ┌─────▼──────┐   ┌────▼────┐
   │  Lambda  │    │ EventBridge│   │ Step    │
   │Functions │    │ (Events)   │   │Functions│
   └────┬────┘    └─────┬──────┘   └────┬────┘
        │                │               │
   ┌────▼────────────────▼───────────────▼────┐
   │         DynamoDB (Database)              │
   │    (Multi-tenancy con Partition Key)     │
   └──────────────────────────────────────────┘
        │
   ┌────▼──────────────┐
   │   S3 (Storage)    │
   │  (Imágenes, etc)  │
   └───────────────────┘
\`\`\`

## Deployment en Vercel

### Paso 1: Preparar el Proyecto

\`\`\`bash
# Asegúrate de que todo esté en git
git add .
git commit -m "Preparar para deployment"
git push origin main
\`\`\`

### Paso 2: Conectar a Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Haz login con GitHub
3. Importa el repositorio
4. Configura las variables de entorno

### Paso 3: Configurar Variables de Entorno

En el dashboard de Vercel, agrega:

\`\`\`
NEXT_PUBLIC_API_URL=https://tu-api-backend.com/api
NEXT_PUBLIC_TENANT_ID=200millas
NEXT_PUBLIC_AUTH_ENABLED=true
\`\`\`

### Paso 4: Deploy

\`\`\`bash
vercel deploy --prod
\`\`\`

## Deployment en AWS Amplify

### Paso 1: Instalar Amplify CLI

\`\`\`bash
npm install -g @aws-amplify/cli
amplify configure
\`\`\`

### Paso 2: Inicializar Amplify

\`\`\`bash
amplify init
\`\`\`

Responde las preguntas:
- Project name: `200millas`
- Environment: `prod`
- Editor: Tu editor preferido
- App type: `javascript`
- Framework: `nextjs`

### Paso 3: Agregar Hosting

\`\`\`bash
amplify add hosting
\`\`\`

Selecciona:
- Hosting service: `Amplify Hosting`
- Environment: `Production`

### Paso 4: Publicar

\`\`\`bash
amplify publish
\`\`\`

## Configuración de Backend (AWS)

### 1. API Gateway

\`\`\`bash
# Crear API REST
aws apigateway create-rest-api \
  --name "200millas-api" \
  --description "API para 200 Millas"
\`\`\`

### 2. Lambda Functions

Crea funciones Lambda para cada endpoint:

\`\`\`python
# lambda_function.py
import json
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Orders')

def lambda_handler(event, context):
    # Procesar evento
    # Retornar respuesta
    return {
        'statusCode': 200,
        'body': json.dumps({'message': 'Success'})
    }
\`\`\`

### 3. DynamoDB

\`\`\`bash
# Crear tabla de órdenes
aws dynamodb create-table \
  --table-name Orders \
  --attribute-definitions \
    AttributeName=tenantId,AttributeType=S \
    AttributeName=orderId,AttributeType=S \
  --key-schema \
    AttributeName=tenantId,KeyType=HASH \
    AttributeName=orderId,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST
\`\`\`

### 4. EventBridge

\`\`\`bash
# Crear regla para procesar eventos de órdenes
aws events put-rule \
  --name "order-processing" \
  --event-pattern '{"source":["orders"],"detail-type":["Order Created"]}'
\`\`\`

### 5. Step Functions

Define el workflow en JSON:

\`\`\`json
{
  "Comment": "Workflow de procesamiento de pedidos",
  "StartAt": "ConfirmarPedido",
  "States": {
    "ConfirmarPedido": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:...",
      "Next": "Cocinando"
    },
    "Cocinando": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:...",
      "Next": "Empacando"
    },
    "Empacando": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:...",
      "Next": "Entregando"
    },
    "Entregando": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:...",
      "End": true
    }
  }
}
\`\`\`

## Monitoreo

### CloudWatch Logs

\`\`\`bash
# Ver logs de Lambda
aws logs tail /aws/lambda/200millas-api --follow
\`\`\`

### Métricas

- Latencia de API
- Errores por endpoint
- Uso de DynamoDB
- Invocaciones de Lambda

## Seguridad

### 1. CORS

Configura CORS en API Gateway:

\`\`\`json
{
  "AllowedHeaders": ["Content-Type", "Authorization"],
  "AllowedMethods": ["GET", "POST", "PATCH", "DELETE"],
  "AllowedOrigins": ["https://tu-dominio.com"],
  "MaxAge": 3600
}
\`\`\`

### 2. Autenticación

Usa AWS Cognito o JWT:

\`\`\`bash
aws cognito-idp create-user-pool \
  --pool-name "200millas-users"
\`\`\`

### 3. Encriptación

- Habilita HTTPS en API Gateway
- Encripta datos en DynamoDB
- Usa AWS KMS para claves

## Rollback

Si algo sale mal:

\`\`\`bash
# Vercel
vercel rollback

# Amplify
amplify publish --invalidateCloudFront
\`\`\`

## Checklist de Deployment

- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada
- [ ] APIs funcionando
- [ ] Tests pasando
- [ ] Seguridad verificada
- [ ] Monitoreo configurado
- [ ] Backup configurado
- [ ] Documentación actualizada
