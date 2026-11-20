# Proposal

## Why

El armador de la Barquilla ya presenta sus siropes ordenados: dos conjuntos con encabezado ("Clásicos" y "Premium ★"), cada uno con su costo a la vista, en una grilla de chips del mismo ancho y con el nombre completo. El armador de Helado Hope y Mixo Hope sigue mostrando toppings y siropes mezclados (básicos y premium juntos, sin orden) y, en móvil, dentro de una lista con scroll interno que deja ver unas cuatro opciones a la vez. Con más de veinte opciones por grupo, el cliente no distingue de un vistazo qué está incluido y qué se cobra aparte. Se replica la organización de la Barquilla para que los armadores se lean igual.

## What Changes

- En el armador de Helado Hope y Mixo Hope (sección `custom-product-v2`), los **toppings** y los **siropes** se presentan cada uno en dos conjuntos con encabezado: "Clásicos" y "Premium ★".
- Cada encabezado muestra el costo del conjunto, calculado desde los ajustes de la sección: los clásicos indican cuántos están incluidos y el precio de cada adicional; los premium indican su precio por unidad.
- Los clásicos conservan el orden de los datos del producto; los premium se ordenan alfabéticamente.
- Los chips pasan a una grilla uniforme (mismo ancho, nombre completo en varias líneas), en escritorio y en móvil.
- En móvil se elimina la lista con scroll interno y el aviso "Desliza para ver más": las opciones se recorren con el scroll normal de la página, dentro del paso del asistente.
- Los chips dejan de repetir la estrella ★ y la etiqueta "premium" (ya lo dice el encabezado). El chip seleccionado conserva su costo ("Incluido", "+$1.00", "+$1.50"), porque en este armador el costo de un básico depende de cuántos se eligieron.
- La guía de precios que hoy aparece sobre cada grupo se retira: su información pasa a los encabezados. Se conserva la nota de que los premium no cuentan como incluidos.
- La organización deja de ser exclusiva de la Barquilla: pasa a ser un componente compartido (marcado, estilos y textos) que usan la Barquilla y el armador de Helado Hope / Mixo Hope. La Barquilla no cambia a la vista.

Fuera de alcance:

- **Milkshake**: sus combos no tienen clasificación clásico/premium y son tres tarjetas con ingredientes, gramos y precio; no hay conjuntos que formar. No cambia.
- **Armador v1** (`custom-product-helado`, plantilla `helado-personalizado`): usa un modelo anterior (topping premium en grupo aparte con máximo 1, tope de 2 toppings) y un marco de alto fijo. No cambia en este change.
- Precios, reglas de cobro, límites de selección, pasos del asistente y líneas del carrito: no cambian.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `configurador-helado`: se agregan los requisitos de agrupación, orden, costo en el encabezado y grilla uniforme para toppings y siropes de Helado Hope y Mixo Hope, y el de organización compartida entre armadores. Se modifica "Chips de sirope de la Barquilla en grilla uniforme" para quitar la restricción de que Helado Hope y Mixo Hope no debían cambiar.

## Impact

- **Liquid**: `sections/custom-product-v2.liquid` (grupos de toppings y siropes), `sections/custom-product-barquillo.liquid` (pasa a usar el componente compartido), nuevo snippet para un conjunto de opciones; se elimina `snippets/hope-pricing-guide.liquid`.
- **CSS**: `assets/hope-customizer-v2.css` (cargado por ambos armadores) pasa a ser dueño de los estilos de conjunto y grilla; se quitan de ahí la lista con scroll interno, el aviso "Desliza para ver más" y la guía de precios. Se retiran del `{% stylesheet %}` de la Barquilla las reglas que se mudan.
- **JS**: `assets/hope-customizer-v2.js` pierde el indicador de scroll. La selección, el cobro y el asistente no se tocan.
- **Textos**: `locales/en.default.json` y `locales/es.json` (claves `hope_customizer`).
- **Sin cambios en la tienda**: no se modifican productos, variantes ni metafields.
- **Riesgo principal**: los dos armadores están en producción y comparten CSS; el paso de toppings y el de siropes crecen en alto en móvil al quitar el scroll interno. Ver `design.md`.
