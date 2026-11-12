# Proposal

## Why

En el armador de la Barquilla (producto `barquillo`), la imagen principal siempre muestra el cono de vainilla sin sirope. Al elegir un sirope, lo único que cambia es una burbuja "+1" con el ícono del ingrediente. Así el cliente no ve cómo queda su barquilla. Ya existen fotos del cono con cada sirope aplicado en Cloudinary (cuenta `v5ovpy2d`, 22 PNG de 1024×1536), así que la vista previa puede mostrar el resultado real.

## What Changes

- Al seleccionar un sirope en el armador de la Barquilla, la imagen principal (`#product-preview`) cambia a la foto del cono con ese sirope.
- Al deseleccionar el sirope o pulsar "Reiniciar", vuelve la imagen base del cono.
- Si un sirope no tiene foto asignada, o la foto no carga, se mantiene la imagen base. El armador sigue funcionando y la compra no se bloquea.
- La correspondencia sirope → foto se guarda como dato: un campo nuevo y opcional `imagen_barquillo` en cada item del metafield `custom.opciones_customizador` del producto Barquillo. Los 13 siropes actuales (4 estándar y 9 premium) se asocian con 13 de las 22 fotos y mantienen su precio (ver `design.md`).
- Se crean 9 siropes nuevos, todos premium ★ (+$1.00, la Barquilla queda en $2.50), a partir de las 9 fotos que no coinciden con ningún sirope actual: Buenissimo blanco, Buenissimo pistacchio, Crema Lotus, Perfetina arachide, Variegato amarena, Variegato arancia, Variegato gran crocante, Variegato gran nocciola y Variegato tiramisù italiano. Cada uno tiene foto principal y una miniatura para el chip, recortada de esa misma foto.
- No hay cambios en el modelo de precio (estándar incluido $1.50 / premium $2.50), las variantes, el pipeline del carrito ni la burbuja "+1".
- Alcance exclusivo: solo el armador de la Barquilla (`sections/custom-product-barquillo.liquid` + `assets/barquillo-customizer.js`). Helado Hope, Mixo Hope y Milkshake no cambian.

## Capabilities

### New Capabilities

_Ninguna._

### Modified Capabilities

- `configurador-helado`: se agregan requisitos para que la vista previa del armador de la Barquilla muestre el cono con el sirope seleccionado (con respaldo a la imagen base) y para que el armador ofrezca los 9 siropes premium nuevos con su miniatura.

## Impact

- **Código**: `sections/custom-product-barquillo.liquid` (expone el mapa sirope → foto) y `assets/barquillo-customizer.js` (cambia la imagen al seleccionar, deseleccionar o reiniciar).
- **Datos de la tienda**: mutación del metafield `custom.opciones_customizador` del producto Barquillo (gid 15447288709372) con `shopify store execute --allow-mutations`. Agrega `imagen_barquillo` a los 13 items actuales, sin cambiar sus campos existentes (`id`, `nombre`, `precio_cents`, `premium`, `imagen`), y suma 9 items nuevos al final de la categoría "Sirope". El metafield de Helado Hope no se toca.
- **Recursos externos**: imágenes servidas desde `res.cloudinary.com/v5ovpy2d`, una cuenta distinta de `slealu5f`. Se entregan transformadas (`f_auto,q_auto,w_800`) para no descargar los PNG originales de ~1.7 MB.
- **Sin impacto** en otros productos, otras secciones ni el snippet compartido `hope-extra-chip.liquid`.
