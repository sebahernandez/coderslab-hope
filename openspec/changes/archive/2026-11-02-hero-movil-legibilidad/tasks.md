# Tasks

## 1. Línea base

- [x] 1.1 Ejecutar el script de QA (D9) contra `shopify theme dev` (ejecutado contra la tienda live por falta de acceso del CLI) en las 7 instancias a 360/390/430/1440 px y guardar capturas + métricas (márgenes laterales, contraste por texto, overflow) en el scratchpad. Verifica: existe un reporte por instancia con los valores actuales.

## 2. Estructura y CSS de la sección

- [x] 2.1 Reemplazar el `background-image` por `<picture class="hero-banner__media">` con `<source media="(max-width: 768px)">` para la imagen móvil e `<img>` vía `image_url`/`image_tag` (`widths`, `sizes="100vw"`, `width`/`height`, `alt=""`), `loading="eager"` + `fetchpriority="high"` solo si `section.index == 1`. Verifica: en la portada a 390 px la pestaña de red muestra una sola imagen de fondo del primer hero, del ancho adecuado y con prioridad alta; sin imagen configurada no se emite `<picture>`.
- [x] 2.2 Añadir la capa `<div class="hero-banner__overlay" aria-hidden="true">` y pasar la sección a grid de una celda con media → velo → contenido apilados (D2). Verifica: los botones del hero siguen siendo clicables y el árbol de accesibilidad no incluye el velo.
- [x] 2.3 Mover el CSS estático a un único `{% stylesheet %}` con clases BEM y dejar en `{% style %}` scopeado solo las custom properties por instancia, conservando las clases actuales (D8). Verifica: `shopify theme check` sin errores nuevos y render de escritorio idéntico a la línea base con los defaults.
- [x] 2.4 Gutter móvil (D4): `padding-inline: 0` en ≤768 px, quitar `min-width: 300px`, añadir `min-width: 0` y envoltura de texto. Verifica: a 360/390/430 px el texto queda a 16 px (±1) del borde según su alineación y `document.documentElement.scrollWidth <= innerWidth` también a 320 px.

## 3. Settings y lógica de posicionamiento

- [x] 3.1 Añadir `background_position` y `background_position_mobile` (`auto` + 9 posiciones) y resolver `auto` con `image.presentation.focal_point` con fallback `50% 50%` (D5). Verifica: con un punto focal definido en el admin el recorte lo respeta; con un override móvil cambia solo en ≤768 px.
- [x] 3.2 Añadir `height_type_mobile` (`inherit` | `image`) con `aspect-ratio` de la imagen móvil o de escritorio (D6). Verifica: con `image`, a 390 px la imagen móvil se ve completa sin recorte y el texto largo hace crecer la sección en vez de cortarse.
- [x] 3.3 Añadir `content_position_x` y `content_position_x_mobile` (`auto | start | center | end`) y aplicar `justify-self`/`align-self` con los `vertical_alignment*` existentes (D3). Verifica: las instancias guardadas (sin el setting nuevo) se ven igual que en la línea base; elegir "Derecha/Arriba" en escritorio e "Izquierda/Abajo" en móvil ubica el contenido en cada zona.
- [x] 3.4 Añadir `overlay_style`, `overlay_color`, `overlay_opacity` y `text_shadow`; calcular en Liquid `--hero-overlay-dir(-mobile)` desde la zona efectiva (con x `auto` tomar la alineación del primer block) e invertir la dirección horizontal en RTL (D7). Verifica: con degradado y contenido a la izquierda el velo es más opaco a la izquierda; con `none` y sin sombra no aparece ninguna capa visible.
- [x] 3.5 Agregar los textos de los nuevos settings al schema siguiendo el estilo actual de la sección (labels en español literales, `info` donde ayude, `visible_if` para color/opacidad solo cuando el velo no es `none`) y validar el JSON del schema. Verifica: el editor del tema muestra los controles agrupados y sin errores; total de settings ≤ 25.

## 4. Ajuste de instancias

- [x] 4.1 Hacer `git pull` y ajustar en `templates/index.json` los 4 heros (posición de imagen/contenido, altura móvil y velo) iterando con el script de QA. Verifica: a 360/390/430 px cada texto cumple 4.5:1 (3:1 si ≥24 px) y no tapa el producto.
- [x] 4.2 (excepción de marca aceptada: "TU HOPE?" queda en #c2457f, ~2.7:1 en móvil) Ajustar los 2 heros de `templates/page.como-comprar.json` y el de `templates/page.contact.json` (Contacto es el caso crítico: sin imagen móvil, texto sobre fresas). Verifica: mismo criterio de contraste y capturas comparadas contra la línea base.

## 5. Verificación final

- [ ] 5.1 Correr `shopify theme check` y el script de QA completo (móvil + 1440 px, editor del tema con re-render de sección). Verifica: sin errores nuevos, todas las métricas del spec en verde y capturas antes/después en el scratchpad para revisión del usuario.

## Workflow follow-up

- Pedir confirmación antes de commit + push a `main` (deploy del tema live vía GitHub).
- Archivar el change con `/opsx:archive` tras la validación en la tienda.
