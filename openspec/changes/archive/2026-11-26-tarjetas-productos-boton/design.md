# Design

## Context

Todo vive en `blocks/product-tile.liquid`: el bloque inyecta variables inline (`--pt-title-size`, `--pt-btn-bg`, `--pt-btn-bg-hover`, etc.) y su `{% stylesheet %}` las consume. El tamaño de fuente del botón hoy está fijo por clase (`--small` 0.8125rem, `--medium` 0.9375rem, `--large` 1.0625rem). El hover del estilo contorno cae a `var(--color-foreground)` cuando `button_bg_hover` está vacío, y las 4 tarjetas de `templates/index.json` tienen `button_bg_hover: ""`, por eso hoy se ven negras en hover. El título de la home está en 20 px / 18 px y el botón en `small` (13 px).

## Goals / Non-Goals

**Goals:**
- Tipografía del botón editable sin romper tarjetas guardadas.
- Hover sin negro aunque el comerciante no configure colores.
- Garantizar la jerarquía título ≤ botón en CSS, no solo por convención de datos.

**Non-Goals:**
- Rediseñar imagen, texto o layout de la tarjeta.
- Cambiar otras secciones con botones.

## Decisions

1. **Tamaño de fuente con ranges opcionales sobre la clase de tamaño.** Nuevos settings `button_font_size` y `button_font_size_mobile` (range en px) + `button_weight` (select 400–700, default `600`, igual al actual). Para no alterar tarjetas guardadas, el CSS define `--pt-btn-font` por clase de tamaño (13/15/17 px) y el bloque solo la sobrescribe cuando el comerciante cambió el range. Como un `range` siempre tiene valor, se agrega un checkbox `button_custom_font` ("Tamaño de fuente personalizado", default false) que habilita los ranges vía `visible_if`. Alternativa descartada: reemplazar el select de tamaño — rompería el contrato guardado `button_size`.

2. **Cap del título con `min()` en CSS.** `font-size: min(var(--pt-title-size), var(--pt-btn-font))` aplicado solo cuando hay botón (clase modificadora `product-tile--has-button` en el wrapper), y su equivalente móvil con `--pt-btn-font-m`. Se usan px en ambos lados para que la comparación sea directa. Alternativa descartada: validar solo en el schema/datos — un comerciante podría volver a subir el título y romper la regla pedida.

3. **Hover derivado con `color-mix()`.** Fallback del hover: `color-mix(in srgb, var(--pt-btn-fg, var(--color-foreground)) 10%, var(--pt-btn-bg, var(--color-background)))` para el fondo, y el borde con el mismo color de texto al 35 %. El texto en hover conserva `--pt-btn-fg`. En estilo relleno, el fallback mezcla el fondo con blanco al 15 % (aclara) en vez de solo `opacity`. `color-mix` tiene soporte amplio en navegadores actuales y Horizon ya lo usa. Alternativa descartada: color fijo rosa en CSS — ignoraría esquemas y colores del comerciante.

4. **Datos de la home y presets.** En `templates/index.json` y en los presets de `sections/product-tiles.liquid`: `button_bg_hover: "#fde7f0"`, `button_text_hover: "#6b0f3a"`, `button_custom_font: true`, `button_font_size: 18`, `button_font_size_mobile: 16`, y título 18 px / 16 px para que los datos ya cumplan la regla sin depender del cap.

## Risks / Trade-offs

- [El cap silencia el setting de tamaño del título] → agregar `info` al setting del título explicando que no superará el tamaño del botón.
- [El editor de Shopify commitea "Update from Shopify" sobre `index.json`] → `git fetch` + rebase antes de editar/pushear.
- [La sync de GitHub descarta en silencio schemas inválidos (ranges con < 3 pasos)] → ranges con min/max/step válidos y verificar que la sección siga apareciendo en el editor tras el push.

## Migration Plan

Commit + push a `develop` (norma del repo); a `main` solo si el usuario lo pide. Rollback: revertir el commit.
