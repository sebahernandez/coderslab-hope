# Proposal

## Why

La home necesita un bloque "Tu experiencia merece ser compartida" que invite a etiquetar a Hope en redes: una imagen promocional y, al lado, título, texto y botones que enlazan a los perfiles sociales. No existe una sección con imagen + botones de redes configurables por separado (el bloque `_social-link` del footer solo muestra iconos y siempre abre en pestaña nueva).

## What Changes

- Nueva sección "Social Hope" (`sections/social-hope.liquid`) de dos columnas: imagen a un lado y contenido al otro; se apilan en móvil.
- Imagen en ajustes de sección (escritorio y móvil opcional, alt, proporción, radio, enlace opcional).
- Contenido como bloques que el comerciante agrega, ordena y elimina: **título**, **texto** y **botón de red social**.
- Cada botón de red social tiene: texto (p. ej. `@hopesweetvzla`), red (Instagram, TikTok, Facebook, WhatsApp, YouTube, X, Threads, Pinterest, Spotify, otra/ninguna) que define el icono, URL, **destino** (`_blank` pestaña nueva / `_self` misma pestaña), posición del icono, estilo (contorno/relleno), colores normal y hover, radio, tamaño y ancho completo en móvil.
- Varios botones consecutivos se muestran en una fila que se ajusta en pantallas angostas.
- Ajustes de layout, colores y espaciados con valores móviles independientes. Preset con la referencia visual.

## Capabilities

### New Capabilities
- `social-hope`: sección de imagen + contenido con bloques de título, texto y botones de redes sociales con destino configurable.

### Modified Capabilities
<!-- Ninguna. -->

## Impact

- Archivo nuevo: `sections/social-hope.liquid`. Reutiliza los iconos de `snippets/icon.liquid`. Sin JavaScript.
- Sin cambios en el footer, `_social-link` ni plantillas.
- Despliegue: commit + push a `develop` (tema `HOPE-development`); a `main` solo con pedido explícito.
