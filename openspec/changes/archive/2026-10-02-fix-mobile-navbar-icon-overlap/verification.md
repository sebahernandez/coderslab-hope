# Verification

## Results

- Se reprodujo el defecto en la vista previa local de Shopify: búsqueda y cuenta ocupaban idénticos rectángulos de 44 × 44 px para visitantes sin sesión. Evidencia en `verification/before-results.json` y capturas `before-*.png`.
- Corrección concentrada en el CSS móvil de `sections/header.liquid`: grupo de acciones reserva ambas columnas cuando contiene cuenta; búsqueda usa el espacio izquierdo; margen negativo neutralizado; menú de 44 × 44 px; centro y logo adaptables; padding simétrico.
- `node /private/tmp/hope-navbar-verify.cjs`: PASS, 96 mediciones. Se verificaron 320, 360, 375, 390, 414 y 749 px, vidrio activado/desactivado, visitante, cuenta eliminada, búsqueda eliminada y wrapper de drawer con avatar simulado; cada combinación antes/después de scroll a 200 px. Áreas táctiles mínimas de 44 × 44 px, controles contenidos en el panel, logo centrado y sin intersecciones. Script conservado en `verification/navbar-verify.cjs`; resultados en `verification/matrix-results.json`.
- Búsqueda abre su modal; menú abre el drawer; carrito abre su diálogo. Cuenta sin sesión conserva el enlace de login personalizado y su etiqueta accesible. No se inició sesión en el servicio externo.
- Medidas de logo, búsqueda, cuenta, panel y header a 750 y 1280 px idénticas antes/después. Capturas en `verification/`.
- `shopify theme check --output json`: antes y después, 39 errores y 90 advertencias. Mismos diagnósticos por archivo, tipo, severidad y mensaje; el comando devuelve 1 por errores existentes. No se introdujeron diagnósticos nuevos. Reportes completos en `verification/theme-check-*.json`.
- `git diff --check`: PASS.

## Limitations

Las variantes de cuentas/búsqueda desactivadas y drawer con avatar se probaron mediante modificaciones temporales del DOM del navegador, sin modificar configuración de la tienda. No se dispone de sesión autenticada ni editor real, por lo que la apertura del drawer de cuenta autenticada y el editor no se verificaron de extremo a extremo; se conserva su Liquid y JavaScript.

La portada ya tenía un ancho desplazable de 331 px en viewport de 320 px, originado en `.hero-banner-text`. El navbar corregido permanece dentro de su panel de 296 px y no añade desbordamiento. El banner está fuera del alcance de este cambio.

## Rollback

Revertir únicamente el bloque de CSS móvil modificado en `sections/header.liquid` restaura la distribución anterior. No hay cambios de datos ni dependencias. La implementación se verificó inicialmente en un tema de desarrollo. El 2026-10-02 se publicó únicamente `sections/header.liquid` en Horizon Production (151215276284), con autorización explícita del usuario. Shopify confirmó role live y carga completa; la descarga posterior del archivo live coincide byte por byte con el archivo local.
