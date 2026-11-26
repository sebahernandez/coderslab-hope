# Design

## Context

`sections/video-hope-modal.liquid` hoy renderiza dentro de `.video-hope-modal__frame` (que ya tiene `aspect-ratio: var(--vhm-ratio)`, `overflow: hidden` y `border-radius: var(--vhm-radius)`) una `<picture>`, un overlay opcional y el custom element `<video-modal>` (botón de play + `<dialog>` + `<template>` que monta el video solo al abrir). El JS vive en `assets/video-modal.js`, mapeado como `@theme/video-modal` en `snippets/scripts.liquid`, y la sección es su único consumidor. En la home la instancia usa video subido (`Video-hope.mp4`), proporción 3:2 y radio 24 px. Ver proposal.md para la motivación y `specs/video-modal/spec.md` para los requisitos.

## Goals / Non-Goals

**Goals:**
- Video en línea dentro del mismo recuadro, reutilizando el contenedor que ya aporta proporción, recorte y radio.
- Cero JavaScript de framework para la reproducción: atributos nativos de `<video>` y parámetros de embed.
- Conservar los IDs de ajustes existentes (imagen, overlay, video, layout) para que la configuración guardada siga aplicando.

**Non-Goals:**
- Renombrar el archivo o el nombre de la sección ("Video Hope modal"): el `type` está referenciado en `templates/index.json`.
- Borrar `assets/video-modal.js` ni su entrada del import map (limpieza aparte).
- Controles de pausa/sonido o reproducción al entrar en viewport.

## Decisions

1. **Reutilizar `.video-hope-modal__frame` como contenedor del video.** Ya resuelve proporción, `overflow: hidden` y radio; el video se posiciona `position: absolute; inset: 0; width/height: 100%; object-fit: cover`. Alternativa descartada: aplicar `border-radius` al `<video>` directamente — Safari a veces no recorta bien el video compuesto en GPU; el `overflow: hidden` del padre ya es el patrón probado (si aparece el bug, añadir `isolation: isolate` al frame).

2. **Video subido con `video_tag` nativo**: `autoplay`, `muted`, `loop`, `playsinline`, sin `controls`, `preload: 'metadata'`, y `image: ` / poster con la imagen desktop (`s.image | default: s.image_mobile`, tamaño ~1400 px). `muted` es obligatorio: sin él Chrome/Safari bloquean el autoplay. Alternativa descartada: montar con JS al entrar en viewport — añade un módulo para un único video y el autoplay nativo ya es diferido por el navegador fuera de pantalla en móviles.

3. **Embeds YouTube/Vimeo como fondo.**
   - YouTube: `youtube-nocookie.com/embed/{id}?autoplay=1&mute=1&loop=1&playlist={id}&controls=0&playsinline=1&rel=0&modestbranding=1` (`playlist` es requisito de YouTube para que `loop` funcione en un solo video).
   - Vimeo: `player.vimeo.com/video/{id}?background=1` (autoplay + loop + muted + sin controles).
   - Como un iframe no admite `object-fit`, se escala para cubrir: el iframe se centra y se dimensiona con `width: max(100%, calc(100% * 16/9 / var(--vhm-ratio)))` y su altura equivalente, con `pointer-events: none` para que el clic no pause ni abra el reproductor.

4. **Decorativo para AT.** `<video>` con `aria-hidden="true"` y sin `controls` (no es tabulable). Iframe con `tabindex="-1"`, `aria-hidden="true"` y `title` (desde el primer bloque heading, como hoy) para Theme Check.

5. **Reducir movimiento.** Un `<script type="module">` inline mínimo dentro de la sección: si `matchMedia('(prefers-reduced-motion: reduce)').matches`, hace `pause()` y `currentTime = 0` sobre los `<video>` de la sección (seleccionados por el `section.id`), dejando visible el poster. Se elige inline frente a un asset nuevo porque son pocas líneas sin estado ni listeners persistentes y se re-ejecuta con el re-render del editor. Los embeds no se controlan (ver riesgos).

6. **Imagen como poster/reemplazo.** El bloque `<picture>` se renderiza solo cuando `has_video` es falso. Se mantiene todo el cálculo de `srcset`/`sizes` para ese caso. Con video, el poster es lo primero que se ve; la sección no es la primera de la home, así que no se precarga.

7. **Schema.** Se eliminan el header "Botón de play" y los ajustes `play_size`, `play_size_mobile`, `play_bg`, `play_icon_color`, `play_border_color`, `play_border_width`, junto con sus custom properties (`--vhm-play-*`). Se actualiza el `info` de `video_source` ("Sin video se muestra la imagen."). Se eliminan esas claves de la instancia en `templates/index.json` para no dejar datos huérfanos. Se quita CSS de `__play`, `__play-circle`, `__dialog`, `__close`, `__player`, `__modal` y los hover/focus-within del frame; el `<script src="video-modal.js">` deja de renderizarse.

## Risks / Trade-offs

- [El navegador bloquea el autoplay (modo ahorro de datos/batería en iOS)] → el poster queda visible; la sección sigue viéndose correcta.
- [Peso del MP4 en móvil, se descarga sin interacción] → `preload="metadata"` más el poster; Shopify sirve el video en varias renditions vía `video_tag`. Revisar el tamaño de `Video-hope.mp4` en la verificación.
- [Reducir movimiento no aplica a YouTube/Vimeo] → aceptado: la home usa video subido; documentado.
- [Quitar ajustes del schema y la sync de GitHub descarta schemas inválidos en silencio] → validar JSON del schema y correr Theme Check antes del push; verificar en el editor que la sección conserva sus ajustes.
- [Sin controles no hay forma de pausar (WCAG 2.2.2)] → video silenciado y decorativo; mitigado por el respeto a `prefers-reduced-motion`. Si se necesita conformidad estricta, agregar un botón de pausa en un cambio posterior.

## Migration Plan

1. Implementar en `develop`, verificar con `shopify theme dev` + Playwright (desktop 1440, móvil 390, reduced motion emulado).
2. Push a `develop`; a `main` (live) solo con confirmación del usuario, tras `git fetch` + rebase.
3. Rollback: revertir el commit; los ajustes eliminados del botón de play vuelven con sus defaults.
