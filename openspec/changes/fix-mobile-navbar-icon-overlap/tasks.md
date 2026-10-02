# Tasks

## 1. Distribución y espaciado móvil

- [x] 1.1 Reproducir el solapamiento en `shopify theme dev` con visitante sin sesión y cuentas/búsqueda habilitadas; guardar captura y rectángulos de controles a 320 y 390 px como evidencia inicial.
- [x] 1.2 Ajustar la grilla móvil en `sections/header.liquid` para reservar ambas áreas derechas a cuenta/carrito según presencia real de `.account-button` y ubicar búsqueda en el área disponible; verificar controles visibles sin intersecciones a 320, 360, 375, 390, 414 y 749 px mediante Playwright.
- [x] 1.3 Neutralizar márgenes negativos móviles del grupo de acciones, evitar compresión de botones y acotar el logo al centro flexible; verificar áreas táctiles mínimas de 44 × 44 px, logo centrado, separación visible y ausencia de desbordamiento, con vidrio activado y desactivado; guardar capturas y mediciones en la carpeta de verificación del cambio.

## 2. Compatibilidad del navbar

- [x] 2.1 Verificar la integración con cuenta autenticada/avatar, editor, cuentas desactivadas y búsqueda desactivada, incluyendo estado sticky tras scroll; registrar por variante los controles visibles, ausencia de duplicados y geometría. Documentar cualquier limitación de acceso a sesión real.
- [x] 2.2 Comprobar por separado modal de búsqueda, destino de cuenta sin sesión, drawer de cuenta con sesión, menú y carrito, conservando etiquetas accesibles; registrar resultados y cualquier variante no verificable.
- [x] 2.3 Comparar capturas antes/después a 750 y 1280 px y ejecutar `shopify theme check`; documentar que escritorio conserva su distribución y separar errores previos de los introducidos por el cambio en el reporte de verificación.
