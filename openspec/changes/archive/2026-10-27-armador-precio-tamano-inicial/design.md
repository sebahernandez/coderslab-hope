# Design

## Context

- `sections/custom-product-v2.liquid` renderiza las tres tarjetas de tamaño con
  `<span class="hopecfg__choice-sub" data-size-price>4 oz</span>` (y 8 oz / 12 oz).
- `assets/hope-customizer-v2.js` se carga con `defer`. En `updatePrice()` busca, para cada tarjeta, la
  variante `findVariant(SIZE_NAME[id], 0)` (option1 = "Pequeño"/"Mediano"/"Grande", option2 = "0"),
  formatea `v.price` con `formatMoney()` y la parte en `span.hope2__size-price-currency`,
  `…-integer` y `…-fraction`. Si `sub.dataset.price` ya es igual al string formateado, no toca el DOM.
- El CSS (`hope-customizer-v2.css`, cerca de las líneas 482-507 y 752) da estilo a esos `span`, así que
  el marcado inicial tiene que ser idéntico para no generar un salto de layout.
- En Liquid ya existe `p_helado` y la misma lógica de variantes (`where: 'option2', '0'`).

## Goals / Non-Goals

**Goals:**
- El primer HTML ya trae el precio formateado con la misma estructura de `span` que produce el JS.
- El JS no vuelve a renderizar cuando el valor coincide (sin parpadeo).

**Non-Goals:**
- Cambiar precios, variantes o la lógica de totales.
- Tocar el armador legacy (`custom-product-helado.liquid` / `toppings-customizer.js`) o el del milkshake.
- Mostrar las onzas en otro lugar de la tarjeta (no se pidió; se puede evaluar aparte).

## Decisions

1. **Render en servidor en vez de ocultar hasta que cargue el JS.**
   Para cada tamaño: `assign v = p_helado.variants | where: 'option1', '<Nombre>' | where: 'option2', '0' | first`.
   Así el precio está en el HTML inicial, funciona sin JS y no depende del orden de carga.
   *Alternativa descartada:* ocultar el `span` (`visibility: hidden`) hasta que el JS lo complete. Saca
   el "oz" pero deja un hueco en blanco y sigue dependiendo del JS.

2. **Mismo marcado que el JS + `data-price`.**
   Liquid arma `formatted = v.price | money | strip_html` y lo pone en `data-price="{{ formatted }}"`.
   Las partes salen de `integer = v.price | divided_by: 100`,
   `fraction = '.' + (v.price | modulo: 100 | prepend: '0' | slice: -2, 2)` y
   `currency = formatted | remove: integer+fraction` (prefijo, por ejemplo "$"). Se emiten como
   `span.hope2__size-price-currency`, `…-integer` y `…-fraction`, igual que hoy. Como `data-price` coincide
   con `formatMoney(v.price)`, la condición que ya existe en `updatePrice()` evita volver a renderizar.
   *Alternativa descartada:* emitir solo el string plano y dejar que el JS lo parta. Habría un salto de
   tipografía, porque los decimales usan un tamaño menor.

3. **Respaldo "—".** Si no se encuentra la variante, el `span` muestra "—" sin `data-price`. En ese caso
   el JS tampoco encuentra la variante y no lo toca.

4. **Snippet opcional.** Las tres tarjetas repiten el mismo bloque. Se puede usar un `{% for %}` sobre
   `small,medium,large` con su nombre en vez de crear un snippet nuevo: es una sola sección y no hace falta
   reutilizarlo en otro lado.

## Risks / Trade-offs

- [El formato de moneda de la tienda difiere entre `money` (Liquid) y `formatMoney` (JS), por ejemplo
  separadores distintos] → El JS detecta la diferencia y vuelve a renderizar con su formato. Se ve
  correcto igual; como mucho hay un reemplazo de texto sin "oz". Se verifica en `shopify theme dev`
  que `data-price` coincida.
- [Precios ≥ $1000 con separador de miles] → No aplica (precios de $5 a $9); el respaldo del JS lo cubre.
- [Mixo Hope tiene otra tabla de precios ($5/$7/$9)] → Sale de `p_helado` (el producto actual), así que
  cada producto muestra sus propios precios.
