# Proposal

## Why

"Extras personalizados" (handle `extras-personalizados`, tag `addon`) es un producto técnico: solo existe
para cobrar los toppings premium del armador como línea add-on del carrito. Hoy aparece en el buscador del
encabezado y en otras listas de productos, como si fuera algo que el cliente puede comprar por sí solo.

## What Changes

- El buscador (resultados predictivos, página `/search` y lista de productos que muestra el buscador antes
  de escribir) deja de mostrar productos internos; muestra solo el catálogo real.
- Las demás listas de productos del tema (página de colección incluida `/collections/all`, vitrina de
  colección, carruseles y recomendaciones) omiten los productos internos.
- "Producto interno" se define por el tag `addon`, que el add-on ya tiene, para que futuros productos
  técnicos se oculten con solo etiquetarlos.
- En la tienda se marca el add-on como oculto para buscadores y búsqueda de la tienda (metafield
  `seo.hidden = 1`), sin despublicarlo de Tienda online, porque el carrito necesita poder agregarlo.
- Sin cambios en el cobro: el add-on se sigue agregando al carrito y viéndose como línea del pedido.

## Capabilities

### New Capabilities

- `productos-internos`: visibilidad de los productos técnicos (tag `addon`) en el storefront — no se
  listan ni se encuentran por búsqueda, pero siguen siendo comprables vía armador.

### Modified Capabilities

<!-- Ninguna: cobro-extras y carrito-nativo conservan sus requisitos. -->

## Impact

- Datos de la tienda: metafield `seo.hidden` en el producto 15398337839356 (mutación Admin API).
- Tema: `snippets/predictive-search-products-list.liquid`, `snippets/predictive-search-empty-state.liquid`,
  `sections/search-results.liquid`, `sections/main-collection.liquid`, `sections/collection-showcase.liquid`,
  `snippets/carousel-slider.liquid`, `sections/product-recommendations.liquid`,
  `blocks/product-recommendations.liquid`.
- Sin cambios en `sections/addon-redirect.liquid` (la página del producto ya redirige) ni en el carrito.
