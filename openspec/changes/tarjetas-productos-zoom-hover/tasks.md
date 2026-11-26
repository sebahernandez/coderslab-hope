# Tasks

## 1. Ajuste y marcado del bloque

- [x] 1.1 Agregar en el schema de `blocks/product-tile.liquid`, junto a los ajustes de imagen, el setting `checkbox` `image_hover_zoom` (label "Zoom de imagen en hover", default `true`); verificar que el JSON del schema es válido y que el ajuste aparece en el editor.
- [x] 1.2 Añadir la clase `product-tile--zoom` al wrapper `.product-tile` cuando `s.image_hover_zoom` está activo; verificar en el HTML renderizado que la clase aparece solo en las tarjetas con el ajuste activado.

## 2. Estilos del zoom

- [x] 2.1 En el `{% stylesheet %}` del bloque, definir `--pt-zoom-scale: 1.06` y `--pt-zoom-duration: 0.6s` y, dentro de `@media (any-pointer: fine) and (prefers-reduced-motion: no-preference)`, aplicar `transition: transform var(--pt-zoom-duration) var(--ease-out-cubic)` a `.product-tile--zoom .product-tile__image` y `transform: scale(var(--pt-zoom-scale))` en `.product-tile--zoom:hover` y `.product-tile--zoom:focus-within`; verificar que el contenedor sigue recortando con su radio y que no hay desplazamiento de layout.

## 3. Verificación

- [x] 3.1 Ejecutar `shopify theme check` sobre el bloque y resolver hallazgos válidos.
- [x] 3.2 Con Playwright contra `shopify theme dev` (127.0.0.1:9292) en la página con "Tarjetas de productos": a 1280 px, hover sobre una tarjeta escala la imagen (transform computado ≠ `none`) y vuelve a `none` al salir; Tab hasta el botón aplica el zoom; con `emulateMedia({ reducedMotion: 'reduce' })` no hay transform; una tarjeta con el ajuste desactivado no escala; a 390 px sin scroll horizontal.
- [x] 3.3 Actualizar la memoria `hope-product-tiles.md` mencionando el ajuste `image_hover_zoom` y verificar que el índice `MEMORY.md` sigue apuntando al archivo.

## Workflow follow-up

- Commit y push a `develop`; pasar a `main` solo con confirmación explícita (publica en vivo).
- Archivar el cambio y sincronizar el spec `tarjetas-productos` tras la verificación.
