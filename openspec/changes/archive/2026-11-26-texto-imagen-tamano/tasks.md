# Tasks

## 1. Schema y variables

- [x] 1.1 Agregar en el bloque "Imagen" del schema de `sections/text-image.liquid` los settings `image_scale` y `image_scale_mobile` (range 40–100, step 5, `%`, default 100) y `image_align` (select start/center/end, default center), y actualizar el `info` de "Encaje"; verificar que el JSON del schema es válido (`shopify theme check` sin errores de schema) y que la sección aparece en el editor.
- [x] 1.2 Exponer `--ti-scale`, `--ti-scale-mobile`, `--ti-image-justify` y separar `--ti-fit` / `--ti-fit-mobile` (forzando `contain` cuando la proporción del breakpoint es `auto`) en el `style` inline; verificar en el HTML renderizado que las variables tienen los valores esperados para defaults y para valores modificados.

## 2. Estilos

- [x] 2.1 Hacer `.text-image__media` flex con `justify-content: var(--ti-image-justify)` y dar a `.text-image__frame` `width: var(--ti-scale)` (escritorio) y `var(--ti-scale-mobile)` bajo 749 px, aplicando `--ti-fit-mobile` en móvil; verificar con Playwright a 1440 px y 390 px que con 70 %/80 % la imagen mide ese porcentaje de su columna, conserva la proporción y el texto no se mueve respecto de 100 %.
- [x] 2.2 Verificar alineación inicio/centro/final en LTR y con `dir="rtl"` (evaluando `getBoundingClientRect` del marco vs. la columna).

## 3. Imagen responsive

- [x] 3.1 Recalcular `sizes` con `media_width × image_scale / 100` en ambas ramas (`full` y `page`, incluido el px a 1600) y `image_scale_mobile` vw en móvil; verificar en el HTML renderizado que con 55 % y 60 % el `sizes` de escritorio es ~33vw.

## 4. Verificación integral

- [x] 4.1 Con `shopify theme dev`, en la portada: dejar defaults y confirmar que el render es idéntico al actual; luego elegir "Según la imagen" y bajar el tamaño a 70 % y confirmar que la foto "Helados artesanales" se ve completa, sin recorte, más chica y con el texto en su lugar (captura escritorio y móvil).
- [x] 4.2 Correr `shopify theme check` sobre `sections/text-image.liquid` y resolver hallazgos válidos.
- [x] 4.3 Actualizar la memoria `hope-text-image.md` con los nuevos controles.

## Workflow follow-up

- Commit + push a `develop`; a `main` solo si el usuario lo pide.
- Archivar el cambio (`/opsx:archive`) tras la verificación.
