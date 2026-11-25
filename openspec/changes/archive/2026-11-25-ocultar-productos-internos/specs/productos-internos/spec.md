# Spec Delta

## Purpose

Define cómo se tratan en el storefront los productos técnicos de Hope (tag `addon`), que existen solo para
cobrar extras del armador: no se listan ni se encuentran, pero siguen siendo comprables desde el armador.

## ADDED Requirements

### Requirement: Identificación de productos internos

El sistema SHALL considerar "producto interno" a todo producto con el tag `addon`. Etiquetar o quitar
la etiqueta SHALL bastar para ocultarlo o mostrarlo en el storefront, sin cambios de código.

#### Scenario: Add-on actual

- **WHEN** se evalúa "Extras personalizados" (tag `addon`)
- **THEN** se trata como producto interno

#### Scenario: Producto del catálogo

- **WHEN** se evalúa Helado Hope, Mixo Hope, Milkshake o Barquillo (sin tag `addon`)
- **THEN** se trata como producto normal y se sigue mostrando

### Requirement: Buscador sin productos internos

El buscador del encabezado SHALL omitir los productos internos en la lista de productos que muestra al
abrirse, en las sugerencias mientras se escribe y en la página de resultados, mostrando el resto de los
productos del catálogo.

#### Scenario: Abrir el buscador sin escribir

- **WHEN** el cliente abre el buscador del encabezado
- **THEN** la lista de productos muestra el catálogo y no incluye "Extras personalizados"

#### Scenario: Buscar por el nombre del add-on

- **WHEN** el cliente escribe "extras" en el buscador o visita `/search?q=extras`
- **THEN** "Extras personalizados" no aparece en las sugerencias ni en los resultados

#### Scenario: Cantidad mostrada completa

- **WHEN** el buscador muestra hasta N productos y hay al menos N productos normales
- **THEN** se muestran N productos normales; omitir el add-on no deja un hueco

### Requirement: Listas de productos sin productos internos

Las listas de productos del tema SHALL omitir los productos internos: páginas de colección (incluida
`/collections/all`), vitrina de colección, carruseles y listas de productos, y recomendaciones
relacionadas o complementarias.

#### Scenario: Colección "todos los productos"

- **WHEN** el cliente visita `/collections/all`
- **THEN** ve todos los productos del catálogo excepto "Extras personalizados"

#### Scenario: Recomendaciones en una ficha

- **WHEN** el cliente ve las recomendaciones de un producto
- **THEN** ninguna recomendación es un producto interno

### Requirement: Fuera de buscadores externos

Los productos internos SHALL quedar excluidos del sitemap y marcados para no indexarse en buscadores
externos.

#### Scenario: Sitemap

- **WHEN** se consulta `/sitemap_products_1.xml`
- **THEN** no incluye la URL de "Extras personalizados"

### Requirement: Los productos internos siguen siendo comprables

Ocultar un producto interno SHALL NOT impedir que el armador lo agregue al carrito ni que se muestre como
línea del carrito y del pedido.

#### Scenario: Helado con toppings premium

- **WHEN** el cliente arma un Helado Hope con un topping premium y lo agrega al carrito
- **THEN** el carrito contiene la línea del helado y la línea "Extras personalizados" a $1.50, como antes
