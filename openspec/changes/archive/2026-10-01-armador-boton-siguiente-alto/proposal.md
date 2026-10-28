# Proposal

## Why

En el wizard móvil del armador v2 (`custom-product-v2.liquid`, usado por Helado Hope y Mixo Hope), el
botón "Siguiente" (y sus hermanos "Atrás" y "Añadir al carrito" en el mismo pie) mide apenas ~28-30px
de alto (`padding: 0.45rem 0.5rem`, `font-size: 10px`). Es notablemente más bajo que el botón circular
"Reiniciar" de la misma fila (40px) y que el estándar de botones tipo app (referencia entregada por el
usuario: pastilla ancha y alta, ~48-56px). El resultado se ve delgado y poco pulido, y cae por debajo
del tamaño táctil mínimo recomendado para móvil.

## What Changes

- Aumentar la altura del botón "Siguiente" (`.hope2__nav--next`) en el wizard móvil para que iguale la
  altura de referencia tipo app (aprox. 48px), manteniendo la pastilla rosa (`--hopecfg-hope`), el
  radio de borde y la tipografía en mayúsculas ya definidos por el configurador.
- Aplicar el mismo alto a los botones hermanos de la misma fila del pie (`.hope2__nav--prev` "Atrás" y
  `.hopecfg__buy` "Añadir al carrito" en su variante móvil) para que los tres controles queden
  alineados y consistentes entre sí, evitando una nueva inconsistencia de alturas dentro de la misma
  fila.
- Ajustar proporcionalmente el tamaño de fuente y el padding interno para que el texto no quede
  descentrado ni apretado dentro de la nueva altura.
- Cambio puramente visual/CSS: no se modifica el flujo de tres pasos, la lógica de habilitación/
  deshabilitación de los botones, ni el comportamiento de clic.

## Capabilities

### New Capabilities

(ninguna)

### Modified Capabilities

- `configurador-helado`: se añade un requisito sobre el tamaño táctil/visual mínimo de los controles
  de navegación del wizard móvil (Atrás/Siguiente/Añadir al carrito), alineado a un alto de referencia
  consistente entre sí y con el estándar táctil móvil.

## Impact

- `sections/custom-product-v2.liquid`: sin cambios de marcado (mismo `hope2__nav`/`hopecfg__buy`); solo
  referencia como contexto del árbol DOM afectado.
- `assets/hope-customizer-v2.css`: reglas dentro de `@media (max-width: 1023px)` para
  `.hopecfg--v2 .hope2__nav` (línea ~379) y `.hopecfg--v2 .hopecfg__buy` (línea ~486).
- Afecta a los dos productos que usan esta sección: Helado Hope y Mixo Hope. Milkshake usa un
  customizer aparte (`custom-product-milkshake.liquid` / `milkshake-customizer.css`) sin este wizard de
  pasos y queda fuera de alcance.
- Solo vista móvil (`max-width: 1023px`); el layout de escritorio no muestra estos botones
  (`display: none` fuera del wizard móvil) y no se toca.
