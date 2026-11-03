# Proposal

## Why

El aviso de disponibilidad ("Disponible solo para compra presencial", "Disponible solo para delivery", etc.) se ve distinto según el armador: Helado Hope, Mixo Hope y Barquillo usan el estilo suave rosado, pero el Milkshake lo sobrescribe con borde más grueso, fondo más saturado y texto en negrita. Además, todos usan un ícono de camión, que no representa bien la idea de "comprar en el local".

## What Changes

- Unificar el diseño del aviso en todos los armadores tomando como canónico el estilo actual de Helado Hope (fondo `#fff8fb`, borde `1px #efd5e1`, texto `#8c5c71` 12px peso 500, radio 14px, ícono 16px).
- Eliminar el estilo propio del aviso en el Milkshake.
- Reemplazar el ícono de camión por un ícono de local/tienda (fachada con toldo) en todos los armadores.
- Centralizar el markup y el CSS del aviso en un único snippet reutilizable para que no vuelva a divergir.
- Sin cambios en los textos ni en la lógica de consulta de disponibilidad (JS), ni en el ajuste `solo_delivery` del Milkshake.

## Capabilities

### New Capabilities

_Ninguna._

### Modified Capabilities

- `configurador-helado`: se agrega el requisito de que el aviso de disponibilidad tenga un diseño único y un ícono de local en todos los armadores (Helado Hope, Mixo Hope, Barquillo y Milkshake).

## Impact

- `sections/custom-product-v2.liquid` (Helado Hope y Mixo Hope), `sections/custom-product-barquillo.liquid`, `sections/custom-product-milkshake.liquid`: reemplazo del markup inline por `{% render %}` del snippet.
- Nuevo `snippets/hope-delivery-notice.liquid` con markup + `{% stylesheet %}`.
- `assets/hope-customizer-v2.css` y `assets/milkshake-customizer.css`: se eliminan las reglas `.hope2__delivery-notice`.
- JS (`hope-customizer-v2.js`, `barquillo-customizer.js`, `milkshake-customizer.js`) sin cambios: siguen escribiendo en `.hope2__delivery-notice span`.
