# Proposal

## Why

La home necesita un bloque "¿Qué hace tan especial un helado de Hope?" que combine una imagen con botón de play (que abre el video en una ventana modal) y una grilla de atributos con icono. La sección actual `video-hope.liquid` (video de fondo con callouts) está en uso en la home live y no cubre este formato, así que se crea una sección nueva sin tocarla.

## What Changes

- Nueva sección "Video Hope modal" (`sections/video-hope-modal.liquid`) de dos columnas: media a un lado, contenido al otro; se apilan en móvil.
- Media: imagen estática (escritorio y móvil opcional) con botón de play centrado y configurable (tamaño, colores, borde).
- Al pulsar play se abre una ventana modal accesible que reproduce el video: subido a Shopify o externo (YouTube/Vimeo). Al cerrar, el video se detiene.
- Todos los elementos de contenido son bloques editables: título, texto/subtítulo y tarjetas de atributo (icono imagen o SVG, título, descripción, colores propios de fondo, icono y textos).
- Ajustes de sección para layout (lado de la media, proporción, ancho de columnas, separaciones, columnas de la grilla en escritorio y móvil), colores y espaciados con valores móviles independientes.
- Preset con los textos y colores de la referencia visual.
- La sección existente `video-hope.liquid` NO se modifica.

## Capabilities

### New Capabilities
- `video-modal`: sección con imagen + botón de play que abre el video en una modal, acompañada de bloques de título, texto y tarjetas de atributo configurables.

### Modified Capabilities
<!-- Ninguna. -->

## Impact

- Archivos nuevos: `sections/video-hope-modal.liquid` y `assets/video-modal.js` (componente que extiende el `DialogComponent` existente de `@theme/dialog`).
- Reutiliza `dialog.js`, ya cargado globalmente; sin dependencias nuevas.
- Sin cambios en `video-hope.liquid`, plantillas ni datos de la tienda.
- Despliegue: commit + push a `develop` (tema `HOPE-development`); a `main` solo con pedido explícito.
