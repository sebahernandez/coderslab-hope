# Proposal

## Why

En los cuatro armadores (Helado Hope v1, Helado Hope / Mixo Hope v2, Milkshake y Barquilla) la imagen principal se pide por red cada vez que cambia la selección, y varias pasan por transformaciones de Cloudinary que tardan en la primera petición. Hoy el cliente no recibe ninguna señal consistente de que la imagen está en camino: Milkshake muestra un spinner en cada cambio, v2 y Barquilla solo en la primera carga, y v1 apenas atenúa la imagen. Si la imagen falla, ninguno lo dice: v2 y Milkshake muestran el ícono de imagen rota, v1 deja la imagen anterior (que ya no corresponde a la selección) y la Barquilla la reemplaza en silencio por el cono base.

## What Changes

- Los cuatro armadores muestran un indicador de carga sobre la vista previa mientras la imagen de la selección actual no está lista, tanto en la primera carga como en cada cambio de selección.
- Mientras carga, la imagen anterior queda visible pero atenuada; el indicador no aparece si la imagen ya está disponible (por ejemplo, en caché), para evitar parpadeos.
- Si la imagen responde con error o no termina de cargar en 15 segundos, la vista previa muestra el mensaje "Imagen no disponible en este momento" en lugar de la imagen. No se muestra el ícono de imagen rota ni una imagen de otra selección.
- La selección, el precio y la compra siguen disponibles aunque la imagen no cargue.
- Al cambiar la selección, o volver a elegir la misma, el armador vuelve a pedir la imagen; si carga, el mensaje desaparece.
- Con cambios rápidos de selección, solo cuenta el resultado de la última: ni una imagen ni un error de una selección anterior pueden quedar visibles.
- El estado de carga y el mensaje de error son accesibles: el error se anuncia a lectores de pantalla y el indicador respeta la preferencia de movimiento reducido.
- **BREAKING** (comportamiento de la Barquilla): cuando una foto no carga, la Barquilla deja de mostrar como respaldo el cono base (o el cono del sabor del mes solo) y muestra el mensaje. El respaldo se mantiene únicamente cuando el sirope no tiene foto asignada, que no es un error de carga.

Fuera de alcance: las miniaturas de los chips y de los combos, el banner del sabor del mes, la imagen de la línea del carrito, y un botón explícito de "Reintentar".

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `configurador-helado`: se agregan los requisitos de indicador de carga, mensaje de imagen no disponible, recuperación, cambios rápidos y accesibilidad de la vista previa para los cuatro armadores; se modifica "Respaldo de la vista previa de la Barquilla" para que una foto que no carga muestre el mensaje en vez del cono base.
- `sabor-del-mes`: se modifica "Vista previa de la Barquilla con el sabor del mes" para que una foto que no carga muestre el mensaje en vez del cono del sabor solo o del cono base.

## Impact

- **JavaScript**: `assets/toppings-customizer.js` (v1), `assets/hope-customizer-v2.js`, `assets/milkshake-customizer.js` y `assets/barquillo-customizer.js` dejan de cambiar la imagen cada uno a su manera y pasan a usar un mismo mecanismo. Se agrega un asset compartido nuevo.
- **CSS**: `assets/toppings-customizer.css` (el único cargado en los cuatro armadores) pasa a ser dueño del indicador de carga y del mensaje; se eliminan las reglas duplicadas del spinner en `assets/hope-customizer-v2.css` y `assets/milkshake-customizer.css`.
- **Liquid**: las cuatro secciones `sections/custom-product-*.liquid` reciben el elemento del mensaje dentro del escenario de la vista previa, vía un snippet compartido nuevo. `layout/theme.liquid` carga el asset compartido junto al script global existente.
- **Sin cambios** en datos de la tienda, metafields, metaobjetos, precios, variantes ni en el carrito.
- **Riesgo principal**: los cuatro armadores están en producción y comparten CSS; un error en el mecanismo común afecta a todos. Se mitiga migrando y verificando un armador por vez (ver `design.md`).
