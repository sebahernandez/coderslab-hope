# Tasks

## 1. Producto Barquillo en la tienda (CLI)

- [x] 1.1 Leer el metafield `custom.opciones_customizador` de Helado Hope (gid 9116101411068) con `shopify store execute --store hopesweet` y guardar el JSON como variable del `productSet` (se copia solo la categoría "Sirope"). Verificación: el JSON contiene la categoría "Sirope" con ítems y flags `premium`.
- [x] 1.2 Crear Barquillo con `productSet` (`shopify store execute --store hopesweet --query-file … --variable-file … --allow-mutations`): título "Barquillo", handle `barquillo`, `templateSuffix: barquillo`, opción "Extras premium" con variantes "0" @ $1.50 y "1" @ $2.50 (`tracked:false`, `inventoryPolicy: CONTINUE`), media con la URL Cloudinary del cono, metafield copiado, status ACTIVE. Verificación: re-query devuelve 2 variantes con esos precios y la imagen.
- [x] 1.3 Publicar Barquillo en Tienda online (160382288124) y POS (160382320892) con `publishablePublish`. Verificación: re-query de `resourcePublications` muestra ambas.

## 2. Armador dedicado en el tema

- [x] 2.1 Crear `templates/product.barquillo.json` que apunte a la sección `custom-product-barquillo`. Verificación: JSON válido y `/products/barquillo` renderiza la sección en `theme dev`.
- [x] 2.2 Crear `sections/custom-product-barquillo.liquid` (contrato de sección, raíz `data-hopecfg-barq`, título "Crea tu Barquillo", imagen base del cono, solo el grupo de siropes vía `hope-extra-chip`, sin tamaños ni toppings, `products_json` con variantes y `option1`, diálogo de disponibilidad de delivery, carga de `hope-customizer-v2.css` y `barquillo-customizer.js`, schema con `t:`/labels como el resto). Verificación: Theme Check sin errores nuevos.
- [x] 2.3 Crear `assets/barquillo-customizer.js`: init idempotente sobre `[data-hopecfg-barq]`, selección única de sirope (reemplaza / deselecciona), precio desde la variante "0"/"1" por nombre, burbuja del sirope, validación "Elige 1 sirope", add-to-cart de 1 línea con property `Sirope`, `cart:update` + drawer + toast. Verificación: en `theme dev`, estándar muestra $1.50 y premium $2.50; sin sirope el botón queda deshabilitado.
- [x] 2.4 Extender `snippets/cart-products.liquid` para ocultar también la opción `Extras premium`. Verificación: la línea del Barquillo en el drawer no muestra "Extras premium".

## 3. Verificación end-to-end

- [x] 3.1 Con Playwright contra `theme dev` y el live (el carrito en dev responde 422 por stock falso; add-to-cart y drawer verificados en hopeheladeria.com tras el deploy): cubrir los escenarios del spec (reemplazo de sirope, sin sirope, $1.50 / $2.50, 1 sola línea sin add-on) y confirmar que Helado Hope, Mixo y Milkshake siguen igual. Verificación: todos los escenarios pasan y no hay errores de consola propios.
- [x] 3.2 Verificar que Barquillo aparece correctamente en la vitrina de colección (`collection-showcase`) y no lo captura el JS global v1. Verificación: inspección en `theme dev`.

## Workflow follow-up

- Desplegar con commit + `git push origin main` (publica en vivo; avisar antes) y verificar en hopeheladeria.com.
- Archivar el cambio con `/opsx:archive`.
