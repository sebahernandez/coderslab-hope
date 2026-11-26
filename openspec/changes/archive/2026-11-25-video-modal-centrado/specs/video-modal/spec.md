# Spec Delta

## ADDED Requirements

### Requirement: Modal centrada en el viewport

Mientras está abierta, la ventana modal del video SHALL quedar centrada vertical y horizontalmente en el viewport en cualquier ancho y orientación de pantalla, también al terminar la animación de apertura. El video MUST verse completo dentro del viewport, sin recortarse ni generar scroll.

#### Scenario: Escritorio
- **WHEN** el visitante abre la modal en una pantalla de 1440 × 900 px
- **THEN** la modal queda centrada con el mismo espacio arriba y abajo

#### Scenario: Móvil vertical
- **WHEN** el visitante abre la modal en una pantalla de 390 × 844 px
- **THEN** la modal queda centrada verticalmente y no pegada al borde superior

#### Scenario: Móvil horizontal
- **WHEN** el visitante abre la modal en una pantalla de 844 × 390 px
- **THEN** la modal queda centrada y el video 16:9 se ve completo sin scroll

#### Scenario: Después de la animación
- **WHEN** la animación de apertura termina
- **THEN** la modal permanece centrada, sin desplazarse hacia arriba

### Requirement: Overlay de la imagen del video

La imagen con botón de play SHALL poder mostrar un overlay configurable (activable, color, opacidad y degradado en los bordes superior e inferior, activo por defecto). Toda la superficie de la imagen SHALL abrir el video al hacer clic, y al pasar el puntero o enfocar SHALL dar respuesta visual sin desplazar el layout.

#### Scenario: Overlay por defecto
- **WHEN** el comerciante agrega la sección sin cambiar ajustes
- **THEN** la imagen muestra un velo oscuro suave con bordes superior e inferior más oscuros

#### Scenario: Clic fuera del botón circular
- **WHEN** el visitante hace clic en una esquina de la imagen
- **THEN** se abre la modal del video

### Requirement: Resolución máxima de la imagen

La imagen SHALL ofrecer al navegador versiones hasta el ancho original del archivo subido, incluido ese ancho, sin pedir anchos mayores que el original.

#### Scenario: Pantalla de alta densidad
- **WHEN** la imagen subida mide 684 px de ancho y se ve en una pantalla retina
- **THEN** el navegador carga la versión de 684 px
