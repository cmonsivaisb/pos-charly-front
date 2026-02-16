# POS SaaS México - Frontend

Interfaz moderna y responsiva construida con **Next.js 15 (App Router)** y **Tailwind CSS**.

## Tecnologías Utilizadas

- **Next.js 15**: Renderizado híbrido y rutas optimizadas.
- **Tailwind CSS**: Estilizado con sistema de diseño basado en utilidades.
- **DaisyUI**: Componentes de interfaz listos para usar basados en Tailwind.
- **Zustand**: Gestión de estado global ligera para autenticación.
- **Lucide React**: Set de iconos modernos.
- **Axios**: Cliente HTTP para comunicación con la API.

## Funcionalidades Principales

- **Dashboard**: Vista general del negocio.
- **POS (Punto de Venta)**: Carrito de compras, búsqueda de productos y finalización de ventas.
- **Gestión de Productos**: Listado con imágenes, filtros y edición completa.
- **Panel de Admin SaaS**: Activación/Suspensión de cuentas de clientes.
- **Autenticación**: Flujos de Registro y Login con protección de rutas.

## Configuración

1.  **Instalar dependencias**:
    ```bash
    npm install
    ```
2.  **Variables de Entorno**:
    Crea un archivo `.env.local`:
    ```env
    NEXT_PUBLIC_API_BASE_URL="http://localhost:3001/api"
    ```
3.  **Ejecutar en desarrollo**:
    ```bash
    npm run dev
    ```

## Estructura del Proyecto

- `src/app`: Rutas del sistema (Login, Register, Dashboard).
- `src/components`: Componentes reutilizables.
- `src/lib/api.ts`: Configuración centralizada de Axios con interceptores para JWT.
- `src/store`: Stores de Zustand (Auth).
