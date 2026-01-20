# 🍏 Food Rescue Network - Frontend

Interfaz de usuario (SPA) para la plataforma Food Rescue Network, desarrollada con Angular v20.

## 🛠 Tecnologías

- **Framework:** Angular 20
- **Renderizado:** Client-Side & SSR (Server-Side Rendering)
- **Estilos & UI:** Lucide Angular, Feather Icons
- **Comunicación:** HTTP Client & Socket.io Client

## ⚙️ Configuración

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configuración de API:**
   Verifica los archivos en `src/environments/` para asegurar que la URL del backend es correcta (por defecto suele apuntar a `http://localhost:3000`).

## 🚀 Ejecución

- **Servidor de Desarrollo:**
  ```bash
  ng serve
  # O npm start
  ```
  La aplicación estará disponible en `http://localhost:4200/`.

- **Tests:**
  ```bash
  ng test
  ```

- **Build de Producción:**
  ```bash
  ng build
  ```
  Los archivos generados se guardarán en el directorio `dist/`.