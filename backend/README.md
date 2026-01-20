# 🍏 Food Rescue Network - Backend

Este directorio contiene la lógica del servidor, API y gestión de datos para la plataforma Food Rescue Network.

## 🛠 Tecnologías

- **Runtime:** Node.js
- **Framework Web:** Express.js
- **Lenguaje:** TypeScript
- **Base de Datos:** PostgreSQL
- **ORM:** Prisma
- **Tiempo Real:** Socket.io (para coordinación logística en vivo)
- **Autenticación:** JWT & bcryptjs

## ⚙️ Configuración y Requisitos

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Variables de Entorno:**
   Crea un archivo `.env` en esta carpeta con las siguientes variables (ejemplo):
   ```env
   PORT=3000
   DATABASE_URL="postgresql://usuario:password@localhost:5432/food_rescue_db"
   JWT_SECRET="tu_secreto_seguro"
   ```

3. **Base de Datos (Prisma):**
   Asegúrate de tener PostgreSQL corriendo y ejecuta:
   ```bash
   # Generar cliente de Prisma
   npx prisma generate
   
   # Ejecutar migraciones
   npx prisma migrate dev
   ```

## 🚀 Ejecución

- **Modo Desarrollo (con recarga automática):**
  ```bash
  npm run dev
  ```
- **Modo Producción:**
  ```bash
  npm run build
  npm start
  ```