# Spec Delta

## Purpose

Define cómo la sección "Social Hope" muestra una imagen junto a bloques de título, texto y botones de redes sociales configurables, cada botón con su propio destino de apertura.

## ADDED Requirements

### Requirement: Imagen de la sección

La sección SHALL mostrar una imagen con imagen móvil opcional que la reemplaza en anchos de 749 px o menos, y un placeholder cuando no hay imagen. Si se configura un enlace para la imagen, la imagen SHALL ser un enlace con nombre accesible.

#### Scenario: Imagen móvil
- **WHEN** hay imagen de escritorio e imagen móvil y se ve a 390 px
- **THEN** se muestra la imagen móvil

### Requirement: Contenido como bloques

El contenido junto a la imagen SHALL componerse de bloques de título, texto y botón de red social, que el comerciante agrega, reordena y elimina. Cada bloque SHALL tener sus propios ajustes de texto, tamaño (con valor móvil) y color, y renderizarse solo cuando tiene contenido.

#### Scenario: Agregar un segundo botón
- **WHEN** el comerciante agrega un botón de TikTok después del de Instagram
- **THEN** ambos botones se muestran uno junto al otro en el orden guardado

### Requirement: Botón de red social con destino configurable

Cada botón SHALL enlazar a la URL configurada y abrirla según su destino: `_blank` (pestaña nueva) o `_self` (misma pestaña). Con destino `_blank` el enlace MUST incluir `rel="noopener noreferrer"`. Sin URL o sin texto e icono, el botón MUST NOT renderizarse en la tienda.

#### Scenario: Destino pestaña nueva
- **WHEN** un botón tiene URL de Instagram y destino `_blank`
- **THEN** el enlace tiene `target="_blank"` y `rel="noopener noreferrer"` y abre en una pestaña nueva

#### Scenario: Destino misma pestaña
- **WHEN** un botón tiene destino `_self`
- **THEN** el enlace abre en la misma pestaña y no lleva `target="_blank"`

#### Scenario: Sin URL
- **WHEN** un botón no tiene URL
- **THEN** el botón no se muestra en la tienda

### Requirement: Icono según la red

Cada botón SHALL mostrar el icono de la red seleccionada (Instagram, TikTok, Facebook, WhatsApp, YouTube, X, Threads, Pinterest o Spotify) antes o después del texto según su ajuste, o ningún icono si se elige "Ninguno". El icono MUST ser decorativo (oculto a lectores de pantalla) y el enlace SHALL tener nombre accesible aun cuando solo muestra el icono.

#### Scenario: Solo icono
- **WHEN** un botón de Instagram no tiene texto
- **THEN** se muestra solo el icono y el enlace se anuncia como "Instagram"

### Requirement: Estilo independiente por botón

Cada botón SHALL tener estilo (contorno o relleno), colores de fondo, texto, borde e icono, colores en hover, radio, tamaño y opción de ancho completo en móvil, sin afectar a otros botones, con foco visible y área táctil mínima de 44 px.

#### Scenario: Botones con estilos distintos
- **WHEN** un botón es de contorno blanco y otro relleno vino
- **THEN** cada uno muestra su propio estilo

### Requirement: Layout responsive

En anchos mayores a 749 px la imagen y el contenido SHALL mostrarse en dos columnas con lado de la imagen configurable; en 749 px o menos SHALL apilarse con orden configurable. Los padding, separaciones y tamaños SHALL tener valores móviles independientes y la sección MUST NOT generar scroll horizontal.

#### Scenario: Vista móvil
- **WHEN** la sección se ve a 390 px
- **THEN** la imagen y el contenido se apilan, los botones se ajustan en varias líneas si no caben y no hay scroll horizontal
