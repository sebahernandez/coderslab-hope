# Design

## Context

Ver proposal.md (Why). Estado actual relevante:

- Helado Hope y Mixo usan `sections/custom-product-v2.liquid` + `assets/hope-customizer-v2.js`, cuyo
  estado y precio giran alrededor de Tamaño × "Toppings extra" y una línea add-on para premium.
- Milkshake ya sentó el precedente de un armador dedicado: sección propia con raíz
  `data-hopecfg-ms` (para que el JS global `toppings-customizer.js`, que inicializa sobre
  `[data-hopecfg]`, no la capture), JS/CSS propios cargados desde la sección y match de variante por
  nombre de opción.
- Los chips de siropes se renderizan con `snippets/hope-extra-chip.liquid`, que ya expone
  `data-id`, `data-label`, `data-image` y `data-premium`.
- `snippets/cart-products.liquid` oculta la opción `Toppings extra` en el carrito.
- Despliegue del tema: commit + `git push origin main` (el tema live está conectado a GitHub);
  `theme dev` solo para previsualizar.

## Goals / Non-Goals

**Goals:**

- Armador aislado para Barquillo, sin tocar la lógica de v2 ni Milkshake.
- Precio 100% nativo por variante (1 línea), coherente con el modelo "bakeado".

**Non-Goals:**

- Generalizar v2 en un armador multi-producto configurable.
- Toppings, tamaños o cantidades múltiples de sirope en el Barquillo.

## Decisions

1. **Sección y JS dedicados (`custom-product-barquillo` + `barquillo-customizer.js`)** con raíz
   `class="hopecfg hopecfg--v2 hopecfg--barquillo"` y atributo `data-hopecfg-barq`.
   - Alternativa: añadir un "modo barquillo" a `custom-product-v2`. Rechazada: v2 tiene ~800 líneas
     acopladas a tamaño/add-on; meter ramas aumenta riesgo de regresión en Helado y Mixo.
   - Reutiliza `assets/hope-customizer-v2.css` (lenguaje visual) cargándolo desde la sección; reglas
     propias mínimas en el `{% stylesheet %}` de la sección.

2. **Precio por variante "Extras premium" 0/1** ($1.50 / $2.50), creada con `productSet`
   (`tracked:false`, `inventoryPolicy: CONTINUE`). El JS elige la variante por nombre:
   `option1 === (siropePremium ? "1" : "0")`.
   - Alternativa: reutilizar el add-on "Extras personalizados" ($1.50). Rechazada: el premium aquí
     vale $1.00, no $1.50, y el add-on suma una segunda línea innecesaria.

3. **Siropes desde el metafield `custom.opciones_customizador`** (categoría "Sirope"), copiado de
   Helado Hope al crear el producto (mismo patrón que Mixo). Se renderizan con `hope-extra-chip`
   (`tipo: 'syrup'`). Las categorías de toppings se ignoran.

4. **Selección única tipo radio**: el estado guarda un único `syrup` (id o null). Pulsar otro chip
   reemplaza; pulsar el activo lo deselecciona. Chips con `aria-pressed`; el botón de añadir queda
   deshabilitado y muestra "Elige 1 sirope" mientras no haya selección.

5. **Carrito**: reutiliza el pipeline del armador (`/cart/add.js` con `sections`, evento
   `cart:update`, apertura del drawer, toast). Properties: `{ "Sirope": <label> }` (más "★ Premium"
   en la etiqueta si aplica). `cart-products.liquid` extiende el `unless` para ocultar también
   `Extras premium`.

6. **Vista previa**: imagen base fija del cono (URL Cloudinary del request) y burbuja del sirope
   elegido, reutilizando el patrón de burbujas de v2 (1 sola burbuja).

7. **Aviso de disponibilidad de delivery**: se conserva el mismo diálogo/endpoint que v2
   (`data-delivery-availability-url`), para que el Barquillo se comporte igual que los otros
   armadores.

## Risks / Trade-offs

- [Duplicación de lógica de carrito/disponibilidad con v2] → copiar solo lo mínimo y comentar el
  origen; aceptable, igual que Milkshake.
- [El metafield copiado puede divergir del de Helado Hope] → documentarlo; si se edita un sirope, hay
  que actualizar ambos (mismo riesgo ya aceptado en Mixo).
- [Que el JS global capture la sección] → usar `data-hopecfg-barq`, nunca `data-hopecfg`.
- [Barquillo aparece en colecciones/vitrina sin tag] → asignar tag de categoría para el chip de
  `collection-showcase` si corresponde; verificar en la vitrina.

## Migration Plan

1. Crear producto y variantes con el CLI (aditivo, sin afectar otros productos).
2. Subir archivos del tema (aditivos + un `unless` en el carrito) vía commit + push a `main`.
3. Rollback: pasar el producto a DRAFT y revertir el commit del tema.
