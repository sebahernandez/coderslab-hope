# Tasks

## 1. Línea base

- [x] 1.1 Levantar `shopify theme dev` y, en Helado Hope a 390 px y 1280 px, anotar para "Crema choco-avellana con trozos", "Leche condensada" y el topping de nombre más largo: número de líneas del nombre y alto de la caja, sin seleccionar y seleccionado. Verificar que se reproduce el aumento de líneas al seleccionar.

## 2. Pill de costo en `assets/hope-customizer-v2.css`

- [x] 2.1 En la regla de `.hope2__set-grid .hopecfg__choice .hopecfg__chip-price`, quitar `flex-shrink` y `margin-inline-start: auto` y posicionar la pill: `position: absolute`, `inset-block-start: 0`, `inset-inline-end: 0.6rem`, `transform: translateY(-50%)`, `white-space: nowrap`, `border-radius: 999px`, padding, `line-height: 1`, `pointer-events: none`, tamaño de fuente único y `margin: 0`. Actualizar el comentario de la regla.
- [x] 2.2 Agregar `.hopecfg__chip-price:empty { display: none; }` con el mismo alcance de grilla. Verificar que un chip deseleccionado no deja una pill vacía.
- [x] 2.3 Definir fondo opaco, borde y color de texto para `.is-included` (verde) y `.is-extra-cost` (`#a03c68` sobre `#ffeaf3`, borde `#f7a9c9`) en la pill de grilla. Verificar contraste de texto ≥ 4.5:1 en ambos estados.
- [x] 2.4 Subir `row-gap` de `.hopecfg--v2 .hope2__set-grid` a 0.75rem (y en su variante de media query si redefine `gap`). Verificar que la pill de una fila no toca el chip de la fila superior y que la de la primera fila no toca `.hope2__set-head` ni la nota del paso; ajustar el margen del encabezado si hace falta.
- [x] 2.5 Verificar que la regla móvil que agrupa `.hopecfg__chip-price` con `.hopecfg__buy-hint` y la de ≥1024px no alteran el tamaño de la pill en grilla.

## 3. Verificación

- [x] 3.1 Repetir 1.1 en Helado Hope a 390 px y 1280 px. Verificar que el número de líneas del nombre y el alto de la caja son iguales seleccionado y sin seleccionar, y que los demás chips no se desplazan.
- [x] 3.2 Seleccionar 3 toppings clásicos, 1 topping premium, 1 sirope clásico y 1 sirope premium. Verificar pills "Incluido" en los dos primeros clásicos y en el sirope clásico, el costo del básico adicional en el tercero y el costo premium en los premium; que ninguna pill queda recortada ni tapa nombre o miniatura; y que el total no cambió respecto de `main` para la misma selección.
- [x] 3.3 Repetir 3.2 en Mixo Hope, en el asistente móvil (paso de toppings y paso de siropes) y en escritorio.
- [x] 3.4 Verificar con teclado y árbol de accesibilidad que el foco visible del chip no queda tapado por la pill y que el nombre accesible del chip seleccionado incluye el costo.
- [x] 3.5 Abrir la Barquilla a 390 px y 1280 px. Verificar que el chip seleccionado sigue sin costo, que la grilla no desborda y que la nueva separación entre filas se ve bien. Abrir Milkshake y verificar que no cambió.
- [x] 3.6 Ejecutar Theme Check y `openspec validate armadores-costo-en-pill --strict`. Verificar que no hay errores nuevos respecto de `main`.

## Workflow follow-up

- Publicar con commit y push a `main`, previo `git fetch` + rebase y con confirmación del usuario (publica en vivo).
- Verificar en la tienda en vivo Helado Hope, Mixo Hope y Barquilla después de la sincronización.
- Archivar el change una vez verificado.

## Notas de verificación (2026-11-20)

- Verificado con Playwright contra `shopify theme dev` (tema de desarrollo #190437523708) a 390 px y 1280 px, en Helado Hope y Mixo Hope.
- 1.1: línea base a 390 px: 18 de 30 toppings y 7 de 13 siropes cambiaban de líneas o de alto al seleccionarse ("Lluvia de chocolate blanco" pasaba de 3 a 6 líneas y de 62 a 108 px; "Crema choco-avellana con trozos" de 3 a 5 líneas). A 1280 px cambiaban 5 siropes de 1 a 2 líneas.
- 3.1: después del cambio ningún chip cambia de líneas ni de alto al seleccionarse, en ninguno de los dos anchos.
- 2.1: la pill sube `translateY(-60%)` (el diseño proponía -50%) y usa `padding-block: 0.1rem`, para no alcanzar la primera línea de los nombres de tres líneas a 390 px. Queda a 3.3 px del chip de la fila superior.
- 2.3: contraste medido 5.87:1 ("Incluido") y 5.48:1 (costo adicional).
- 2.4: además del `row-gap`, el margen inferior de `.hope2__set-head` sube de 0.6rem a 0.75rem.
- 3.2: el total no se comparó contra `main` en el navegador; el cambio no toca JS ni Liquid y el total coincide con las reglas de cobro ($6 + $1.00 de un básico adicional + 2 premium a $1.50 = $10.00).
- 3.4: verificado con teclado y con el árbol de accesibilidad del navegador (nombre accesible "Crema choco-avellana con trozos +$1.50"), no con un lector de pantalla real. La pill cubre cerca de un cuarto del borde superior del chip; el contorno de foco (3 px) sigue visible en el resto del perímetro.
- 3.5: en la Barquilla el costo sigue oculto, sin scroll horizontal; la separación entre filas pasa a 12 px.
- 3.6: Theme Check da los mismos totales que `main` (211 errores y 165 avisos preexistentes, ninguno en `hope-customizer-v2.css`).
