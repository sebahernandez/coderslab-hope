# Design

## Context

- `sections/video-hope.liquid` ya existe y la home live (`main`, `templates/index.json`) la usa; queda intacta.
- El tema ya carga `assets/dialog.js` en todas las páginas (`snippets/scripts.liquid`) y lo mapea como `@theme/dialog`. `DialogComponent` (custom element `dialog-component`, ref requerida `dialog`) maneja `showDialog`/`closeDialog`, Escape, clic fuera y restauración de foco; se usa en `blocks/popup-link.liquid` con `on:click="/showDialog"`.
- Las secciones custom recientes (`text-image`, `box-items`) usan bloques locales y CSS por custom properties inline + `{% stylesheet %}`.
- La sync GitHub → Shopify descarta en silencio schemas inválidos (p. ej. `range` < 3 pasos).

## Goals / Non-Goals

**Goals:**
- Reutilizar el sistema de diálogo del tema en lugar de crear una modal propia.
- No cargar el reproductor ni el iframe hasta que el visitante pulsa play.
- Bloques de contenido editables con el mismo estilo de schema que el resto de secciones custom.

**Non-Goals:**
- Video inline o de fondo en la sección (eso es `video-hope.liquid`).
- Galería de varios videos.
- Modificar `video-hope.liquid` o plantillas existentes.

## Decisions

1. **Bloques locales de sección (`heading`, `text`, `feature`)** en un único archivo, como `text-image`/`box-items`. Cada tipo tiene ~10–15 ajustes, muy por debajo del volumen que motivó theme blocks en `product-tiles`. *Alternativa*: theme blocks → descartado por sobrecosto sin beneficio aquí.

2. **Media y video en ajustes de sección**, no en bloque: hay exactamente una media por sección y su posición es estructural. Ajustes: `image`, `image_mobile`, `image_alt`, `video_source` (subido/URL), `video`, `video_url`, proporción, radio, botón de play (tamaño, fondo, icono, borde).

3. **Componente `video-modal` que extiende `DialogComponent`** en `assets/video-modal.js`, mapeado como `@theme/video-modal` en el import map y cargado como `<script type="module">` desde la propia sección solo cuando hay video. Sobrescribe `showDialog` para clonar el contenido de un `<template ref="videoTemplate">` dentro del contenedor del reproductor (activa la carga del video/iframe con autoplay) y `closeDialog` para vaciarlo (detiene audio y descarga). *Alternativa*: `dialog-component` puro + pausa manual → no detiene iframes de YouTube/Vimeo sin su API; vaciar el contenedor es universal.

4. **Render del video en Liquid dentro del `<template>`**: subido → `video | video_tag: autoplay: true, controls: true, playsinline: true`; externo → `iframe` con `https://www.youtube-nocookie.com/embed/{id}?autoplay=1&rel=0` o `https://player.vimeo.com/video/{id}?autoplay=1` usando `video_url.id` y `video_url.type`, con `allow="autoplay; fullscreen; picture-in-picture"` y `title` traducible.

5. **Textos de interfaz por `t`**: etiqueta del botón de play ("Reproducir video") y de cerrar usan claves existentes si las hay en `locales/en.default.json` (p. ej. `accessibility.play_video`/`accessibility.close`), o se agregan; verificar en implementación.

6. **Colores de la referencia en el preset** (fondo `#fdf0f5`, títulos `#6b0f3a`, tarjetas rosa `#fdecef`, crema `#fdf3dc`, lila `#f1eafd`, menta `#e6f4ef`, círculo de icono blanco, play `#d4508a` con borde blanco). Los ajustes de color del bloque no tienen default para que "vacío = esquema".

7. **Selects para opciones de 1–2 valores** (p. ej. columnas móviles) y todo `range` con ≥ 3 pasos y default alineado.

## Risks / Trade-offs

- [Autoplay bloqueado por el navegador para video con sonido] → la reproducción se inicia por gesto del usuario (clic en play), lo que la mayoría de navegadores permite; los controles siguen visibles como respaldo.
- [Re-render de sección en el editor duplica listeners] → la lógica vive en el custom element con ciclo de vida del `Component`; sin listeners globales.
- [Schema rechazado en servidor] → validar subiendo a un tema de desarrollo antes del push a `develop`.
- [Iframe externo y privacidad] → usar `youtube-nocookie.com` para YouTube.

## Migration Plan

Sección nueva, no reemplaza nada. Deploy: commit + push a `develop` → verificar en `HOPE-development` → `main` solo con pedido explícito. Rollback: quitar la sección o revertir el commit.
