# 🍏 Food Rescue Network (Red de Rescate de Alimentos)

![Node.js](https://img.shields.io/badge/Node.js-v20.x-339933?style=flat-square&logo=nodedotjs)
![Angular](https://img.shields.io/badge/Angular-20.x-DD0031?style=flat-square&logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-316192?style=flat-square&logo=postgresql)

---

## Descripción del Proyecto

**Food Rescue Network** es una solución tecnológica diseñada para combatir el **desperdicio de alimentos** (ODS 12: Producción y Consumo Responsables) y apoyar la **lucha contra el hambre** (ODS 2: Hambre Cero).

El objetivo es cerrar la brecha logística entre el **excedente de alimentos consumibles** (proveniente de supermercados, restaurantes, etc.) y la **necesidad** (bancos de alimentos, refugios).

Utilizamos una **API RESTful con WebSockets en tiempo real** para conectar instantáneamente a:

* **Donantes** (publican el excedente disponible).
* **Recolectores** (voluntarios o ONGs que recogen y transportan las donaciones).
* **Receptores** (bancos de alimentos que reciben las donaciones).

La comunicación en tiempo real, similar al rastreo de vehículos de una aplicación de transporte, garantiza una logística rápida y eficiente desde la publicación de la donación hasta su entrega final.

---

## 🚀 Inicio Rápido

Este repositorio es una estructura de **monorepo** que contiene los proyectos de Frontend y Backend en carpetas separadas.

Para levantar la aplicación completa, sigue las instrucciones de configuración y arranque en cada subdirectorio.

### 💻 1. Backend (API y WebSockets)

El servidor y la lógica de negocio. Construido con **Node.js, Express, TypeScript y PostgreSQL**.

Dirígete a la carpeta `backend` para ver los pasos de instalación:

```bash
cd backend
cat README.md
# O visita el archivo README.md directamente en la carpeta.
```

### 🌐 2. Frontend (Aplicación Web)
La interfaz de usuario principal de la aplicación. Construido con **Angular CLI**.

Dirígete a la carpeta frontend para ver los pasos de instalación:

``` bash
cd frontend
cat README.md
# O visita el archivo README.md directamente en la carpeta.
```

Stack Tecnológico Clave  

| **Componente** | **Tecnología** |
| :--- | :--- |
| Backend | ```Node.js, Express, TypeScript```|
| Frontend | ```Angular``` |
| Base de Datos| ```PostgreSQL, Prisma ORM``` |
| FTiempo Real | ```Socket.io (WebSockets)``` |
| Autenticación | ```JWT, bcryptjs``` |
