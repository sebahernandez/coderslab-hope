# Tasks

## 1. Schema del encabezado

- [ ] 1.1 Añadir en `sections/header.liquid` el grupo "Fondo y espaciado" con `header_band_enable`, `header_band_color`, `header_min_height`, `custom_spacing`, `padding-block-start`, `padding-block-end`, `padding-inline`, `margin-block-end` y `margin-inline` según la tabla de design.md; verificar que el JSON del schema parsea (`jq` sobre el bloque extraído) y que todo `range` tiene entre 3 y 101 pasos
- [ ] 1.2 Quitar el `visible_if` de `glass_float_margin`, ampliar `max` a 48 y renombrar su etiqueta a "Margen superior"; verificar que el ID y el default no cambian (`git diff`)

## 2. Variables y estilos

- [ ] 2.1 Emitir en `<header-component>` las variables `--header-band-color`, `--header-min-height` (solo si > 0) y las de espaciado (solo con `custom_spacing`), y añadir la clase `header--band` cuando la franja está activa y `transparent` es blank; verificar en el HTML renderizado que con los defaults no aparece ninguna variable nueva
- [ ] 2.2 Pintar la franja como fondo de `.header-section` con `header--band` y reservar espacio con `padding-block-start: var(--header-height)` en `main`; verificar con Playwright en `shopify theme dev` que la franja cubre el ancho completo y la primera sección no queda tapada (sumar `--glass-float-margin` si hace falta)
- [ ] 2.3 Aplicar `min-height` + centrado vertical a `.header__columns` y las variables de padding/margin en escritorio (`min-width: 750px`); mover la regla de `margin-block-start` fuera de `.header--glass`; verificar con Playwright que 96 px de altura, 40 px de padding lateral y 48 px de margen lateral se reflejan en los tamaños medidos
- [ ] 2.4 Verificar con Playwright a 375 px que el navbar móvil conserva sus controles visibles y alineados y que `--hope-navbar-gutter-mobile` no cambia, con franja activa e inactiva

## 3. Verificación integral

- [ ] 3.1 Con todos los ajustes nuevos en su default, comparar capturas de escritorio y móvil del inicio antes/después y confirmar que son equivalentes
- [ ] 3.2 Ejecutar `shopify theme check` sobre `sections/header.liquid` y resolver hallazgos válidos
- [ ] 3.3 Commit + push a `develop` y confirmar en el editor de temas que los nuevos controles aparecen (schema no descartado) y los valores guardados se mantienen

## Workflow follow-up

- Publicar a `main` solo con confirmación explícita del usuario (sincroniza el tema live).
- Archivar el change tras la verificación.
