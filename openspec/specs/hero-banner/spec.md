# Hero Banner

## Purpose

Define cómo la sección Hero Banner Helados presenta su imagen de fondo y su contenido en escritorio y móvil para que el sujeto de la imagen se vea bien, el texto sea siempre legible y el ancho útil en móvil se aproveche.

## Requirements

### Requirement: Margen lateral único en móvil

En anchos de 320 a 768 px, el contenido del hero (textos y botón) SHALL quedar separado de los bordes del viewport solo por el margen de página del tema (16 px por lado), sin padding horizontal adicional de la sección y sin un ancho mínimo fijo que fuerce su centrado o desbordamiento. El contenido SHALL NOT provocar desplazamiento horizontal.

#### Scenario: Texto alineado a la izquierda
- **WHEN** un visitante ve un hero con texto alineado a la izquierda a 360, 390 o 430 px
- **THEN** el borde izquierdo del texto queda a 16 px (±1 px) del borde del viewport y el bloque de texto puede ocupar hasta 16 px del borde derecho

#### Scenario: Texto alineado a la derecha
- **WHEN** un visitante ve un hero con texto alineado a la derecha a 390 px
- **THEN** el borde derecho del texto queda a 16 px (±1 px) del borde del viewport

#### Scenario: Pantalla muy angosta
- **WHEN** un visitante ve cualquier hero a 320 px
- **THEN** el documento no presenta desplazamiento horizontal y ningún texto se recorta

### Requirement: Posición controlada de la imagen de fondo

La imagen de fondo SHALL cubrir la sección y su encuadre SHALL seguir, en este orden de prioridad: el ajuste de posición del breakpoint activo cuando el comerciante lo elige; si no, el punto focal definido en Shopify para esa imagen; si no, el centro. La imagen móvil SHALL reemplazar a la de escritorio en anchos de 768 px o menos cuando está configurada.

#### Scenario: Punto focal definido en Shopify
- **WHEN** la imagen de fondo tiene un punto focal definido en el admin y la posición está en "Automática (punto focal)"
- **THEN** el recorte de la imagen mantiene visible ese punto en cualquier ancho

#### Scenario: Posición manual en móvil
- **WHEN** el comerciante elige una posición móvil distinta de la automática (por ejemplo "Derecha")
- **THEN** en 768 px o menos la imagen se encuadra con esa posición y en escritorio se mantiene la posición de escritorio

#### Scenario: Altura según la imagen en móvil
- **WHEN** el tipo de altura móvil es "Según la imagen"
- **THEN** en 768 px o menos la sección toma la relación de aspecto de la imagen móvil (o de la de escritorio si no hay móvil) y la imagen se ve completa sin recorte

#### Scenario: Sin imagen de fondo
- **WHEN** la sección no tiene imagen de fondo
- **THEN** se muestra solo el color de fondo y no se solicita ninguna imagen

### Requirement: Posición del contenido por breakpoint

El comerciante SHALL poder ubicar el bloque de contenido en una de nueve zonas (izquierda / centro / derecha × arriba / medio / abajo) de forma independiente para escritorio y para móvil. Los valores guardados de posición vertical existentes SHALL seguir aplicándose sin intervención.

#### Scenario: Instancia existente
- **WHEN** una instancia guardada antes del cambio tiene posición vertical móvil "Abajo" y no tiene posición horizontal definida
- **THEN** el contenido se ubica abajo en móvil y horizontalmente según la alineación de sus bloques, como antes

#### Scenario: Zona móvil distinta de escritorio
- **WHEN** el comerciante elige "Derecha / Arriba" en escritorio y "Izquierda / Abajo" en móvil
- **THEN** el contenido aparece en cada zona en su breakpoint respectivo

### Requirement: Protección de contraste del texto

La sección SHALL ofrecer una protección de contraste configurable entre: ninguna, velo en degradado y velo sólido, con color y opacidad elegibles por el comerciante, y opcionalmente una sombra de texto. El velo en degradado SHALL ser más intenso en la zona donde está el contenido y desvanecerse hacia el lado opuesto, siguiendo la zona activa en cada breakpoint. El velo SHALL quedar entre la imagen y el contenido, sin capturar clics ni afectar la lectura por lectores de pantalla.

#### Scenario: Degradado siguiendo al texto
- **WHEN** la protección es "Degradado" y el contenido está a la izquierda en móvil
- **THEN** el velo es más opaco en el lado izquierdo y transparente hacia la derecha; si en escritorio el contenido está abajo, el velo es más opaco abajo

#### Scenario: Legibilidad mínima en las instancias de la tienda
- **WHEN** se revisan a 360, 390 y 430 px los heros de inicio, cómo comprar y contacto después del cambio
- **THEN** cada texto del hero tiene un contraste de al menos 4.5:1 (3:1 para textos de 24 px o más) contra el fondo efectivo muestreado detrás de él, y no se superpone al sujeto principal de la imagen
- **AND** queda exceptuado por decisión de marca el texto "TU HOPE?" del primer hero de cómo comprar (color #c2457f, 20 px en móvil, ~2.7:1 en móvil y ~3.1:1 en escritorio)

#### Scenario: Protección desactivada
- **WHEN** la protección es "Ninguna" y la sombra de texto está desactivada
- **THEN** la sección se ve igual que una imagen sin velo, sin capas adicionales visibles

### Requirement: Carga eficiente de la imagen de fondo

La imagen de fondo SHALL servirse en un tamaño acorde al ancho renderizado (variantes responsivas con dimensiones intrínsecas) y solo SHALL descargarse la imagen del breakpoint activo. Cuando el hero es la primera sección de la página, su imagen SHALL cargarse con prioridad; en otro caso SHALL cargarse de forma diferida.

#### Scenario: Primer hero de la portada en móvil
- **WHEN** un visitante abre la portada a 390 px
- **THEN** se descarga solo la imagen móvil del primer hero, en una variante de ancho cercano al renderizado, con prioridad alta

#### Scenario: Hero más abajo en la página
- **WHEN** el hero no es la primera sección
- **THEN** su imagen se carga de forma diferida
