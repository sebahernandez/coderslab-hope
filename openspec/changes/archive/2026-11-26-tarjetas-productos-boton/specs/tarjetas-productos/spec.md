# Spec Delta

## MODIFIED Requirements

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

## ADDED Requirements

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
