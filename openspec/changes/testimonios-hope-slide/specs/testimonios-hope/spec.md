# Spec Delta

## MODIFIED Requirements

### Requirement: Grilla estática sin carrusel

En modo de visualización "Grilla" (valor por defecto) la sección SHALL mostrar todos los testimonios simultáneamente en una grilla con columnas configurables para escritorio, tablet y móvil, sin flechas, paginación ni desplazamiento automático.

#### Scenario: Tres testimonios en escritorio
- **WHEN** hay 3 testimonios, el modo es "Grilla" y la sección se ve a 1280 px con 3 columnas
- **THEN** los 3 testimonios se ven en una fila, sin controles de navegación

#### Scenario: Secciones existentes conservan la grilla
- **WHEN** una sección guardada antes de existir el ajuste de modo se renderiza
- **THEN** se muestra en modo "Grilla" sin cambios visuales

## ADDED Requirements

### Requirement: Modo slide

En modo de visualización "Slide" la sección SHALL mostrar los testimonios en un carrusel navegable con deslizamiento táctil, flechas anterior/siguiente y paginación, con una cantidad de testimonios visibles configurable para escritorio y para móvil. Si todos los testimonios caben en una vista, los controles MUST NOT mostrarse.

#### Scenario: Navegar con flechas
- **WHEN** el modo es "Slide", hay 6 testimonios y se ven 3 por vista
- **THEN** pulsar "siguiente" desplaza el carrusel y muestra los testimonios siguientes

#### Scenario: Deslizar en móvil
- **WHEN** el modo es "Slide" y el visitante desliza horizontalmente a 390 px
- **THEN** el carrusel avanza al siguiente testimonio

#### Scenario: Todos caben en una vista
- **WHEN** el modo es "Slide", hay 3 testimonios y se ven 3 por vista
- **THEN** no se muestran flechas ni paginación

### Requirement: Autoplay opcional del slide

En modo "Slide" la sección SHALL permitir activar avance automático con velocidad configurable en segundos, desactivado por defecto. El avance automático MUST pausarse mientras el visitante interactúa con el carrusel o tiene el foco dentro, y MUST NOT ejecutarse cuando el visitante prefiere movimiento reducido.

#### Scenario: Pausa al interactuar
- **WHEN** el autoplay está activo y el visitante pasa el puntero sobre el carrusel
- **THEN** el carrusel deja de avanzar hasta que el puntero sale

### Requirement: Accesibilidad del slide

Las flechas y puntos de paginación SHALL tener nombres accesibles, ser operables con teclado y tener foco visible; la diapositiva activa SHALL comunicarse a lectores de pantalla.

#### Scenario: Navegación con teclado
- **WHEN** el visitante enfoca la flecha "siguiente" y pulsa Enter
- **THEN** el carrusel avanza y el foco permanece en la flecha
