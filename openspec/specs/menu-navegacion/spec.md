# Menú de Navegación (Header — Desplegable de Escritorio)

## Purpose

Define el comportamiento del menú de navegación del header del tema y de su panel desplegable: dónde
aparece, qué ancho ocupa y cómo se presentan los productos cuando el desplegable los incluye.

## Requirements

### Requirement: Panel desplegable anclado al ítem

El sistema SHALL posicionar el panel desplegable de un ítem de nivel superior anclado a ese ítem,
alineado a su borde izquierdo y ubicado justo debajo de él, en lugar de ocupar el ancho completo del
header. El contexto de posicionamiento SHALL ser el propio ítem de menú (`.menu-list__list-item` en
`position: relative`), no la fila del header.

#### Scenario: Abrir el desplegable de un ítem

- **WHEN** el usuario pasa el cursor (o enfoca) un ítem de nivel superior con hijos
- **THEN** el panel aparece con su borde izquierdo alineado al borde izquierdo de ese ítem y su borde
  superior justo bajo la barra, no a lo ancho completo del header

#### Scenario: Ítems distintos abren en posiciones distintas

- **WHEN** el usuario abre el desplegable de un ítem y luego el de otro ítem más a la derecha
- **THEN** cada panel aparece bajo su propio ítem (posición horizontal distinta), no en la misma
  posición full-width

### Requirement: Ancho por contenido del panel

El sistema SHALL dimensionar el panel según su contenido (`max-content`) con un ancho máximo
razonable, sin aplicar el offset de ancho de página (sin `grid-column: 2` ni la grilla de página
completa) ni la barra de fondo a ancho completo.

#### Scenario: Panel con pocos enlaces

- **WHEN** un ítem tiene un desplegable con pocos enlaces
- **THEN** el panel es una caja compacta ajustada a su contenido, no una franja del ancho del header

### Requirement: El panel no se corta fuera de la pantalla

El sistema SHALL mantener el panel completamente visible dentro del viewport: si al anclarlo a la
izquierda del ítem el panel se saldría por el borde derecho de la pantalla, SHALL desplazarse hacia la
izquierda lo necesario para quedar contenido.

#### Scenario: Ítem cercano al borde derecho

- **WHEN** se abre el desplegable de un ítem ubicado cerca del borde derecho del header
- **THEN** el panel se ajusta horizontalmente para no cortarse fuera de la pantalla, permaneciendo
  completamente visible

### Requirement: Miniatura de producto en cada enlace del desplegable

El sistema SHALL mostrar, para cada enlace del desplegable que resuelva a un recurso con imagen
destacada (producto o colección), una miniatura junto a su título, para que los productos del menú
aparezcan con imagen. El enlace SHALL disponerse en fila (miniatura + título) y el título NO SHALL
partirse en dos líneas.

#### Scenario: Enlaces de producto con imagen

- **WHEN** un ítem (p. ej. "Productos") tiene enlaces hijos que son productos con imagen destacada
- **THEN** cada enlace muestra su miniatura a la izquierda y el nombre del producto en una sola línea

### Requirement: Presentación de la lista de productos

El sistema SHALL presentar la lista de productos del desplegable alineada a la izquierda (sin el
sangrado de ancho de página ni el de lista por defecto), con separación vertical cómoda entre
productos y una línea divisoria sutil entre ellos (no después del último).

#### Scenario: Separación y divisores

- **WHEN** el desplegable muestra varios productos
- **THEN** los productos están alineados a la izquierda del panel, separados entre sí, con una línea
  divisoria tenue entre cada par consecutivo y sin divisor tras el último

### Requirement: Miniaturas de producto circulares

El sistema SHALL renderizar esas miniaturas del desplegable como círculos (relación 1:1 y
`border-radius: 50%`, tamaño pequeño). La regla SHALL estar acotada al contexto del menú y NO SHALL
afectar las tarjetas de producto usadas fuera del menú (por ejemplo, resultados de búsqueda).

#### Scenario: Miniatura circular

- **WHEN** un enlace del desplegable muestra su miniatura de producto
- **THEN** la imagen se ve circular (recorte 1:1, borde redondeado al 50%)

#### Scenario: No afecta imágenes fuera del menú

- **WHEN** se renderiza una tarjeta de producto fuera del menú (p. ej. resultados de búsqueda)
- **THEN** esa imagen conserva su forma original (no se vuelve circular)
