# Proposal

## Why

En el armador v2 (Helado Hope y Mixo Hope), las tarjetas del paso "1 · Elige tu tamaño" muestran
"4 oz / 8 oz / 12 oz" durante la carga y recién después cambian al precio en dólares. El HTML que
genera `sections/custom-product-v2.liquid` trae las onzas como texto provisional, y
`assets/hope-customizer-v2.js` (cargado con `defer`) las reemplaza por el precio cuando se ejecuta.
El cliente ve un salto de contenido y, por un momento, una unidad que no corresponde. El precio en
dólares debe estar visible desde el primer render.

## What Changes

- Las tarjetas de tamaño del armador v2 se renderizan desde el servidor con el precio base en dólares
  de la variante correspondiente (Pequeño/Mediano/Grande sin extras), usando el mismo marcado que hoy
  arma el JS (moneda, entero y decimales en `span` separados), para que no haya salto visual ni de layout.
- El JS mantiene la actualización del precio, pero ya no cambia nada cuando el valor renderizado
  coincide con el calculado.
- Si no se puede resolver la variante de un tamaño, la tarjeta muestra un texto de respaldo neutral
  en lugar de las onzas.

## Capabilities

### New Capabilities

_Ninguna._

### Modified Capabilities

- `configurador-helado`: agrega el requisito de que el precio de cada tamaño se vea en dólares desde la
  carga inicial, sin texto provisional en onzas.

## Impact

- `sections/custom-product-v2.liquid`: marcado de las tres tarjetas de tamaño.
- `assets/hope-customizer-v2.js`: verificar que `updatePrice()` respete el marcado ya renderizado.
- Templates afectados: `product.helado-v2.json` (Helado Hope y Mixo Hope).
- Fuera de alcance: el armador legacy `custom-product-helado.liquid` + `toppings-customizer.js`
  (template `product.helado-personalizado`), que tiene el mismo patrón; se puede tratar en otro cambio.
