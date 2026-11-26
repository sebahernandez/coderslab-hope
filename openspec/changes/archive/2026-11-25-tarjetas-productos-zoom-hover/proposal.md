# Proposal

## Why

Las imágenes de la sección "Tarjetas de productos" son estáticas al pasar el cursor, por lo que la vitrina se siente plana y no comunica que la tarjeta es interactiva. Un zoom suave en hover da respuesta visual inmediata sin cambiar el layout.

## What Changes

- Al pasar el cursor sobre una tarjeta de la sección "Tarjetas de productos", su imagen (o placeholder) hace un zoom in suave; al salir, vuelve suavemente a su tamaño original (zoom out).
- El zoom queda recortado dentro del contenedor de la imagen: respeta el radio de esquinas y la proporción configurados y no desplaza el resto de la tarjeta.
- El mismo efecto se activa cuando el botón de la tarjeta recibe foco de teclado.
- El efecto se omite en dispositivos sin puntero fino (táctiles) y cuando el visitante prefiere movimiento reducido.
- Nuevo ajuste por tarjeta "Zoom de imagen en hover" (activado por defecto) para que el comerciante pueda desactivarlo en una tarjeta concreta.

## Capabilities

### New Capabilities

_Ninguna._

### Modified Capabilities

- `tarjetas-productos`: se agrega el requisito de zoom suave de la imagen en hover/foco, con su ajuste por tarjeta y las excepciones de movimiento reducido y puntero táctil.

## Impact

- `blocks/product-tile.liquid`: CSS del `{% stylesheet %}`, clase modificadora en el wrapper y un setting `checkbox` nuevo en el schema embebido.
- Sin JavaScript, sin dependencias nuevas y sin cambios en `sections/product-tiles.liquid` ni en las tarjetas de producto nativas de Horizon (`product-card`).
- Tarjetas ya guardadas: el nuevo ajuste toma su valor por defecto (activado), así que el efecto aparece en todas las tarjetas existentes tras el despliegue.
