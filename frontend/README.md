# Frontend

Este proyecto fue generado con [Angular CLI](https://github.com/angular/angular-cli) versión 20.3.7.

## Estructura y Convenciones del Proyecto

Este proyecto sigue una estructura inspirada en **Atomic Design** para asegurar la escalabilidad y reutilización de los componentes.

### Estructura de Carpetas

-   `src/app/core`: Contiene servicios singleton (`AuthService`), route guards e interceptores HTTP.
-   `src/app/features`: Contiene componentes de "página", que son las características principales de la aplicación (por ejemplo, `login`, `dashboard`).
-   `src/app/shared/ui`: Contiene componentes de UI reutilizables, organizados por complejidad:
    -   `atoms`: Los componentes indivisibles más pequeños (por ejemplo, `button`).
    -   `molecules`: Composiciones simples de átomos que funcionan juntos (por ejemplo, `tab-group`, `form-field`).

### Convención de Nomenclatura de Archivos

Los archivos de componentes se generan sin el sufijo `.component`. Cada componente consta de tres archivos separados:

-   `component-name.ts`: Lógica (clase de TypeScript).
-   `component-name.html`: Plantilla (HTML).
-   `component-name.css`: Estilos (CSS).

### Generando Componentes

Para mantener la consistencia, utiliza siempre Angular CLI para generar nuevos componentes dentro de la estructura establecida.

```bash
# Ejemplo: Generar una nueva página de feature
ng generate component features/feature-name/page-name

# Ejemplo: Generar un nuevo atom
ng generate component shared/ui/atoms/component-name
```

### Design Tokens

Los tokens de diseño globales (variables para colores, espaciado y tipografía) están definidos en `src/styles.css`. Estos tokens deben usarse en todos los estilos para mantener una apariencia y sensación coherentes.

### Bibliotecas de UI e iconos

- **Iconos**: El proyecto usa **Lucide-Angular** como conjunto de iconos.
    - Para añadir un nuevo icono, debe importarse y registrarse en `src/app/shared/lucide-icons.module.ts`.
    - Puedes encontrar todos los iconos disponibles en [lucide.dev/icons](https://lucide.dev/icons/).
- **Estructura de componentes**: Sigue los principios de Atomic Design para los componentes reutilizables ubicados en `src/app/shared/ui`.

---

## Servidor de desarrollo

Para iniciar un servidor de desarrollo local, ejecuta:

```bash
ng serve
```

Una vez que el servidor esté en ejecución, abre tu navegador y navega a `http://localhost:4200/`. La aplicación se recargará automáticamente cada vez que modifiques los archivos fuente.

## Generación de código

Angular CLI incluye potentes herramientas de scaffolding. Para generar un nuevo componente, ejecuta:

```bash
ng generate component component-name
```

Para una lista completa de los esquemas disponibles (como `components`, `directives` o `pipes`), ejecuta:

```bash
ng generate --help
```

## Compilación

Para compilar el proyecto, ejecuta:

```bash
ng build
```

Esto compilará tu proyecto y almacenará los artefactos de compilación en el directorio `dist/`. Por defecto, la compilación para producción optimiza la aplicación para rendimiento y velocidad.

## Ejecutar pruebas unitarias

Para ejecutar las pruebas unitarias con el corredor de pruebas [Karma](https://karma-runner.github.io), usa el siguiente comando:

```bash
ng test
```

## Ejecutar pruebas end-to-end

Para pruebas end-to-end (e2e), ejecuta:

```bash
ng e2e
```

Angular CLI no incluye por defecto un framework para pruebas end-to-end; puedes elegir el que mejor se adapte a tus necesidades.

## Recursos adicionales

Para más información sobre el uso de Angular CLI, incluyendo referencias detalladas de comandos, visita la página [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).
```
