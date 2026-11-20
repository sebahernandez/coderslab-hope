# Design

## Context

- `assets/hope-customizer-v2.js` (`setChipPrice`, `renderChipPrices`) agrega al final de cada `<button class="hopecfg__choice">` un `<span class="hopecfg__chip-price">` con el texto del costo y las clases `is-included` o `is-extra-cost`. En chips no seleccionados el span queda con texto vacío.
- `assets/hope-customizer-v2.css` coloca ese span como último ítem flex del chip en grilla (`flex-shrink: 0; margin-inline-start: auto`), por lo que resta ancho a `.topping-name`.
- `.hopecfg__choice` ya tiene `position: relative` (`assets/toppings-customizer.css`) y los grupos `#topping-options` / `#syrup-options` ya tienen `overflow: visible` bajo `.hopecfg--v2`.
- `.hope2__set-grid` usa `gap: 0.5rem` y la comparten Helado Hope, Mixo Hope (`sections/custom-product-v2.liquid`) y la Barquilla (`sections/custom-product-barquillo.liquid`). La Barquilla oculta el span con `display: none` en su `{% stylesheet %}`.
- Hay reglas de tamaño de fuente para `.hopecfg__chip-price` en tres puntos del CSS de v2 (base 9px, ≥1024px 10px, y un bloque móvil con 0.8125rem).

## Goals / Non-Goals

**Goals:**
- Que seleccionar un chip no cambie el ancho del nombre ni el alto de la caja.
- Mantener visible el costo por chip en Helado Hope y Mixo Hope.
- Resolverlo solo con CSS, sin tocar el JS ni el marcado.

**Non-Goals:**
- Mostrar el costo en los chips de la Barquilla (su spec lo prohíbe; queda igual).
- Cambiar textos, precios, reglas de cobro, encabezados de conjunto o Milkshake.
- Agregar ajustes de tema para la pill.

## Decisions

1. **Pill con posición absoluta sobre el borde superior, al final de la caja.**
   `.hopecfg__chip-price` dentro de `.hope2__set-grid` pasa a `position: absolute; inset-block-start: 0; inset-inline-end: 0.6rem; transform: translateY(-60%)` (algo más de la mitad, para no alcanzar el nombre cuando ocupa tres líneas), con `white-space: nowrap`, `border-radius: 999px`, padding propio y `pointer-events: none`. Al salir del flujo flex deja de restar ancho al nombre. Se eliminan `flex-shrink` y `margin-inline-start: auto`, que quedan sin efecto.
   - Alternativa descartada: costo en una segunda línea bajo el nombre. No roba ancho, pero cambia el alto de la caja al seleccionar y desplaza la grilla.
   - Alternativa descartada: reservar siempre el ancho del costo. Angosta el nombre de todos los chips, también los no seleccionados.

2. **Ocultar la pill vacía con `:empty`.**
   El span existe sin texto en chips que fueron seleccionados y luego deseleccionados; con fondo y padding quedaría una pill vacía. `.hopecfg__chip-price:empty { display: none; }` lo resuelve sin tocar `setChipPrice`.

3. **Colores con fondo sólido claro, borde y texto oscuro.**
   - Incluido: texto verde oscuro sobre fondo verde muy claro, con borde verde.
   - Costo adicional: texto `#a03c68` sobre `#ffeaf3` con borde `#f7a9c9` (el mismo par que ya usa `.hope2__hint`).
   El texto blanco sobre `--hopecfg-hope` (#ed5d96) no llega a 4.5:1, por eso no se usa fondo rosa pleno. El fondo debe ser opaco para tapar el borde del chip que queda detrás. Los valores exactos del verde se fijan en la implementación verificando contraste ≥ 4.5:1.

4. **Tamaño de fuente único de la pill.**
   Las tres reglas actuales de tamaño se reemplazan, para el chip en grilla, por un tamaño único legible (≈0.6875rem, peso 800) con `line-height: 1`. El bloque móvil que agrupa `.hopecfg__chip-price` con `.hopecfg__buy-hint` tiene menor especificidad que el selector de grilla, por lo que no hace falta modificarlo; se verifica en el render.

5. **Más separación entre filas en `.hope2__set-grid`.**
   La pill sobresale media altura (≈0.55rem) sobre la caja y el `gap` actual es 0.5rem. Se sube `row-gap` a 0.75rem y se confirma que la primera fila no toca `.hope2__set-head`. Se aplica a la clase compartida, así la Barquilla conserva el mismo diseño de grilla que exige el requisito "Organización de selectores compartida entre armadores".

6. **Sin cambios en JS ni en el nombre accesible.**
   El span sigue siendo hijo del botón, por lo que su texto sigue formando parte del nombre accesible ("Miel +$1.50"). El orden en el DOM no cambia.

7. **Sin animación de entrada.**
   La pill aparece sin transición; no agrega movimiento que requiera variante de `prefers-reduced-motion`. El `transform` del hover del chip (`translateY(-1px)`) mueve la pill junto con la caja.

## Risks / Trade-offs

- [La pill tapa parte del borde resaltado del chip seleccionado] → Es intencional (pill "montada" en el borde); se usa fondo opaco y borde propio para que se lea como una etiqueta.
- [Pill recortada por un contenedor con `overflow`] → Los grupos ya tienen `overflow: visible`; verificar en el asistente móvil (`[data-view]`) y en escritorio.
- [Pill de la primera fila sobre el encabezado del conjunto] → Verificar el margen entre `.hope2__set-head` y la grilla; ajustar ese margen si hace falta.
- [La Barquilla cambia levemente su separación entre filas] → Aceptado para mantener el diseño compartido; se verifica que no desborde ni empeore a 390 px.
- [RTL] → Se usan propiedades lógicas (`inset-inline-end`, `inset-block-start`).
