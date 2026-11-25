# Proposal

## Why

El encabezado de Hope es una cápsula glass flotante (`position: fixed`) sin fondo propio a lo ancho de la
pantalla, y su altura, padding y márgenes están fijados en CSS (tokens `--padding-sm`, `--padding-xl`) o
en un único ajuste (`glass_float_margin`). El comerciante no puede pintar una franja de color de borde a
borde detrás de la cápsula ni ajustar la altura y el espaciado desde el editor de temas.

## What Changes

- Nuevo ajuste de **fondo a ancho completo** en la sección `header`: casilla para activarlo y selector de
  color (con transparencia). La franja cubre todo el ancho del viewport detrás de la cápsula, incluido el
  hueco del margen superior.
- Cuando la franja está activa, el encabezado **reserva su altura** en el flujo para que el color no tape
  el inicio de la primera sección (con la franja apagada se conserva el comportamiento actual: el
  contenido pasa por detrás del vidrio).
- Nuevo control de **altura mínima** (px) de la barra; `0` = automática, conservando el selector
  existente `section_height` (compacta/estándar).
- Nuevo grupo de **espaciado personalizado** (casilla que habilita los controles, apagada por defecto
  para no alterar el aspecto actual):
  - Padding interior de la cápsula: superior, inferior y lateral.
  - Márgenes exteriores de la cápsula: inferior y lateral (escritorio). El margen superior sigue siendo
    el ajuste existente `glass_float_margin`, que pasa a ser visible también sin glassmorphism.
- Se conservan todos los IDs, tipos y valores de ajustes existentes; no hay cambios rompientes.

## Capabilities

### New Capabilities

- `encabezado-apariencia`: apariencia configurable del encabezado — franja de fondo a ancho completo,
  altura mínima y espaciado (padding/margin) de la barra o cápsula del header.

### Modified Capabilities

<!-- Ninguna: navbar-movil y menu-navegacion no cambian sus requisitos. -->

## Impact

- `sections/header.liquid`: schema (nuevos ajustes y visibilidad de `glass_float_margin`), variables CSS
  inline en `<header-component>` y reglas del `{% stylesheet %}`.
- `sections/header-group.json`: sin cambios obligatorios (los ajustes nuevos toman su valor por defecto).
- `assets/header.js`: se reutiliza la medición existente de `--header-height`; sin cambios previstos.
- `--hope-navbar-gutter-mobile` (consumido por `.hopecfg`) debe seguir alineado con el margen lateral
  móvil.
- Restricción de la sync GitHub → Shopify: los `range` deben tener al menos 3 pasos y como máximo 101,
  o el schema se descarta en silencio.
