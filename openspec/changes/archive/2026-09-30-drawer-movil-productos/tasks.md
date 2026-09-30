# Tasks

## 1. Hacer visibles los enlaces hijos

- [x] 1.1 En `snippets/header-drawer.liquid` (bloque CSS custom móvil ~1140-1245), añadir una regla
  `.header__drawer--mobile .menu-drawer__menu-item--child` que fije el color al granate de Hope (la
  misma variable/valor usado en el nivel superior ~1180-1189) — verificación: en `theme dev` móvil, los
  productos bajo "Productos" se leen (texto oscuro), ya no blanco sobre blanco.

## 2. Renderizar la miniatura del producto en el drawer

- [x] 2.1 En `snippets/header-drawer.liquid` (~197-203), renderizar `childlink.object.featured_image`
  cuando exista (en vez de solo cuando `render_link_image`), con la clase `.menu-drawer__link-image` y
  `width: 96` — verificación: cada enlace hijo de producto muestra su imagen en el drawer.

## 3. Miniatura circular en fila (scopeado al drawer)

- [x] 3.1 En el CSS custom móvil, estilizar `.header__drawer--mobile .menu-drawer__link-image` como
  círculo pequeño: `flex:0 0 44px; width/min-width/max-width:44px; height:44px; aspect-ratio:1/1;
  border-radius:50%; object-fit:cover` (los `min/max-width` evitan el aplanado por `img{max-width:100%}`
  global) — verificación: la miniatura mide 44×44 y es un círculo perfecto.
- [x] 3.2 Disponer el enlace hijo en fila (miniatura + nombre): `.header__drawer--mobile
  .menu-drawer__menu-item--child { display:flex; align-items:center; gap }` — verificación: imagen a la
  izquierda y nombre a la derecha en una línea.

## 4. Verificación integral (móvil)

- [x] 4.1 Verificación end-to-end con Playwright en viewport móvil (≤749px) contra `shopify theme dev`:
  abrir el drawer (hamburguesa), confirmar que bajo "Productos" se ven Helado Hope, Milkshake y Mixo
  Hope con texto legible y miniatura circular; confirmar que el desplegable de escritorio y el resto del
  drawer (Inicio/¿Cómo Comprar?/Contacto, iconos sociales) no cambian — verificación: captura + medición
  del color/tamaño de la miniatura.

## Notas de verificación
- 2.1 ✓ HTML del theme dev confirma que los 3 hijos (Helado Hope, Milkshake, Mixo Hope) renderizan con `menu-drawer__link-image`.
- 1.1 / 3.1 / 3.2 ✓ Reglas CSS presentes y `shopify theme check` sin errores. La regla de color `.header__drawer--mobile .menu-drawer__menu-item--child { color: var(--drawer-maroon) }` (especificidad 0,2,0) vence a la base blanca (0,1,0); el círculo replica el patrón ya verificado en desktop (min/max-width 44px).
- 4.1 ✓ Verificado con Playwright (390px) tras liberar un lock colgado de Chrome MCP: drawer abierto, medición y captura OK.

## 5. Seguimiento (feedback: Productos cerrado + alineado izq + texto al lado de la imagen)
- [x] 5.1 Activar el acordeón del drawer: `sections/header-group.json` `drawer_accordion: false → true` — verificación: Playwright confirma "Productos" como `<details>` de `accordion-custom` CERRADO por defecto (`open=false`).
- [x] 5.2 Renderizar la imagen también en la rama del acordeón (`header-drawer.liquid` ~146): condición por `childlink.object.featured_image`, width 96 — verificación: HTML muestra `menu-drawer__link-image` en los 3 productos del acordeón.
- [x] 5.3 Layout en fila alineado a la izquierda, texto centrado vertical: override de la regla base `:has(> .menu-drawer__link-image){flex-direction:column}` con `.header__drawer--mobile .menu-drawer__menu-item--child { flex-direction:row; align-items:center; justify-content:flex-start; width:100% }` + `childlist { padding-inline-start:0 }` — verificación: Playwright: `flexDirection:row`, `alignItems:center`, imagen antes que el texto, mismo centro vertical; captura confirma alineación izquierda.
