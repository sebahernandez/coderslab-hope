## ADDED Requirements

### Requirement: Reserva única de la altura del encabezado

La altura del encabezado SHALL reservarse una sola vez sobre el contenido de la página. Cuando el encabezado ya reserva su altura en el flujo, las páginas sin hero (armadores de producto, carrito, listado de colecciones y políticas) MUST NOT volver a sumarla y SHALL añadir solo su separación propia. Cuando el encabezado es fijo y no reserva espacio, esas páginas SHALL compensar su altura completa.

#### Scenario: Armador con franja y glassmorphism

- **WHEN** el encabezado tiene franja y glassmorphism activos, mide 94 px y se abre `/products/helado-hope` en 1440 × 900
- **THEN** la tarjeta del armador empieza 16 px debajo del borde inferior del encabezado, no 110 px

#### Scenario: Carrito y listado de colecciones

- **WHEN** el encabezado tiene franja y glassmorphism activos y se abre `/cart` o `/collections`
- **THEN** el contenido empieza a la separación propia de la página (20 px) bajo el encabezado, sin la altura del encabezado sumada de nuevo

#### Scenario: Páginas de políticas

- **WHEN** el encabezado tiene franja y glassmorphism activos y se abre una página `/policies/*`
- **THEN** el contenedor de la política empieza a su separación propia (32 px) bajo el encabezado

#### Scenario: Glassmorphism sin franja

- **WHEN** el glassmorphism está activo, la franja desactivada y se abre cualquiera de esas páginas
- **THEN** el contenido no queda tapado por el encabezado y empieza a la misma distancia que antes del cambio

#### Scenario: Armador completo en pantalla

- **WHEN** se abre un armador en un viewport de al menos 540 px de alto con franja y glassmorphism activos
- **THEN** la tarjeta cabe completa entre el borde inferior del encabezado y el borde inferior del viewport, sin scroll de página
