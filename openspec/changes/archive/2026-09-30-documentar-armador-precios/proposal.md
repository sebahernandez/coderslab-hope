# Proposal

## Why

Los specs sembrados de `configurador-helado` y `cobro-extras` describen el armador de helado a
grandes rasgos, pero no dejan explícitas varias condiciones y reglas de precio que hoy SÍ están
implementadas en el código (`assets/hope-customizer-v2.js`, `sections/custom-product-v2.liquid`).
Documentarlas convierte a los specs en una fuente de verdad precisa del comportamiento actual, útil
para futuros cambios de precio o de reglas sin tener que releer el JS.

## What Changes

- Documentar el **flujo de armado en tres pasos** del configurador (Tamaño → Toppings → Sirope,
  `STEP_LABELS`) como requisito explícito de `configurador-helado`.
- Documentar el **tope de extras básicos bakeados en la variante** (`MAX_EXTRA_TOPPINGS = 20`): más
  allá de 20 básicos pagados, el conteo que elige la variante se topa en 20 (los básicos por encima
  de 20 no suben el precio de la variante).
- Documentar que el **precio premium es plano y uniforme** ($1.50) para cualquier ítem premium —
  topping o sirope— ignorando su `precio_cents`, y que los premium nunca consumen los incluidos.
- Documentar las **condiciones de la interfaz**: aviso al superar los 2 toppings incluidos, marca
  `+$1.00` en los chips adicionales, y validación de mínimo 1 sirope para poder añadir al carrito.
- Precisar que estas reglas aplican por igual a **Helado Hope** y **Mixo Hope** (comparten sección,
  JS y add-on), difiriendo solo en la tabla de precios base.

No hay cambios de código ni de datos de la tienda: es un cambio de **documentación** que alinea los
specs con el comportamiento ya desplegado.

## Capabilities

### New Capabilities

_(ninguna)_

### Modified Capabilities

- `configurador-helado`: se añade el requisito del flujo de armado en tres pasos.
- `cobro-extras`: se añaden los requisitos del tope de extras básicos (20), del precio premium plano
  y uniforme (topping y sirope), y de las condiciones/validaciones de la interfaz.

## Impact

- Solo se modifican specs de OpenSpec (`openspec/specs/configurador-helado/spec.md` y
  `openspec/specs/cobro-extras/spec.md`) al sincronizar/archivar este cambio.
- Código de referencia (no se modifica): `assets/hope-customizer-v2.js`
  (`FREE_TOPPINGS`, `FREE_SYRUPS`, `EXTRA_UNIT_CENTS`, `PREMIUM_CENTS`, `MAX_EXTRA_TOPPINGS`,
  `variantExtraCount`, `premiumCount`, `isValidSelection`) y `sections/custom-product-v2.liquid`
  (data-attrs `data-free-toppings`, `data-free-syrups`, `data-extra-topping-cents`,
  `data-max-extra-toppings`, `data-premium-cents`, `data-extras-variant-id`).
