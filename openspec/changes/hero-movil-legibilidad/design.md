# Design

## Context

Estado actual observado (ver proposal.md - Why para la motivación):

- `sections/hero-text.liquid` pinta el fondo con `background-image` sobre `.hero-banner-section` (`cover` + `center center` fijo) y declara todo el CSS en un `<style>` inline (estático y dinámico mezclados). Variables por instancia: `--hero-bg-image(-mobile)`, `--hero-height(-mobile)`, `--hero-min-height(-mobile)`, `--hero-vertical-alignment(-mobile)`.
- En ≤768 px la sección aplica `padding: 40px 15px`, y su hijo `.hero-banner-container.section--page-width` añade un gutter de grid de `--page-margin` (16 px, `assets/base.css:313`). Resultado medido: 31 px por lado. `.hero-banner-text` tiene `min-width: 300px` y `.hero-banner-content` centra sus hijos, por eso en 390/430 px el bloque queda en 40/60 px.
- Los textos los renderizan `blocks/_hero-text-row.liquid` y `blocks/_hero-button.liquid`; cada uno controla su propia alineación horizontal (`align-self` + `text-align`) por breakpoint. El breakpoint de los blocks también es 768 px.
- 7 instancias: 4 en `templates/index.json`, 2 en `page.como-comprar.json`, 1 en `page.contact.json`. Ninguna usa la imagen principal en móvil (en el home `show_image` está en false o la imagen no está asignada).
- Capturas de referencia (390 px): Helado Hope y Milkshakes con texto sobre el producto; Contacto ilegible (texto #630022 sobre fresas/crema, sin imagen móvil).

## Goals / Non-Goals

**Goals:**
- Encuadre de imagen predecible por breakpoint, apoyado en el punto focal nativo de Shopify.
- Texto legible por construcción (velo orientado a la zona del contenido), no por suerte del recorte.
- Un solo gutter lateral en móvil, coherente con el resto del tema.
- Compatibilidad total con los datos guardados: ningún ID de setting existente cambia de tipo ni de significado.

**Non-Goals:**
- Detección automática del brillo de la imagen en el navegador (JS/canvas). La legibilidad se garantiza con el velo configurable y se verifica en QA.
- Rediseñar tipografía, el botón glass o la imagen principal (`show_image`).
- Cambiar el header transparente que se superpone al primer hero.

## Decisions

### D1. Fondo como `<picture>` + `object-fit`, no `background-image`
Se renderiza `<picture class="hero-banner__media">` con `<source media="(max-width: 768px)">` para la imagen móvil y un `<img>` generado con `image_url` + `image_tag` (`widths`, `sizes="100vw"`, `width`/`height` intrínsecos). CSS: `object-fit: cover; object-position: var(--hero-bg-pos)` y en móvil `var(--hero-bg-pos-mobile)`.
- Por qué: `object-position` admite el mismo valor que el punto focal de Shopify; `<picture>` descarga solo la fuente activa; el navegador elige el ancho por `srcset`; permite `fetchpriority="high"`/`loading="eager"` cuando `section.index == 1` y `lazy` en el resto (requisito de carga eficiente).
- Alternativa descartada: mantener `background-image` con `image-set()` y media queries. Descarga una sola imagen grande, no participa en LCP con prioridad y no admite `loading`.
- `alt` vacío: el fondo es decorativo; el contenido semántico vive en los textos.

### D2. Media y velo absolutos, contenido en grid
`.hero-banner-section` pasa a `display: grid` (`position: relative; isolation: isolate`). Media y velo usan `position: absolute; inset: 0` para no aportar altura; el contenedor es la única celda del grid. Orden de pintado: media (z 0) → velo (z 1) → contenido (z 2). La altura sigue saliendo de `--hero-height`/`--hero-min-height`, y el contenido define la altura mínima cuando es mayor.
- Alternativa descartada durante apply: apilar los tres en `grid-area: 1 / 1`. El `<img>` aportaba su altura intrínseca a la fila y agrandaba la sección.

### D3. Posición del contenido en rejilla 3×3 por breakpoint
Nuevos selects `content_position_x` / `content_position_x_mobile` con valores `auto | left | center | right`. Se mantienen `vertical_alignment` / `vertical_alignment_mobile` (mismos valores `flex-start | center | flex-end`), que ahora alimentan `align-self` del bloque de contenido dentro de la celda.
- `auto` (default) conserva el comportamiento actual: el contenedor ocupa todo el ancho y cada block se alinea por su propio setting. Con `start/center/end`, el contenedor `.hero-banner-text` se ajusta a su contenido (`width: fit-content; max-width: 100%`) y se coloca con `justify-self`.
- Por qué: compatibilidad con las 7 instancias guardadas y control explícito para nuevas.

### D4. Gutter móvil único y sin ancho mínimo
En ≤768 px: `padding-inline: 0` en la sección (se conserva el `padding-block` de 40 px) y el gutter queda a cargo del grid de `section--page-width` (`--page-margin`, 16 px). `.hero-banner-text` pierde `min-width: 300px` y gana `min-width: 0`; los textos con `<br>` y textos largos envuelven con `overflow-wrap: anywhere` en su contenedor.
- Alternativa: un setting de padding lateral móvil. Descartada para este cambio: el pedido es reducirlo y el tema ya define el margen de página; un control más solo abre combinaciones inconsistentes.

### D5. Posición de la imagen: focal point → override
Nuevos selects `background_position` y `background_position_mobile` con `auto | top | center | bottom | left | right | top left | top right | bottom left | bottom right`. En Liquid:
`auto` → `image.presentation.focal_point` de la imagen correspondiente (si no está definido, `50% 50%`); cualquier otro valor → ese valor CSS literal. Se emiten como `--hero-bg-pos` / `--hero-bg-pos-mobile` en el `{% style %}` scopeado.
- Verificar en apply que `presentation.focal_point` devuelve un string CSS válido (`"x% y%"`) para imágenes `shop_images`; el tema ya lo usa en `snippets/swatch.liquid:39`.

### D6. Altura móvil "Según la imagen"
Nuevo select `height_type_mobile` con `inherit` (default, usa `height_type` como hoy) e `image`. Con `image`, en ≤768 px la sección usa `aspect-ratio: {{ img.aspect_ratio }}` (imagen móvil o, si falta, la de escritorio), `height: auto` y `min-height: 0`; el contenido sigue pudiendo crecer si es más alto que la imagen.
- Por qué: es la única forma CSS de mostrar el sujeto completo sin recorte; `cover` con altura fija siempre recorta según el ancho del dispositivo.

### D7. Velo de contraste orientado a la zona
Settings: `overlay_style` (`none | gradient | solid`, default `none` para no alterar instancias que no se ajusten), `overlay_color` (color, default `#ffffff`), `overlay_opacity` (range 0–90 %, default 60), `text_shadow` (checkbox, default false).
- Capa `<div class="hero-banner__overlay" aria-hidden="true">` con `pointer-events: none`.
- Degradado: `linear-gradient(var(--hero-overlay-dir), rgb(var(--hero-overlay-rgb) / var(--hero-overlay-alpha)) 0%, rgb(var(--hero-overlay-rgb) / calc(var(--hero-overlay-alpha) * .6)) 35%, transparent 75%)`. La dirección se calcula en Liquid por breakpoint a partir de la zona (x efectivo, y) → `--hero-overlay-dir` / `--hero-overlay-dir-mobile` (p. ej. izquierda+medio → `to right`; izquierda+abajo → `to top right`; centro+abajo → `to top`; centro+medio → velo radial centrado). Cuando x es `auto`, se toma la alineación del primer block de la sección para ese breakpoint.
- Sólido: `background: rgb(var(--hero-overlay-rgb) / var(--hero-overlay-alpha))`.
- Sombra: `text-shadow` en `.hero-banner-text` (heredado por los blocks) usando el color del velo, suave (0 1px 2px + 0 0 12px).
- Alternativa descartada: panel "glass" detrás del texto con `backdrop-filter`. Útil, pero cambia la estética de marca y añade coste de render en móviles; queda como posible extensión.
- Accesibilidad: el color/opacidad lo elige el comerciante; la verificación de contraste (spec) se hace en QA para las 7 instancias.

### D8. Organización del CSS
El CSS estático pasa a un único `{% stylesheet %}` de la sección con clases BEM de baja especificidad (`.hero-banner`, `__media`, `__overlay`, `__content`); los valores por instancia quedan en el `{% style %}` scopeado a `#shopify-section-{{ section.id }}` solo como custom properties. Se usan propiedades lógicas donde no hay dirección (`padding-inline`, `inset`). La posición horizontal del contenido y la dirección del degradado son físicas (izquierda/derecha) a propósito, porque la alineación de los blocks ya es física; así texto y velo coinciden también en RTL. Se conservan las clases actuales (`hero-banner-section`, `hero-banner-container`, `hero-banner-content`, `hero-banner-text`) para no romper estilos externos.

### D9. Verificación de contraste con Playwright
Script de QA (no se versiona en el tema; vive en el scratchpad): por cada hero y ancho (360/390/430 y 1440), ocultar los textos con `visibility: hidden`, capturar la sección, muestrear los píxeles dentro del rectángulo de cada `.hero-text-row`, tomar el percentil desfavorable (p90 de diferencia de luminancia contra el color del texto) y calcular la razón de contraste WCAG. También comprobar `scrollWidth <= innerWidth` y la distancia del texto a los bordes (16 px).

## Risks / Trade-offs

- [Los templates JSON se sincronizan desde el admin de Shopify ("Update from Shopify")] → Cambiar solo los settings nuevos de las 7 instancias, hacer `git pull` justo antes y desplegar rápido; si hay conflicto, reaplicar los valores desde el editor del tema.
- [`presentation.focal_point` podría venir vacío o con otro formato] → Fallback a `50% 50%` y verificación en apply con una imagen con y sin punto focal.
- [Cambiar a `<img>` altera el LCP y el orden de carga del primer hero] → `fetchpriority="high"` solo para `section.index == 1`; medir en la portada móvil que se descarga una sola imagen.
- [`aspect-ratio` con textos largos] → el contenido puede exceder la proporción; se acepta que la sección crezca (la imagen se recorta mínimamente) antes que cortar texto.
- [Un velo intenso puede lavar la foto] → defaults conservadores (`none` global; opacidad ajustada por instancia en QA).

## Migration Plan

1. Implementar en `sections/hero-text.liquid` con defaults que reproducen el render actual (`auto`, `inherit`, `none`), salvo el gutter móvil (cambio deseado global).
2. Ajustar en los templates los settings nuevos de cada instancia, iterando con Playwright contra `shopify theme dev` hasta cumplir el spec.
3. `shopify theme check`, revisión visual escritorio/móvil, commit y push a `main` (deploy por GitHub) tras confirmación del usuario.
4. Rollback: revertir el commit; los settings nuevos quedan ignorados por la versión anterior sin romper los datos guardados.

## Open Questions

- Valores finales de velo/posición por instancia: se deciden durante la iteración visual y no cambian el diseño ni las tareas.
