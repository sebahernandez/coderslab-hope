# Tasks

## 1. Anclar el panel al ítem con ancho por contenido

- [x] 1.1 En `snippets/header-menu.liquid` (~27-65), asegurar que `.menu-list__list-item` sea el
  contexto de posicionamiento (`position: relative`) para el panel — verificación: inspección del DOM
  muestra el `li` del ítem con `position:relative` como offset parent del panel.
- [x] 1.2 En `blocks/_header-menu.liquid` `{% stylesheet %}` (~333-349), cambiar `.menu-list__submenu`
  a anclado al ítem: `left:0; right:auto; width:max-content; max-width:min(90vw, ~360px)`; quitar el
  `width:100%` full-width — verificación: en `theme dev`, el panel de un ítem aparece bajo ese ítem,
  alineado a su izquierda, con ancho ajustado al contenido (medir `getBoundingClientRect` del panel vs
  el header).
- [x] 1.3 Neutralizar el offset de ancho de página del panel por ítem: quitar/anular `grid-column: 2`
  y `grid-template-columns: var(--full-page-grid-with-margins)` (~373-397) y la barra de fondo
  full-width `::after` (~301-315) para el `.menu-list__submenu` — verificación: el panel es una caja
  contenida sin franja de fondo a ancho completo; abrir dos ítems distintos muestra paneles en
  posiciones horizontales distintas.

## 2. Clamping horizontal (no cortar fuera de pantalla)

- [x] 2.1 Implementar el CSS-first: para ítems cercanos al borde derecho, anclar el panel a la derecha
  (`left:auto; right:0`) vía selector de posición o clase — verificación: abrir el último ítem del menú
  y confirmar que el panel queda completamente dentro del viewport (borde derecho visible).
- [x] 2.2 SOLO si 2.1 no basta en la verificación: añadir en `assets/header-menu.js`, en el punto donde
  ya setea `--submenu-height` al abrir, una medición `getBoundingClientRect()` vs `innerWidth` que
  active alineación derecha (variable/clase), sin listeners globales nuevos — verificación: forzar un
  ítem que se cortaría y confirmar que el panel se reposiciona para quedar visible. (Si 2.1 basta,
  marcar esta tarea como no necesaria y anotarlo.)

## 3. Imágenes de producto circulares (solo productos, acotado al menú)

- [x] 3.1 En `blocks/_header-menu.liquid` `{% stylesheet %}`, añadir una regla scopeada al contenedor
  de productos del desplegable (p. ej. `.mega-menu__content-list--products .resource-card__image` /
  su `.resource-card__media`) que fuerce `aspect-ratio:1/1` y `border-radius:50%`, ignorando
  `--resource-card-corner-radius` en ese contexto — verificación: en un ítem con `menu_style:
  featured_products`, las miniaturas de producto se ven circulares.
- [x] 3.2 Confirmar que la regla NO afecta `collection_images` del menú ni la `resource-card` fuera del
  menú (búsqueda/otras tarjetas) — verificación: en `theme dev`, las imágenes de colección del menú y
  una `resource-card` en resultados de búsqueda conservan su forma original.

## 4. Verificación integral en storefront

- [x] 4.1 Verificación end-to-end con Playwright contra `shopify theme dev` (y revisar con
  `enable_glass_header` activo, que es el default): abrir cada ítem con hijos, confirmar anclaje bajo su
  ítem + ancho por contenido + sin corte en viewport, y (si aplica) productos circulares — verificación:
  capturas/mediciones por ítem; sin regresiones en el drawer móvil ni en el header sticky/transparente.

## Notas de verificación
- 1.1: ✓ Implementado (regla `position:relative` en `_header-menu.liquid`); verificado: los 4 `li` reportan `position:relative`.
- 1.2: ✓ Implementado (override `.menu-list__submenu` → `width:max-content; max-width:min(90vw,360px); left:0; right:auto`); verificado a 1280px: panel left 661 = item left, width 360, right 1021 ≤ 1280.
- 1.3: ✓ Implementado (`grid-column:auto` + `padding-inline:0` en el inner y `::after{display:none}`). Nota: el panel por ítem NO es grid (su inner es flex), así que el `grid-column:2` ya era inerte; el ancho completo venía de `width:100%` + `padding-inline` de página. Verificado: paneles compactos, sin franja full-width.
- 2.1: ✓ Cubierto por el enfoque JS (2.2), más robusto que el CSS-only por `nth-child` (que contaría el `li` 'more'). Decisión permitida por design.md.
- 2.2: ✓ Implementado en `assets/header-menu.js` (tras setear `--submenu-height`: mide `getBoundingClientRect()` vs `innerWidth` y añade la clase `menu-list__submenu--align-right` → CSS `left:auto; right:0`). Verificado forzando overflow a 900px: se añadió la clase y el panel se ancló al borde derecho del ítem.
- 3.1: ✓ Implementado (regla scopeada a `.mega-menu__content-list--products .resource-card__media/__image`: `aspect-ratio:1/1; border-radius:50%; overflow:hidden; object-fit:cover`). Verificado por probe DOM: media 1/1 + 50%, imagen 50%. (El menú 'Productos' actual es de texto; para verlo en vivo, configurar un ítem con `menu_style: featured_products`.)
- 3.2: ✓ Verificado por probe: contexto `--collections` en el menú queda `aspect:auto`, `radius:0` (no circular). La regla solo matchea dentro de `--products`, así que la `resource-card` de búsqueda/otras no se ve afectada.
- 4.1: ✓ Verificado E2E con Playwright y `enable_glass_header` activo (default): anclaje + ancho por contenido + dentro del viewport a 789px y 1280px; flip a 900px; círculos por probe. Sin tocar el drawer móvil (`header-drawer`) ni la lógica sticky/transparent.

## Seguimiento (feedback: faltaban imágenes y ajustar posiciones)
- Causa: `menu_style: featured_products` con "Productos" que NO es collection link → caía a `text` (sin imágenes).
- Fix (sin tocar la config del comercio): `snippets/mega-menu-list.liquid` ahora renderiza la
  `link.object.featured_image` de cualquier enlace del desplegable con imagen (producto/colección);
  CSS en `blocks/_header-menu.liquid`: enlaces en FILA (miniatura + nombre), miniatura circular 44px
  (`flex:0 0 44px; width/min/max:44px; aspect-ratio:1/1; border-radius:50%`), y `white-space:nowrap`
  en el título (evita el corte "Helado Hope" en 2 líneas).
- Verificado con Playwright + captura: 3 productos (Helado Hope, Milkshake, Mixo Hope) con foto real en
  círculo 44×44, nombres en una línea, panel anclado bajo "Productos".
