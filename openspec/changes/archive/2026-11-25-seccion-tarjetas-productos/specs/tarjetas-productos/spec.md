# Spec Delta

## Purpose

Define cómo la sección "Tarjetas de productos" muestra una vitrina de tarjetas independientes, cada una con imagen, textos y botón configurables por separado y con ajustes propios para móvil.

## ADDED Requirements

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

Cada tarjeta SHALL ofrecer un botón opcional con texto, enlace, estilo (relleno o contorno), colores de fondo, texto y borde, colores en hover, radio, tamaño, ancho completo en móvil e icono de flecha opcional. Sin texto de botón, el botón MUST NOT renderizarse.

#### Scenario: Botón de contorno con flecha
- **WHEN** el botón tiene estilo contorno, texto "Arma tu mixo" y flecha activada
- **THEN** se muestra un botón con borde, el texto y una flecha a continuación

#### Scenario: Botón sin texto
- **WHEN** el texto del botón está vacío
- **THEN** la tarjeta no muestra botón

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
