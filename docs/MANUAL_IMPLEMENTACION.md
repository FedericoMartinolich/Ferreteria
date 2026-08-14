# Manual de implementación

Guía para poner en marcha **Catálogo Comercial** para un cliente nuevo. El objetivo es configurar un comercio sin tocar una sola línea de código.

---

## 1. ¿Cómo funciona?

El sistema es un **frontend único** que consume datos e identidad desde dos fuentes configurables:

| Origen | Qué aporta | Cómo se configura |
|---|---|---|
| `.env` | URLs y credenciales de los servicios | Variables `VITE_*` |
| Google Sheets | Información del comercio, productos y eventos | Planillas publicadas como CSV |

El frontend nunca conoce el origen de los datos: consume una interfaz común (`getConfig`, `getProducts`, eventos) definida en `src/services/`. Cambiar el proveedor de datos (API, stock, etc.) solo requiere reemplazar esa capa, sin tocar las vistas.

## 2. Requisitos

- Node.js 18 o superior (y npm).
- Una cuenta en [Cloudinary](https://cloudinary.com) para las imágenes de productos (plan gratuito).
- Una cuenta en [EmailJS](https://www.emailjs.com) para el formulario de contacto (plan gratuito).
- Una cuenta de Google (para crear y publicar las planillas).

## 3. Instalación

```bash
npm install
cp .env.example .env   # completar según los pasos siguientes
npm run dev
```

## 4. Puesta en marcha para un cliente

### 4.1 Crear las planillas (Google Sheets)

1. Crear una planilla nueva en Google Sheets y crear **tres pestañas** con estos nombres: `Información`, `Productos`, `Eventos`.
2. Copiar el contenido de las plantillas de [`docs/template/`](docs/template/) en cada pestaña:

   | Pestaña | Plantilla |
   |---|---|
   | `Información` | `plantilla-informacion.csv` (columna A = clave, columna B = valor) |
   | `Productos` | `plantilla-productos.csv` (primera fila = encabezados, luego un producto por fila) |
   | `Eventos` | `plantilla-eventos.csv` (primera fila = encabezados) |

3. Reemplazar los datos de ejemplo por los del cliente.

### 4.2 Publicar las planillas como CSV

1. En Google Sheets: **Archivo → Compartir → Publicar en la web**.
2. Elegir *Documento completo* y formato **Valores separados por comas (.csv)**. Publicar.
3. Copiar la URL publicada (termina en `.../pub?output=csv`). Es el valor de `VITE_SHEET_BASE_URL`.
4. Para cada pestaña, obtener su **GID**: abrir la planilla, hacer clic en la pestaña y mirar la URL (`#gid=XXXXXXXXX`).

> Las tres pestañas comparten la misma URL base (`VITE_SHEET_BASE_URL`); cada una se distingue por su GID.

### 4.3 Completar `.env`

```dotenv
# — Google Sheets (datos del comercio)
VITE_SHEET_BASE_URL=https://docs.google.com/spreadsheets/d/e/.../pub?output=csv
VITE_CONFIG_GID=XXXXXXXXX       # pestaña Información
VITE_PRODUCTS_GID=XXXXXXXXX     # pestaña Productos
VITE_EVENTS_GID=XXXXXXXXX       # pestaña Eventos

# — Imágenes de productos
VITE_CLOUDINARY_CLOUD_NAME=xxxxxxxxx

# — Formulario de contacto (EmailJS)
VITE_EMAILJS_SERVICE_ID=service_xxx
VITE_EMAILJS_TEMPLATE_ID=template_xxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxx
```

Si se dejan las variables de EmailJS vacías, el formulario de contacto muestra un aviso de "no configurado" en lugar de fallar.

### 4.4 Configurar imágenes de productos

1. Subir las fotos a Cloudinary (carpeta del cliente). Cada imagen tiene un **public_id**.
2. En la columna `image_key` de la pestaña `Productos`, cargar el public_id (sin carpeta ni extensión, por ejemplo `martillo_negro_ab12cd`). Lo agrega el bot de Cloudinary al subir la imagen.
3. Los productos sin `image_key` muestran la imagen predeterminada.

### 4.5 Configurar la identidad visual (logo, banner y foto del local)

Para cada cliente **no se edita código ni se reemplazan archivos**: el repo es una plantilla genérica compartida, por eso la identidad visual se configura con tres claves de la pestaña `Información`:

| Clave | Qué imagen define | Dónde se muestra |
|---|---|---|
| `logo` | Logo del comercio | Header (y versión navideña si es diciembre) |
| `banner_url` | Banner principal | Portada |
| `local_url` | Foto del local | Sección "Nosotros" |

1. Subir las tres imágenes a Cloudinary (o a cualquier URL pública estable) y pegar la URL en la clave correspondiente.
2. Si una clave queda **vacía**, el sistema usa el placeholder genérico de la plantilla (ver §8).

### 4.6 Configurar el formulario de contacto (EmailJS)

1. En EmailJS crear un *service* de correo y un *template*. Los campos del formulario (en `src/views/Contact.vue`) son: `name`, `reply_to`, `title`, `message`.
2. Cargar el Service ID, Template ID y Public Key en `.env`.

## 5. Campos de la pestaña Información

| Clave | Descripción | Ejemplo |
|---|---|---|
| `nombre` | Nombre del comercio. Se usa en header, footer, título de pestaña y mapas. | `Mi Comercio` |
| `tipo_de_negocio` | Rubro. Se muestra en el footer y en el título del catálogo ("Catálogo de …"). | `Ferretería` |
| `eslogan` | Lema del comercio (footer). | `Calidad, servicio y experiencia` |
| `email` | Email de contacto (formularios y pedidos). | `info@comercio.com` |
| `whatsapp` | Número para WhatsApp, con código de país (sin `+`). | `5491123456789` |
| `numero_fijo` | Teléfono fijo (informativo). | `3455 42-0000` |
| `instagram` | URL del perfil de Instagram. | `https://www.instagram.com/comercio` |
| `ciudad` | Localidad del negocio. Se muestra como badge en "Nosotros" y en la dirección de contacto. | `Gualeguaychú` |
| `provincia` | Provincia del negocio. Se muestra en la dirección de contacto. | `Entre Ríos` |
| `pais` | País (código ISO 2). Se muestra en la dirección y se usa como origen del envío. | `AR` |
| `codigo_postal` | Código postal del negocio (origen del envío). | `2820` |
| `coordenadas` | Latitud y longitud para el mapa. Vacío = sin mapa. | `-33.001651, -58.518268` |
| `dias_de_atencion` | Días de atención (contacto). | `Lunes a Sábado` |
| `horas_de_atencion` | Horarios (contacto). | `9 a 13 y 16 a 21` |
| `titulo_decorativo` | Texto chico sobre el título de "Nosotros". | `Nuestra historia` |
| `titulo_principal` | Título de la sección "Nosotros". | `¿Quiénes somos?` |
| `texto1`, `texto2`, `texto3` | Párrafos de la sección "Nosotros". | texto descriptivo |
| `caracteristica1..3` | Pilares que se muestran en "Nosotros". | `Buen trato` |
| `logo` | URL del logo del comercio (header). Vacío = logo genérico de la plantilla. | `https://res.cloudinary.com/.../logo.png` |
| `banner_url` | URL del banner de la portada. Vacío = banner genérico. | `https://res.cloudinary.com/.../banner.jpg` |
| `local_url` | URL de la foto del local (sección "Nosotros"). Vacío = imagen genérica. | `https://res.cloudinary.com/.../local.jpg` |

## 6. Campos de la pestaña Productos

| Columna | ¿Obligatoria? | Descripción |
|---|---|---|
| `id` | Sí | Identificador único del producto. |
| `product` | Sí | Nombre del producto. |
| `price` | Sí | Precio de venta. |
| `originalPrice` | No | Precio anterior (muestra el descuento). |
| `description` | No | Descripción corta. |
| `image_key` | No | Public id de Cloudinary. Vacío = imagen por defecto. |
| `category` | No | Categoría opcional. |
| `stock` | No | Cantidad en stock. `0` = "Sin stock". Vacío = sin límite. |
| `badge` | No | Etiqueta sobre la imagen (ej. "Oferta"). |
| `sku` | No | Código interno del producto. |

## 7. Campos de la pestaña Eventos

| Columna | Descripción |
|---|---|
| `event_key` | Identificador: `new` (nuevos productos), `offers` (ofertas), `christmas` (navidad). |
| `active` | `1` activo / `0` inactivo. |
| `title` | Título visual de la sección. |
| `product_ids` | IDs de productos separados por `|`. |
| `order` | Campo informativo de ordenamiento. |

## 8. Identidad visual

El repositorio es una **plantilla genérica compartida por todos los clientes**: no debe contener logos, banners ni fotos de ningún cliente en particular.

Para un cliente nuevo **no se edita código ni se reemplazan archivos**: el logo, el banner y la foto del local se configuran con las claves `logo`, `banner_url` y `local_url` de la pestaña `Información` (ver §4.5 y §5). Si una clave queda vacía, el sistema usa el placeholder genérico de la plantilla:

- **Logo**: `public/logo.svg` (y `public/logo-navidad.svg` para la versión navideña).
- **Favicon**: `public/favicon.svg`.
- **Banner de portada**: `public/imgs/banners/home-banner.svg`.
- **Imagen "Nosotros"**: `src/assets/imgs/local.svg`.

- **Colores, radios de borde y sombras**: variables CSS (tokens) en `src/style.css` (`--navy`, `--orange`, `--yellow`, `--radius-*`, `--shadow-*`, etc.). La lista completa, los valores por defecto y ejemplos de paletas están documentados en [`docs/ESTETICA.md`](ESTETICA.md).
- **Navegación**: enlaces por defecto en `src/components/Header.vue`.

## 9. Medios de pago y envío

El checkout se apoya en una arquitectura de **proveedores desacoplados** (`src/services/checkout/`). Se definen dos contratos — *PaymentProvider* y *ShippingProvider* — con un registro de proveedores. Sumar un proveedor nuevo consiste en crear una clase que cumpla el contrato y registrarla; no requiere tocar el checkout.

Los proveedores están en los archivos:
- Pago: `src/services/checkout/paymentProvider.js`, `providers/localPaymentProvider.js`, `providers/externalPaymentProvider.js`.
- Envío: `src/services/checkout/shippingProvider.js`, `providers/localShippingProvider.js`, `providers/externalShippingProvider.js`.
- Órdenes (estado del pedido en `localStorage`): `src/services/checkout/orders.js`.

### 9.1 Configuración desde la planilla

En la pestaña **Información** (clave → valor) pueden configurarse:

| Clave | Qué configura | Default |
|---|---|---|
| `payment_providers` | IDs de proveedores de pago activos separados por `,` | `local` |
| `payment_local_methods` | Medios de pago locales separados por `|` (efectivo, transferencia…) | `Efectivo\|Transferencia` |
| `payment_external_api_url` | Endpoint de un proveedor de pago online (MercadoPago, Stripe, etc.) | vacío |
| `payment_external_methods` | Medios que expone el proveedor online | `Tarjeta de crédito\|Tarjeta de débito` |
| `shipping_providers` | IDs de proveedores de envío activos | `local` |
| `shipping_local_retiro_label` / `shipping_local_retiro_eta` | Opción "Retiro en el local" | `Retiro en el local` / `Disponible de inmediato` |
| `shipping_local_domicilio_label` / `shipping_local_domicilio_eta` | Opción "Envío a domicilio" | `Envío a domicilio` / `2 a 5 días hábiles` |
| `shipping_local_domicilio_cost` | Costo del envío a domicilio | `0` |
| `shipping_free_over` | Monto a partir del cual el envío es gratis | `0` (nunca) |
| `shipping_local_options` | Lista JSON completa de opciones de envío (reemplaza los defaults) | vacío |
| `shipping_external_api_url` | Endpoint de una empresa de envío (Andreani, Correo Argentino, etc.) | vacío |
| `shipping_zones` | JSON con zonas de envío por código postal (ver 9.4) | vacío (tarifa fija) |
| `shipping_express` | `1` habilita la variante "Envío express" | vacío |
| `ciudad` / `provincia` / `pais` / `codigo_postal` | Ubicación del negocio. Se usan como **origen** del envío y en la dirección que se muestra al cliente | ver §5 |

Ejemplo de `shipping_local_options`:

```json
[{"id":"retiro","label":"Retiro en el local","cost":0,"eta":"Disponible de inmediato"},
 {"id":"domicilio","label":"Envío a domicilio","cost":2500,"eta":"2 a 4 días","free_over":50000}]
```

### 9.2 Credenciales de proveedores externos

Las credenciales (claves de API) se cargan por entorno, siguiendo el patrón de EmailJS/Cloudinary. Ver `.env.example`:

```
VITE_PAYMENT_API_KEY=
VITE_SHIPPING_API_KEY=
```

> En producción, las credenciales secretas deberían residir en un backend. En esta etapa el contrato ya está preparado para delegar en un servidor; si el proveedor se integra con una API real, `payment_external_api_url` / `shipping_external_api_url` apuntan a ese backend.

### 9.3 Flujo del checkout

1. El cliente completa sus datos y, si es envío a domicilio, su **código postal** (con el CP se recalculan las opciones de envío y el total).
2. Elige **envío** (retiro en el local o envío) y **medio de pago**.
3. "Confirmar pedido" crea la orden (estado `pending`).
4. Con un proveedor **online** (MercadoPago), el cliente es redirigido al **link de pago** (`init_point`); MercadoPago notifica el resultado al **webhook** (`/api/payments/webhook`). Con el proveedor **local** (efectivo/transferencia) la confirmación es inmediata.
5. El proveedor de envío **genera el envío** y devuelve el **número de seguimiento** (el "retiro en el local" no genera seguimiento).

### 9.4 Envío por zonas de código postal

Si se define `shipping_zones`, el costo del envío se calcula según el **código postal** del cliente en el backend (`/api/shipping/quote`). Cada zona define qué **prefijos de CP** le corresponden, su costo y su tiempo de entrega:

```json
[
  {"id":"local","label":"Gualeguaychú","prefixes":["2820"],"cost":4000,"eta":"24 horas","express_cost":6000,"express_eta":"Mismo día"},
  {"id":"provincia","label":"Entre Ríos","prefixes":["31","32"],"cost":6000,"eta":"2 a 3 días hábiles","express_cost":9000,"express_eta":"1 día"},
  {"id":"pais","label":"Resto del país","prefixes":["*"],"cost":9500,"eta":"3 a 7 días hábiles","express_cost":14000,"express_eta":"2 a 3 días hábiles"}
]
```

Reglas:
- El CP del cliente se compara contra cada zona en orden; gana la **primera coincidencia**.
- `"*"` es la zona comodín (resto del país). Sin coincidencia, se responde "No hay envío disponible".
- `express_cost` es opcional; si falta, express = `cost` + `SHIPPING_EXPRESS_SURCHARGE`.
- `free_over` (opcional) es el monto a partir del cual esa zona es gratis.
- La ubicación del negocio (`ciudad`, `provincia`, `pais`, `codigo_postal`, `coordenadas`) se envía junto a la cotización: hoy sirve de referencia y mañana será el **origen** para un proveedor de logística real.

Para que el cliente reciba la opción de envío, debe **ingresar su código postal** en el checkout; al escribirlo se recalculan las opciones **antes** del pago.

Configuración sugerida en la planilla:
- `shipping_providers=local,external` (retiro en el local + envíos por CP)
- `shipping_local_options=[{"id":"retiro","label":"Retiro en el local","cost":0,"eta":"Disponible de inmediato","free_over":0}]` (el proveedor local solo ofrece retiro; los envíos vienen de la cotización)
- `payment_external_api_url=https://tu-dominio.vercel.app`
- `shipping_external_api_url=https://tu-dominio.vercel.app`

### 9.5 Despliegue en Vercel (funciones de backend)

La carpeta `api/` contiene funciones serverless que Vercel ejecuta. El checkout las consume cuando `payment_external_api_url` / `shipping_external_api_url` apuntan al dominio desplegado.

| Ruta | Función |
|---|---|
| `api/payments/create.ts` | Crea la preferencia de pago en MercadoPago y devuelve el link (`init_point`). |
| `api/payments/webhook.ts` | Recibe la notificación de MercadoPago y consulta el estado real del pago. |
| `api/shipping/quote.ts` | Calcula opciones de envío por CP (zonas) o delega en un proveedor de logística. |
| `api/shipping/create.ts` | Genera el envío (número de seguimiento). |
| `api/orders/create.ts` | Persiste el pedido (Upstash Redis / Vercel KV). |

Variables de **servidor** (se configuran en Vercel → Settings → Environment Variables; **nunca** en el `.env` del frontend):

```
MERCADOPAGO_ACCESS_TOKEN   # token privado de Mercado Pago
SITE_URL                   # https://tu-dominio.vercel.app (sin barra final)
API_ACCESS_KEY             # opcional: clave que el frontend envía como Bearer
SHIPPING_ZONES             # JSON de zonas de respaldo si no vienen de la planilla
SHIPPING_FLAT_RATE         # tarifa fija de respaldo
SHIPPING_EXPRESS_SURCHARGE # recargo del envío express
SHIPPING_FREE_OVER         # envío gratis a partir de X
SHIPPING_ETA               # ej: "2 a 5 días hábiles"
SHIPPING_EXPRESS_ETA       # ej: "1 a 2 días hábiles"
SHIPPING_CARRIER           # ej: "Correo"
SHIPPING_PROVIDER_API_URL / SHIPPING_PROVIDER_API_KEY  # opcional: logística real
KV_REST_API_URL / KV_REST_API_TOKEN                    # guardar pedidos (Upstash Redis)
```

## 10. Verificación

```bash
npm run build
```

El build de producción se genera en `dist/` y puede servirse desde cualquier hosting estático.