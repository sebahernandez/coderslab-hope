# Design

## Context

Horizon ya trae `slideshow-component` (`assets/slideshow.js`, cargado globalmente en `snippets/scripts.liquid`) y los snippets `slideshow`, `slideshow-slide` y `slideshow-controls`, que resuelven scroll-snap, swipe, autoplay, flechas, paginación y `aria-hidden` por diapositiva. Las secciones custom de Hope (`slider-imperdibles`, `custom-image`) usan bloques locales en el schema y etiquetas en español literal. El breakpoint móvil del tema es `max-width: 749px`. El ancho de página sale de las clases `page-width-*` y la variable `--page-margin` de `assets/base.css`.

## Goals / Non-Goals

**Goals:**
- Una sola sección autocontenida `sections/slide-hope.liquid` (markup + `{% stylesheet %}` + schema).
- Reutilizar el slideshow de Horizon en modo Slide; cero JS nuevo.

**Non-Goals:**
- Texto, botones o superposiciones HTML sobre la imagen (el diseño de la promo va dentro de la imagen).
- Video en los bloques.
- Ajustes distintos por bloque de autoplay/navegación (son de sección).

## Decisions

1. **Bloques locales en el schema (no theme blocks en `blocks/`).** El usuario pidió un único archivo y el bloque solo tiene sentido dentro de esta sección. Se itera `section.blocks` y se aplica `{{ block.shopify_attributes }}` en el wrapper de cada imagen. Alternativa descartada: theme block `blocks/_slide-hope-image.liquid` con `content_for 'blocks'`; más reutilizable pero añade un archivo y en modo Fija complica renderizar solo el primero.

2. **Modo Fija = primer bloque, sin `slideshow-component`.** Se renderiza el primer bloque en un contenedor simple. Evita cargar estado de carrusel para una sola imagen. Modo Slide con 1 bloque usa la misma ruta del slideshow con `show_arrows: false` y sin controles (igual que `sections/slideshow.liquid`).

3. **Imagen por breakpoint con `<picture>`.** `<source media="(max-width: 749px)" srcset=...>` con la imagen móvil y `<img>` de escritorio vía `image_url`/`image_tag` con `widths` y `sizes` (`100vw` en fullscreen, `min(100vw, ancho de página)` en centrado). El navegador descarga solo la imagen activa. `width`/`height` intrínsecos de la de escritorio; la relación de aspecto de cada breakpoint se pasa como custom property para "Según la imagen". Alternativa descartada: dos `<img>` ocultos con CSS (descarga doble).

4. **Ancho por bloque con wrapper.** Cada diapositiva ocupa el 100 % del track (track a ancho completo de sección). Dentro, un wrapper `slide-hope__frame` aplica `max-width: var(--page-width)` + `margin-inline: auto` + `padding-inline: var(--page-margin)` en Centrado, o `width: 100%` sin padding en Fullscreen. La sección se marca `section--full-width` para que Fullscreen llegue al borde del viewport; Centrado reproduce el ancho de página.

5. **Altura y encaje por custom properties inline.** El bloque emite `--sh-height-desktop`, `--sh-height-mobile` (p. ej. `450px`, `60vh`, o `auto`), `--sh-ratio-desktop/mobile`, `--sh-fit` y `--sh-position`. El CSS usa `height: var(--sh-height-desktop)` y, en `auto`, `aspect-ratio: var(--sh-ratio-*)`. `object-fit: var(--sh-fit)` y `object-position: var(--sh-position)` en la `<img>`. Se usan rangos (`range`) para los valores (px: 100–1000; vh/vw: 10–100) con un único par de rangos numéricos interpretados según la unidad, y `visible_if` los oculta en "Según la imagen".

6. **Radio siempre aplicado.** Rango de sección 4–48 px, default 24 px. En Cubrir, `border-radius` + `overflow: hidden` en el contenedor de la imagen (no en el slide). En Contener, el radio va en la propia `<img>`, que se dimensiona a su proporción con `width: min(100%, altura × ratio)` calculado en Liquid y se alinea con grid según la posición; así las esquinas visibles de la imagen siempre quedan redondeadas (aplicar el radio al contenedor dejaba esquinas rectas en las franjas del letterbox, detectado en verificación).

7. **Carga.** Primera imagen `loading="eager"` y `fetchpriority="high"` si la sección es la primera de la plantilla (`section.index == 1`), resto `lazy`.

## Risks / Trade-offs

- [Un único par de rangos para px/vh/vw puede confundir (450 en vh no tiene sentido)] → rango 10–1000 con texto de ayuda por unidad; valores fuera de 100 en vh/vw se limitan con `min()` en Liquid a 100.
- [Fullscreen dentro de un carrusel con diapositivas mixtas Centrado/Fullscreen cambia el ancho visible entre slides] → comportamiento aceptado: cada slide respeta su ajuste; documentado en la ayuda del bloque.
- [Contener deja franjas vacías dentro del radio] → fondo del esquema de color de la sección rellena las franjas.
- [Los estilos de `slideshow` de Horizon podrían imponer alturas propias] → no pasar `slide_size` y fijar altura en el frame propio; verificar en preview.

## Migration Plan

Sección nueva sin datos previos: no hay migración. Despliegue por commit + push a `main` (sincroniza el tema live). Rollback: revertir el commit; las instancias agregadas en el editor quedarían huérfanas y deben eliminarse antes.
