# Proposal

## Why

En móvil (< 750 px) la tarjeta de los armadores queda más ancha que el navbar flotante: el panel de vidrio del navbar se separa de los bordes según el setting del header "Separación del borde" (`glass_float_margin`, hoy 12 px), mientras que el contenedor `.hopecfg` usa un margen lateral propio de 8 px. Los bordes no se alinean y la página se percibe descuadrada.

## What Changes

- El header publica su margen lateral móvil como variable CSS global, solo cuando el navbar de vidrio está activo y no es transparente en esa plantilla.
- El contenedor de los armadores en móvil usa esa variable como margen lateral, de modo que la tarjeta y el navbar coincidan aunque el comerciante cambie el setting; sin la variable, usa el margen de página del tema.
- Aplica a todos los armadores que comparten el contenedor `.hopecfg` (Helado Hope, Mixo Hope, Milkshake, Barquillo).
- Sin cambios en escritorio ni en el rango 750–1023 px (supuesto: "versión móvil" = breakpoint móvil del navbar, < 750 px).

## Capabilities

### New Capabilities

_Ninguna._

### Modified Capabilities

- `configurador-helado`: se añade un requisito de alineación horizontal de la tarjeta del armador con el navbar en móvil.

## Impact

- `sections/header.liquid`: bloque `{% style %}` que publica la variable global (sin cambios de schema ni de IDs de settings).
- `assets/toppings-customizer.css`: regla base de `.hopecfg` y sus media queries.
- Sin cambios en JS ni datos de la tienda.
