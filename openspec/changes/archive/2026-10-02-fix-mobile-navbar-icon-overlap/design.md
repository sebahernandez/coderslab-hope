# Design

## Context

Ver `proposal.md` para la motivación. En `sections/header.liquid`, las columnas se convierten en `display: contents` en móvil y sus hijos se posicionan sobre cinco áreas con extremos de 44 px. `header-actions` ocupa únicamente `rightB`, aunque contiene cuenta y carrito; además recibe un margen inicial negativo desde `snippets/header-actions.liquid`.

La búsqueda cambia a `rightA` cuando no existe `.account-actions`. Para un visitante sin sesión, `header-actions` renderiza directamente el enlace de cuenta y ese selector no refleja la presencia real del botón. Es una causa probable identificada por lectura de código; el solapamiento reportado aún no se ha reproducido visualmente durante esta planificación.

El tema define `--minimum-touch-target: 44px`. El panel de vidrio añade márgenes y padding propios en móvil. `header-group.json` habilita búsqueda a la derecha en la fila superior. Las especificaciones existentes de cuenta y drawers no cubren la geometría del navbar.

## Goals / Non-Goals

**Goals:** Resolver la asignación de espacio según los controles realmente renderizados, con reglas deterministas de CSS móvil y compatibilidad con el panel de vidrio.

**Non-Goals:** Cambiar destinos de cuenta, listeners, iconos, configuración comercial, contenido de drawers o distribución de escritorio.

## Decisions

1. Mantener la grilla móvil, reservando al grupo cuenta/carrito las dos áreas derechas cuando la cuenta esté presente y ubicando búsqueda junto al menú a la izquierda. Conservar ambas reservas laterales equilibradas para centrar el logo. Con cuentas desactivadas, búsqueda puede ocupar `rightA` y carrito `rightB`. Detectar la presencia real del control `.account-button`, en lugar del contenido interno `.account-actions`. Esto evita que el estado de sesión determine accidentalmente el espacio. Alternativa descartada: reposicionar iconos con offsets absolutos, que no resuelve las áreas táctiles.
2. Neutralizar el margen negativo de `header-actions` solo en móvil y asegurar que sus hijos no se compriman. Usar los tokens existentes de tamaño y espaciado; no reducir las áreas táctiles para ganar ancho. Alternativa descartada: aplicar cambios globales a los botones, que afectaría escritorio y otros contextos.
3. Dar al centro una pista flexible que pueda contraerse y acotar el ancho del logo manteniendo su proporción si el espacio disponible lo requiere. Preservar márgenes interiores y flotantes del panel de vidrio. Alternativa descartada: ocultar búsqueda o cuenta en pantallas estrechas, que incumple la solicitud.
4. Validar geometría sobre controles visibles, no sobre wrappers de diálogos ni la búsqueda oculta de escritorio. Medir rectángulos de botones, logo y panel y acompañarlos de capturas y pruebas de interacción.

## Risks / Trade-offs

- [Logo grande a 320 px con panel flotante] → Acotar su ancho disponible antes de comprimir controles; verificar proporción y centrado.
- [Distintas variantes de cuenta alteran el DOM] → Cubrir enlace sin sesión, drawer autenticado, editor y cuentas desactivadas.
- [Cascada del panel de vidrio o header sticky] → Verificar estilos computados, antes y después de scroll, con vidrio activado y desactivado.
- [Sin infraestructura de tests de UI localizada] → Verificación focalizada con Playwright contra `shopify theme dev`, registrando capturas y mediciones; indicar explícitamente cualquier variante no verificable por falta de sesión.

## Migration Plan

Aplicar los estilos en el tema local y completar la matriz de verificación antes de publicar. No hay migración de datos. Un despliegue posterior seguirá el flujo habitual del tema; revertir los cambios de CSS restaura el layout anterior.
