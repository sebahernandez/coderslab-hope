# Spec Delta

## MODIFIED Requirements

### Requirement: Alineación horizontal de la imagen reducida

La sección SHALL ofrecer un ajuste "Alineación horizontal de la imagen" con los valores inicio, centro, final y hacia el borde exterior. El ajuste SHALL ubicar la imagen dentro de su columna cuando su tamaño es menor al 100 % y SHALL ubicar también la imagen visible dentro de su marco cuando el encaje "Contener" deja espacio libre horizontal. "Hacia el borde exterior" SHALL equivaler a final si la imagen está a la derecha y a inicio si está a la izquierda en escritorio, y a centro en móvil. La alineación SHALL usar propiedades lógicas (LTR/RTL). El valor por defecto SHALL ser centro.

#### Scenario: Imagen reducida centrada
- **WHEN** el tamaño es 70 % y la alineación es centro
- **THEN** la imagen queda centrada horizontalmente en su columna con espacio libre igual a ambos lados

#### Scenario: Imagen reducida al final en RTL
- **WHEN** el tamaño es 70 %, la alineación es final y el documento tiene `dir="rtl"`
- **THEN** la imagen queda pegada al borde izquierdo de su columna

#### Scenario: Imagen contenida pegada al borde exterior a la derecha
- **WHEN** en escritorio la proporción es "Horizontal (3:2)", el encaje es "Contener", la imagen es más angosta que el marco, "Imagen en escritorio" es "A la derecha" y la alineación es "Hacia el borde exterior"
- **THEN** el borde derecho de la imagen visible coincide con el borde derecho de su columna y todo el espacio libre queda del lado del texto

#### Scenario: Imagen contenida pegada al borde exterior a la izquierda
- **WHEN** las condiciones son las mismas pero "Imagen en escritorio" es "A la izquierda"
- **THEN** el borde izquierdo de la imagen visible coincide con el borde izquierdo de su columna

#### Scenario: Borde exterior en móvil
- **WHEN** la alineación es "Hacia el borde exterior" en una pantalla de 749 px o menos
- **THEN** la imagen queda centrada horizontalmente

#### Scenario: Secciones existentes sin cambios
- **WHEN** una sección guardada no tiene valor para la alineación
- **THEN** la imagen contenida queda centrada en su marco, igual que antes del cambio

## ADDED Requirements

### Requirement: Esquinas redondeadas sobre la imagen visible con "Contener"

Cuando el encaje efectivo del breakpoint activo es "Contener", el "Radio de las esquinas" SHALL aplicarse al contorno de la imagen visible y no al marco, de modo que la imagen conserve las esquinas redondeadas en cualquier alineación. Con encaje "Cubrir" el radio SHALL seguir aplicándose al marco como hoy.

#### Scenario: Imagen contenida pegada al borde con radio
- **WHEN** el encaje es "Contener", el radio es 24 px y la imagen queda pegada al borde exterior con espacio libre del lado del texto
- **THEN** las cuatro esquinas de la imagen visible se ven redondeadas con 24 px

#### Scenario: Encaje Cubrir sin cambios
- **WHEN** el encaje es "Cubrir" con proporción fija
- **THEN** el marco recorta la imagen y sus esquinas se redondean igual que antes del cambio
