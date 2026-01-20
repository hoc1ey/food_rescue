# 🍏 Food Rescue Network - Guía de Arquitectura y Despliegue

Este documento detalla la arquitectura del sistema, los cambios realizados para integrar tecnologías híbridas y los pasos exactos para levantar el entorno de desarrollo completo.

---

## 🏗 Arquitectura del Sistema

El proyecto utiliza una arquitectura de **Microservicios Híbrida** compartiendo una única base de datos.

1.  **Base de Datos (PostgreSQL en Docker):**
    *   Puerto externo: **5435** (Mapeado al 5432 interno).
    *   Contiene tablas compartidas (`User`, `Donor`, `Location`) y tablas específicas de lógica de negocio (`Donation`, `Notification`).
    *   Usa **Enums nativos** de PostgreSQL (`UserType`, `Days`, `DonationStatus`).

2.  **Backend 1: Servicio de Registro (.NET 8 / CoreWCF):**
    *   **Protocolo:** SOAP.
    *   **Función:** Maneja exclusivamente el registro de usuarios y la creación de entidades relacionadas (Donantes/Beneficiarios y Ubicaciones).
    *   **ORM:** Entity Framework Core.
    *   **Puerto:** `5113` (http).

3.  **Backend 2: API Principal (Node.js / Express):**
    *   **Protocolo:** REST & WebSockets (Socket.io).
    *   **Función:** Login (JWT), gestión de donaciones, notificaciones en tiempo real y dashboard.
    *   **ORM:** Prisma.
    *   **Puerto:** `3000`.

4.  **Frontend (Angular 20):**
    *   **Función:** SPA que consume tanto el servicio SOAP (para registro) como la API REST (para el resto).
    *   **Puerto:** `4200`.

---

## 🛠 Resumen de Implementación y Soluciones

Durante el desarrollo se resolvieron los siguientes desafíos técnicos:

*   **Integración SOAP en Angular:** Se implementó un servicio capaz de generar sobres XML manuales para comunicarse con el servicio SOAP de .NET, manejando namespaces y orden estricto de campos.
*   **Unificación de Base de Datos:** Se configuró tanto Entity Framework (.NET) como Prisma (Node) para leer y escribir en la misma base de datos Dockerizada en el puerto 5435.
*   **Mapeo de Enums (Postgres vs C#):** Se solucionó el error `42804` configurando `NpgsqlNullNameTranslator` en .NET para respetar las mayúsculas de los Enums (`DONOR`, `BENEFICIARY`) definidos en la base de datos.
*   **Sincronización de Esquemas:** Se alinearon las migraciones de .NET con el esquema de Prisma para evitar conflictos de tablas existentes.

---

## 🚀 Guía de Inicio Rápido (Comandos)

Sigue estos pasos en orden para levantar todo el sistema.

### 1. Base de Datos (Docker)
Asegúrate de tener Docker Desktop corriendo.

### 2. Backend .NET (Servidor SOAP)
Este servicio debe iniciarse para permitir el registro de usuarios.

**Configuración previa:** Verifica que `backend/backend-dotnet/appsettings.json` apunte al puerto `5435`.

```powershell
cd backend/backend-dotnet

# 1. Crear la migración inicial (Si no existe la carpeta Migrations)
dotnet ef migrations add InitialCreate

# 2. Aplicar migraciones y crear tablas base (User, Donor, Location, City)
dotnet ef database update

# 3. Iniciar el servidor
dotnet run
```
*Deberías ver:* `Now listening on: http://localhost:5113` y `✅ Datos semilla: Ciudad UIO creada...`

### 3. Backend Node.js (API REST)
Este servicio maneja el login y la lógica principal.

**Configuración previa:** Verifica que `backend/backend-node/.env` tenga `DATABASE_URL="postgresql://postgres:123456@localhost:5435/food-rescue?schema=public"`

```bash
cd backend/backend-node

# Instalar dependencias
npm install

# (Importante) Sincronizar el cliente de Prisma con la BD actual
npx prisma generate

# Iniciar servidor en modo desarrollo
npm run dev
```
*Deberías ver:* `🚀 Server listening on port 3000`

### 4. Frontend (Angular)
La interfaz de usuario.

```bash
cd frontend

# Instalar dependencias
npm install

# Iniciar la aplicación
ng serve
```
*Accede a:* `http://localhost:4200`

---

## ✅ Cómo Probar el Sistema

1.  **Registro (SOAP Flow):**
    *   Ve a `http://localhost:4200/register`.
    *   Llena los datos. Selecciona "Donante".
    *   Llena la ubicación (Paso 2).
    *   Click en "Registrarse".
    *   *Por detrás:* Angular envía XML -> .NET procesa -> Guarda en Postgres (Docker).

2.  **Login (REST Flow):**
    *   Ve a `http://localhost:4200/login`.
    *   Ingresa con el email y contraseña creados.
    *   *Por detrás:* Angular envía JSON -> Node normaliza email -> Verifica en Postgres -> Devuelve JWT.

3.  **Dashboard:**
    *   Verás el panel principal.
    *   El contador de notificaciones (campana) hará una petición a `/api/notifications/unread-count`.

---

## ⚠️ Solución de Problemas Comunes

*   **Error de conexión a BD (Connection Refused):**
    *   Verifica que Docker esté corriendo (`docker ps`).
    *   Asegúrate de que la configuración en ambos backends apunte al puerto **5435** (no 5432).

*   **Error SOAP "UserType ... expression is of type integer":**
    *   Significa que .NET está enviando números en lugar de Enums. Asegúrate de que `Program.cs` en .NET tenga `dataSourceBuilder.MapEnum<UserType>("UserType", new NpgsqlNullNameTranslator());`.

*   **Error en Node "Route not found /unread-count":**
    *   Asegúrate de que en `notification.routes.ts` la ruta `/unread-count` esté definida **antes** de `/:id`.
