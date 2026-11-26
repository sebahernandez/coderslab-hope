# Proposal

## Why

En la sección "Video Hope modal", la ventana modal del video aparece pegada al borde superior de la pantalla en lugar de centrada verticalmente. La causa es la animación de apertura: anima `margin-top` hasta `0` con `fill-mode: forwards`, lo que anula el `margin: auto` que centra la modal. Se ve en todos los tamaños de pantalla y deja espacio vacío debajo del video.

## What Changes

- La modal del video SHALL quedar centrada vertical y horizontalmente en el viewport en escritorio, tablet y móvil (vertical y horizontal), durante y después de la animación de apertura.
- La animación de apertura y cierre de la modal pasa a animar solo `transform` y `opacity`, sin tocar márgenes.
- La imagen del video gana un overlay configurable tipo YouTube, toda su superficie abre el video y carga la resolución máxima disponible del archivo subido.
- El ancho de la modal se limita también por la altura disponible, para que el video 16:9 entre completo en pantallas bajas (móvil en horizontal) sin desbordar ni recortarse.

## Capabilities

### New Capabilities

_Ninguna._

### Modified Capabilities

- `video-modal`: se agrega el requisito de que la modal quede centrada en el viewport y el video entre completo en cualquier tamaño de pantalla.

## Impact

- `sections/video-hope-modal.liquid` (solo el bloque `{% stylesheet %}`: reglas de `.video-hope-modal__dialog` y keyframes propios).
- Sin cambios en `assets/video-modal.js`, en `assets/dialog.js` ni en `assets/base.css`: los keyframes globales `elementSlideInTop` los siguen usando otras modales del tema.
- Sin cambios de schema ni de ajustes del comerciante.
