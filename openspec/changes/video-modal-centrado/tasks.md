# Tasks

## 1. Estilos de la modal

- [x] 1.1 En el `{% stylesheet %}` de `sections/video-hope-modal.liquid`, declarar en `.video-hope-modal__dialog` `inset: 0`, `margin: auto`, `height: fit-content` y `width: min(92vw, 1000px, calc(92dvh * 16 / 9))` con fallback en `vh`; verificar en el editor que la modal sigue mostrando el video completo.
- [x] 1.2 Reemplazar `elementSlideInTop` / `elementSlideOutTop` en `.video-hope-modal__dialog[open]` y `.dialog-closing` por keyframes propios `video-hope-modal-in` / `video-hope-modal-out` que animen solo `opacity` y `transform`; verificar que `assets/base.css` no se modifica (`git diff --stat`).
- [x] 1.3 Añadir `@media (prefers-reduced-motion: reduce)` con animación solo de opacidad; verificar emulando reduced motion en Playwright que la modal aparece sin desplazamiento.
- [x] 1.4 Correr `shopify theme check` sobre la sección y verificar que no aparecen hallazgos nuevos.

## 2. Verificación en navegador

- [x] 2.1 Con `shopify theme dev` y Playwright, abrir la modal a 1440×900, 768×1024, 390×844 y 844×390; verificar con `getBoundingClientRect()` que el espacio superior e inferior difiere en ≤ 1 px tras terminar la animación y que el video cabe completo sin scroll.
- [x] 2.2 Verificar que Escape, el botón de cerrar y el clic en el fondo siguen cerrando la modal, que el video se detiene y que el foco vuelve al botón de play.

## Workflow follow-up

- Commit y push a `develop` (no a `main` salvo pedido explícito).
- Archivar el cambio tras la verificación.

## 3. Overlay y resolución de la imagen

- [x] 3.1 Calcular en Liquid los anchos de `srcset` (escritorio y móvil) limitados al ancho original e incluyéndolo; verificar en Playwright que `currentSrc` es la versión de ancho original.
- [x] 3.2 Añadir overlay (`overlay_enabled`, `overlay_color`, `overlay_opacity`, `overlay_gradient`) con degradado tipo YouTube; verificar el color y el degradado aplicados en Playwright.
- [x] 3.3 Hacer que el botón de play cubra toda la imagen con el círculo como elemento visual, hover/focus con zoom suave y reduced motion; verificar que el clic en una esquina abre la modal, que Enter la abre y que el foco vuelve al botón.
