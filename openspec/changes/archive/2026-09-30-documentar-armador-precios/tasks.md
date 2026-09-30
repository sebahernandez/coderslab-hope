# Tasks

## 1. Verificar reglas contra el código

- [x] 1.1 Confirmar en `assets/hope-customizer-v2.js` los valores `FREE_TOPPINGS=2`, `FREE_SYRUPS=1`,
  `EXTRA_UNIT_CENTS=100`, `PREMIUM_CENTS=150`, `MAX_EXTRA_TOPPINGS=20` y que `variantExtraCount()`
  usa `min(..., MAX_EXTRA_TOPPINGS)` — verificación: `grep` de esas constantes muestra los valores del
  delta. ✓ líneas 57–64, 131.
- [x] 1.2 Confirmar en `sections/custom-product-v2.liquid` que los data-attrs `data-free-toppings`,
  `data-free-syrups`, `data-extra-topping-cents`, `data-max-extra-toppings`, `data-premium-cents` y
  `data-extras-variant-id` existen y alimentan al JS — verificación: `grep` de los atributos en la
  sección. ✓ líneas 137–142.
- [x] 1.3 Confirmar que `isValidSelection()` exige `syrups.length >= 1` y que los premium se cuentan
  aparte (no consumen incluidos) — verificación: lectura de `isValidSelection`, `paidBasicToppingCount`
  y `premiumCount`. ✓ líneas 128, 132, 185; premium plano vía `premiumCount * PREMIUM_CENTS` (línea 158).

## 2. Verificar condiciones en el storefront

- [x] 2.1 En `shopify theme dev` (127.0.0.1:9292), en `/products/helado-hope`: seleccionar un 3er
  topping básico y verificar el aviso + marca `+$1.00`; intentar añadir sin sirope y verificar que se
  bloquea — verificación: Playwright. ✓ 3er chip muestra `+$1.00` (2 primeros "Incluido"), aviso con
  copia correcta presente, botón "AÑADIR AL CARRITO" `disabled` sin sirope.
- [x] 2.2 Añadir 1 topping premium + 1 sirope premium y verificar 2 líneas en el carrito (helado por
  tamaño + add-on `qty=2` a $1.50 c/u, ignorando `precio_cents`) — verificación: Playwright inspecciona
  las líneas del carrito. ✓ Verificado en la tienda REAL (hopeheladeria.com): línea Helado Hope
  "Mediano / 0" $7.50 + línea "Extras personalizados" qty 2 @ $1.50 (props `Para: Helado Hope`,
  `_hope_ext` en ambas). NOTA: el 422 "agotado" que se vio antes era un FALSO POSITIVO del `theme dev`
  local (127.0.0.1:9292) con caché stale; el Admin reporta `availableForSale:true`/`tracked:false` y la
  tienda real añade con 200. No hubo cambio de datos de la tienda.
- [x] 2.3 Repetir 2.1 en `/products/mixo-hope` para confirmar que las condiciones son idénticas y solo
  cambia la tabla de precios base ($5/$7/$9) — verificación: Playwright en la página de Mixo. ✓ Mismo
  flujo 3 pasos (size/topping/syrup), aviso `+$1.00` al 3er básico, banner delivery presente, y base
  propia $5/$7/$9 (Pequeño 500 / Mediano 700 / Grande 900).

## 3. Sincronizar specs

- [x] 3.1 Ejecutar `/opsx:sync documentar-armador-precios` (o `/opsx:archive`) para volcar los deltas a
  `openspec/specs/configurador-helado` y `openspec/specs/cobro-extras` — verificación:
  `openspec validate --specs --strict` pasa y `openspec show cobro-extras` incluye los nuevos requisitos.
  ✓ `cobro-extras` 4→7 req, `configurador-helado` 4→5 req; validación strict pasa (4/4).
