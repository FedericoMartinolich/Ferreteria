# Guía de estética

Guía para personalizar el aspecto visual de **Catálogo Comercial** editando un único archivo: `src/style.css` (bloque `:root`).

## Cómo funciona

Todo el "look" del sitio se define con **variables CSS (tokens)** declaradas una sola vez en el bloque `:root` de `src/style.css`. Los componentes las consumen mediante `var(--nombre)`. **Si querés cambiar el estilo, editás los valores del bloque `:root` y listo** — no hace falta rastrear colores sueltos en los componentes.

> Algunas excepciones intencionales quedan fijas fuera de los tokens: los anillos de foco (`box-shadow: 0 0 0 …`), los radios de píldora (`999px`) y de círculo (`50%`), y `box-shadow: none`.

## 1. Tokens de marca

| Variable | Default | Dónde se usa |
|---|---|---|
| `--navy` | `#0d1b2a` | Fondo de header superior, botones navy, footer, títulos |
| `--navy-light` | `#1b2838` | Variante de `--navy` (tarjeta de contacto, bordes) |
| `--orange` | `#e86a10` | Barra de navegación, badges, íconos de acento, enlaces |
| `--orange-hover` | `#d45d0a` | Hover de `--orange`, degradado de ofertas |
| `--orange-dark` | `#a84808` | Fin del degradado de la sección de ofertas |
| `--yellow` | `#fbbf24` | Acentos amarillos (sección contacto, íconos) |
| `--yellow-light` | `#fcd34d` | Hover amarillo (sección contacto) |
| `--white` | `#ffffff` | Fondo de tarjetas, texto sobre colores oscuros |
| `--gray-50 … --gray-800` | escala de grises | Fondos suaves, bordes, textos secundarios |

## 2. Tokens de estado de producto

| Variable | Default | Dónde se usa |
|---|---|---|
| `--success` | `#16a34a` | Badge "Disponible" en el detalle de producto |
| `--danger` | `#dc3545` | Badge "Sin stock", badge de descuento, botón eliminar carrito |

## 3. Tokens de precio

| Variable | Default | Dónde se usa |
|---|---|---|
| `--price` | `#b91c1c` | Precio (catálogo, detalle, carruseles de ofertas/nuevos) |
| `--price-old` | `#bbb` | Precio anterior tachado |

## 4. Tokens de acciones sociales

| Variable | Default | Dónde se usa |
|---|---|---|
| `--whatsapp` | `#25d366` | Botones "Consultar por WhatsApp" y envío de pedidos |
| `--whatsapp-hover` | `#20bd5a` | Hover de los botones de WhatsApp |

## 5. Tokens de la sección Navidad

| Variable | Default | Dónde se usa |
|---|---|---|
| `--christmas-deep` | `#0a3318` | Fondo y botones de la sección navideña |
| `--christmas-green` | `#0e7733` | Mitad del degradado navideño |
| `--christmas-leaf` | `#1a9944` | Fin del degradado navideño |

## 6. Tokens de radio de borde

Escala progresiva: cuanto mayor el sufijo, más redondeado. Cada token se usa en tarjetas, botones, inputs y contenedores según el tamaño del elemento (un botón usa `lg`, una tarjeta grande usa `5xl/6xl`).

| Variable | Valor | Variable | Valor |
|---|---|---|---|
| `--radius-xs` | `2px` | `--radius-2xl` | `12px` |
| `--radius-sm` | `4px` | `--radius-3xl` | `14px` |
| `--radius-md` | `6px` | `--radius-4xl` | `16px` |
| `--radius-lg` | `8px` | `--radius-5xl` | `18px` |
| `--radius-xl` | `10px` | `--radius-6xl` | `20px` |

## 7. Tokens de sombra

| Variable | Valor por defecto | Uso típico |
|---|---|---|
| `--shadow-xs` | `0 2px 8px rgba(0,0,0,.06)` | Elevación muy sutil (mini tarjetas, flechas de carrusel, botones) |
| `--shadow-sm` | `0 4px 16px rgba(0,0,0,.06)` | Cajas y secciones sobre fondo claro |
| `--shadow-md` | `0 8px 24px rgba(0,0,0,.1)` | Hover de tarjetas, dropdown de búsqueda |
| `--shadow-lg` | `0 16px 40px rgba(0,0,0,.15)` | Tarjetas grandes (Nosotros, mapa, contacto) |
| `--shadow-xl` | `0 20px 60px rgba(0,0,0,.25)` | Modales y toasts |
| `--shadow-navy-xs` | `0 2px 6px rgba(13,27,42,.2)` | Botones navy (agregar al carrito, paginación) |
| `--shadow-navy-md` | `0 4px 12px rgba(13,27,42,.3)` | Hover de botones navy |
| `--shadow-orange-xs` | `0 2px 6px rgba(232,106,16,.25)` | Botones de acento naranja |
| `--shadow-orange-md` | `0 4px 12px rgba(232,106,16,.35)` | Hover de botones de acento |
| `--shadow-yellow-md` | `0 8px 25px rgba(251,191,36,.35)` | Hover de botón amarillo (contacto) |
| `--shadow-christmas-md` | `0 4px 12px rgba(10,51,24,.3)` | Botones de la sección navideña |

## 8. Cómo personalizar

### Cambiar solo colores
1. Abrí `src/style.css` → bloque `:root`.
2. Cambiá el valor de una variable, p. ej. `--navy: #4a1220;`.
3. Recargá la página. El cambio se aplica a todos los componentes que usan ese token.

### Aplicar una paleta de ejemplo
En el bloque `:root` hay un comentario **PERSONALIZACIÓN RÁPIDA** con paletas de ejemplo (Vino, Bosque). Descomentá los valores que prefieras y ajustalos.

### Ajustar el estilo general
- **Radio de bordes**: cambiá la escala `--radius-*` (más `px` → más redondeado).
- **Sombras**: ajustá `--shadow-*` para elevar o aplanar tarjetas, secciones y modales.

## 9. Buenas prácticas

- No escribir colores o valores de radio/sombra directos en los componentes: usar siempre `var(--…)`.
- Los colores de estados funcionales (`--success`, `--danger`) conviene mantenerlos con esos roles para conservar la usabilidad.
- Al crear un nuevo componente, consumir los tokens existentes antes de agregar valores nuevos.