# Tasks

## 1. Ajustar CSS del pie del wizard móvil

- [x] 1.1 En `assets/hope-customizer-v2.css`, dentro de `@media (max-width: 1023px)`, subir el alto de
      `.hopecfg--v2 .hope2__nav` (`.hope2__nav--prev` "Atrás" y `.hope2__nav--next` "Siguiente") a
      ~48px ajustando `padding` (bloque) y `font-size`/`line-height`, y verificar visualmente en
      `shopify theme dev` que el texto queda centrado y sin cortes en ambos botones.
- [x] 1.2 En el mismo bloque de media query, aplicar el mismo alto (~48px) a
      `.hopecfg--v2 .hopecfg__buy` (variante móvil, "Añadir al carrito") ajustando `padding` y
      `font-size` de forma análoga, y verificar que el texto "Añadir al carrito" sigue en una sola
      línea (`white-space: nowrap`) sin desbordar el botón.
- [x] 1.3 Revisar que `.hope2__nav-arrow` (flecha ‹ ›) sigue centrada verticalmente respecto al nuevo
      alto del botón, ajustando su posicionamiento si es necesario.

## 2. Verificación visual en el armador real

- [x] 2.1 Levantar `shopify theme dev` y abrir el armador v2 (Helado Hope) en un viewport móvil angosto
      (375×667) con Playwright; confirmado con captura de pantalla y medición DOM (`getBoundingClientRect`)
      que "Atrás", "Siguiente" y "Añadir al carrito" comparten 47.67px (~48px) de alto y se ven alineados
      con el botón circular "Reiniciar" en la misma fila. Durante la verificación se detectó que
      "AÑADIR AL CARRITO" desbordaba su caja (`scrollWidth` > `clientWidth`) con el padding/font-size
      inicialmente propuestos; se ajustó a `font-size: 11px` y `.hopecfg__buy-arrow { margin-left: 0.1rem }`
      manteniendo el mismo `padding` que "Atrás"/"Siguiente" (necesario para que el reparto flex
      `1 1 0` siga siendo 50/50 entre "Atrás" y "Añadir al carrito"), quedando sin desborde
      (`scrollWidth === clientWidth`).
- [x] 2.2 Repetido en el paso donde solo "Siguiente" está visible (paso de tamaño): ocupa el ancho
      completo de la fila (314px) con 47.67px de alto, sin verse desproporcionado (ver captura).
- [x] 2.3 Repetido en Mixo Hope (misma sección `custom-product-v2`): mismas dimensiones
      (`.hope2__nav--next` 314×47.67px), confirmando que el ajuste aplica igual al compartir sección y CSS.
- [x] 2.4 Confirmado en viewport de escritorio (1440×900) que `.hope2__nav` y `.hope2__stepbar` calculan
      `display: none`, y que el CTA de escritorio (`.hopecfg__buy` fuera del media query móvil) no cambió
      visualmente.
