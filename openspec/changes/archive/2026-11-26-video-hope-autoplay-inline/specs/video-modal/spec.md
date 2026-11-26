## ADDED Requirements

### Requirement: Video en línea con reproducción automática

Cuando hay un video configurado (archivo subido a Shopify o URL de YouTube o Vimeo), la sección SHALL mostrarlo dentro del recuadro de la media, ocupando toda su superficie, con reproducción automática, silenciado, en loop infinito y sin controles visibles. La sección MUST NOT renderizar botón de play ni ventana modal.

#### Scenario: Video subido
- **WHEN** la sección tiene un video subido a Shopify y el visitante carga la página
- **THEN** el video se reproduce solo, sin sonido, dentro del recuadro y sin controles

#### Scenario: Loop infinito
- **WHEN** el video llega a su final
- **THEN** vuelve a empezar automáticamente sin intervención del visitante

#### Scenario: Video de YouTube o Vimeo
- **WHEN** la sección tiene una URL de YouTube o Vimeo
- **THEN** el video se reproduce silenciado y en loop dentro del recuadro, sin abrir una modal

#### Scenario: Reproducción en móvil
- **WHEN** la sección se ve en un iPhone a 390 px
- **THEN** el video se reproduce en línea dentro del recuadro, sin pasar a pantalla completa

### Requirement: Recuadro del video con bordes redondeados

El recuadro del video SHALL respetar el radio de borde y la proporción configurados en la sección. El video MUST llenar el recuadro recortándose si su proporción difiere, sin franjas negras y sin sobresalir de las esquinas redondeadas.

#### Scenario: Radio por defecto de la home
- **WHEN** la sección tiene radio de borde 24 px y proporción 3:2
- **THEN** el video se ve con las cuatro esquinas redondeadas a 24 px y llena el recuadro 3:2

#### Scenario: Video 16:9 en recuadro cuadrado
- **WHEN** el video es 16:9 y la proporción configurada es cuadrada
- **THEN** el video se recorta a los lados y llena el recuadro sin franjas

### Requirement: Imagen como poster y reemplazo

Con un video subido configurado, la imagen de la sección (con su variante móvil) SHALL usarse solo como fotograma de espera mientras el video carga y MUST NOT mostrarse encima ni junto al video. Sin video configurado, SHALL mostrarse la imagen estática; sin imagen ni video, un placeholder.

#### Scenario: Video cargando
- **WHEN** el video subido aún no empezó a reproducirse
- **THEN** el recuadro muestra la imagen configurada como poster

#### Scenario: Sin video
- **WHEN** la sección tiene imagen pero no video
- **THEN** se ve solo la imagen estática con el radio configurado, sin botón

### Requirement: Respeto de la preferencia de reducir movimiento

Si el visitante tiene activada la preferencia del sistema de reducir movimiento, el video subido MUST NOT reproducirse automáticamente y el recuadro SHALL mostrar el poster.

#### Scenario: Reducir movimiento activo
- **WHEN** el visitante tiene `prefers-reduced-motion: reduce` y carga la página
- **THEN** el recuadro muestra la imagen poster y el video no avanza

### Requirement: Video decorativo para tecnologías de asistencia

El video en línea SHALL tratarse como decorativo: MUST NOT recibir foco con el teclado ni ser anunciado por lectores de pantalla como un control interactivo.

#### Scenario: Navegación con teclado
- **WHEN** el visitante recorre la sección con la tecla Tab
- **THEN** el foco pasa del contenido anterior al siguiente sin detenerse en el video



### Requirement: Overlay del recuadro del video

El recuadro de la media SHALL poder mostrar un overlay configurable (activable, color, opacidad y degradado en los bordes superior e inferior, activo por defecto) sobre el video o la imagen. El recuadro MUST NOT reaccionar al clic, al hover ni al foco.

#### Scenario: Overlay por defecto
- **WHEN** el comerciante agrega la sección sin cambiar ajustes
- **THEN** el video muestra un velo oscuro suave con bordes superior e inferior más oscuros

#### Scenario: Overlay desactivado
- **WHEN** el comerciante desactiva "Mostrar overlay"
- **THEN** el video se ve sin velo

#### Scenario: Clic en el video
- **WHEN** el visitante hace clic sobre el recuadro del video
- **THEN** no se abre ninguna modal y el video sigue reproduciéndose

## REMOVED Requirements

### Requirement: Imagen estática con botón de play

**Reason**: El video se reproduce automáticamente en el recuadro; ya no existe botón de play.
**Migration**: Cubierto por "Video en línea con reproducción automática" e "Imagen como poster y reemplazo".

### Requirement: Reproducción en ventana modal

**Reason**: Se elimina la modal; el video se ve en línea.
**Migration**: Cubierto por "Video en línea con reproducción automática".

### Requirement: Accesibilidad de la modal

**Reason**: Sin modal no hay foco contenido, Escape ni botón de cerrar.
**Migration**: Cubierto por "Video decorativo para tecnologías de asistencia" y "Respeto de la preferencia de reducir movimiento".

### Requirement: Modal centrada en el viewport

**Reason**: Se elimina la modal.
**Migration**: Ninguna; el video vive en el layout de la sección.

### Requirement: Overlay de la imagen del video

**Reason**: El overlay ya no cubre una miniatura clicable; se reemplaza por un overlay sobre el video sin interacción.
**Migration**: Cubierto por "Overlay del recuadro del video"; los ajustes de overlay existentes se conservan.
