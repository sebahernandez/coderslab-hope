# Design

## Context

El aviso vive como markup duplicado en tres secciones (`custom-product-v2`, `custom-product-barquillo`, `custom-product-milkshake`) con el mismo SVG de camión. Su CSS base está en `assets/hope-customizer-v2.css` (cargado por V2 y Barquillo) y el Milkshake, que solo carga `assets/milkshake-customizer.css`, tiene su propia versión con estilo más fuerte bajo `.hopecfg--milkshake`. Los tres JS escriben el estado en `.hope2__delivery-notice span`. Ver proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Una sola fuente de markup y CSS para el aviso.
- Ícono de local en todos los estados.

**Non-Goals:**
- Cambiar textos, lógica de disponibilidad, modal de "no disponible" o el ajuste `solo_delivery` del Milkshake.
- Ícono distinto según el estado (delivery vs. presencial).

## Decisions

1. **Snippet `snippets/hope-delivery-notice.liquid` con `{% stylesheet %}`.** Contiene el `div.hope2__delivery-notice` (con `role="note"` y `aria-live="polite"`), el SVG de local con `aria-hidden="true"` y el `<span>` con el texto inicial "Consultando disponibilidad...". Su `{% stylesheet %}` es dueño de las reglas `.hope2__delivery-notice` (copia exacta del estilo actual de V2). Así lo indica AGENTS.md para CSS compartido entre consumidores, y el Milkshake recibe el estilo sin cargar `hope-customizer-v2.css`.
   - Alternativa: duplicar las reglas de V2 en `milkshake-customizer.css`. Descartada: vuelve a abrir la puerta a la divergencia.
   - Alternativa: cargar `hope-customizer-v2.css` en el Milkshake. Descartada: arrastra todo el CSS del armador V2.
2. **Se conservan clase y estructura (`.hope2__delivery-notice span`)** para no tocar los tres JS.
3. **Ícono de local**: SVG inline 24×24 de trazo (`stroke="currentColor"`, `stroke-width="2"`, mismo estilo que el actual) con toldo, fachada y puerta (estilo del ícono "store" de Lucide, dibujado inline; sin dependencias nuevas). Se elige trazo para coincidir con el resto de íconos del armador.
4. **Se eliminan** las reglas `.hope2__delivery-notice` de `hope-customizer-v2.css` y `.hopecfg--milkshake .hope2__delivery-notice` de `milkshake-customizer.css`.

## Risks / Trade-offs

- [El `{% stylesheet %}` de snippets se sirve en el bundle compilado del tema y no en el CSS del asset] → Verificar en `shopify theme dev` que el aviso tenga estilos en las tres páginas y tras recargar la sección en el editor.
- [Especificidad: otra regla de los CSS de armadores podría pisar el aviso] → Buscar `delivery-notice` tras el cambio; solo debe quedar el snippet.
- [El Milkshake se ve menos destacado] → Es el comportamiento pedido (mismo diseño que Helado Hope).

## Migration Plan

Deploy normal vía push a `main` (el tema live sincroniza con GitHub). Rollback: revertir el commit.
