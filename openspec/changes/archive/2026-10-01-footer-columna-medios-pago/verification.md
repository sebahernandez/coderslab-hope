# Verification

## Resultado

Implementación completada: 6/6 tareas. La columna Medios de pago aparece después de Horario y sus bloques ofrecen nombre editable e image_picker. Se preservó la configuración completa que existía al comenzar, incluyendo los ajustes previos del usuario en Ubicación y Horario.

## Comprobaciones

- `shopify theme check --output json`: 39 errores y 90 advertencias preexistentes; comparación de incidencias con el baseline confirma cero incidencias nuevas o eliminadas. Ninguna incidencia en los archivos del cambio.
- `openspec validate footer-columna-medios-pago --strict`: válido.
- `git diff --check`: sin errores.
- Preview real mediante `shopify theme dev`, comprobado con Playwright en inicio y `/products/helado-hope`, a 320, 390, 749, 750, 1024, 1280 y 1440 px, sin imágenes y con tres imágenes de prueba de Shopify: 28 casos aprobados. Sin desbordamiento del footer; cinco columnas en una fila a 1440 px y apilado ordenado por debajo de 750 px.
- Imágenes de prueba: icon-fruit-01.png, icon-fruid-02.png e icon-vegan-01.png, ya disponibles en Shopify. Carga correcta, nombres accesibles, object-fit contain y límites de 120 × 48 px.
- Reordenamiento Stripe → Pago Móvil → Zelle y sustitución individual de Zelle por todos-aman-hope.avif: dos casos aprobados, a 1440 y 390 px; las otras selecciones permanecieron intactas.
- Capturas y medidas en `verification/`. Los scripts utilizan Playwright y Chromium del entorno local y requieren adaptar esas rutas en otro equipo.

## Configuración pendiente

No había un navegador conectado para operar una sesión del editor. Se verificó el render de configuraciones guardadas mediante archivos del tema y su sincronización al preview; no se verificó una interacción real de guardar desde la UI del editor. Se aplicó la alternativa prevista en la tarea 3.1: imágenes de prueba. Las imágenes temporales fueron retiradas y los selectores quedaron vacíos, con los nombres Stripe, Zelle y Pago Móvil visibles.

Para elegir los logos definitivos: editor de Shopify → Footer → Medios de pago → Stripe / Zelle / Pago Móvil → Imagen del medio de pago → seleccionar stripe / zelle / pago-movil → Guardar. Los bloques pueden reordenarse dentro del grupo.

## Entrega y reversión

Cambios sincronizados al tema de desarrollo; sin publicación al tema activo. Para revertir esta unidad, eliminar el grupo group_medios_pago y su entrada en block_order de sections/footer-group.json, retirar el bloque blocks/hope-payment-method.liquid y los estilos y registro añadidos en sections/footer.liquid. Conservar las modificaciones previas del usuario en otros archivos y en los bloques originales del footer.

## Ajuste posterior: logos en fila

La columna presenta los tres logos en una misma fila, con gap de 12 px y padding lateral de 8 px. A partir de 1200 px recibe una fracción mayor del ancho disponible; entre 750 y 1199 px ocupa dos columnas de la grilla. Se conservaron las imágenes seleccionadas y el ajuste de horario existente al comenzar esta corrección.

Playwright: 14 casos aprobados en inicio y producto a 320, 390, 749, 750, 1024, 1280 y 1440 px, con logos reales Stripe, Zelle y Pago Móvil. Se comprobó alineación horizontal, separación mínima de 12 px, imágenes cargadas y ausencia de desbordamiento. Theme Check: cero incidencias nuevas. Capturas y medidas en verification/horizontal-*.
