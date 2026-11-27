# Design

## Context

`sections/text-image.liquid` renderiza un marco (`.text-image__frame`) con `aspect-ratio` fijo y la imagen con `object-fit: var(--ti-fit)` y `object-position` derivado de "Posición de la imagen" (por defecto el punto focal, normalmente centro). Con "Contener" la imagen queda centrada dentro del marco y las franjas vacías son parte del marco; el `border-radius` del marco redondea esas franjas invisibles, no la imagen. `image_align` (start/center/end) hoy solo alimenta `justify-content` de `.text-image__media`, efectivo únicamente con `image_scale < 100`. En la tienda live: `ratio_desktop: 1.5`, `image_fit: contain`, `media_side: end`, `media_width: 50`.

## Goals / Non-Goals

**Goals:**
- Una sola fuente de alineación horizontal que gobierne el marco reducido y la imagen contenida.
- Opción automática que siga a `media_side`.
- Radio aplicado a la imagen visible con "Contener".

**Non-Goals:**
- Cambiar el comportamiento de "Cubrir" o del recorte.
- Ajustes de alineación separados por breakpoint.
- Modificar el ancho de columna, el gap o el `sizes` de la imagen.

## Decisions

1. **Reutilizar `image_align` y sumarle el valor `edge`.** En Liquid se resuelve a `end` si `media_side == 'end'` y a `start` si no; en móvil una variable aparte (`--ti-image-justify-mobile`) lo deja en `center`. Alternativa descartada: un setting nuevo "Pegar al borde" (dos controles para el mismo concepto, combinaciones ambiguas). Los valores existentes no cambian, así que los datos guardados siguen válidos.

2. **Con "Contener", dimensionar la imagen en vez de usar `object-fit`.** El marco recibe la clase modificadora `text-image__frame--contain` (por breakpoint, vía variables) y pasa a `display: flex` con `justify-content: var(--ti-image-justify)` y `align-items` según la posición vertical (`top` → `flex-start`, `bottom` → `flex-end`, resto → `center`). `.text-image__picture` usa `display: contents` y la `img` lleva `border-radius: var(--ti-radius)`. El eje que llena se decide en Liquid comparando `image.aspect_ratio` con la proporción del marco: si la imagen es más angosta se agrega `--by-height-*` (`height: 100%; width: auto`), si no `width: 100%; height: auto`. Se descartó `width/height: auto` + `max-*: 100%` porque con `srcset` + `sizes` el tamaño intrínseco del `img` sale de `sizes` y puede quedar menor que el marco. El marco deja `overflow` visible y sin radio en ese modo. Alternativa descartada: mapear la alineación a `object-position` (`right center`): mueve la imagen, pero el radio sigue aplicándose al marco y la imagen pegada al borde queda con esquinas rectas del lado del texto, que es justo lo que se ve en la captura.

3. **Contain efectivo por breakpoint.** Como desktop y móvil pueden diferir (`ratio_* == 'auto'` fuerza `contain`), la clase no basta: se exponen `--ti-frame-display`/modo por breakpoint, o dos modificadores (`--contain-desktop`, `--contain-mobile`) aplicados dentro de su media query. Se elige dos modificadores por legibilidad y baja especificidad.

4. **`sizes` sin cambios.** La imagen visible nunca supera el ancho del marco, así que el cálculo actual sigue siendo un techo correcto.

## Risks / Trade-offs

- [`max-height: 100%` no resuelve si el alto del marco no es definido] → el alto proviene de `aspect-ratio` + ancho, que es definido; verificar en Safari y Chrome con Playwright.
- [`display: contents` en `<picture>` y accesibilidad] → `picture` no aporta semántica propia; el `alt` vive en la `img`, sin impacto.
- [Placeholder SVG sin imagen] → el modo contain solo aplica cuando hay imagen; el placeholder mantiene los estilos actuales.
- [Enlace en el marco (`image_link`)] → con contain el área clicable sigue siendo el marco completo; aceptable y sin cambio respecto a hoy.

## Migration Plan

Sin migración: el valor por defecto `center` reproduce el render actual. Deploy por push a `develop` y luego a `main` según la norma del repo; rollback revirtiendo el commit.
