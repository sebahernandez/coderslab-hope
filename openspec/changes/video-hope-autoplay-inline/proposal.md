# Proposal

## Why

En la home, la sección "Video Hope modal" muestra una imagen con botón de play y el video solo se ve si el visitante abre una ventana modal. Se busca que el video se vea siempre, en el mismo recuadro donde hoy está la imagen, como un elemento vivo de la página sin requerir interacción.

## What Changes

- **BREAKING** Se elimina la ventana modal (`<video-modal>` + `<dialog>` + botón de cerrar) de la sección `sections/video-hope-modal.liquid`.
- **BREAKING** Se elimina el botón de play y sus ajustes de schema ("Botón de play": tamaño, tamaño móvil, fondo, color de icono, color y ancho de borde).
- El video se renderiza directamente dentro del recuadro de la media (`.video-hope-modal__frame`), ocupando toda su superficie, con reproducción automática, silenciado (requisito de los navegadores para autoplay), en loop infinito, en línea (`playsinline`) y sin controles.
- Se mantiene el radio de borde configurable (`image_radius`) y la proporción (`image_ratio`) del recuadro; el video se recorta (cover) para llenarlo sin franjas.
- La imagen deja de mostrarse cuando hay video: se usa como `poster` del video subido (lo que se ve mientras carga) y como contenido de reemplazo cuando no hay video configurado.
- YouTube y Vimeo siguen soportados como fondo silenciado en loop sin controles.
- Si el visitante tiene activada la preferencia de reducir movimiento, el video subido no se reproduce automáticamente y se muestra el poster.
- Se quitan los efectos de hover/foco pensados para el clic en la imagen.

## Capabilities

### New Capabilities

_Ninguna._

### Modified Capabilities

- `video-modal`: la reproducción pasa de modal bajo demanda a video en línea con autoplay y loop; se retiran los requisitos de modal, botón de play y accesibilidad de la modal.

## Impact

- `sections/video-hope-modal.liquid`: markup, CSS (`{% stylesheet %}`) y schema.
- `templates/index.json`: instancia `video_hope_modal_nFwVzD` (video subido `Video-hope.mp4`, proporción 3:2, radio 24 px); conserva sus ajustes salvo los del botón de play, que dejan de existir.
- `assets/video-modal.js` y su entrada `@theme/video-modal` en `snippets/scripts.liquid` quedan sin consumidores; se mantienen en este cambio.
- Publica en vivo al hacer push a `main` (flujo habitual: `develop` primero).
