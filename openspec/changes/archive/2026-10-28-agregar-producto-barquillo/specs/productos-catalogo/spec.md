## ADDED Requirements

### Requirement: Barquillo como producto sin tamaños ni toppings

El sistema SHALL ofrecer el producto Barquillo (handle `barquillo`) publicado en Tienda online y POS,
con la imagen del cono de vainilla de Cloudinary, sin opción de tamaño, sin grupo de toppings y con
inventario no rastreado.

#### Scenario: Página del Barquillo

- **WHEN** el cliente visita `/products/barquillo`
- **THEN** ve el armador "Crea tu Barquillo" con la imagen del cono, solo el grupo de siropes y
  ningún selector de tamaño ni de toppings

### Requirement: Selección única de 1 sirope en el Barquillo

El armador del Barquillo SHALL permitir como máximo 1 sirope (estándar o premium); elegir otro sirope
reemplaza al anterior. Añadir al carrito MUST exigir exactamente 1 sirope.

#### Scenario: Reemplazo de sirope

- **WHEN** el cliente tiene "Chocolate" elegido y pulsa "Frutos rojos"
- **THEN** queda solo "Frutos rojos" seleccionado

#### Scenario: Sin sirope

- **WHEN** el cliente no tiene ningún sirope seleccionado
- **THEN** no puede añadir al carrito y ve el mensaje de que falta elegir 1 sirope

### Requirement: Precio del Barquillo según sirope

El precio del Barquillo SHALL ser $1.50 con un sirope estándar y $2.50 con un sirope premium (★).

#### Scenario: Sirope estándar

- **WHEN** el cliente elige un sirope estándar
- **THEN** el total mostrado es $1.50

#### Scenario: Sirope premium

- **WHEN** el cliente elige un sirope premium
- **THEN** el total mostrado es $2.50

### Requirement: Barquillo en una sola línea del carrito

Añadir un Barquillo SHALL crear una única línea nativa cuyo precio coincide con el total mostrado,
con la property legible del sirope, sin línea add-on de extras y sin mostrar la opción interna de
premium en el carrito.

#### Scenario: Añadir Barquillo con sirope premium

- **WHEN** el cliente añade un Barquillo con un sirope premium
- **THEN** el carrito tiene 1 línea "Barquillo" a $2.50 con la property del sirope, y no aparece la
  línea "Extras personalizados" ni la opción interna de premium
