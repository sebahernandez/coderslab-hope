# Video Hope modal

## Purpose

Define cómo la sección "Video Hope modal" muestra una imagen con botón de play que reproduce un video en una ventana modal, junto a bloques configurables de título, texto y tarjetas de atributo.

## Requirements

### Requirement: Imagen estática con botón de play

La sección SHALL mostrar una imagen estática (con imagen móvil opcional para anchos de 749 px o menos) y, cuando hay un video configurado, un botón de play centrado sobre ella. Sin video configurado, el botón MUST NOT renderizarse. Sin imagen, SHALL mostrarse un placeholder.

#### Scenario: Imagen y video configurados
- **WHEN** la sección tiene imagen y video
- **THEN** se ve la imagen con un botón de play centrado

#### Scenario: Sin video
- **WHEN** la sección tiene imagen pero no video
- **THEN** se ve solo la imagen, sin botón de play

### Requirement: Reproducción en ventana modal

Al activar el botón de play SHALL abrirse una ventana modal que reproduce el video automáticamente. El video SHALL poder ser un archivo subido a Shopify o una URL de YouTube o Vimeo. Al cerrar la modal la reproducción MUST detenerse.

#### Scenario: Abrir video subido
- **WHEN** el visitante pulsa play y el video es un archivo de Shopify
- **THEN** se abre la modal y el video comienza a reproducirse con controles

#### Scenario: Abrir video de YouTube
- **WHEN** el visitante pulsa play y el video es una URL de YouTube
- **THEN** se abre la modal con el reproductor de YouTube reproduciendo

#### Scenario: Cerrar detiene el video
- **WHEN** el video se reproduce y el visitante cierra la modal
- **THEN** el sonido y la reproducción se detienen

### Requirement: Accesibilidad de la modal

El botón de play SHALL tener nombre accesible. La modal SHALL cerrarse con la tecla Escape, con un botón de cerrar con nombre accesible y al hacer clic fuera del video; mientras está abierta el foco MUST quedar contenido en ella y al cerrarse SHALL volver al botón de play.

#### Scenario: Cerrar con Escape
- **WHEN** la modal está abierta y el visitante pulsa Escape
- **THEN** la modal se cierra y el foco vuelve al botón de play

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
