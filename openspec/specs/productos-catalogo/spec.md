# Catálogo de Productos (Mixo, Milkshake, Barquillo y Vitrina de Colección)

## Purpose

Documentar los productos del catálogo Hope más allá del Helado Hope base: Mixo Hope (clon del armador
con aviso de delivery), Milkshake (combos pre-armados de opción única con armador dedicado), Barquillo
(solo 1 sirope, con armador dedicado) y la vitrina de colección (grid minimalista con filtro por chips).

## Requirements

### Requirement: Mixo Hope reutiliza el armador con aviso de delivery

El sistema SHALL servir Mixo Hope (gid 9454592786684) con el mismo template `helado-v2` y su propia
base de precios ($5/$7/$9), mostrando título dinámico ("Crea tu Mixo Hope") e imagen base propia
(`hope-mixo-fixed-default-v1`).

#### Scenario: Página de Mixo Hope

- **WHEN** el cliente visita `/products/mixo-hope`
- **THEN** ve el armador con el título "Crea tu Mixo Hope" y su imagen base propia, reutilizando la
  sección `custom-product-v2`

### Requirement: Milkshake como combos de opción única

El sistema SHALL servir Milkshake (gid 9461419311356) como producto de opción única "Combo" con 3
variantes a $7.00 (Fresa / Vainilla / Chocolate), renderizando una card por combo desde el metafield
`custom.milkshake_combos`.

#### Scenario: Elegir un combo

- **WHEN** el cliente elige el combo "Vainilla" en el armador de Milkshake
- **THEN** la vista previa carga el cutout del combo y "Añadir" mete la variante correcta con la
  property `Combo: Vainilla`

### Requirement: Armador de Milkshake aislado del JS global v1

El sistema SHALL usar el atributo raíz `data-hopecfg-ms` en la sección de Milkshake para que el JS
global `toppings-customizer.js` (que inicializa sobre `[data-hopecfg]`) no la capture, y matchear la
variante por nombre de opción (no por posición).

#### Scenario: El armador de Milkshake no es capturado por el JS global

- **WHEN** la página de Milkshake se carga con el asset global presente
- **THEN** solo el `milkshake-customizer.js` dedicado inicializa la sección `[data-hopecfg-ms]`

### Requirement: Vitrina de colección con filtro por chips

El sistema SHALL renderizar las páginas de colección con la sección `collection-showcase` (grid propio
+ chips), filtrando client-side por el `match_tag` de cada chip contra los tags del producto y
ocultando productos con tag `addon`.

#### Scenario: Filtrar por categoría

- **WHEN** el cliente pulsa el chip "Milkshakes"
- **THEN** el grid muestra solo los productos con el tag correspondiente, sin recargar la página

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
