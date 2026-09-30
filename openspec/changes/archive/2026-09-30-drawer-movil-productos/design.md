# Design

## Context

Ver `proposal.md` — Why. Estado actual (confirmado en el tema):
- El drawer móvil renderiza los hijos en la rama plana (`snippets/header-drawer.liquid:160-208`,
  `drawer_accordion == false`, menú de 2 niveles) como `.menu-drawer__menu-item--child`.
- Color del hijo: `--menu-child-font-color` = `#ffffff` (`scheme-5` + `menu_font_style: inverse` en
  `submenu-font-styles.liquid`). El CSS custom fuerza fondo blanco (`header-drawer.liquid:1153`) y solo
  recolorea el nivel superior a granate (`~1180-1189`). → hijos blancos sobre blanco.
- La miniatura solo se renderiza si `render_link_image` (solo `collection_images` con todos los hijos
  collection_link); con `featured_products` queda `false` → sin imagen. La imagen usaría la clase
  `.menu-drawer__link-image`.

## Goals / Non-Goals

- **Goal:** hijos legibles + miniatura circular en el drawer, consistente con el desplegable desktop.
- **Non-Goal:** no cambiar el esquema de color del drawer; no tocar el JS del drawer; no alterar el
  acordeón ni el desplegable de escritorio.

## Decisions

### 1. Arreglar el color con una regla scopeada (no cambiar el esquema)
Añadir en el bloque CSS custom móvil una regla `.header__drawer--mobile .menu-drawer__menu-item--child`
que fije el color a la variable granate de Hope ya usada para el nivel superior. Es mínimo y consistente
con cómo ya se recolorea el nivel superior.
- **Alternativa descartada:** cambiar `settings.drawer_color_scheme` de `scheme-5` a un esquema claro —
  afecta todo el drawer (bordes, otros textos, iconos) y otras superficies; más riesgo por un problema
  puntual de contraste de los hijos.

### 2. Renderizar la miniatura para cualquier hijo con imagen (igual que desktop)
Cambiar la condición del template de `render_link_image` a "cuando `childlink.object.featured_image`
exista", replicando el enfoque ya aplicado en `snippets/mega-menu-list.liquid` para el desktop.
- **Alternativa descartada:** cambiar `menu_style` a `collection_images` — no aplica a links de
  producto (caería a texto) y cambiaría el desktop.

### 3. Miniatura circular en fila
Estilizar `.menu-drawer__link-image` (scopeado al drawer) como círculo pequeño (44px, 1:1,
`border-radius:50%`, `object-fit:cover`, con `min/max-width` fijos para evitar el aplanado por el
`img{max-width:100%}` global — mismo detalle que en desktop) y disponer el enlace hijo en fila.

## Risks / Trade-offs

- [Imagen ovalada por `img{max-width:100%}` global] → Mitigación: fijar `width/min-width/max-width:44px`
  (aprendido en el desplegable desktop).
- [Regresión de color en otros textos del drawer] → Mitigación: regla acotada a
  `.menu-drawer__menu-item--child` dentro de `.header__drawer--mobile`.

## Migration Plan

Cambios aditivos de tema (CSS + 1 condición Liquid). Despliegue con `shopify theme push`. Rollback =
revertir el commit.

## Open Questions

Ninguna.
