# Proposal

## Why

Con el encabezado en modo franja + glassmorphism (la configuración actual de la tienda), el encabezado ya reserva su altura en `main`, pero cuatro páginas sin hero vuelven a sumar esa altura por su cuenta. El resultado es un hueco extra de ~94 px bajo el encabezado. Medido en vivo a 1440 px:

| Página | Reserva de `main` | Padding propio | Hueco esperado |
|---|---|---|---|
| Armador (`/products/helado-hope`, `.hopecfg`) | 94 px | 110 px (94 + 16) | 16 px |
| Carrito (`/cart`) | 94 px | 114 px (94 + 20) | 20 px |
| Listado de colecciones (`/collections`) | 94 px | 114 px (94 + 20) | 20 px |
| Políticas (`/policies/*`) | 94 px | 126 px (94 + 32) | 32 px |

La causa no es el margen inferior del encabezado: ese espaciado ya es padding desde el cambio `encabezado-espaciado-padding`. Es una doble reserva: esas páginas se escribieron cuando el encabezado glass flotaba sobre el contenido sin reservar espacio.

## What Changes

- El encabezado publica cuánta altura reserva en el flujo (la altura del encabezado con franja + glass; 0 en cualquier otra configuración). Esa reserva es la única fuente de verdad.
- Las cuatro páginas restan esa reserva de su compensación, y solo suman su aire propio cuando el encabezado ya reservó espacio:
  - `assets/toppings-customizer.css` (`.hopecfg`, armadores de Helado, Mixo, Milkshake y Barquilla).
  - `sections/main-cart.liquid`.
  - `sections/main-collection-list.liquid`.
  - `assets/base.css` (`main .shopify-policy__container`).
- Con glass sin franja (encabezado fijo que no reserva espacio), las páginas siguen compensando la altura completa como hoy.
- El armador conserva su presupuesto de alto: la tarjeta sigue cabiendo completa bajo el encabezado.

## Capabilities

### New Capabilities

_Ninguna._

### Modified Capabilities

- `encabezado-apariencia`: se añade el requisito de que la altura del encabezado se reserve una sola vez, sin compensaciones duplicadas en las páginas.

## Impact

- `sections/header.liquid`: nueva custom property con la reserva en el flujo; la regla de `main` pasa a usarla.
- `assets/toppings-customizer.css`, `sections/main-cart.liquid`, `sections/main-collection-list.liquid`, `assets/base.css`: compensación superior.
- Sin cambios de schema ni de ajustes guardados. Cambio visual en vivo al publicar en `main`.
