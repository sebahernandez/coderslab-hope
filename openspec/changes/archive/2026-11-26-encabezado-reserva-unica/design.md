# Design

## Context

- `sections/header.liquid` define `--header-height` y `--header-group-height` (medida por `assets/critical.js`). Con glass, `.header-section` es `position: fixed`. Solo con franja + glass reserva espacio: `body:has(#header-component.header--band.header--glass) main { padding-block-start: var(--header-height); }`.
- Cuatro páginas compensan el encabezado glass por su cuenta con `--header-group-height` + aire, sin saber si `main` ya reservó:
  - `.hopecfg` en `assets/toppings-customizer.css`: `--hopecfg-top: calc(var(--header-group-height, 76px) + var(--hopecfg-gap))`, usado como padding superior y para el alto de la tarjeta. Con alto de viewport < 540 px usa `padding-block` fijo de 6rem / 7rem / 9.5rem.
  - `sections/main-cart.liquid`: `calc(var(--header-group-height, 86px) + var(--padding-xl))`, condicionado a `.header--glass`.
  - `sections/main-collection-list.liquid`: igual, sobre `.section-resource-list`.
  - `assets/base.css`: `main .shopify-policy__container` con `calc(var(--header-group-height, 86px) + var(--padding-4xl))`.

Ver proposal.md (Why) y `specs/encabezado-apariencia/spec.md`.

## Goals / Non-Goals

**Goals:**
- Una sola fuente de verdad para "cuánto reservó el encabezado en el flujo", reutilizable por cualquier página.
- Mismo resultado visual que hoy en configuraciones donde el encabezado no reserva (glass sin franja, sin glass).

**Non-Goals:**
- Cambiar cuándo reserva el encabezado (sigue siendo solo con franja + glass).
- Tocar heros, la portada u otras secciones que usan `--header-group-height` para alturas (`hero.liquid`, `snippets/section.liquid`, `_product-details.liquid`): no suman padding.

## Decisions

1. **Nueva custom property `--header-flow-offset` en `sections/header.liquid`.** `body { --header-flow-offset: 0px; }` y `body:has(#header-component.header--band.header--glass) { --header-flow-offset: var(--header-height); }`. La regla de `main` pasa a `padding-block-start: var(--header-flow-offset)`, misma condición y mismo valor que hoy, pero publicado.
   - Alternativa descartada: quitar la compensación de las páginas sin más. Rompería el caso glass sin franja, donde `main` no reserva y el contenido quedaría tapado.
   - Alternativa descartada: duplicar el selector `:has(.header--band.header--glass)` en cada página. Acopla cuatro archivos a los detalles del encabezado; la variable los aísla.

2. **Fórmula común en las páginas:** `calc(var(--header-group-height, <fallback>) - var(--header-flow-offset, 0px) + <aire propio>)`. Con franja + glass da solo el aire propio; sin franja da lo de hoy. `--header-group-height` puede incluir otras secciones del grupo (barra de anuncios); restar solo la parte reservada mantiene correcto ese caso.

3. **Armador (`.hopecfg`).**
   - Separar la altura del encabezado del padding: `--hopecfg-header: var(--header-group-height, 76px)`; padding superior `calc(var(--hopecfg-header) - var(--header-flow-offset, 0px) + var(--hopecfg-gap))`.
   - El alto de la tarjeta sigue restando la altura completa del encabezado (es lo que tapa el viewport): `min(calc(100svh - var(--hopecfg-header) - 2 * var(--hopecfg-gap)), 900px)`, con respaldo `100vh`. Hoy la tarjeta excede el viewport en la reserva de `main` (94 px); con el cambio cabe.
   - En viewports de alto < 540 px se conserva el padding fijo (6/7/9.5rem) para el bloque, pero el padding superior se reduce en `--header-flow-offset` con `max(var(--hopecfg-gap, 12px), calc(<valor> - var(--header-flow-offset, 0px)))` para no repetir la reserva.

4. **Carrito, colecciones y políticas:** solo cambiar la fórmula de su `padding-block-start`, sin tocar selectores ni el aire propio (`--padding-xl`, `--padding-4xl`).

## Risks / Trade-offs

- [`--header-flow-offset` sin definir si la sección del encabezado no se renderiza] → todos los usos llevan fallback `0px`, equivalente a "no reservó".
- [Otro archivo compensa el encabezado y no se detectó] → búsqueda de `--header-group-height` y `--header-height` en `padding` como parte de las tareas; las demás coincidencias actuales son alturas, no padding.
- [Cambio visual en todos los armadores] → verificar Helado, Mixo, Milkshake y Barquilla en escritorio y móvil.

## Migration Plan

1. Implementar en `develop` y verificar con `shopify theme dev` (puerto libre) + Playwright.
2. Push a `develop`; a `main` (publica en vivo) solo con confirmación, tras `git fetch` + merge.
3. Rollback: revertir el commit; no hay datos ni ajustes que migrar.
