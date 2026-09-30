# Proposal

## Why

En el **drawer móvil** del header, los productos bajo "Productos" (Helado Hope, Milkshake, Mixo Hope)
parecen no aparecer: el área bajo "Productos" se ve vacía. La causa real (confirmada leyendo el tema)
NO es markup faltante —los enlaces hijos SÍ se renderizan en el DOM— sino un **problema de contraste**:
el drawer usa el esquema de color `scheme-5` (fondo oscuro, texto **blanco**) y el CSS custom de Hope
fuerza el fondo del drawer a **blanco** pero solo recolorea los ítems de nivel superior a granate; los
enlaces hijos quedan con `--menu-child-font-color: #ffffff` → **texto blanco sobre fondo blanco**
(invisibles). Además, a diferencia del desplegable de escritorio, el drawer no renderiza las
miniaturas de producto.

## What Changes

- **Hacer visibles los enlaces hijos:** recolorear `.menu-drawer__menu-item--child` en el drawer móvil
  a un color legible (granate/oscuro de Hope), en lugar del blanco heredado de `scheme-5`.
- **Miniaturas circulares (igual que desktop):** renderizar la imagen destacada de cada enlace hijo
  que sea producto (o colección) en el drawer, y presentarla como círculo pequeño junto al nombre —
  reutilizando el mismo enfoque aplicado al desplegable de escritorio.
- **Layout en fila:** enlace hijo como fila (miniatura + nombre), consistente con el desplegable.

Cambios de CSS + una condición de render en el template del drawer. Sin cambiar el esquema de color del
drawer (evita efectos colaterales en otros temas/superficies).

## Capabilities

### New Capabilities

- `menu-movil`: comportamiento y presentación del menú de navegación en el drawer móvil del header
  (visibilidad de enlaces hijos y miniaturas de producto). Complementa a `menu-navegacion` (desktop).

### Modified Capabilities

_(ninguna)_

## Impact

- **`snippets/header-drawer.liquid`**:
  - Template (~197-203): renderizar `childlink.object.featured_image` cuando exista (hoy gateado a
    `render_link_image`, solo `collection_images`).
  - CSS custom móvil (~1140-1245): añadir regla de color para `.menu-drawer__menu-item--child` y estilos
    de la miniatura circular (`.menu-drawer__link-image`) + layout en fila.
- Referencia de causa: `settings.drawer_color_scheme = scheme-5` (blanco), `menu_font_style: inverse`
  (`snippets/submenu-font-styles.liquid`), fondo forzado blanco (`header-drawer.liquid:1153`).
- Sin cambios en `assets/header-drawer.js`. No afecta el desplegable de escritorio (usa otro esquema).
