# Design

## Context

Las secciones custom recientes (`text-image.liquid`, `box-items.liquid`) usan bloques locales de sección con todo el schema embebido. `hero-text.liquid` migró a theme blocks (`{% content_for 'blocks' %}` + `blocks/_hero-*.liquid`) porque el volumen de settings de un único archivo se volvió inmanejable. Esta sección pide muchos ajustes por tarjeta (imagen, producto, 3 textos, botón, espaciados, todo con variante móvil), del mismo orden de magnitud que el caso hero-text.

La sincronización GitHub → Shopify descarta en silencio archivos con schema inválido que Theme Check no detecta (p. ej. `range` con menos de 3 pasos).

## Goals / Non-Goals

**Goals:**
- Cada tarjeta 100 % configurable de forma aislada, con variantes móviles.
- Schemas pequeños y validables por archivo.
- Sin JavaScript: render y layout solo con Liquid + CSS.

**Non-Goals:**
- Precio, variantes, agregar al carrito o quick add (el botón solo enlaza).
- Carrusel/slider en móvil (la grilla apila columnas).
- Migrar secciones existentes.

## Decisions

1. **Theme blocks en lugar de bloques locales.** Sección `sections/product-tiles.liquid` con `{% content_for 'blocks' %}` aceptando solo `product-tile`. Tarjeta en `blocks/product-tile.liquid`. *Alternativa*: bloques locales como `box-items` → descartada porque concentra ~60 settings por tipo de bloque en un solo schema, difícil de mantener y con el antecedente de límites de hero-text.

2. **Una sola tarjeta con settings agrupados por `header`, no sub-bloques anidados.** El bloque `product-tile` contiene grupos: Producto, Imagen, Título, Texto, Botón, Tarjeta (fondo, radio, padding, margin). *Alternativa*: sub-bloques estáticos (`_product-tile-image`, `_product-tile-title`, …) → más granular pero obliga al comerciante a navegar 4 niveles por tarjeta y complica el preset. Si el schema de la tarjeta supera límites de servidor al validar, se extrae el botón a un sub-bloque estático `_product-tile-button` (plan B documentado en tasks).

3. **Resolución de contenido en Liquid.** `imagen = custom | default: product.featured_image`; `título = setting | default: product.title`; `texto = setting | default: product.description | strip_html | truncatewords: n`; `enlace = setting | default: product.url`. Placeholder SVG si no hay imagen.

4. **Variables CSS por instancia.** Cada tarjeta emite sus valores como custom properties inline en su wrapper (`--pt-title-size`, `--pt-title-size-m`, `--pt-pad`, `--pt-pad-m`, …); el CSS estático en `{% stylesheet %}` las consume y cambia a las `-m` bajo `@media (max-width: 749px)`. Así no hay `{% style %}` por instancia ni selectores por ID.

5. **Colores opcionales con fallback al esquema.** Settings `color` sin default para fondo/texto; si están vacíos se usa `var(--color-*)` del esquema de la sección. Los defaults visuales de la referencia (vino `#6b0f3a`, botón blanco con borde suave) se fijan en el preset, no en el schema, para que "vacío = esquema" sea cierto.

6. **Imagen responsive.** `<picture>` con `<source media="(max-width: 749px)">` para la imagen móvil; `image_tag` con `widths` y `sizes` derivados de las columnas de la sección (`100vw / cols`); `loading: lazy` salvo cuando la sección es la primera de la plantilla.

7. **Opciones de 1–2 valores como `select`.** Todo `range` tiene ≥ 3 pasos y default alineado al step.

## Risks / Trade-offs

- [Schema rechazado en servidor y omitido por la sync] → validar cada archivo subiéndolo a un tema de desarrollo (`shopify theme push --only … --nodelete`) antes del push a `develop`.
- [Demasiados ajustes abruman al comerciante] → agrupar con `header`, usar `visible_if` (p. ej. colores de hover solo si hay botón) y defaults útiles.
- [Descripción del producto larga o con HTML] → `strip_html` + `truncatewords` configurable.
- [Producto eliminado o no disponible] → la tarjeta cae a los valores manuales o al placeholder; no rompe.

## Migration Plan

Sección nueva, sin datos previos. Deploy: commit + push a `develop` → verificar en `HOPE-development` → push a `main` solo con pedido explícito. Rollback: quitar la sección del editor o revertir el commit.
