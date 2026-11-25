# Design

## Context

- `sections/header.liquid` envuelve todo en `.header-section`, que con glassmorphism es `position: fixed`
  y no reserva espacio: el contenido pasa por detrás del vidrio.
- La cápsula es `.header__columns` (fondo blanco con alfa, blur, radio, borde). Padding vertical vía
  `--header-padding` (`--padding-sm` / `--padding-2xs` en compacta), padding lateral con `--padding-xl`
  en `.header__column--left/right`. Margen superior: `.header__row--top { margin-block-start:
  var(--glass-float-margin) }`. Margen lateral móvil: `.header__columns { margin-inline:
  var(--glass-float-margin) }`, publicado también como `--hope-navbar-gutter-mobile` en `:root`.
- `assets/header.js` mide `#header-component` y publica `--header-height` en `body`.
- La sync GitHub → Shopify descarta en silencio schemas inválidos (p. ej. `range` con < 3 pasos).

## Goals / Non-Goals

**Goals:**
- Exponer los controles con variables CSS inline en `<header-component>`, sin tocar JS.
- Valores por defecto que no alteren el aspecto publicado.

**Non-Goals:**
- Controles separados por breakpoint (solo el margen lateral móvil existente se mantiene).
- Cambiar el color o el estilo del vidrio, o el comportamiento transparente por plantilla.

## Decisions

1. **Franja = fondo de `.header-section`.** Al ser el contenedor fijo de ancho completo, pintar ahí
   `--header-band-color` cubre el viewport y el hueco del margen superior. Alternativa descartada: fondo
   en `.header__row`, que con `section--page-width` no llega al borde y no cubre el margen.
   Se aplica solo cuando `transparent` es blank.
2. **Reserva de espacio con franja activa** mediante `padding-block-start: var(--header-height)` en
   `#MainContent` / `main`, condicionado a una clase `header--band` (selector
   `body:has(#header-component.header--band) main`). Reutiliza la medición de `header.js`. Alternativa
   descartada: quitar `position: fixed` cuando hay franja — cambia el sticky y el morph de secciones.
3. **Altura mínima** como `--header-min-height` sobre `.header__columns` (`min-height` + `align-items:
   center`). `0` → no se emite la variable, así no hay override.
4. **Espaciado tras casilla `custom_spacing`.** Los ranges no pueden expresar "sin valor"; con la casilla
   apagada no se emiten variables y rigen los tokens actuales. IDs nuevos en kebab-case lógico, como el
   resto del tema: `padding-block-start`, `padding-block-end`, `padding-inline`, `margin-block-end`,
   `margin-inline`. Las variables pisan `--padding-block-*` de `.header__columns` y el padding de las
   columnas laterales, solo en escritorio (`min-width: 750px`).
5. **`glass_float_margin` se conserva** (ID y valor), se le quita el `visible_if` y su regla
   `margin-block-start` se mueve fuera del bloque `.header--glass` para aplicar siempre. Se amplía su
   `max` a 48 px (los valores guardados siguen siendo válidos). Etiqueta pasa a "Margen superior".
6. **Ajustes nuevos (borrador de schema)**, en un nuevo `header` "Fondo y espaciado":

   | ID | Tipo | Rango / default | visible_if |
   |---|---|---|---|
   | `header_band_enable` | checkbox | false | — |
   | `header_band_color` | color | `#FFFFFF` | band enable |
   | `header_min_height` | range | 0–160, paso 4, 0 | — |
   | `custom_spacing` | checkbox | false | — |
   | `padding-block-start` / `-end` | range | 0–40, paso 2, 12 | custom_spacing |
   | `padding-inline` | range | 0–64, paso 2, 20 | custom_spacing |
   | `margin-block-end` | range | 0–48, paso 2, 0 | custom_spacing |
   | `margin-inline` | range | 0–80, paso 2, 0 | custom_spacing |

   Todos con ≥ 3 y ≤ 101 pasos. Etiquetas en español literal, como el grupo Glassmorphism existente.

## Risks / Trade-offs

- [`--header-height` puede no incluir el `margin-block-start` del row hijo] → verificar en Playwright que
  la primera sección no queda tapada; si falta, sumar `--glass-float-margin` en el `calc` de la reserva.
- [Franja opaca + vidrio blanco puede quedar plano] → decisión estética del comerciante; el vidrio sigue
  configurable con opacidad.
- [El editor de Shopify reescribe `header-group.json`] → no se editan valores ahí; los defaults del schema
  cubren los ajustes nuevos.

## Migration Plan

Commit + push a `develop`; tras validar en `shopify theme dev`, merge/push a `main` (sync del tema live).
Rollback: revertir el commit; los ajustes nuevos guardados quedan ignorados sin romper nada.
