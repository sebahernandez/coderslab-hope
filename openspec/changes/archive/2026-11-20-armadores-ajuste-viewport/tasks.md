# Tasks

## 1. Reconciliar el cambio en curso

- [x] 1.1 En `openspec/changes/armadores-selectores-agrupados/specs/configurador-helado/spec.md`, retirar del requisito "Chips de Helado Hope y Mixo Hope en grilla uniforme" la frase "Las opciones MUST recorrerse con el scroll de la página, sin lista con scroll interno ni desplazamiento horizontal" (conservando "sin desplazamiento horizontal") y el escenario "Todas las opciones alcanzables con el scroll de la página"; verificar con `openspec validate armadores-selectores-agrupados` y `openspec validate armadores-ajuste-viewport`.

## 2. Prueba en vivo previa a la implementación

- [x] 2.1 Inyectar con Playwright el CSS candidato de `design.md` (Decisiones 1–4) sobre las páginas en vivo de Helado Hope, Mixo Hope, Milkshake y Barquilla, sin desplegar; verificar que en 1366×768, 1440×900, 390×844 y 375×667 la tarjeta queda entre el navbar y el borde inferior del viewport.
- [x] 2.2 Recorrer con el CSS inyectado los pasos del asistente móvil de Helado Hope (base, tamaño, toppings, siropes) a 375×667 y capturar cada paso, incluyendo los tamaños de texto de la Decisión 6; verificar que se ven al menos dos filas de chips al entrar a toppings y que el pie no se mueve.
- [x] 2.3 Presentar las capturas de escritorio y móvil al usuario y obtener su visto bueno antes de editar el tema; si pide ajustes (alto de la vista previa, separación, pie, tamaños de texto), actualizar `design.md`.

## 3. Contenedor compartido

- [x] 3.1 En `assets/toppings-customizer.css`, dentro de `@media (min-height: 540px)`, definir en `.hopecfg` `--hopecfg-gap` (12 px; 16 px desde 1024 px) y `--hopecfg-top`, y reemplazar el padding vertical por esas variables; verificar en `shopify theme dev` que la separación navbar–tarjeta mide entre 8 y 24 px en 1366×768 y 390×844.
- [x] 3.2 En el mismo bloque, dimensionar `.hopecfg__frame` con `min-height: 0` y `height: min(calc(100svh - var(--hopecfg-top) - var(--hopecfg-gap)), 900px)`, con declaración previa en `100vh`; verificar que en Milkshake el borde inferior de la tarjeta queda dentro del viewport en 1280×720, 1920×1080 y 375×667.
- [x] 3.3 Verificar el respaldo: en 844×390 el armador conserva el layout actual y se llega a "Añadir al carrito" desplazando la página.

## 4. Asistente móvil v2 y Barquilla

- [x] 4.1 En `assets/hope-customizer-v2.css` (`max-width: 1023px` y `min-height: 540px`), reemplazar las anulaciones de alto de `.hopecfg__frame`, `.hopecfg__preview` y `.hopecfg__config` por tarjeta acotada, vista previa `clamp(120px, 20svh, 230px)` y panel de opciones flexible; verificar en Helado Hope a 390×844 que `.hopecfg__config-scroll` es el único elemento con scroll y que la página no necesita desplazarse para ver el pie.
- [x] 4.2 Compactar el pie móvil (total en una línea, menor padding vertical) conservando la altura de al menos 48 px y pareja de "Atrás", "Siguiente" y "Añadir al carrito"; verificar que el pie mide ~108 px y que el requisito "Tamaño táctil consistente de los controles del wizard móvil" se sigue cumpliendo.
- [ ] 4.3 Recorrer los pasos de Helado Hope y Mixo Hope (con y sin sabor del mes) a 375×667 y 360×640; verificar que cada paso arranca desde el inicio de la lista, que se alcanza la última opción con el scroll interno, sin scroll horizontal, y que las burbujas de la vista previa siguen pudiéndose pulsar para quitar un extra.
- [x] 4.4 Verificar Barquilla a 390×844 y 360×640: tarjeta completa en el viewport, todos los siropes alcanzables con el scroll interno y la foto del cono actualizada visible al elegir el último sirope.

- [x] 4.5 Ocultar en móvil el título y el aviso de disponibilidad fuera del primer paso del asistente (Decisión 7); verificar en Helado Hope y Mixo Hope a 375×667 y 360×640 que se ven al menos dos opciones completas al entrar a toppings y a siropes, que ambos reaparecen al volver al primer paso y que en Barquilla siguen siempre visibles.
- [x] 4.6 Ajustar el último paso para que "Atrás" no reparta el ancho a partes iguales y "Añadir al carrito" quepa en una línea a 13 px; verificar a 360×640 que el texto no desborda y que los tres botones conservan la misma altura de al menos 48 px.

## 5. Tamaño de texto en móvil

- [x] 5.1 En `assets/toppings-customizer.css` (`max-width: 1023px`), subir `.hopecfg__total-label` y `.hopecfg__eyebrow` a 11 px y `.hopecfg__buy` a 13 px; verificar los tamaños computados en Milkshake a 375×667 y que "Añadir al carrito" cabe en una línea.
- [x] 5.2 En `assets/hope-customizer-v2.css` (`max-width: 1023px`), subir `.hope2__stepbar` y `.hope2__base-sub` a 12 px y los nombres de toppings y siropes a 13 px, cuidando que la regla gane a las existentes; verificar los tamaños computados en Helado Hope y Barquilla a 375×667 y que ningún nombre supera tres líneas a 360 px de ancho.
- [x] 5.3 En `assets/milkshake-customizer.css` (`max-width: 1023px`), subir `.ms__ingredientes` a 12 px y `.ms__gramos` a 11 px; verificar los tamaños computados y que las tarjetas de combo no se desbordan a 360 px de ancho.
- [x] 5.4 Recorrer con Playwright todo el texto visible de los cuatro armadores a 375×667 y verificar que ninguno mide menos de 12 px salvo las etiquetas en mayúsculas de 11 px, y que a 1366×768 los tamaños son los mismos que antes del cambio.

## 6. Verificación integral

- [x] 6.1 Ejecutar con Playwright contra `shopify theme dev` la matriz 4 productos × (1920×1080, 1440×900, 1366×768, 1280×720, 1024×768, 768×1024, 390×844, 375×667, 360×640) y verificar en cada caso: tarjeta entre el navbar y el borde inferior del viewport, botones del pie visibles y sin scroll horizontal de página.
- [x] 6.2 Verificar en escritorio que la columna de opciones llega a la última opción con el scroll interno, que el footer del sitio sigue alcanzable con el scroll de la página y que no hay salto de la tarjeta al cargar.
- [ ] 6.3 Añadir un armado al carrito en móvil y en escritorio y verificar que la animación al carrito, el drawer y el cobro de extras funcionan igual que antes.
- [x] 6.4 Ejecutar `shopify theme check` y verificar que no hay hallazgos nuevos en los archivos modificados.

## Workflow follow-up

- Con confirmación del usuario: `git fetch` + rebase, commit y push a `main` (publica en vivo).
- Verificar los cuatro armadores en https://hopeheladeria.com tras la sincronización.
- Archivar el cambio.
