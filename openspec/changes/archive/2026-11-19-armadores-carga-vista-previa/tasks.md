# Tasks

## 1. Base compartida (sin cambios visibles)

- [x] 1.1 Crear `assets/hope-preview-loader.js` con `window.HopePreview.create(stage, img, options)` y `show(url)` según `design.md` (token, precarga, tiempo límite de 15 s como constante única, clases `is-loading` / `is-error` / `is-loaded`, `aria-busy`, texto del mensaje). Verificar con `node --check` y, en la consola del navegador, que `show()` con una URL válida, una inválida y una que no responde deja el escenario en `is-loaded`, `is-error` e `is-error` respectivamente.
- [x] 1.2 Cargar el helper en `layout/theme.liquid` con `defer`, antes de `toppings-customizer.js`. Verificar en las cuatro páginas de armador que `window.HopePreview` existe cuando corre el script de cada sección y que no hay errores de consola nuevos.
- [x] 1.3 Crear `snippets/hope-preview-status.liquid` (elemento `role="status"` con el texto por defecto y su `{% doc %}`) y renderizarlo dentro de `.hopecfg__stage` en `custom-product-helado`, `custom-product-v2`, `custom-product-milkshake` y `custom-product-barquillo`. Verificar que el elemento existe, oculto y vacío, en las cuatro páginas.
- [x] 1.4 Agregar en `assets/toppings-customizer.css` los estilos compartidos de cargando (spinner con retraso, imagen atenuada), de error (imagen oculta, mensaje centrado) y la regla de movimiento reducido. Verificar que, sin migrar ningún armador, las cuatro páginas se ven igual que antes (comparar capturas de escritorio y 390 px).
- [x] 1.5 Ejecutar Theme Check sobre el tema y resolver los hallazgos de los archivos tocados.

## 2. Barquilla

- [x] 2.1 Reemplazar en `assets/barquillo-customizer.js` la precarga propia de `setPreview` y el `revealCup` del arranque por el controlador, conservando la elección de URL y quitando el respaldo en error; mantener el camino directo si `window.HopePreview` no existe. Verificar con `node --check`.
- [x] 2.2 Verificar con Playwright e intercepción de red en `/products/barquillo`: demora de 2 s (imagen anterior atenuada + indicador, luego la foto), error 500 (mensaje, sin cono base, compra habilitada), cambio rápido Miel→Nutella con Miel llegando tarde y con Miel fallando, reintento sobre el mismo sirope, Reiniciar, y sirope sin foto (cono base, sin mensaje).
- [x] 2.3 Verificar los mismos casos con el sabor del mes elegido (foto del sabor con sirope que falla → mensaje; sirope sin foto del sabor → cono del sabor solo) y que agregar al carrito en estado de error crea la línea con `Sirope` y `Base` correctos.

## 3. Milkshake

- [x] 3.1 Reemplazar en `assets/milkshake-customizer.js` la asignación directa y los listeners de `updatePreview()` por el controlador, con el camino directo de respaldo. Verificar con `node --check`.
- [x] 3.2 Verificar con Playwright en `/products/milkshake`: primera carga, cambio de combo con demora, error 500 (mensaje, sin imagen rota), cambio rápido entre dos combos, cambio de tamaño (sin indicador si la imagen no cambia) y agregar al carrito en estado de error. Confirmar que el spinner de las miniaturas de combo sigue funcionando.

## 4. Helado Hope y Mixo Hope (v2)

- [x] 4.1 Reemplazar en `assets/hope-customizer-v2.js` la asignación en `render()` y el `revealCup` del arranque por el controlador, con el camino directo de respaldo. Verificar con `node --check`.
- [x] 4.2 Verificar con Playwright en `/products/helado-hope` y `/products/mixo-hope`: primera carga, cambio de base clásica↔sabor del mes con demora y con error, cambio de tamaño y de toppings (sin indicador), que las burbujas `+1` y la insignia del sabor del mes siguen visibles sobre el indicador y el mensaje, y agregar al carrito en estado de error. Revisar también el wizard móvil a 390 px.

## 5. Helado Hope v1

- [x] 5.1 Reemplazar en `assets/toppings-customizer.js` `setPreviewImage` y la asignación directa de `setPreview` (pestañas y arranque) por el controlador, dejando de poner `is-loading` en la imagen y conservando la precarga de combinaciones; camino directo de respaldo. Verificar con `node --check`.
- [x] 5.2 Quitar de `assets/toppings-customizer.css` la regla `.hopecfg__cup.is-loading` que ya no se usa. Verificar con `rg` que no quedan referencias.
- [x] 5.3 Verificar con Playwright la página del template `helado-personalizado`. Cerrada como no verificable por completo (decisión del usuario, 2026-11-19): ningún producto usa ese template y solo se alcanza con `?view=helado-personalizado`, donde no hay pestañas ni precio. Verificado ahí: primera carga, cambio con demora (imagen atenuada + indicador), mensaje ante error, Reiniciar y que la clase `is-loading` ya no se pone en la imagen. Sin verificar: cambio de pestaña y agregar al carrito.

## 6. Limpieza e integración

- [x] 6.1 Eliminar las reglas duplicadas del spinner del escenario en `assets/hope-customizer-v2.css` y `assets/milkshake-customizer.css` (sin tocar `.ms__thumb`). Verificar con `rg` que el spinner del escenario tiene un único dueño y que los cuatro armadores lo siguen mostrando.
- [x] 6.2 Verificar accesibilidad en los cuatro armadores: el mensaje se anuncia una vez por fallo sin mover el foco (árbol de accesibilidad / lector de pantalla), `aria-busy` se quita al terminar, el indicador no gira con movimiento reducido emulado, y el mensaje se lee completo a 375 px sin scroll horizontal.
- [x] 6.3 Verificar el caso de tiempo límite con el reloj simulado: una imagen que nunca responde pasa de indicador a mensaje a los 15 s en un armador de cada tipo de carga (Barquilla y Milkshake).
- [x] 6.4 Ejecutar Theme Check final y `openspec validate armadores-carga-vista-previa --strict`; ambos sin hallazgos en los archivos del cambio.
- [x] 6.5 Tras publicar, repetir en hopeheladeria.com una pasada corta por los cuatro armadores (carga normal, cambio de selección y agregar al carrito) y vaciar el carrito de prueba.

## Workflow follow-up

- Publicar con commit + push a `main`, un grupo por commit, con confirmación previa del usuario (publica en vivo).
- Archivar el cambio una vez verificado en vivo.
