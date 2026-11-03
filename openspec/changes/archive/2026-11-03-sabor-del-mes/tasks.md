# Tasks

## 1. Datos de tienda (metaobjeto)

- [x] 1.1 Crear la definición de metaobjeto `sabor_del_mes` con los campos de design.md D1 y acceso Storefront `PUBLIC_READ` (vía `shopify store execute --allow-mutations`); verificar con una query `metaobjectDefinitionByType(type: "sabor_del_mes")` que existe con todos los campos y el acceso correcto
- [x] 1.2 Subir las imágenes de "Alegría" (banner, decorativa, vaso, miniatura) a Archivos de Shopify y crear la entrada "Alegría" con vigencia 2026-11-01 → 2026-11-30, estado activo; verificar con una query `metaobjects(type: "sabor_del_mes")` que la entrada devuelve todos los campos

- [x] 1.3 Agregar a la definición el campo opcional `producto` (product_reference), asociar `alegria` a Helado Hope y crear la entrada `alegria-mixo` asociada a Mixo Hope; verificar en `theme dev` que cada producto renderiza su propia entrada

## 2. Resolución del sabor vigente y banner (Liquid)

- [x] 2.1 En `sections/custom-product-v2.liquid`, resolver `flavor` (forzado por ajuste, o vigente por fechas según D2) y `step_offset`; agregar al schema `mostrar_sabor_del_mes` (checkbox, default true), `sabor_del_mes_forzado` (metaobject `sabor_del_mes`) y `base_clasica_subtitulo` (default "Nuestro sabor tradicional"); verificar con `shopify theme check` sin errores nuevos
- [x] 2.2 Crear `snippets/hope-flavor-banner.liquid` con `{% doc %}`, imagen del banner completa y responsive (D7), alt generado con mes en español (D3) y `{% stylesheet %}` propio; renderizarlo sobre el paso de base; verificar en `shopify theme dev` que /products/helado-hope muestra la imagen sin recorte y con un alt que incluye "Alegría" y "hasta el 30 de noviembre"
- [x] 2.3 Renderizar el fieldset `#base-options` (Clásico seleccionado + sabor) con `aria-pressed`, ajustar la numeración de las legends con `step_offset` y emitir `data-flavor-*` (nombre, URL o ID del vaso) en la raíz; verificar en el HTML renderizado que con sabor vigente las legends son 1–4 y que sin sabor (ajuste apagado) quedan 1–3 y no aparecen banner ni fieldset

## 3. Comportamiento del armador (JS/CSS)

- [x] 3.1 En `assets/hope-customizer-v2.js`, agregar `state.base` (default "clasico"), manejo de click en `[data-group='base']`, reset a clásico, swap de la imagen del preview y clase `is-flavor-month` en la raíz (D5); verificar con Playwright que al elegir "Alegría" cambia `#product-preview` src y aparece la insignia, y al reiniciar vuelve el vaso clásico
- [x] 3.2 Hacer `STEP_LABELS` dinámico según exista `#base-options` y migrar el CSS del wizard móvil a `data-step-index` (D6); verificar con Playwright a 375 px los escenarios de 3 pasos (sin sabor) y 4 pasos ("Paso 1 de 4", "Continuar paso 4" en el paso 3, sin botón avanzar en el último)
- [x] 3.3 Añadir `Base` en `buildMainProperties()` solo con sabor vigente (D4); verificar con Playwright que la línea del carrito trae `Base: Alegría (Sabor del mes)` y el mismo precio/variante que con la base clásica, y que el add-on premium sigue funcionando
- [x] 3.4 Estilos en `assets/hope-customizer-v2.css` para tarjetas de base (2 columnas en desktop, apiladas en móvil), insignia del preview y banner, usando propiedades lógicas y `prefers-reduced-motion`; verificar visualmente con capturas de Playwright en 375 px, 768 px y 1440 px contra el mock de referencia

## 4. Verificación integral

- [x] 4.1 Verificar con Playwright en `theme dev` Helado Hope y Mixo Hope: banner, base, preview, carrito, y que Milkshake y Barquillo no cambian; verificar navegación por teclado (Tab/Enter/Espacio) en las opciones de base
- [x] 4.2 Verificar el caso sin sabor vigente (apagar `mostrar_sabor_del_mes`): armador idéntico al actual en 3 pasos y sin property `Base`

## Workflow follow-up

- Desplegar con commit + push a `main` (publica en vivo; confirmar antes) y verificar en hopeheladeria.com.
- Archivar el change tras la verificación en vivo.
