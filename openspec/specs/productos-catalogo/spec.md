# Catálogo de Productos (Mixo, Milkshake y Vitrina de Colección)

## Purpose

Documentar los productos del catálogo Hope más allá del Helado Hope base: Mixo Hope (clon del armador
con aviso de delivery), Milkshake (combos pre-armados de opción única con armador dedicado) y la
vitrina de colección (grid minimalista con filtro por chips).

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
