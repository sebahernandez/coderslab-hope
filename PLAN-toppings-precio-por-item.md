# Plan: Catálogo completo de toppings + precio por item (Cart Transform)

## Context
El usuario confirmó el **catálogo completo HOPE** (43 toppings = las 43 imágenes Cloudinary, mapeo 1:1) y
decidió: **precio por item** (cada topping/sirope su costo) cobrado con **Cart Transform**, manteniendo la
UI en **2 grupos** (Toppings = Frutas + Galletas y Secos, elige 2 + máx 1 premium; Sirope = Cremas y Siropes,
elige 1). Se quitan **Cambur, Frutos rojos, Caramelo salado** (no están en el catálogo). Aplica a
**Helado Hope** y **Mixo Hope** (comparten metafield y template `helado-v2`). El **Milkshake NO** se toca
(no tiene toppings).

Restricción Shopify: no se puede sumar recargos por item a una línea nativa sin función. Solución elegida:
**Cart Transform con operación `update`** que fija el precio de la única línea = base del tamaño + Σ costos
de los extras elegidos, calculado **server-side** desde el metafield (seguro ante manipulación del cliente).

## INPUT REQUERIDO del usuario
1. **Costos por item** (columna cortada en el documento). Formato libre, ej.:
   `Mango 0.30, Oreo 0.50, Nutella 1.20, Sirope de fresa 0.40, ...`. Los no listados = incluidos ($0).
2. **Confirmar base por tamaño**: Pequeño **$5.00** / Mediano **$7.00** / Grande **$9.00** (derivado de las
   variantes actuales). Corregir si cambia.

## Mapeo topping → imagen (verificado, 43/43 = 200 OK)
- Frutas (Básico): coco-rallado, maracuya-pulpa, fresa, mango, patilla, pina
- Frutas (Premium *): uva, moras, kiwi, cerezas, melocoton, arandanos
- Galletas y Secos (Básico): migas-de-torta, oreo, lluvia-de-colores, maní_con_ajonjolí, malvaviscos,
  lluvia-de-chocolate, lluvia-de-chocolate-blanco, granola, fruit-loops, miga-de-susy, miga-de-cocosette
- Galletas y Secos (Premium *): pirulin, flips, mini-brownies, m_m, hershey_s, Bolero, mini-chocolates
- Cremas y Siropes (Básico): leche-condensada, sirope-de-fresa, sirope-de-chocolate-negro, arequipe
- Cremas y Siropes (Premium *): miel, nutella, crema-de-pistacho-salado, crema-de-pistacho-dulce,
  chocolate-blanco-crocante, crema-de-avellana-tostada, crema-de-parchita, crema-choco-avellana-con-trozos,
  crema-de-mango-con-parchita
(URLs: `https://res.cloudinary.com/slealu5f/image/upload/f_auto,q_auto,w_400/<public_id>.png`, raíz,
transparente, sin `e_background_removal`. Ver [[hope-cloudinary-ingredientes]].)

## Cambios a ejecutar (una vez tenga costos)

### 1. Variantes de producto (Helado Hope 9116101411068 + Mixo Hope 9454592786684)
`productSet`: reemplazar opciones `Tamaño × Extras(Estándar/Con premium)` (6 variantes) por **solo `Tamaño`**
(3 variantes) a base **$5/$7/$9**. Republicar. Todo lo demás (sirope/toppings) lo cobra la función.

### 2. Cart Transform (`hope-functions` › extensión `helado-bundle`)
Reescribir `src/cart_transform_run.{graphql,js}`:
- Input: `cart.lines[]` con `attribute(key:"_extra_ids")` (ids elegidos) + `cost.amountPerQuantity.amount`
  (base) + `merchandise ... on ProductVariant { product { metafield(namespace:"custom",
  key:"opciones_customizador"){ value } } }`.
- Lógica: parsear el metafield → mapa id→precio_cents; sumar los ids de `_extra_ids`; **`update`** la línea
  con `price.adjustment.fixedPricePerUnit.amount = base + Σextras`.
- Quitar la lógica vieja `linesMerge`/`_grupo`/`Para`.
- `shopify app deploy` (build wasm) + asegurar `cartTransformCreate` activo. La app ya tiene scope
  `write_cart_transforms`.

### 3. Metafield `custom.opciones_customizador` (ambos productos)
Reconstruir con 2 categorías: **Topping** (Frutas + Galletas y Secos; `premium:true` en los `*`; `limite:2`)
y **Sirope** (Cremas y Siropes; `limite:1`). Cada item: `{id, nombre, emoji, precio_cents, premium?, imagen}`.
`precio_cents` desde la lista de costos.

### 4. Customizer v2 (`sections/custom-product-v2.liquid` + `assets/hope-customizer-v2.js`)
- JS: variante = **solo tamaño** (`findVariant` por `option1`); quitar `heladoLevel`/Estándar/Con premium.
- Añadir 1 línea = variante de tamaño (precio base) + properties visibles (Toppings/Premium/Sirope) +
  atributo oculto `_extra_ids` (ids separados por coma) que lee la función.
- Total mostrado en el JS = base + Σ `precio_cents` (ya disponibles en el metafield inyectado).
- Reglas de selección sin cambio (2 toppings + máx 1 premium + 1 sirope) pero cada item suma su precio
  (los básicos ya no son "Incluido").
- Chips ya muestran imagen (hecho en la fase anterior).

## Verificación (end-to-end)
- `shopify app deploy` de la función; confirmar cart transform activo.
- `shopify theme dev` + Playwright en `/products/helado-hope` y `/products/mixo-hope`: elegir tamaño + 2
  toppings + 1 premium + 1 sirope; el total mostrado = el precio real de `/cart.js` (la función aplicó el
  `update`); 1 sola línea; properties correctas. Repetir en Mixo. Confirmar Milkshake intacto.
