## Why

En la sección "Tarjetas de productos" el botón de cada tarjeta se ve pequeño (13 px) frente al título (20 px), y su diseño tipográfico no se puede ajustar desde el editor. Además, cuando no hay colores de hover configurados —como ocurre en las tarjetas guardadas de la home— el hover recurre al color de primer plano del esquema, que es casi negro y rompe la paleta rosada de Hope.

## What Changes

- Nuevos ajustes del botón por tarjeta para editar su diseño: tamaño de fuente en escritorio y móvil, y grosor de fuente.
- El hover del botón deja de usar el color de primer plano del esquema (negro) como valor por defecto: sin colores de hover configurados, el botón usa un tinte suave derivado de sus propios colores (fondo y texto), nunca negro.
- Regla de jerarquía: el título de la tarjeta MUST tener un tamaño menor o igual al texto del botón, tanto en escritorio como en móvil, cuando la tarjeta muestra botón.
- Actualizar los presets de la sección y las tarjetas guardadas en la home (`templates/index.json`) con colores de hover de marca y tamaños coherentes con la nueva regla.

## Capabilities

### New Capabilities

_(ninguna)_

### Modified Capabilities

- `tarjetas-productos`: se modifica el requisito "Botón configurable por tarjeta" (tipografía editable y hover sin negro) y se agrega un requisito de jerarquía título ≤ botón.

## Impact

- `blocks/product-tile.liquid`: CSS (`{% stylesheet %}`), variables inline del bloque y schema (nuevos settings de tipografía del botón).
- `sections/product-tiles.liquid`: presets de la sección.
- `templates/index.json`: ajustes guardados de las 4 tarjetas de la home.
- Sin cambios en JavaScript, dependencias ni otras secciones.
