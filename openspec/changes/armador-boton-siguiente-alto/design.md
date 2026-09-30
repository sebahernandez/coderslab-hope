# Design

## Context

El pie del wizard móvil (`.hopecfg__footer` → `.hopecfg__actions`) agrupa hasta cuatro controles según
el paso: `.hope2__nav--prev` ("Atrás"), `#reset-view` (círculo "Reiniciar"; base 40px en
`assets/toppings-customizer.css:571-587`, pero con override móvil a `1.7rem` ≈ 27px en
`assets/hope-customizer-v2.css:478-482`), `.hope2__nav--next` ("Siguiente") y `#buy` ("Añadir al
carrito"). Las reglas móviles (`@media (max-width: 1023px)` en `assets/hope-customizer-v2.css`) fijan
`.hope2__nav` en `padding: 0.45rem 0.5rem; font-size: 10px; line-height: 1.15` (líneas 379-399) y
`.hopecfg__buy` en `padding: 0.45rem 0.5rem; font-size: 10px` (líneas 486-503). Ambas resultan en
~28-30px de alto. En móvil toda la fila de controles queda corta (~27-30px), muy por debajo de un
botón tipo app (referencia del usuario, ~48-56px) — no es solo "Siguiente" desalineado respecto a un
vecino más alto, sino la fila completa demasiado baja. Ver proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Definir el alto objetivo para "Siguiente"/"Atrás"/"Añadir al carrito" (móvil) y cómo lograrlo sin
  romper el reparto flex (`flex: 1 1 0`) que hoy iguala los anchos de "Atrás" y "Siguiente".
- Mantener la pastilla (`border-radius`), el color de marca (`--hopecfg-hope`) y el patrón visual ya
  usados por `.hopecfg__buy` en escritorio como referencia de proporciones, no reinventar un estilo.

**Non-Goals:**
- No se rediseña el layout del pie (orden, distribución, columnas) ni el wizard de 3 pasos.
- No se toca el desktop (`min-width: 1024px`), donde estos botones no se muestran.
- No se toca Milkshake (customizer separado sin este wizard).

## Decisions

- **Alto objetivo: 48px**, tomando como referencia `#reset-view` en su variante desktop (`3rem` = 48px,
  `toppings-customizer.css:588-591`) y el `--minimum-touch-target: 44px` ya definido en
  `theme-styles-variables.liquid:515` para el resto del tema. 48px iguala visualmente el peso de un
  botón de app estándar (referencia del usuario) y queda por encima del mínimo táctil de 44px con
  margen cómodo, sin verse desproporcionado en pantallas pequeñas (~360-390px de ancho).
  - Alternativa descartada: fijar 44px exactos (mínimo táctil). Se prefiere 48px porque ya existe como
    valor de referencia en el propio componente (`#reset-view` desktop) y da un poco más de aire al
    texto en mayúsculas.
- **Cómo llegar a 48px**: subir `padding-block` (vertical) en `.hope2__nav` y en la variante móvil de
  `.hopecfg__buy`, y subir `font-size` de 10px a ~12-13px para que el texto no quede perdido dentro de
  un botón más alto. Se ajusta solo `padding`/`font-size`/`line-height`; no se cambia `border-radius`
  (pastilla ya correcta) ni el color.
  - Alternativa descartada: usar `height`/`min-height` fijo en vez de padding. Se descarta porque el
    patrón existente en este componente (`.hopecfg__buy` desktop, `.hopecfg__reset`) ya centra el
    contenido vía padding + `display: inline-flex; align-items: center`, y mezclar `height` fijo con
    padding variable complicaría mantener el texto centrado si cambia el texto del botón (ej.
    "Añadir al carrito" es más largo que "Siguiente").
- **Aplicar el mismo alto a los tres controles de texto** (`Atrás`, `Siguiente`, `Añadir al carrito`
  móvil), no solo a "Siguiente", para que la fila quede visualmente uniforme. El círculo "Reiniciar"
  (40px) ya es ligeramente menor y se deja como está: es un control icónico secundario, no de texto, y
  cambiar su tamaño está fuera del pedido original.

## Resultado de la implementación

Verificado con Playwright contra `shopify theme dev` (viewport 375×667):

- `.hope2__nav` (Atrás/Siguiente): `padding: 0.9rem 0.6rem`, `font-size: 13px`, `line-height: 1.3` → alto
  47.67px (~48px).
- `.hopecfg__buy` (Añadir al carrito, móvil): mismo `padding: 0.9rem 0.6rem` que `.hope2__nav`
  (imprescindible: al medir en vivo se confirmó que un padding distinto entre hermanos con
  `flex: 1 1 0` rompe el reparto 50/50 en este layout, aunque `flex-basis` sea `0` y `min-width: 0`
  esté declarado en ambos - el navegador no reparte el espacio libre de forma puramente proporcional
  al `flex-grow` cuando el padding difiere). Como el texto "Añadir al carrito" es más largo, se bajó
  `font-size` a 11px (con `line-height: 1.4` para conservar el mismo alto) y el margen del ícono
  (`.hopecfg__buy-arrow`) de `0.5rem`/`0.3rem` original a `0.1rem`, en vez de tocar el padding.
  Resultado: mismo ancho (137.8px) y alto (47.67px) que "Atrás", sin desborde de texto
  (`scrollWidth === clientWidth`).
- Confirmado sin cambios visuales en escritorio (`.hope2__nav`/`.hope2__stepbar` siguen en
  `display: none` a `min-width: 1024px`) y aplicado por igual a Helado Hope y Mixo Hope.

## Risks / Trade-offs

- [Aumentar la altura reduce el espacio vertical disponible para el resto del wizard en pantallas muy
  bajas (ej. iPhone SE en horizontal)] → Mitigación: 48px es un incremento moderado (~18-20px) sobre el
  actual; se valida visualmente con Playwright en un viewport móvil angosto y bajo antes de dar por
  cerrado el cambio.
- [Subir el `font-size` de 10px a ~12-13px en botones con `flex: 1 1 0` y ancho compartido podría
  forzar salto de línea en "Añadir al carrito" dentro de un contenedor angosto] → Mitigación: mantener
  `white-space: nowrap` (ya presente) y verificar en el mismo viewport de prueba; si no entra, reducir
  levemente el `letter-spacing` o el padding inline antes que bajar el alto.
