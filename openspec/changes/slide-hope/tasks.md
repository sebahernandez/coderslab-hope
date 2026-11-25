# Tasks

## 1. Schema de la sección

- [x] 1.1 Crear `sections/slide-hope.liquid` con contrato de sección y schema: ajustes de sección (modo Slide/Fija, autoplay + velocidad con `visible_if`, estilo de flechas, paginación, radio 4–48 px default 24, esquema de color, padding) y bloque local "Imagen" (imagen escritorio, imagen móvil, alt, enlace, ancho Centrado/Fullscreen, unidad de altura auto/px/vh/vw, altura escritorio y móvil con `visible_if`, encaje cover/contain, posición) y un preset con 2 bloques; verificar que el editor de tema carga la sección sin errores de schema y `shopify theme check` no reporta errores en el archivo.

## 2. Render de la imagen

- [x] 2.1 Implementar el render de bloque con `<picture>` (source móvil `max-width: 749px` + img escritorio con `widths`/`sizes`, alt con fallback, enlace opcional, `block.shopify_attributes`, placeholder solo en el editor) y las custom properties de altura, ratio, encaje y posición; verificar con Playwright a 390 px y 1440 px que se descarga y muestra la imagen correcta en cada breakpoint.
- [x] 2.2 Implementar el `{% stylesheet %}`: frame Centrado (ancho de página + `--page-margin`) y Fullscreen (100 % del viewport), altura por breakpoint o `aspect-ratio` en auto, `object-fit`/`object-position`, `border-radius` + `overflow: hidden` siempre; verificar a 320, 390, 1024 y 1600 px que no hay scroll horizontal, que Centrado no supera el ancho de página y que las esquinas están redondeadas en ambos anchos.

## 3. Modos Fija y Slide

- [x] 3.1 Modo Fija: renderizar solo el primer bloque sin `slideshow-component`; verificar con 3 bloques que solo aparece la primera imagen y no hay flechas ni puntos.
- [x] 3.2 Modo Slide: envolver los bloques con los snippets `slideshow`/`slideshow-slide`/`slideshow-controls` (sin controles ni flechas con 1 bloque, autoplay según ajuste) y carga eager/`fetchpriority` solo para la primera imagen cuando `section.index == 1`; verificar con Playwright navegación por flechas, puntos, swipe y avance automático, y que con 1 bloque no hay controles.

## 4. Verificación integral

- [x] 4.1 Agregar la sección en `shopify theme dev` (127.0.0.1:9292), recorrer cada escenario de `specs/slide-hope/spec.md` (modos, breakpoints, anchos, alturas px/vh/vw/auto, encajes, radio mínimo, enlace con teclado) y repetir tras cambiar ajustes en el editor (re-render de sección); registrar el resultado de cada escenario.

## Workflow follow-up

- Confirmar con el usuario antes de commit + push a `main` (publica en el tema live).
- Archivar el cambio con `/opsx:archive` tras la verificación.
