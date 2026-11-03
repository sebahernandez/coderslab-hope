# Sabor del mes

## Purpose

Permite al comerciante publicar cada mes un sabor de edición limitada, administrado desde el admin
de Shopify sin tocar código, y ofrecerlo como base alternativa al yogurt griego clásico en el
armador de Helado Hope y Mixo Hope.

## Requirements

### Requirement: Contenido del sabor del mes administrable sin código

El sistema SHALL leer el sabor del mes desde entradas de metaobjeto `sabor_del_mes` del admin de
Shopify, con nombre, descripción, imagen del banner, imagen del vaso para el preview, miniatura,
fecha de inicio y fecha de fin. Cambiar el sabor SHALL requerir solo editar o crear entradas, sin
modificar archivos del tema.

#### Scenario: El comerciante cambia el sabor del mes

- **WHEN** el comerciante crea en Contenido › Metaobjetos una entrada "Sabor del mes" con nombre
  "Alegría", descripción, imágenes y vigencia del 1 al 30 de noviembre
- **THEN** el armador de Helado Hope y Mixo Hope muestra "Alegría" sin cambios en el código del tema

#### Scenario: Imagen opcional ausente

- **WHEN** la entrada vigente no tiene imagen del vaso para el preview
- **THEN** el preview mantiene la imagen base actual del producto y el resto del sabor se muestra
  normalmente

### Requirement: Selección del sabor vigente por fechas

El sistema SHALL considerar vigente la entrada cuya fecha de inicio es anterior o igual a la fecha
actual y cuya fecha de fin es posterior o igual a la fecha actual, y cuyo producto asociado es el
producto actual o está vacío. Una entrada asociada al producto SHALL tener prioridad sobre una sin
producto; si hay varias del mismo nivel SHALL usar la de inicio más reciente. Si ninguna está vigente, el armador SHALL comportarse como antes de este
cambio.

#### Scenario: Sabor distinto por producto

- **WHEN** existe una entrada vigente asociada a Helado Hope y otra asociada a Mixo Hope
- **THEN** cada armador muestra solo la entrada de su producto; una entrada sin producto se muestra
  en ambos solo si el producto no tiene una entrada propia vigente

#### Scenario: Sabor programado a futuro

- **WHEN** existe una entrada de diciembre y la fecha actual es 3 de noviembre
- **THEN** esa entrada no se muestra hasta el 1 de diciembre

#### Scenario: Sin sabor vigente

- **WHEN** ninguna entrada está vigente o el comerciante desactiva el sabor del mes en la sección
- **THEN** no se muestra el banner ni el paso de base, el flujo es de 3 pasos y el carrito no lleva
  la property `Base`

### Requirement: Banner promocional del sabor del mes

Cuando hay sabor vigente, el armador SHALL mostrar, encima del paso de base, la imagen del banner
del sabor completa (diseñada con su texto incluido), sin recortes ni texto duplicado. La imagen
SHALL tener un texto alternativo con el nombre, la vigencia y la descripción del sabor, y SHALL
ajustarse al ancho del armador sin desbordarse en móvil.

#### Scenario: Banner visible con sabor vigente

- **WHEN** el cliente abre /products/helado-hope durante la vigencia de "Alegría"
- **THEN** ve la imagen del banner completa sobre "1 · Elige la base del helado", y su texto
  alternativo incluye "Alegría", "Hasta el 30 de noviembre" y la descripción

#### Scenario: Banner en pantalla angosta

- **WHEN** el cliente abre el armador a 375 px de ancho
- **THEN** la imagen del banner se ve completa (sin recorte) dentro del armador y sin scroll
  horizontal

### Requirement: Elección de la base del helado

Cuando hay sabor vigente, el armador SHALL ofrecer "Elige la base del helado" con dos opciones de
selección única: "Yogurt Griego Clásico" (seleccionada por defecto) y el sabor vigente, cada una con
miniatura y subtítulo. Las opciones SHALL ser operables con teclado y exponer su estado seleccionado
a lectores de pantalla.

#### Scenario: Base por defecto

- **WHEN** el cliente abre el armador con sabor vigente
- **THEN** "Yogurt Griego Clásico" aparece seleccionada y el preview muestra el vaso clásico

#### Scenario: Elegir el sabor del mes

- **WHEN** el cliente selecciona "Alegría"
- **THEN** "Alegría" queda seleccionada, el preview cambia a la imagen del vaso de Alegría y aparece
  la insignia "Sabor del mes" sobre el preview

#### Scenario: Volver a la base clásica

- **WHEN** el cliente vuelve a seleccionar "Yogurt Griego Clásico" o reinicia el armador
- **THEN** el preview vuelve al vaso clásico y desaparece la insignia

### Requirement: Base elegida en la línea del carrito sin cambio de precio

Al añadir al carrito con sabor vigente, la línea del helado SHALL incluir la property visible
`Base` con el nombre de la base elegida. El precio, la variante y la línea add-on de premium SHALL
ser los mismos que con la base clásica.

#### Scenario: Pedido con el sabor del mes

- **WHEN** el cliente elige "Alegría", tamaño Pequeño y 2 toppings básicos, y añade al carrito
- **THEN** la línea del helado tiene `Base: Alegría (Sabor del mes)`, precio $6.00 y la misma
  variante que tendría con la base clásica

#### Scenario: Pedido con la base clásica

- **WHEN** el cliente añade al carrito con "Yogurt Griego Clásico" mientras hay sabor vigente
- **THEN** la línea del helado tiene `Base: Yogurt Griego Clásico`
