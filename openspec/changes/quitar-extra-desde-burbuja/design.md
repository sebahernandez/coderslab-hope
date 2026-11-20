# Design

## Context

Estado observado en el código:

- `assets/hope-customizer-v2.js` mantiene `state.toppings` y `state.syrups` (arreglos en orden de selección) y `state.lastKey`. Todo deriva de `render()`: clases de chips, pills de costo, aviso, burbujas, resumen y precio.
- La única vía para alternar un extra es el listener de clic de `#hope-options`, que llama `toggleInArray()`, ajusta `lastKey`, marca `hasInteracted` y llama `render()`.
- `renderBubbles()` reemplaza el `innerHTML` de `#hope-bubbles` con `<span class="hope2__bubble">` para los primeros 6 extras (`BUBBLE_ANCHORS`), asignando el ancla por índice.
- `#hope-bubbles` tiene `aria-hidden="true"` y `.hope2__bubbles` tiene `pointer-events: none`.
- La burbuja mide 62 px por defecto, 84 px desde 1024 px y 38 px en el bloque `@media (max-width: 1023px)`.
- Los textos del JS están escritos en español en el propio archivo; las claves `hope_customizer.sets.*` ya existen en `locales/en.default.json` y `locales/es.json`.
- `#toast` es la única región `role="status"` de la sección y se maneja con `showToast()`.
- `assets/hope-customizer-v2.css` también lo carga `sections/custom-product-barquillo.liquid`, que no renderiza burbujas.

## Goals / Non-Goals

**Goals:**

- Quitar un extra desde su burbuja con el mismo resultado que deseleccionar su chip.
- Una sola ruta de mutación de estado para chips y burbujas.
- Burbujas operables con puntero, toque y teclado, con nombre accesible y foco predecible.

**Non-Goals:**

- Deshacer la eliminación.
- Cambiar posiciones, tope de 6 burbujas o la animación de entrada.
- Dar anclas estables por extra (hoy se asignan por índice).
- Tocar la Barquilla, el Milkshake, el carrito o las reglas de cobro.

## Decisions

### 1. Una función compartida para alternar extras

Extraer del listener de `#hope-options` la lógica de toppings y siropes a `toggleExtra(group, id)`, que alterna el id, ajusta `lastKey`, marca `hasInteracted` y llama `render()`. El listener de chips la usa; la burbuja llama a `removeExtra(group, id)`, que no hace nada si el id no está seleccionado y en otro caso delega en `toggleExtra`.

Alternativa descartada: que la burbuja dispare `click()` sobre el chip. Acopla la burbuja al DOM del panel y depende de que el chip exista y no esté deshabilitado.

### 2. La burbuja es un `<button>`

`renderBubbles()` genera `<button type="button" class="hope2__bubble" data-group data-id aria-label="Quitar {nombre}">`. La imagen interna lleva `alt=""` y el emoji y la insignia `aria-hidden="true"`, porque el nombre lo da el `aria-label`. Se quita el `title`.

La capa `#hope-bubbles` deja de llevar `aria-hidden` y recibe `role="group"`, `aria-label` y `tabindex="-1"` (destino de foco cuando no quedan burbujas).

Alternativa descartada: `<span role="button" tabindex="0">`. Obliga a reimplementar Enter y Espacio.

### 3. Un listener delegado en la capa

Un solo listener `click` en `#hope-bubbles`, registrado una vez dentro de `initConfigurator` (ya protegido por `data-hopecfg-v2-init`). Resuelve la burbuja con `closest(".hope2__bubble")` y lee `data-group` y `data-id`. No se registran listeners por burbuja porque el `innerHTML` se reemplaza en cada `render()`.

### 4. Foco tras quitar

Antes de llamar a `removeExtra`, se guarda el índice de la burbuja activada y si el foco estaba dentro de la capa. Después del render, solo si el foco estaba en la capa: se enfoca la burbuja en el mismo índice; si no existe, la anterior; si no queda ninguna, la capa. Así un clic con ratón en navegadores que no enfocan botones no mueve el foco.

### 5. Aviso con el toast existente

Tras quitar se llama `showToast("Quitaste {nombre}")`. Reutiliza la única región `role="status"`, da confirmación visual en móvil (donde el chip puede estar en otro paso) y evita una segunda región viva.

### 6. Señal de control accionable

- `.hope2__bubbles` conserva `pointer-events: none`; `.hope2__bubble` pasa a `pointer-events: auto` y `cursor: pointer`, con reset de estilos de botón (`padding: 0`, `font: inherit`, `color: inherit`, `appearance: none`).
- La insignia contiene dos textos, `+1` y `×`. Con `:hover` (solo bajo `@media (hover: hover)`) y `:focus-visible` se muestra `×`; en otro caso `+1`.
- `:focus-visible` con contorno que no dependa del anillo `is-last`.
- Área táctil: pseudo-elemento `::before` con `inset` negativo que lleva el área a 44 × 44 px cuando la burbuja mide 38 px.
- El escalado al pasar el cursor se omite: `transform` ya lo usa el centrado y la animación `hope2-pop`.

En pantallas táctiles no hay señal permanente de `×`; el aviso "Quitaste …" confirma la acción. Se mantiene el `+1` del diseño aprobado.

### 7. Textos por `data-*` desde Liquid

Claves nuevas `hope_customizer.bubbles.remove` ("Quitar {{ name }}"), `hope_customizer.bubbles.removed` ("Quitaste {{ name }}") y `hope_customizer.bubbles.group_label`. La sección las entrega en la raíz como `data-bubble-remove-label` y `data-bubble-removed-label`, renderizadas con `t: name: '__NAME__'`; el JS reemplaza `__NAME__` y conserva un valor por defecto en español si el atributo falta. El `aria-label` de la capa se renderiza directo en Liquid.

Alternativa descartada: textos fijos en el JS como el resto del archivo. Las claves de locale ya existen para este armador y son el lugar que pide la guía del tema.

### 8. Escape de valores en el HTML generado

`renderBubbles()` arma HTML por concatenación con etiquetas tomadas de `data-label`. Los valores que entran en atributos (`aria-label`, `data-id`, `src`) se escapan con una función local, porque el nombre del ingrediente viene de datos de la tienda.

## Risks / Trade-offs

- [Las burbujas se reubican por índice al quitar una] → un doble toque rápido puede quitar dos extras, porque la siguiente burbuja pasa a ocupar el lugar de la quitada. Mitigación: el aviso nombra lo quitado y el chip permite volver a elegirlo. Dar anclas estables queda fuera de alcance.
- [Toque accidental en móvil] → no hay confirmación previa. Mitigación: aviso inmediato y reelección con un toque en el chip.
- [Áreas táctiles de 44 px solapadas entre burbujas vecinas en teléfono] → verificar con las 6 anclas a 390 px; si se solapan, gana la burbuja posterior en el DOM. Ajustar el `inset` si el solape cubre el centro de otra burbuja.
- [Extras a partir del séptimo no tienen burbuja] → solo se quitan desde su chip, igual que hoy.
- [El toast lo usa también el alta al carrito] → un aviso de quitado puede reemplazar a otro en curso. Aceptable: `showToast` ya reinicia su temporizador.
- [La capa de burbujas ahora recibe eventos sobre la imagen] → solo las burbujas capturan el puntero; el resto de la vista previa no cambia.
