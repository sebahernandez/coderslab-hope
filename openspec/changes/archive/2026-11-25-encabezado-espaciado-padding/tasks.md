# Tasks

## 1. CSS del encabezado

- [x] 1.1 En `sections/header.liquid`, reemplazar `margin-block-start` de `.header:not([transparent]) .header__row--top` por `padding-block-start: var(--glass-float-margin, 0px)` sobre `.header:not([transparent])`; verificar en el navegador que la cápsula conserva su distancia al borde superior.
- [x] 1.2 Reemplazar `margin-block-end` de la última fila por `padding-block-end: var(--header-margin-block-end, 0px)` sobre `.header:not([transparent])`; verificar con margen inferior 20 px que el espacio queda dentro del header (DevTools: el box de `.header` lo incluye).
- [x] 1.3 Confirmar que `.header` no pinta fondo propio sin franja (el padding debe verse transparente) y actualizar el comentario de `.header--band` / `display: flow-root`; verificar leyendo el CSS resultante.
- [x] 1.4 Ejecutar `shopify theme check` sobre `sections/header.liquid` y resolver hallazgos válidos.

## 2. Verificación visual

- [x] 2.1 En preview, sin franja y margen superior 12 px: comprobar que `--header-height` en `body` incluye los 12 px y que nada externo se desplaza.
- [x] 2.2 Con franja activa: comprobar que la franja cubre desde el borde superior del viewport hasta el borde inferior del encabezado y la primera sección empieza justo debajo.
- [x] 2.3 Con glassmorphism desactivado y en móvil (375 px): comprobar posición de la barra y alineación de `.hopecfg` con el navbar.
