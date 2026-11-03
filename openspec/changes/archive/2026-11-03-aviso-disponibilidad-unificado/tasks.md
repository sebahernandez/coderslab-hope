# Tasks

## 1. Snippet compartido

- [x] 1.1 Crear `snippets/hope-delivery-notice.liquid` con `{% doc %}`, el `div.hope2__delivery-notice` (`role="note"`, `aria-live="polite"`), SVG de local con `aria-hidden="true"` y `<span>Consultando disponibilidad...</span>`; verificar que el archivo existe y que Theme Check no reporta errores en él
- [x] 1.2 Mover al `{% stylesheet %}` del snippet las reglas `.hope2__delivery-notice` y `.hope2__delivery-notice svg` copiadas de `assets/hope-customizer-v2.css`; verificar que los valores coinciden (fondo `#fff8fb`, borde `1px #efd5e1`, color `#8c5c71`, 12px/500, radio 14px, ícono 16px)

## 2. Consumidores

- [x] 2.1 Reemplazar el markup inline del aviso por `{% render 'hope-delivery-notice' %}` en `sections/custom-product-v2.liquid`, `sections/custom-product-barquillo.liquid` y `sections/custom-product-milkshake.liquid` (manteniendo el `if section.settings.solo_delivery` del Milkshake); verificar con `rg "M1 3h15v13H1z" sections` que no queda el camión
- [x] 2.2 Eliminar las reglas del aviso de `assets/hope-customizer-v2.css` y `assets/milkshake-customizer.css`; verificar con `rg "delivery-notice" assets/*.css` que no quedan coincidencias

## 3. Verificación

- [x] 3.1 Con `shopify theme dev`, abrir Helado Hope, Mixo Hope, Barquillo y Milkshake y verificar con Playwright (desktop y móvil) que el aviso se ve idéntico, con ícono de local, y que el texto se actualiza tras la consulta de disponibilidad
- [x] 3.2 Correr `shopify theme check` sobre los archivos cambiados y resolver hallazgos válidos
