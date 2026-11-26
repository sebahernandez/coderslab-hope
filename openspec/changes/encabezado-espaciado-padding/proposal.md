# Proposal

## Why

La separación superior e inferior de la barra del encabezado se aplica con `margin` sobre la fila superior.
Cuando el encabezado no contiene esos márgenes (sin franja activa), colapsan fuera de él: empujan hacia
abajo los elementos externos y no se cuentan en la altura medida del encabezado (`--header-height`), que
usan otros componentes para reservar espacio y alinear contenido.

## What Changes

- La separación superior (ajuste `glass_float_margin`) y la inferior (ajuste `margin-block-end`) pasan a
  aplicarse como espacio interno (padding) del encabezado en lugar de margen de la fila.
- La altura medida del encabezado incluye esa separación en todos los casos, con o sin franja y con o sin
  glassmorphism.
- Los IDs, tipos, rangos y valores por defecto de los ajustes no cambian; el aspecto visual con los valores
  guardados se mantiene.
- Fuera de alcance: el margen lateral móvil (`glass_float_margin` en móvil) y el margen lateral de escritorio
  (`margin-inline`) siguen como están.

## Capabilities

### New Capabilities

_(ninguna)_

### Modified Capabilities

- `encabezado-apariencia`: se añade el requisito de que la separación vertical de la barra sea interna al
  encabezado y no desplace contenido externo.

## Impact

- `sections/header.liquid`: reglas CSS de "Apariencia configurable" (separación superior/inferior) y, si
  aplica, el `display: flow-root` de `.header--band`.
- Consumidores de `--header-height` (`assets/header.js`, `assets/critical.js`, offset de la primera sección y
  reserva de espacio con franja): reciben una altura que ahora incluye la separación.
- Sin cambios de schema ni de datos guardados.
