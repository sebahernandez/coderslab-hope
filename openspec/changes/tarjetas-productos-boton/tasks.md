# Tasks

## 1. Tipografía del botón

- [x] 1.1 En el schema de `blocks/product-tile.liquid` agregar `button_custom_font` (checkbox, default false), `button_font_size` y `button_font_size_mobile` (range px, ≥3 pasos, `visible_if` sobre el checkbox y el texto del botón) y `button_weight` (select 400–700, default 600); verificar JSON válido con `shopify theme check`.
- [x] 1.2 Definir `--pt-btn-font` / `--pt-btn-font-m` por clase de tamaño (13/15/17 px) en el `{% stylesheet %}`, sobrescribirlas inline solo con `button_custom_font` activo y aplicar `--pt-btn-weight`; verificar con Playwright que una tarjeta sin el checkbox mantiene 13 px y que con 18/16 px cambia a 1280 y 390 px.

## 2. Hover sin negro

- [x] 2.1 Reemplazar los fallbacks de hover de `--outline` y `--solid` por tintes con `color-mix()` derivados de `--pt-btn-fg`/`--pt-btn-bg` (sin `--color-foreground` como fondo) manteniendo prioridad de `--pt-btn-bg-hover`/`--pt-btn-fg-hover`; verificar con Playwright (hover) que el `background-color` computado no es negro con hover vacío y que respeta colores configurados.
- [x] 2.2 Revisar foco visible y contraste del texto en hover; verificar con Tab en Playwright que el outline se ve sobre el botón.

## 3. Jerarquía título ≤ botón

- [x] 3.1 Agregar la clase `product-tile--has-button` cuando hay `button_label` y aplicar `font-size: min(var(--pt-title-size), var(--pt-btn-font))` (y su variante móvil); verificar con Playwright que título 24 px + botón 16 px computa 16 px, y que sin botón queda en 24 px.
- [ ] 3.2 Añadir `info` al setting `title_size` explicando el límite; verificar que el texto aparece en el editor.

## 4. Datos y presets

- [x] 4.1 `git fetch` + rebase y actualizar las 4 tarjetas de `templates/index.json` (hover `#fde7f0`/`#6b0f3a`, botón 18/16 px con `button_custom_font: true`, título 18/16 px); verificar JSON válido y render en `shopify theme dev`.
- [ ] 4.2 Actualizar los presets de `sections/product-tiles.liquid` con los mismos valores; verificar agregando la sección desde el editor.

## 5. Integración

- [x] 5.1 Correr `shopify theme check` sin errores nuevos y revisar la home en 1280/800/390 px (hover, foco, RTL si aplica), comparando con la captura original.
- [x] 5.2 Actualizar la memoria `hope-product-tiles` con los nuevos settings y la regla del título.

## Workflow follow-up

- Commit + push a `develop`; a `main` solo si el usuario lo pide explícitamente.
- Archivar el change tras verificar en el tema de desarrollo.
