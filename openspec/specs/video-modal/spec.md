# Video Hope modal

## Purpose

Define cómo la sección "Video Hope modal" reproduce un video en línea (automático, silenciado y en loop) dentro de un recuadro redondeado, junto a bloques configurables de título, texto y tarjetas de atributo.

## Requirements

### Requirement: Contenido como bloques

El contenido junto a la media SHALL componerse de bloques que el comerciante agrega, ordena y elimina: título, texto y tarjeta de atributo. Cada bloque SHALL tener sus propios ajustes de texto, tamaño y color, con tamaño móvil independiente.

#### Scenario: Reordenar bloques
- **WHEN** el comerciante mueve el bloque de texto encima del título
- **THEN** la sección muestra el texto primero

### Requirement: Tarjetas de atributo configurables

Cada tarjeta de atributo SHALL tener icono (imagen subida o código SVG, con prioridad del SVG), título, descripción, color de fondo, color de fondo del icono, color del icono y colores de título y descripción propios. Las tarjetas SHALL disponerse en una grilla con columnas configurables para escritorio y móvil.

#### Scenario: Colores distintos por tarjeta
- **WHEN** una tarjeta tiene fondo rosa y otra fondo amarillo
- **THEN** cada tarjeta muestra su propio fondo sin afectar a las demás

#### Scenario: Icono SVG
- **WHEN** una tarjeta tiene código SVG que usa currentColor y color de icono vino
- **THEN** el icono se ve en color vino

### Requirement: Layout responsive

En anchos mayores a 749 px la media y el contenido SHALL mostrarse en dos columnas, con el lado de la media configurable. En 749 px o menos SHALL apilarse con orden de la media configurable. La sección MUST NOT generar scroll horizontal y los padding, separaciones y tamaños SHALL tener valores móviles independientes.

#### Scenario: Vista móvil
- **WHEN** la sección se ve a 390 px
- **THEN** la imagen y el contenido se apilan, las tarjetas usan las columnas móviles configuradas y no hay scroll horizontal

### Requirement: Resolución máxima de la imagen

La imagen SHALL ofrecer al navegador versiones hasta el ancho original del archivo subido, incluido ese ancho, sin pedir anchos mayores que el original.

#### Scenario: Pantalla de alta densidad
- **WHEN** la imagen subida mide 684 px de ancho y se ve en una pantalla retina
- **THEN** el navegador carga la versión de 684 px

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
