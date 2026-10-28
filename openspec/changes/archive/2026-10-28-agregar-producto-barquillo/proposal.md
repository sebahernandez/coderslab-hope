# Proposal

## Why

Hope quiere vender un cuarto producto, **Barquillo** (cono de vainilla), con la misma experiencia de
armador que Helado Hope y Mixo, pero con una regla mucho más simple: solo se elige un sirope, sin
toppings ni tamaños, a precio base bajo ($1.50). Hoy no existe el producto en la tienda ni un armador
que soporte "solo 1 sirope".

## What Changes

- Crear el producto **Barquillo** en la tienda `hopesweet` con el CLI de Shopify
  (`shopify store execute --allow-mutations`), con imagen
  `https://res.cloudinary.com/slealu5f/image/upload/v1793205910/Cono_de_vainilla_en_espiral_ah6axq.png`,
  publicado en Tienda online y POS.
- El producto NO tiene tamaños ni toppings. Su precio depende solo del tipo de sirope, bakeado en
  variantes nativas (opción interna "Extras premium" con valores 0/1):
  - 1 sirope estándar → **$1.50**
  - 1 sirope premium → **$2.50**
- Nuevo armador dedicado (sección + JS propios, mismo lenguaje visual `.hopecfg`/v2) donde el cliente
  elige **exactamente 1 sirope** (selección única; obligatorio para añadir al carrito). No se muestra
  ningún grupo de toppings. Los siropes salen de la categoría "Sirope" del metafield
  `custom.opciones_customizador`.
- El carrito oculta la opción interna "Extras premium" igual que hoy oculta "Toppings extra".
- Siempre **1 sola línea nativa**; el Barquillo NO usa la línea add-on "Extras personalizados".

## Capabilities

### New Capabilities

_(ninguna)_

### Modified Capabilities

- `productos-catalogo`: se añade el producto Barquillo con su armador dedicado de solo 1 sirope y su
  regla de precio por sirope premium.

## Impact

- **Tienda (datos):** producto nuevo Barquillo (2 variantes, `tracked:false`, `templateSuffix:
  barquillo`, metafield `custom.opciones_customizador` copiado de Helado Hope, publicaciones).
- **Tema:** `templates/product.barquillo.json`, `sections/custom-product-barquillo.liquid`,
  `assets/barquillo-customizer.js` (nuevos); `snippets/cart-products.liquid` (ocultar opción interna).
- **No cambia:** Helado Hope, Mixo, Milkshake, add-on de extras ni `hope-customizer-v2.js`.
