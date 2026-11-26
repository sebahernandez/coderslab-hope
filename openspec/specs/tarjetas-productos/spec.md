# Tarjetas de productos

## Purpose

Define cómo la sección "Tarjetas de productos" muestra una vitrina de tarjetas independientes, cada una con imagen, textos y botón configurables por separado y con ajustes propios para móvil.

## Requirements

### Requirement: Tarjetas como bloques independientes

La sección SHALL renderizar una tarjeta por cada bloque de tarjeta, en el orden guardado por el comerciante. Cada tarjeta SHALL poder agregarse, reordenarse, ocultarse y eliminarse desde el editor sin afectar a las demás.

#### Scenario: Reordenar tarjetas
- **WHEN** el comerciante mueve la tarjeta "Barquilla" a la primera posición
- **THEN** la vitrina muestra "Barquilla" primero y el resto conserva su orden relativo

#### Scenario: Sección sin tarjetas
- **WHEN** la sección no tiene bloques de tarjeta
- **THEN** solo se muestra el título de la sección si está configurado, sin grilla vacía

### Requirement: Imagen personalizada o del producto

Cada tarjeta SHALL mostrar la imagen personalizada si está configurada; si no, la imagen destacada del producto seleccionado; si no hay ninguna, un placeholder. Una imagen móvil opcional SHALL reemplazar a la principal en anchos de 749 px o menos.

#### Scenario: Solo producto seleccionado
- **WHEN** una tarjeta tiene producto "Milkshake" y no tiene imagen personalizada
- **THEN** la tarjeta muestra la imagen destacada de Milkshake

#### Scenario: Imagen personalizada con producto
- **WHEN** una tarjeta tiene producto e imagen personalizada
- **THEN** la tarjeta muestra la imagen personalizada

#### Scenario: Imagen móvil
- **WHEN** una tarjeta tiene imagen móvil y se ve a 390 px
- **THEN** se muestra la imagen móvil

### Requirement: Contenido heredado del producto

El título, el texto y el enlace del botón de cada tarjeta SHALL usar el valor escrito por el comerciante cuando existe; si está vacío y hay un producto seleccionado, SHALL usar el título, la descripción resumida y la URL del producto respectivamente.

#### Scenario: Título vacío con producto
- **WHEN** el título de la tarjeta está vacío y el producto es "Mixo Hope"
- **THEN** la tarjeta muestra "Mixo Hope" como título

#### Scenario: Enlace del botón vacío
- **WHEN** el enlace del botón está vacío y hay producto seleccionado
- **THEN** el botón lleva a la página del producto

#### Scenario: Sin producto ni contenido
- **WHEN** título y texto están vacíos y no hay producto
- **THEN** esos elementos no se renderizan

### Requirement: Estilos independientes por tarjeta

Cada tarjeta SHALL tener sus propios ajustes de color de fondo, color y tamaño de título y texto, padding, margin, radio de esquinas de la tarjeta y de la imagen, y proporción de imagen. Cambiar los ajustes de una tarjeta MUST NOT alterar las demás.

#### Scenario: Color de título distinto
- **WHEN** el comerciante cambia el color del título solo en la tarjeta "Helado Hope"
- **THEN** solo esa tarjeta cambia el color de su título

### Requirement: Botón configurable por tarjeta

Cada tarjeta SHALL ofrecer un botón opcional con texto, enlace, estilo (relleno o contorno), colores de fondo, texto y borde, colores en hover, radio, tamaño, tamaño de fuente en escritorio y en móvil, grosor de fuente, ancho completo en móvil e icono de flecha opcional. Sin texto de botón, el botón MUST NOT renderizarse.

#### Scenario: Botón de contorno con flecha
- **WHEN** el botón tiene estilo contorno, texto "Arma tu mixo" y flecha activada
- **THEN** se muestra un botón con borde, el texto y una flecha a continuación

#### Scenario: Botón sin texto
- **WHEN** el texto del botón está vacío
- **THEN** la tarjeta no muestra botón

#### Scenario: Tamaño de fuente del botón por dispositivo
- **WHEN** el comerciante configura el texto del botón en 18 px para escritorio y 16 px para móvil
- **THEN** el botón muestra su texto a 18 px a 1280 px y a 16 px a 390 px

#### Scenario: Tarjeta existente sin ajustes nuevos
- **WHEN** una tarjeta guardada antes de este cambio se muestra sin que el comerciante la edite
- **THEN** el botón conserva su tamaño de fuente según el tamaño elegido (pequeño, mediano o grande)

### Requirement: Hover del botón sin negro por defecto

Cuando la tarjeta no tiene colores de hover configurados, el hover del botón SHALL derivarse de los propios colores del botón (un tinte suave de su color de texto sobre su fondo) y MUST NOT usar el color de primer plano del esquema como fondo. Los colores de hover configurados por el comerciante SHALL tener prioridad.

#### Scenario: Botón de contorno sin colores de hover
- **WHEN** el botón tiene fondo blanco, texto #6b0f3a, sin colores de hover, y el visitante pasa el cursor sobre él
- **THEN** el fondo cambia a un tinte rosado claro, el texto sigue siendo #6b0f3a y el botón no se vuelve negro

#### Scenario: Colores de hover configurados
- **WHEN** el comerciante define fondo de hover #fde7f0 y texto de hover #6b0f3a
- **THEN** al pasar el cursor el botón usa exactamente esos colores

#### Scenario: Foco de teclado
- **WHEN** el visitante enfoca el botón con Tab
- **THEN** el botón muestra foco visible y su texto mantiene contraste legible sobre el fondo

### Requirement: Título no mayor que el botón

Cuando una tarjeta muestra botón, el tamaño de fuente efectivo de su título MUST ser menor o igual al tamaño de fuente del texto del botón, en escritorio y en móvil por separado. Si el tamaño de título configurado lo supera, SHALL mostrarse al tamaño del botón. Sin botón, el título SHALL usar su tamaño configurado.

#### Scenario: Título configurado más grande que el botón
- **WHEN** el título está en 24 px y el texto del botón en 16 px, y se ve a 1280 px
- **THEN** el título se muestra a 16 px

#### Scenario: Título más pequeño que el botón
- **WHEN** el título está en 14 px y el botón en 16 px
- **THEN** el título se muestra a 14 px

#### Scenario: Regla en móvil
- **WHEN** el título móvil está en 18 px, el texto del botón móvil en 15 px, y se ve a 390 px
- **THEN** el título se muestra a 15 px

#### Scenario: Tarjeta sin botón
- **WHEN** el texto del botón está vacío y el título está en 24 px
- **THEN** el título se muestra a 24 px

### Requirement: Ajustes independientes para móvil

Los tamaños de texto, padding y margin de cada tarjeta, y el padding vertical, la separación y el tamaño del título de la sección, SHALL tener un valor de escritorio y uno de móvil. En anchos de 749 px o menos SHALL aplicarse el valor móvil.

#### Scenario: Padding móvil distinto
- **WHEN** una tarjeta tiene padding 24 px en escritorio y 12 px en móvil y se ve a 390 px
- **THEN** la tarjeta usa padding de 12 px

### Requirement: Grilla responsive

La sección SHALL distribuir las tarjetas en columnas configurables para escritorio, tablet (750–989 px) y móvil (≤749 px). El contenido MUST NOT generar scroll horizontal de página y los textos largos SHALL ajustarse dentro de la tarjeta.

#### Scenario: Cuatro columnas en escritorio, una en móvil
- **WHEN** las columnas son 4 / 2 / 1 y hay 4 tarjetas
- **THEN** a 1280 px se ven 4 por fila, a 800 px 2 por fila y a 390 px 1 por fila, sin scroll horizontal

### Requirement: Accesibilidad de tarjetas

Las imágenes SHALL tener texto alternativo (personalizado, del producto o vacío si es decorativa), cada botón SHALL tener nombre accesible y foco visible, y los iconos decorativos SHALL ocultarse a lectores de pantalla.

#### Scenario: Navegación con teclado
- **WHEN** el visitante recorre la sección con Tab
- **THEN** cada botón recibe foco visible en el orden visual de las tarjetas

### Requirement: Zoom suave de imagen en hover

Con el ajuste "Zoom de imagen en hover" activado, al pasar el cursor sobre una tarjeta su imagen (o placeholder) SHALL ampliarse con una transición suave y SHALL volver suavemente a su tamaño original al retirar el cursor. La ampliación MUST quedar recortada dentro del contenedor de la imagen, respetando su radio y proporción, y MUST NOT desplazar ni redimensionar el resto de la tarjeta ni de la grilla.

#### Scenario: Cursor entra y sale de la tarjeta
- **WHEN** el visitante, con mouse, pasa el cursor sobre la tarjeta "Helado Hope" y luego lo retira
- **THEN** la imagen se amplía de forma gradual mientras el cursor está encima y regresa de forma gradual a su tamaño original al salir

#### Scenario: Zoom recortado por el contenedor
- **WHEN** la tarjeta tiene radio de imagen 12 px y el cursor está sobre ella
- **THEN** la imagen ampliada no sobresale del contenedor, mantiene las esquinas redondeadas y el título, texto y botón no cambian de posición

#### Scenario: Placeholder sin imagen
- **WHEN** la tarjeta no tiene imagen ni producto y el cursor está sobre ella
- **THEN** el placeholder aplica el mismo zoom suave

### Requirement: Zoom con foco de teclado

Con el ajuste de zoom activado, la imagen de una tarjeta SHALL aplicar el mismo zoom cuando un elemento enfocable dentro de la tarjeta recibe foco de teclado, y SHALL volver a su tamaño al perder el foco.

#### Scenario: Tab hasta el botón
- **WHEN** el visitante, con teclado, enfoca el botón "Arma tu mixo" de una tarjeta
- **THEN** la imagen de esa tarjeta se amplía y vuelve a su tamaño al mover el foco a otra tarjeta

### Requirement: Zoom desactivable por tarjeta

Cada tarjeta SHALL tener un ajuste "Zoom de imagen en hover", activado por defecto. Desactivado, la imagen de esa tarjeta MUST NOT ampliarse en hover ni en foco, y el resto de tarjetas MUST conservar su propio ajuste. Las tarjetas guardadas antes de este cambio SHALL comportarse como activadas.

#### Scenario: Una tarjeta sin zoom
- **WHEN** el comerciante desactiva el zoom solo en la tarjeta "Barquilla" y el visitante pasa el cursor por todas las tarjetas
- **THEN** "Barquilla" mantiene su imagen fija y las demás tarjetas sí aplican el zoom

#### Scenario: Tarjeta existente tras el despliegue
- **WHEN** una tarjeta configurada antes del cambio se muestra sin que el comerciante la edite
- **THEN** su imagen aplica el zoom en hover

### Requirement: Zoom omitido con movimiento reducido o puntero táctil

La imagen MUST NOT animarse cuando el visitante tiene activada la preferencia de movimiento reducido ni en dispositivos cuyo único puntero no es fino (pantallas táctiles), para evitar movimiento no deseado o un zoom que quede fijo tras un toque.

#### Scenario: Movimiento reducido
- **WHEN** el sistema del visitante tiene activado "reducir movimiento" y pasa el cursor sobre una tarjeta
- **THEN** la imagen no cambia de tamaño

#### Scenario: Toque en móvil
- **WHEN** el visitante toca una tarjeta en un teléfono a 390 px
- **THEN** la imagen no queda ampliada
