# Proposal

## Why

En el armador de Helado Hope y Mixo Hope, el chip seleccionado muestra su costo ("Incluido", "+$1.00", "+$1.50") dentro de la misma fila que el nombre. Ese texto le quita ancho al nombre justo al seleccionar: nombres que cabían en dos líneas pasan a tres o cuatro ("Crema choco-avellana con trozos") y la caja cambia de alto, lo que desplaza el resto de la grilla.

## What Changes

- El costo del chip seleccionado deja de ocupar espacio dentro de la fila del chip y se muestra como una pill superpuesta sobre el borde superior de la caja, alineada al final.
- El nombre del chip conserva el mismo ancho y el mismo número de líneas esté o no seleccionado; la caja no cambia de tamaño al seleccionar.
- La pill distingue "Incluido" de un costo adicional por color y por texto, con contraste suficiente sobre el chip seleccionado.
- La separación entre filas de la grilla de chips aumenta lo necesario para que la pill no toque la fila superior.
- Sin cambios en precios, reglas de cobro, textos del costo ni en el carrito.
- La Barquilla sigue sin mostrar costo en el chip y Milkshake no cambia.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `configurador-helado`: se agrega el requisito de presentación del costo del chip seleccionado como pill superpuesta en Helado Hope y Mixo Hope, sin alterar el ancho del nombre ni el tamaño de la caja.

## Impact

- `assets/hope-customizer-v2.css`: estilos de `.hopecfg__chip-price` dentro de `.hope2__set-grid` y separación entre filas de la grilla.
- `assets/hope-customizer-v2.js`: sin cambios previstos; `setChipPrice` ya crea el elemento y sus clases de estado (`is-included`, `is-extra-cost`).
- `sections/custom-product-barquillo.liquid`: comparte `.hope2__set-grid`; recibe la nueva separación entre filas y mantiene oculto el costo del chip.
- Sin cambios de schema, locales, datos de la tienda ni dependencias.
