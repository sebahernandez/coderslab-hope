# Tasks

## 1. Encabezado

- [x] 1.1 En `sections/header.liquid`, definir `--header-flow-offset` (`0px` por defecto en `body`, `var(--header-height)` con `#header-component.header--band.header--glass`) y hacer que la regla de `main` use `padding-block-start: var(--header-flow-offset)`; verificar con Playwright en la portada que `main` conserva `padding-top` igual a la altura del encabezado (94 px a 1440 px) y que la primera sección no cambia de posición.

## 2. Páginas que compensan el encabezado

- [x] 2.1 En `assets/toppings-customizer.css`, separar `--hopecfg-header`, calcular el padding superior restando `--header-flow-offset` (también en el caso de alto < 540 px) y mantener el alto de la tarjeta restando la altura completa del encabezado; verificar a 1440 × 900 que la tarjeta empieza 16 px bajo el encabezado y cabe completa sin scroll de página en Helado, Mixo, Milkshake y Barquilla.
- [x] 2.2 En `sections/main-cart.liquid`, restar `--header-flow-offset` en el padding superior; verificar en `/cart` que el contenido empieza 20 px bajo el encabezado.
- [x] 2.3 En `sections/main-collection-list.liquid`, restar `--header-flow-offset`; verificar en `/collections` que el contenido empieza 20 px bajo el encabezado.
- [x] 2.4 En `assets/base.css` (`main .shopify-policy__container`), restar `--header-flow-offset`; verificar en `/policies/privacy-policy` que el contenedor empieza 32 px bajo el encabezado.
- [x] 2.5 Buscar con `rg` otros `padding` que sumen `--header-group-height` o `--header-height`; confirmar que no quedan compensaciones duplicadas o listar las que aparezcan antes de seguir.

## 3. Verificación integral

- [x] 3.1 Repetir las mediciones de 2.1–2.4 a 390 × 844 y confirmar que no hay scroll horizontal ni contenido tapado.
- [x] 3.2 Simular glass sin franja (quitando temporalmente la clase `header--band` en el navegador) y confirmar que el contenido de las cuatro páginas no queda tapado y conserva la distancia de antes del cambio.
- [x] 3.3 Correr `shopify theme check` y confirmar que no hay hallazgos nuevos en los archivos tocados.

## Workflow follow-up

- Commit y push a `develop`; a `main` (publica en vivo) solo con confirmación explícita.
- Archivar el cambio y sincronizar la spec `encabezado-apariencia` tras verificar.
