# Food Rescue Backend

API RESTful con WebSocket en tiempo real para conectar donantes de alimentos con beneficiarios.

![Node.js](https://img.shields.io/badge/Node.js-v20.x-339933?style=flat-square&logo=nodedotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat-square&logo=typescript)
![Express](https://img.shields.io/badge/Express-4.18.2-000000?style=flat-square&logo=express)
![Prisma](https://img.shields.io/badge/Prisma-6.19.0-2D3748?style=flat-square&logo=prisma)
![Socket.io](https://img.shields.io/badge/Socket.io-4.7.4-010101?style=flat-square&logo=socketdotio)

---

## Inicio Rápido

### Prerrequisitos

- Node.js v20.x o superior
- PostgreSQL 15+ (o Docker)

### Instalación

1. Clonar repositorio
```
git clone url-github
cd food-rescue-backend
```

2. Instalar dependencias
```
npm install
```

3. Configurar variables de entorno
```
cp .env.template .env
```

Edita .env con tus configuraciones  

4. Iniciar PostgreSQL (con Docker)
```
docker-compose up -d
```

5. Generar cliente Prisma y migrar BD
```
npx prisma generate
npx prisma migrate dev --name init
```

6. Poblar base de datos (Recomendado)
```
npm run seed
```  
Esto creará usuarios de prueba y otros datos iniciales.

7. Iniciar servidor

``` 
npm run dev
```

El servidor estará disponible en: `http://localhost:3000`


## Documentación API

### Swagger UI Interactivo
http://localhost:3000/api-docs



### JSON OpenAPI
http://localhost:3000/api-docs.json


### Endpoints Principales

#### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión (requiere auth)

#### Ciudades
- `GET /api/cities` - Obtener todas las ciudades
#### Donaciones
- `POST /api/donations` - Crear donación (solo donantes)
- `GET /api/donations` - Obtener donaciones
- `POST /api/donations/:id/claim` - Reclamar donación (solo beneficiarios)
- `POST /api/donations/:id/confirm` - Confirmar entrega

#### Horarios Pico (solo donantes)
- `POST /api/peak-hours` - Crear horario pico
- `GET /api/peak-hours` - Obtener horarios

#### Notificaciones
- `GET /api/notifications` - Obtener notificaciones
- `PATCH /api/notifications/:id/read` - Marcar como leída

### Autenticación

Incluye el token JWT en el header:

Authorization: Bearer <tu-token-jwt>

text

---

## WebSocket

### Conectar
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

text

### Eventos
- `donation:created` - Nueva donación creada
- `donation:claimed` - Donación reclamada
- `donation:delivered` - Donación entregada

---

## Datos de Prueba

Después de ejecutar `npm run seed`, puedes usar las siguientes credenciales para probar la aplicación:

| Email | Password | Tipo |
|-------|----------|------|
| donor1@example.com | password123 | Donante |
| beneficiary1@example.com | password123 | Beneficiario |

**Nota:** La contraseña es `password123` (todo en minúsculas).

---

## Stack Tecnológico

- **Backend**: Node.js, Express, TypeScript
- **Base de Datos**: PostgreSQL, Prisma ORM
- **Tiempo Real**: Socket.io
- **Autenticación**: JWT, bcryptjs
- **Documentación**: Swagger/OpenAPI
- **Logging**: Winston



**Documentación completa**: `http://localhost:3000/api-docs`