# Catálogo Comercial

Sistema web de catálogo para pequeños y medianos comercios. Muestra productos, promociones e información del negocio de forma simple, moderna y autoadministrable.

- **Un único código para todos los clientes.** La identidad visual, la información del comercio y los datos se configuran por `.env` y por una hoja de cálculo, sin modificar el código.
- **Proveedor de datos agnóstico.** El frontend nunca conoce el origen de la información. Hoy se incluye el adaptador de *Google Sheets* (opción económica para negocios que ya usan planillas), pero mañana puede reemplazarse por una API, un sistema de stock u otra fuente sin tocar las vistas.

## Documentación

- **Manual de implementación** (puesta en marcha de un cliente nuevo, paso a paso): [`docs/MANUAL_IMPLEMENTACION.md`](docs/MANUAL_IMPLEMENTACION.md)
- **Plantillas de datos demo** (Información / Productos / Eventos): [`docs/template/`](docs/template/)
- **Blueprint del producto** (visión, arquitectura y evolución): [`docs/product.md`](docs/product.md)
- **Guía de estética** (cómo personalizar colores, radios y sombras con variables CSS): [`docs/ESTETICA.md`](docs/ESTETICA.md)

## Desarrollo

```bash
npm install
npm run dev      # entorno de desarrollo
npm run build    # build de producción
npm run preview  # previsualizar el build
```