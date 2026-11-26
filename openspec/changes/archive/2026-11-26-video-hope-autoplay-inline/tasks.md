# Tasks

## 1. Markup del video en línea

- [x] 1.1 En `sections/video-hope-modal.liquid`, reemplazar `<video-modal>` (botón, `<dialog>`, `<template>`) por el video directo dentro de `.video-hope-modal__frame`: `video_tag` con `autoplay`, `muted`, `loop`, `playsinline`, sin `controls`, `preload: 'metadata'`, poster desde la imagen y `aria-hidden="true"`; verificar en el HTML renderizado que no existen `video-modal`, `dialog` ni `.video-hope-modal__play`.
- [x] 1.2 Reescribir los iframes de YouTube (`mute=1&loop=1&playlist={id}&controls=0&playsinline=1`) y Vimeo (`background=1`) con `tabindex="-1"`, `aria-hidden="true"` y `title`; verificar cambiando temporalmente `video_source` a una URL de YouTube en el editor que se reproduce silenciado y en loop.
- [x] 1.3 Renderizar `<picture>` solo cuando no hay video (placeholder si tampoco hay imagen) y quitar el `<script src="video-modal.js">`; verificar ambos casos en el editor.
- [x] 1.4 Agregar el `<script type="module">` inline que pausa los `<video>` de la sección con `prefers-reduced-motion: reduce`; verificar con Playwright `emulateMedia({ reducedMotion: 'reduce' })` que `video.paused === true`.
- [x] 1.5 Actualizar el comentario "Section contract" para describir el video en línea; verificar por lectura.

## 2. Estilos

- [x] 2.1 En `{% stylesheet %}`, posicionar `video` e `iframe` absolutos a `inset: 0` con `object-fit: cover` (iframe escalado a cover y `pointer-events: none`) y mantener el overlay encima; verificar con Playwright a 1440 y 390 px que el video llena el frame, las esquinas se ven redondeadas a 24 px y no hay scroll horizontal.
- [x] 2.2 Eliminar CSS de `__play`, `__play-circle`, `__play-icon`, `__modal`, `__dialog`, `__close`, `__player` y los hover/focus-within del frame y la imagen; verificar con `rg` que no quedan selectores sin markup.

## 3. Schema y datos guardados

- [x] 3.1 Quitar el header "Botón de play" y los ajustes `play_size`, `play_size_mobile`, `play_bg`, `play_icon_color`, `play_border_color`, `play_border_width` y sus `--vhm-play-*`; actualizar el `info` de `video_source`; verificar que el JSON del schema parsea (`jq`) y que `rg "play_" sections/video-hope-modal.liquid` no devuelve resultados.
- [x] 3.2 Quitar esas claves de `video_hope_modal_nFwVzD` en `templates/index.json`; verificar con `jq` que el template parsea y conserva `image`, `video`, `image_ratio` e `image_radius`.
- [x] 3.3 Correr `shopify theme check` y resolver hallazgos válidos de la sección.

## 4. Verificación integral

- [x] 4.1 Con `shopify theme dev`, comprobar en la home (desktop 1440×900 y móvil 390×844) que el video arranca solo, sin sonido, se repite al terminar, se ve en línea en móvil, no hay botón ni modal, y el clic sobre el video no hace nada; el Tab no se detiene en el video.
- [x] 4.2 Revisar el peso de `Video-hope.mp4` servido (pestaña Network) y anotarlo en el reporte de verificación. (Medido: ~4,9 MB transferidos vía HLS en desktop, 6 recursos.)

## Workflow follow-up

- Commit y push a `develop`; push a `main` (publica en vivo) solo con confirmación explícita.
- Archivar el cambio y sincronizar la spec `video-modal` tras verificar.
