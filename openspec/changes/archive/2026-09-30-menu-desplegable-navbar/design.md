# Design

## Context

Ver `proposal.md` — Why. Estado actual (confirmado leyendo el tema):

- El panel por ítem `.menu-list__submenu` (en `blocks/_header-menu.liquid` `{% stylesheet %}`, ~333-349)
  es `position:absolute; width:100%; left:0`, resuelto contra `.header__row` (`position:relative`,
  `sections/header.liquid:410`). Por eso es full-width e independiente del ítem.
- El contenido va a `grid-column: 2` de `--full-page-grid-with-margins` (~373-397) y hay una barra de
  fondo full-width (`::after`, ~301-315).
- El JS `assets/header-menu.js` solo mide altura y setea `--submenu-height` / `--submenu-opacity`; no
  posiciona horizontalmente.
- Productos en el desplegable: `menu_style: featured_products` → `snippets/mega-menu-list.liquid:231-253`
  renderiza `resource-card` (imagen `.resource-card__image`, con `--resource-card-corner-radius`). La
  `resource-card` es compartida (búsqueda, otras tarjetas) → cualquier regla de círculo debe ir
  acotada al menú.
- Header glass activo por defecto (`enable_glass_header`): oculta el overflow "More" y fuerza items
  inline, así que los desplegables activos son los `.menu-list__submenu` por ítem.

## Goals / Non-Goals

- **Goal:** panel anclado bajo su ítem, ancho por contenido, sin cortarse en el viewport; miniaturas de
  producto circulares (solo productos).
- **Non-Goal:** no rediseñar el contenido del mega-menú ni los estilos de `collection_images`. No tocar
  `resource-card.liquid` compartido. No cambiar el drawer móvil (`header-drawer`). No alterar el sistema
  overflow "More" (inactivo con glass).

## Decisions

### 1. Anclaje: contexto de posicionamiento en el ítem
Hacer `.menu-list__list-item` `position: relative` y cambiar el panel a `left: 0; right: auto;
width: max-content; max-width: min(90vw, ~360px)`. Quitar/neutralizar `grid-column: 2`, la grilla
`--full-page-grid-with-margins` y la barra `::after` full-width para el panel por ítem.
- **Alternativa descartada:** mantener el contexto en `.header__row` y calcular `left` por JS para cada
  ítem — más frágil y contradice el patrón "CSS posiciona, JS solo altura".

### 2. Clamping horizontal (evitar corte a la derecha) — CSS-first con fallback JS mínimo
- **Preferido (CSS):** con `left:0` + `max-width`, el corte solo ocurre en ítems cercanos al borde
  derecho. Para esos, anclar a la derecha del ítem (`left:auto; right:0`) mediante un selector de
  posición (p. ej. últimos ítems) o una clase. Dado que glass fuerza pocos items inline, cubre el caso
  real.
- **Fallback (JS mínimo, solo si el CSS no basta):** en `assets/header-menu.js`, al abrir, medir
  `getBoundingClientRect()` del panel vs `innerWidth` y setear una variable/clase de alineación
  (`--submenu-align` o `.is-flipped`). Reusa el punto donde ya setea `--submenu-height`; no añade
  listeners nuevos de posicionamiento global.
- **Decisión:** implementar CSS-first; introducir el fallback JS **solo** si en verificación un ítem se
  corta. Registrar en tasks ambos caminos.

### 3. Imágenes de producto circulares, acotadas al menú
Añadir la regla en el `{% stylesheet %}` de `blocks/_header-menu.liquid` (no en `resource-card.liquid`),
scopeada al contenedor de productos del menú (p. ej. `.mega-menu__content-list--products
.resource-card__image` o un modificador del contexto menú): forzar `aspect-ratio: 1/1` en el
contenedor de media y `border-radius: 50%` en la imagen, ignorando `--resource-card-corner-radius` en
ese contexto.
- **Alternativa descartada:** pasar `image_border_radius` grande desde el block — no da 1:1 (la relación
  sigue siendo la de contenido) y afectaría la tarjeta compartida.

## Risks / Trade-offs

- [El panel compacto podría verse angosto con `collection_images` de 16:9] → acotar `max-width` y probar
  con los estilos reales; ajustar `--menu-columns-*` si hace falta.
- [Regresión visual en `resource-card` compartida] → Mitigación: regla estrictamente scopeada al menú;
  verificar que búsqueda/otras tarjetas no cambian.
- [Interacción con glass header] → verificar con `enable_glass_header` activo (config live) y también
  desactivado.

## Migration Plan

Cambios aditivos de tema (CSS/markup). Despliegue con `shopify theme push`. Rollback = revertir el
commit. Sin migración de datos.

## Open Questions

Ninguna que cambie specs/approach/tareas. La elección CSS-only vs fallback JS se resuelve en
implementación según la verificación en viewport.
