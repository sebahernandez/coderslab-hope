# Proposal

## Why

Hope quiere lanzar cada mes un sabor de edición limitada (p. ej. "Alegría", noviembre) además del
yogurt griego clásico, y hoy el armador de Helado Hope y Mixo Hope no tiene forma de elegir la base
ni de comunicar la promoción. Se necesita una forma de que el comerciante cambie el sabor, su texto
y sus imágenes cada mes **sin tocar código**, tal como muestra el mock de referencia.

## What Changes

- Nuevo **banner "Sabor del mes"** encima del primer paso del armador v2: imagen del sabor, insignia
  "Edición limitada", vigencia ("Hasta el 30 de noviembre"), etiqueta "Sabor del mes · Noviembre",
  nombre y descripción.
- Nuevo **paso "Elige la base del helado"** como paso 1, con dos opciones de selección única:
  "Yogurt Griego Clásico" (por defecto) y el sabor del mes vigente, cada una con miniatura.
- Al elegir el sabor del mes, la **vista previa cambia a la imagen del vaso del sabor** y aparece
  una insignia "Sabor del mes" sobre el preview.
- La base elegida viaja como **line item property** (`Base`) en la línea del helado, para cocina y
  pedidos. **No cambia el precio** (mismo precio que el clásico en el mock: $6.00).
- El flujo pasa de 3 a **4 pasos** (Base → Tamaño → Toppings → Sirope) **solo cuando hay un sabor
  del mes vigente**; sin sabor vigente, el armador queda exactamente como hoy (3 pasos, sin banner).
- El **contenido** del sabor (nombre, descripción, imágenes, vigencia) se administra desde el
  admin de Shopify como **metaobjeto** "Sabor del mes" (ver alternativas evaluadas en design.md:
  ajustes de sección, metaobjeto, metafield de producto, Cloudinary, producto/variante aparte).
- Aplica a **Helado Hope y Mixo Hope** (misma sección `custom-product-v2`); Milkshake y Barquillo
  quedan fuera.

## Capabilities

### New Capabilities
- `sabor-del-mes`: contenido administrable del sabor de edición limitada (fuente de datos,
  vigencia, banner promocional y su selección como base del helado).

### Modified Capabilities
- `configurador-helado`: el flujo guiado pasa a incluir el paso "Elige la base del helado" cuando
  hay sabor vigente (requisitos "Flujo de armado en tres pasos" y "Etiqueta dinámica del botón de
  avanzar de paso").

## Impact

- `sections/custom-product-v2.liquid`: resolución del sabor vigente, banner, fieldset de base,
  data-attrs para JS, nuevos ajustes de schema.
- `assets/hope-customizer-v2.js`: estado `base`, `STEP_LABELS` dinámico, swap de imagen del preview,
  property `Base` en el carrito.
- `assets/hope-customizer-v2.css`: estilos del banner, tarjetas de base, insignia, mapeo de pasos
  móviles.
- Nuevo snippet `snippets/hope-flavor-banner.liquid` (banner reutilizable).
- **Datos de tienda**: nueva definición de metaobjeto `sabor_del_mes` (vía `shopify store execute
  --allow-mutations`) y una primera entrada ("Alegría") con imágenes subidas a Archivos de Shopify.
- Sin cambios en variantes, precios ni en el add-on de extras premium.
