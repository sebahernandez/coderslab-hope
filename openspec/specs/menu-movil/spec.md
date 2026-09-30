# Menú Móvil (Drawer del Header)

## Purpose

Define el comportamiento y la presentación del menú de navegación en el drawer móvil del header:
cómo se muestran los enlaces hijos de un ítem (p. ej. los productos bajo "Productos") de forma legible
y con miniaturas.

## Requirements

### Requirement: Enlaces hijos visibles en el drawer móvil

El sistema SHALL mostrar los enlaces hijos de un ítem del menú en el drawer móvil con suficiente
contraste sobre el fondo del drawer. Los enlaces hijos NO SHALL quedar con texto del mismo color que
el fondo (p. ej. blanco sobre blanco).

#### Scenario: Abrir "Productos" en el drawer móvil

- **WHEN** el usuario abre el drawer móvil y mira bajo "Productos"
- **THEN** ve los enlaces de producto (Helado Hope, Milkshake, Mixo Hope) con texto legible (color
  oscuro/granate de Hope), no en blanco sobre blanco

### Requirement: Ítem con hijos colapsado por defecto (acordeón)

El sistema SHALL presentar en el drawer móvil un ítem con hijos (p. ej. "Productos") como un acordeón
**cerrado por defecto**; sus productos se muestran solo al expandirlo.

#### Scenario: "Productos" aparece cerrado

- **WHEN** el usuario abre el drawer móvil
- **THEN** "Productos" aparece colapsado (con indicador de expandir) y sus productos no se muestran
  hasta que el usuario lo expande

### Requirement: Miniatura de producto en el drawer móvil

El sistema SHALL renderizar, para cada enlace hijo del drawer que resuelva a un recurso con imagen
destacada (producto o colección), una miniatura junto a su título. El enlace SHALL disponerse en
**fila**, con la miniatura a la izquierda y el texto a su lado **centrado verticalmente**, y la lista
SHALL quedar **alineada a la izquierda** (sin sangrado), consistente con el desplegable de escritorio
(ver `menu-navegacion`).

#### Scenario: Productos con imagen en el drawer

- **WHEN** "Productos" tiene enlaces hijos que son productos con imagen destacada
- **THEN** cada enlace del drawer muestra su miniatura a la izquierda y el nombre a su lado, centrado
  verticalmente y alineado a la izquierda

### Requirement: Miniaturas de producto circulares en el drawer

El sistema SHALL renderizar esas miniaturas del drawer como círculos (relación 1:1 y
`border-radius: 50%`, tamaño pequeño), acotado al drawer móvil.

#### Scenario: Miniatura circular en móvil

- **WHEN** un enlace del drawer muestra su miniatura de producto
- **THEN** la imagen se ve circular (recorte 1:1, borde redondeado al 50%)
