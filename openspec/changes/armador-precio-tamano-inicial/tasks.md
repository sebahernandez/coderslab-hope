# Tasks

## 1. Render del precio en servidor

- [x] 1.1 En `sections/custom-product-v2.liquid`, reemplazar el texto "4 oz / 8 oz / 12 oz" de las tarjetas de tamaño por el precio de la variante option1=Pequeño/Mediano/Grande, option2="0" de `p_helado`, con `data-price` y los `span` `hope2__size-price-currency|integer|fraction`; verificar con `curl`/view-source en `shopify theme dev` que el HTML de `/products/helado-hope` trae $6.00/$7.50/$9.00 sin "oz"
- [x] 1.2 Implementar el respaldo "—" cuando falta la variante; verificar leyendo la rama Liquid y confirmando que `updatePrice()` no la sobrescribe si no hay variante
- [x] 1.3 Ejecutar `shopify theme check` sobre la sección y verificar que no haya ofensas nuevas

## 2. Coherencia con el JavaScript

- [x] 2.1 Confirmar que `formatMoney(v.price)` en `assets/hope-customizer-v2.js` produce exactamente el `data-price` renderizado (si no, ajustar el string de Liquid); verificar con Playwright que después de cargar el JS el `innerHTML` de cada `[data-size-price]` no cambia respecto del HTML inicial

## 3. Verificación de integración

- [x] 3.1 Con Playwright contra `shopify theme dev` (127.0.0.1:9292), con red lenta o JS bloqueado, verificar en Helado Hope y Mixo Hope (desktop y móvil) que las tarjetas muestran dólares desde el primer frame ($6/$7.50/$9 y $5/$7/$9) y que seleccionar tamaños sigue actualizando el total
- [ ] 3.2 Actualizar la spec principal `openspec/specs/configurador-helado/spec.md` mediante sync/archive y verificar con `openspec validate armador-precio-tamano-inicial`

## Workflow follow-up

- Desplegar con `shopify theme push` (solo `sections/custom-product-v2.liquid` y, si cambia, `assets/hope-customizer-v2.js`).
- Archivar el cambio después de verificar en la tienda.
