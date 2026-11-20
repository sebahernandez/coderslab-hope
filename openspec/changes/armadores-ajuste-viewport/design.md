# Design

## Context

Motivación en `proposal.md`. Estado observado en el código y en producción (2026-11-20):

- El contenedor es compartido. `assets/toppings-customizer.css` se carga globalmente
  (`layout/theme.liquid:35`) y es dueño de `.hopecfg` (padding vertical 6 / 7 / 9.5 rem, líneas 14–39) y
  de `.hopecfg__frame` (`min-height: 640px; height: min(88dvh, 900px)`, líneas 44–60). Lo usan los cuatro
  armadores y el v1 heredado (`custom-product-helado.liquid`).
- `assets/hope-customizer-v2.css` (Helado Hope, Mixo Hope y Barquilla, vía la clase `hopecfg--v2`)
  anula el alto en móvil: `.hopecfg__frame { height: auto; min-height: 0 }` (L742), vista previa
  `32vh` entre 160 y 230 px (L743–748), `.hopecfg__config { height: auto; flex: none }` (L749).
  Milkshake no carga ese archivo y conserva el alto fijo en móvil.
- Ya existe un único contenedor de scroll, `.hopecfg__config-scroll` (`overflow-y: auto`), y el pie
  `.hopecfg__footer` está fuera de él. Solo funciona cuando la tarjeta tiene alto acotado.
- El navbar es de vidrio, `position: fixed`, y no ocupa espacio en el flujo. `--header-group-height`
  (en `body`, mantenida por `critical.js` / `header.js`) mide su borde inferior: 86 px en escritorio y
  76 px en móvil. No hay barra de anuncios. El armador hoy no usa esa variable: compensa con padding fijo.
- El asistente móvil es estado JS + CSS; `setStep` ya hace `scrollTop = 0` sobre `.hopecfg__config-scroll`
  (`hope-customizer-v2.js:645`). No hay `scrollIntoView`, listeners de resize ni medición de alto.
- Las plantillas de los armadores solo tienen la sección `main`; debajo va el footer del sitio.

Prototipo ya ejecutado: se inyectó el CSS candidato (Decisiones 1–4) sobre las páginas en vivo con
Playwright, sin desplegar. En 36 combinaciones (4 productos × 1920×1080, 1440×900, 1366×768, 1280×720,
1024×768, 768×1024, 390×844, 375×667, 360×640) la tarjeta quedó entre el navbar y el borde inferior del
viewport, con los botones visibles y sin scroll horizontal.

## Goals / Non-Goals

**Goals:**

- Un único presupuesto de alto, definido en el contenedor compartido, que sirva a los cuatro armadores.
- Solo CSS: sin cambios en Liquid, JS, ids de `fieldset`, atributos `data-*` ni esquemas.
- Conservar el asistente móvil, la grilla de chips y el pie tal como quedaron en
  `armadores-selectores-agrupados`, salvo el modo de scroll.

**Non-Goals:**

- Eliminar el scroll de la página (el footer del sitio sigue debajo).
- Rediseñar la vista previa, el pie o los chips más allá de compactarlos en móvil.
- Layout fijo para viewports de menos de 540 px de alto.

## Decisions

### 1. Presupuesto de alto con custom properties en `.hopecfg`

`.hopecfg` define `--hopecfg-gap` (12 px; 16 px desde 1024 px) y
`--hopecfg-top: calc(var(--header-group-height, 76px) + var(--hopecfg-gap))`. El padding vertical pasa
a `var(--hopecfg-top)` arriba y `var(--hopecfg-gap)` abajo, y la tarjeta mide
`min(calc(100svh - var(--hopecfg-top) - var(--hopecfg-gap)), 900px)` con `min-height: 0`.

- Por qué: una sola fórmula deriva la posición y el alto del navbar real, en vez de dos números fijos
  que hoy no cuadran (152 px de padding contra 86 px de navbar).
- Alternativa descartada: medir con JS (ResizeObserver) y fijar el alto en línea. Agrega JS, un salto
  visual al cargar y un punto más de fallo; la variable del tema ya da el dato.
- Alternativa descartada: solo bajar `88dvh` a un porcentaje menor. No sigue la altura del navbar y
  vuelve a fallar si esta cambia.
- Se conserva el tope de 900 px: en pantallas altas evita una tarjeta desproporcionada.

### 2. `svh` en lugar de `dvh`

El alto se calcula con `100svh` (con declaración previa en `100vh` como respaldo para navegadores sin
soporte).

- Por qué: `svh` es el viewport con la barra del navegador móvil visible, así que la tarjeta cabe
  desde la carga y no cambia de alto mientras el cliente interactúa.
- Alternativa descartada: `dvh` (lo que usa hoy). Reajusta el alto de la tarjeta cuando la barra del
  navegador se oculta o aparece, lo que mueve el pie bajo el dedo del cliente.
- Costo aceptado: con la barra oculta queda una franja libre bajo la tarjeta.

### 3. Móvil v2: tarjeta acotada, vista previa elástica y opciones con scroll

Dentro de `max-width: 1023px`, en `hope-customizer-v2.css` se quitan las anulaciones de L742 y L749 y
se reemplazan por: tarjeta con el alto de la Decisión 1; vista previa
`flex: 0 0 clamp(120px, 20svh, 230px)`; `.hopecfg__config` con `flex: 1 1 0; min-height: 0`. Así
`.hopecfg__config-scroll` recupera su scroll y el pie queda fijo. `.hopecfg__total` pasa a una sola
línea (etiqueta y precio en fila) y el pie reduce su padding vertical: 142 → 108 px medidos.

- Por qué: reutiliza el contenedor de scroll existente; no hay scroll anidado, que fue el motivo por
  el que `armadores-selectores-agrupados` descartó el scroll interno (allí el scroll estaba dentro de
  cada lista y cortaba los encabezados de conjunto). Aquí se desplaza toda la zona de opciones, con
  sus encabezados.
- Se mantiene `overflow: visible` en `#topping-options` / `#syrup-options` (L334–337): sigue siendo
  correcto, el scroll lo hace el contenedor padre.
- Barquilla hereda estas reglas (no tiene asistente; todo su contenido se desplaza en la misma zona).
- Milkshake no necesita reglas propias: ya usa el contenedor compartido en móvil.
- Alternativa descartada: pie en una sola fila (total a la izquierda, botones a la derecha). La
  etiqueta dinámica del botón de avanzar ("Elegir tamaño", etc.) no cabe junto a "Atrás" y el total en
  340 px de ancho.

### 4. Respaldo por altura

Todas las reglas nuevas van dentro de `@media (min-height: 540px)`. Por debajo se conserva el
comportamiento actual (v2 móvil con alto libre y scroll de página; contenedor compartido con
`min-height: 640px`).

- Por qué: con 540 px de alto quedan ~450 px de tarjeta; menos que eso no deja lugar a vista previa,
  opciones y pie a la vez.

### 5. Dónde vive cada regla

Presupuesto y tarjeta en `toppings-customizer.css` (dueño del contenedor); ajustes del asistente móvil
en `hope-customizer-v2.css`. Las reglas nuevas reemplazan a las existentes en su mismo lugar; no se
agregan `!important` ni un archivo nuevo.

### 6. Piso de tamaño de texto en móvil

Medido en vivo a 375×667 (2026-11-20). Solo suben los textos que hoy están por debajo del piso; los
títulos, precios y encabezados de paso (13–26 px) no cambian.

| Texto | Selector | Hoy | Nuevo |
|---|---|---|---|
| Etiqueta "Total" | `.hopecfg__total-label` | 8 px | 11 px |
| Antetítulo | `.hopecfg__eyebrow` | 9 px | 11 px |
| Gramos del combo | `.ms__gramos` | 9 px | 11 px |
| Indicador de paso | `.hope2__stepbar` | 11 px | 12 px |
| Ingredientes del combo | `.ms__ingredientes` | 11 px | 12 px |
| Subtítulo de la base | `.hope2__base-sub` | 11.5 px | 12 px |
| "Añadir al carrito" | `.hopecfg__buy` | 11 px (12 en Milkshake) | 13 px |
| Nombres de toppings y siropes | `.topping-name`, `.hopecfg__choice` | 12 px | 13 px |

- Regla: 12 px mínimo; 11 px solo para etiquetas cortas en mayúsculas y negrita; 13 px para lo que el
  cliente lee para decidir o pulsa (nombres de opciones y botones).
- Por qué no más: cada píxel en los nombres de los chips agrega líneas y le quita alto a la zona de
  opciones, que es el recurso escaso de este cambio (Decisión 3).
- Alcance: reglas dentro de `max-width: 1023px`, en el archivo dueño de cada selector
  (`toppings-customizer.css` para el contenedor compartido, `hope-customizer-v2.css` para v2 y
  Barquilla, `milkshake-customizer.css` para los combos). Escritorio no se toca.
- Alternativa descartada: subir todo a 14–16 px (recomendación general para texto de lectura). Son
  etiquetas y nombres cortos, no párrafos, y con ese tamaño la zona de opciones no muestra dos filas de
  chips en teléfonos pequeños.

### 7. Encabezado compacto y botón final en el asistente móvil

Resultado de la prueba en vivo (tareas 2.1–2.2): con el diseño original, a 375×667 y 360×640 no se veía
ninguna opción al entrar al paso de toppings, y "Añadir al carrito" a 13 px desbordaba su botón.

- En `max-width: 1023px`, con asistente activo y fuera del primer paso
  (`.hopecfg--v2[data-step-key]:not([data-step-first])`), se ocultan `.hopecfg__heading` y el aviso de
  disponibilidad. Barquilla no tiene `data-step-key`, así que no le aplica.
- La vista previa baja de 24svh a 20svh (Decisión 3 ya actualizada).
- En el último paso "Atrás" deja de repartir el ancho a partes iguales (`flex: 0 0 auto`). Por debajo
  de 380 px de ancho se oculta el ícono decorativo del carrito en `.hopecfg__buy` para que el texto a
  13 px no desborde (verificado a 360 px).
- Medido con la variante: 2 opciones visibles al entrar a toppings y siropes a 375×667 y 360×640, 4 a
  390×844; "Añadir al carrito" en una línea en los tres.
- Alternativa descartada: mantener título y aviso en todos los pasos y bajar la vista previa a 120 px.
  No alcanza: siguen sin verse opciones al entrar.
- Costo aceptado por el usuario: el aviso de disponibilidad no se ve después del primer paso en móvil.

## Risks / Trade-offs

- [Nombres de chips a 13 px: algunos pasan a una línea más y la lista crece] → El requisito vigente
  admite hasta tres líneas por nombre; verificar a 360 px de ancho que ninguno lo supera y que se siguen
  viendo dos filas de chips al entrar al paso. Si no, se reduce el padding del chip antes que el texto.
- [Botón "Añadir al carrito" a 13 px en mayúsculas puede no caber en una línea junto a "Atrás" y
  reiniciar en 340 px de ancho] → Verificar a 360×640; si no cabe, reducir el espaciado entre letras o
  el padding horizontal del botón, no el tamaño.

- [Zona de opciones baja en teléfonos pequeños: 297 px a 375×667 y 277 px a 360×640, de los que el
  título, el aviso y el indicador de paso ocupan ~150 px al inicio] → Se desplazan junto con las
  opciones, así que al bajar la lista toda la zona muestra chips. Si en la verificación se ven menos de
  dos filas de chips al entrar al paso, se reduce el título en móvil o la vista previa hasta 120 px.
- [Vista previa más chica en móvil (203 px a 390×844 contra 230 px hoy; vaso de 137 px)] → Las
  burbujas de extras ya son de 38 px en móvil; verificar que siguen legibles y pulsables (área táctil
  del requisito "Quitar un extra desde su burbuja").
- [`--header-group-height` la fija JS; antes de que corra vale 60 px por CSS] → El respaldo en la
  fórmula y el valor por defecto dejan la tarjeta a lo sumo 26 px más arriba durante el primer
  render, hasta que `critical.js` fija el valor medido. Verificar que no haya salto visible al cargar.
- [El cambio en el contenedor compartido alcanza al armador v1 heredado] → Usa el mismo esqueleto;
  verificar su plantilla si hay un producto asignado.
- [Contradice el delta en curso de `armadores-selectores-agrupados`] → La primera tarea retira esa
  cláusula antes de archivar aquel cambio, para que el spec principal no quede con dos reglas opuestas.
- [Scroll interno en móvil: el gesto puede encadenarse al scroll de la página al llegar al final] →
  Comportamiento aceptado; permite llegar al footer.

## Migration Plan

1. Implementar y verificar en `shopify theme dev` (127.0.0.1:9292) con la matriz de viewports.
2. Con confirmación del usuario: `git fetch` + rebase, commit y push a `main` (publica en ~30 s).
3. Verificar los cuatro armadores en vivo.
4. Rollback: revertir el commit y volver a pushear; no hay datos ni esquemas que migrar.
