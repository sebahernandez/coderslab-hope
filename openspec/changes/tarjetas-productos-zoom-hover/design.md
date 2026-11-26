# Design

## Context

`blocks/product-tile.liquid` ya recorta la imagen: `.product-tile__media` tiene `overflow: hidden`, `aspect-ratio: var(--pt-ratio)` y `border-radius: var(--pt-img-radius)`. Dentro, `.product-tile__image` (img o SVG placeholder) ocupa el 100 % con `object-fit`. No hay JS en el bloque. Horizon ya condiciona sus efectos hover de tarjetas en `assets/base.css` con `@media (any-pointer: fine) and (prefers-reduced-motion: no-preference)`. Los tokens de movimiento del tema son cortos (`--animation-speed-slow: 0.2s`), pensados para micro-interacciones, no para un zoom de imagen.

## Goals / Non-Goals

**Goals:**
- Zoom in/out suave solo con CSS, dentro del `{% stylesheet %}` del bloque.
- Sin desplazamiento de layout (sin CLS) y respetando radio/proporción existentes.

**Non-Goals:**
- Ajustes de intensidad o duración para el comerciante (se fijan en código).
- Cambiar las tarjetas nativas `product-card` de Horizon ni el ajuste global `card-hover-effect-*`.
- Hacer clicable toda la tarjeta.

## Decisions

1. **`transform: scale()` sobre `.product-tile__image`, disparado por `.product-tile:hover` y `.product-tile:focus-within`.** Escalar con `transform` corre en el compositor y no provoca reflow; el `overflow: hidden` existente del contenedor recorta el exceso y conserva el radio. Alternativa descartada: animar `width`/`background-size` (causa reflow y no aplica a `<img>`). El disparador es la tarjeta completa (no solo la imagen) porque el pedido es "hover sobre el elemento"; `:focus-within` cubre el botón con teclado.

2. **Valores fijos como variables del componente:** `--pt-zoom-scale: 1.06` y `--pt-zoom-duration: 0.6s` con `var(--ease-out-cubic)`. 1.06 es perceptible sin pixelar (las imágenes se sirven con `widths` hasta 1200). 0.6 s logra el efecto "suave" que los tokens del tema (≤0.2 s) no dan; se reutiliza el easing del tema para coherencia. La misma `transition` aplica a la entrada y a la salida, así el zoom out es igual de suave.

3. **Media query `(any-pointer: fine) and (prefers-reduced-motion: no-preference)`**, idéntica a la de Horizon. Fuera de ella no hay ni `transition` ni `transform`, así que en táctil y con movimiento reducido no hay zoom "pegado" tras un toque.

4. **Ajuste `checkbox` `image_hover_zoom` (default `true`) que añade la clase `product-tile--zoom` en el wrapper.** Las reglas se escriben bajo `.product-tile--zoom`, así desactivarlo en una tarjeta no afecta a otras. Como el default es `true`, las tarjetas guardadas sin el ajuste se comportan como activadas. Se ubica junto a los ajustes de imagen del schema con label literal en español, siguiendo el estilo actual del bloque.

5. **`will-change` no se declara.** Con un `transform` en hover basta; `will-change` permanente en una grilla de tarjetas gastaría memoria de GPU sin beneficio medible.

## Risks / Trade-offs

- [El `<picture>` con imagen móvil hereda el mismo selector] → la regla apunta a `.product-tile__image`, que es la `<img>` dentro del `<picture>`, así que aplica igual a escritorio y móvil.
- [Con `object-fit: contain` y fondo `image_bg`, el zoom amplía también la imagen dentro de su caja] → aceptable; el fondo del contenedor no se mueve y el recorte se mantiene.
- [Ligera borrosidad de subpíxeles al escalar en algunos navegadores] → escala moderada (1.06) y fuente de alta resolución (`srcset`) la minimizan.

## Migration Plan

Deploy normal del tema (commit a `develop`, verificación en tema dev, luego `main` según la norma del proyecto). Rollback: revertir el commit; el setting nuevo queda ignorado en los datos guardados sin romper nada.
