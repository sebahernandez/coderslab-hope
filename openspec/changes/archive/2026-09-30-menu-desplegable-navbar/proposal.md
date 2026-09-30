# Proposal

## Why

El menú desplegable del navbar (tema Horizon personalizado) hoy se abre a **ancho completo**: el panel
(`.menu-list__submenu`) usa `position:absolute; width:100%; left:0` relativo a `.header__row`, y su
contenido se empuja a la columna 2 de una grilla de ancho de página. Resultado: sin importar qué ítem
de nivel superior se abra, el desplegable ocupa todo el ancho de la barra, lo que se siente
desconectado del ítem y desperdicia espacio en un menú con pocos enlaces. Además, cuando el menú
muestra productos, sus imágenes se ven como tarjetas rectangulares, y se quiere una presentación más
ligera con miniaturas circulares.

## What Changes

- **Anclar el panel bajo su ítem, con ancho por contenido:** el desplegable aparece alineado al borde
  izquierdo del ítem de nivel superior que lo abre, con ancho = contenido (`max-content`, con un
  máximo), en lugar de ocupar el ancho completo del header.
- **Evitar corte fuera de pantalla:** si el panel anclado a la izquierda se saldría por el borde
  derecho del viewport, se desplaza para quedar completamente visible.
- **Eliminar el offset de ancho de página:** quitar/neutralizar `grid-column: 2` y la grilla
  `--full-page-grid-with-margins` del panel, y la barra de fondo full-width (`::after`), para que el
  panel sea una caja contenida bajo el ítem.
- **Imágenes de producto circulares:** cuando el desplegable muestra **productos**
  (`menu_style: featured_products`), sus miniaturas se renderizan como círculos (relación 1:1 +
  `border-radius: 50%`). Aplica **solo a productos**; las imágenes de colección y el resto del menú no
  cambian.

Principalmente cambios de CSS/markup del header. El JS del menú hoy solo controla altura/visibilidad;
el anclaje y el ancho son CSS. El único punto que podría requerir un ajuste mínimo de JS es el
**clamping horizontal** (evitar corte fuera de pantalla) — ver `design.md` para la decisión.

## Capabilities

### New Capabilities

- `menu-navegacion`: comportamiento del menú de navegación del header y su desplegable (posición,
  ancho, y presentación de productos dentro del desplegable).

### Modified Capabilities

_(ninguna)_

## Impact

- **`blocks/_header-menu.liquid`** (`{% stylesheet %}`): reglas de posición/ancho del panel
  (`.menu-list__submenu`, ~líneas 333-349), la grilla/offset (~373-397) y la barra de fondo full-width
  (`::after`, ~301-315); aquí también se añade la regla scoped de imágenes circulares de producto.
- **`snippets/header-menu.liquid`** (~líneas 27-65): `.menu-list__list-item` debe ser el contexto de
  posicionamiento (`position: relative`) para anclar el panel al ítem.
- **`snippets/mega-menu-list.liquid`** (~231-253) y **`snippets/resource-card.liquid`** (imagen
  `.resource-card__image`): referencia para scopear el círculo a productos del menú sin afectar la
  `resource-card` compartida (búsqueda/otras tarjetas).
- `assets/header-menu.js`: sin cambios salvo (opcional) el clamping horizontal si el enfoque CSS no
  basta (ver `design.md`). Considerar la interacción con el header glass (`enable_glass_header`, que ya
  oculta el overflow "More" y fuerza items inline).
