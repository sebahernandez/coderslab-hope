# Proposal

## Why

La home necesita la sección "Lo que dicen quienes ya probaron Hope" con testimonios de clientes en tarjetas editables. La sección existente `carousel-testimonials.liquid` tiene estilos fijos y no permite configurar cada testimonio por separado ni ajustes móviles, así que se crea una nueva.

## What Changes

- Nueva sección "Testimonios Hope" (`sections/testimonios-hope.liquid`) con título y subtítulo configurables y una grilla de tarjetas.
- Cada testimonio es un bloque independiente: avatar (imagen), calificación en estrellas (1–5), nombre/etiqueta, texto del testimonio y sus propios colores, tamaños y espaciados, con valores móviles.
- Grilla estática responsive (3 columnas en escritorio por defecto, apiladas en móvil). Por ahora **sin carrusel**: todos los testimonios se muestran a la vez.
- Preset con los 3 testimonios de la referencia.
- **Futuro (no incluido)**: modo slide/carrusel. Queda registrado como cambio de planificación separado `testimonios-hope-slide` (proposal + spec), para implementarlo cuando se pida.

## Capabilities

### New Capabilities
- `testimonios-hope`: sección de testimonios con tarjetas independientes configurables y grilla responsive.

### Modified Capabilities
<!-- Ninguna. -->

## Impact

- Archivo nuevo: `sections/testimonios-hope.liquid`. Sin JavaScript.
- Sin cambios en `carousel-testimonials.liquid` ni en plantillas.
- Despliegue: commit + push a `develop` (tema `HOPE-development`); a `main` solo con pedido explícito.
