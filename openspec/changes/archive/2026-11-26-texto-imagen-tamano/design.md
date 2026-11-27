# Design

## Context

`sections/text-image.liquid` arma una fila flex con `.text-image__content` (flex `1 1 0`, tope `--ti-content-max`) y `.text-image__media` (flex `0 0 var(--ti-media-width)`). Dentro, `.text-image__frame` ocupa el 100 % de la columna con `aspect-ratio: var(--ti-ratio)` y la imagen usa `object-fit: var(--ti-fit)`. Bajo 750 px las columnas se apilan y la imagen ocupa el 100 % del ancho con `--ti-ratio-mobile`.

La proporción "auto" ya se resuelve en Liquid con `image_desktop.aspect_ratio` / `image_mobile.aspect_ratio`, así que el marco ya coincide con la imagen. El recorte observado en la portada viene de la configuración guardada (`ratio_desktop: "1.25"` + `image_fit: "cover"`), no de un defecto del modo "auto". Ver proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Escalar solo el marco de la imagen dentro de su columna, por breakpoint.
- Formalizar que "Según la imagen" nunca recorta ni deja franjas.
- Mantener el render actual con los valores por defecto.

**Non-Goals:**
- No se cambia `media_width` ni su significado (sigue controlando el ancho de columna).
- No se modifica `templates/index.json`; el ajuste visual lo hace el comerciante desde el editor.
- No se agrega un tope en px ni control de alto.

## Decisions

1. **Escalar el marco, no la columna.** Nuevos settings `image_scale` y `image_scale_mobile` (range 40–100, step 5, `%`, default 100) se pasan como `--ti-scale` / `--ti-scale-mobile`. `.text-image__frame` recibe `width: var(--ti-scale)`; como conserva `aspect-ratio`, el alto se deriva solo y la proporción se mantiene.
   *Alternativa descartada:* reutilizar `media_width` con un rango más bajo — mueve el texto y cambia el equilibrio de la fila, que es justo lo que el usuario quiere evitar.
   *Alternativa descartada:* `transform: scale()` — no libera el espacio de layout y deja huecos.

2. **Alineación con propiedades lógicas.** Nuevo setting `image_align` (select `start` / `center` / `end`, default `center`) → `--ti-image-justify`. `.text-image__media` pasa a `display: flex; justify-content: var(--ti-image-justify)`. `flex-start`/`flex-end` respetan RTL sin reglas extra. Se aplica igual en móvil (un solo control para no inflar el schema).

3. **"Según la imagen" fuerza `contain`.** En Liquid, si la proporción del breakpoint es `auto`, el `object-fit` de ese breakpoint se resuelve como `contain` (`--ti-fit` / `--ti-fit-mobile`). Como el marco ya tiene la proporción exacta, `contain` no genera franjas y protege contra diferencias de redondeo que con `cover` recortan un par de píxeles. Requiere separar `--ti-fit-mobile` del de escritorio.

4. **`sizes` según ancho efectivo.** El porcentaje de viewport se calcula como `media_width × image_scale / 100` (entero en Liquid, `times` + `divided_by`) y se usa tanto en la rama `full` como en la `page` (incluido el cálculo en px a 1600). En móvil, `sizes` usa `image_scale_mobile` vw. El `<source>` móvil ya lista anchos fijos y hereda el `sizes` del `<img>`.

5. **Schema en español literal.** La sección no usa `t:` en su schema (labels en español literal, igual que el resto de la sección); se mantiene la convención existente en lugar de mezclar estilos. Los nuevos settings van en el bloque "Imagen", después de "Encaje".

## Risks / Trade-offs

- [Imagen reducida + alineación vertical "Centro"] la fila queda más baja si la imagen era el elemento más alto → comportamiento esperado; la alineación vertical existente sigue gobernando la relación texto-imagen.
- [Forzar `contain` en "auto" ignora la elección de encaje] → documentar en el `info` del setting "Encaje" que con "Según la imagen" la imagen siempre se ve completa.
- [Redondeo entero en `sizes`] puede sobrestimar ~1 vw → impacto despreciable en descarga.
- [Liquid sin `visible_if` para tamaño] → los controles quedan siempre visibles; aceptable porque aplican en cualquier combinación.

## Migration Plan

Sin migración de datos: los defaults (100 %, centro) reproducen el render actual. Despliegue por push a `develop` (y a `main` solo si el usuario lo pide). Rollback: revertir el commit; los settings nuevos guardados se ignoran sin error.
