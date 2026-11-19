# Sabor del mes

## Purpose

Permite al comerciante publicar cada mes un sabor de edición limitada, administrado desde el admin
de Shopify sin tocar código, y ofrecerlo como base alternativa al yogurt griego clásico en los
armadores de Helado Hope, Mixo Hope y Barquilla. El armador de Milkshake queda fuera.

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

### Requirement: Sabor del mes en el armador de la Barquilla

Cuando hay sabor vigente para la Barquilla, su armador SHALL mostrar el banner del sabor y, antes
de los siropes, "Elige la base del helado" con las mismas dos opciones que Helado Hope y Mixo Hope.
La Barquilla no tiene pasos: ambos bloques SHALL estar siempre visibles, sin numeración. Sin sabor
vigente, el armador de la Barquilla SHALL comportarse como antes de este cambio.

#### Scenario: Banner y base visibles en la Barquilla

- **WHEN** el cliente abre /products/barquillo con una entrada vigente asociada a la Barquilla
- **THEN** ve el banner completo y, debajo, "Elige la base del helado" con "Yogurt Griego Clásico"
  seleccionada, seguido de "Elige tu sirope"

#### Scenario: Entradas de otros productos

- **WHEN** las únicas entradas vigentes están asociadas a Helado Hope y a Mixo Hope
- **THEN** el armador de la Barquilla no muestra banner ni selección de base

#### Scenario: Pedido de Barquilla con el sabor del mes

- **WHEN** el cliente elige "Alegría" y el sirope "Nutella", y añade al carrito
- **THEN** la línea tiene `Base: Alegría (Sabor del mes)` y `Sirope: Nutella ★`, con el mismo precio
  y la misma variante que tendría con la base clásica

#### Scenario: Reiniciar la Barquilla

- **WHEN** el cliente pulsa "Reiniciar" con "Alegría" seleccionada
- **THEN** la base vuelve a "Yogurt Griego Clásico" y desaparece la insignia "Sabor del mes"

### Requirement: Vista previa de la Barquilla con el sabor del mes

Con el sabor del mes seleccionado, la imagen principal de la Barquilla SHALL mostrar la foto del
cono con ese sabor y el sirope elegido, o la foto del cono con el sabor solo si no hay sirope
elegido o ese sirope no tiene foto. Con el sabor del mes seleccionado MUST NOT mostrarse una foto
del cono clásico si la entrada tiene fotos propias. Si una foto no carga, SHALL mostrarse el
mensaje de imagen no disponible definido en la capacidad `configurador-helado`, en lugar de una
imagen de respaldo.

#### Scenario: Sabor del mes con sirope

- **WHEN** el cliente selecciona "Alegría" y luego el sirope "Nutella"
- **THEN** la imagen principal es la foto del cono con Alegría y Nutella

#### Scenario: Sabor del mes sin sirope

- **WHEN** el cliente selecciona "Alegría" sin sirope elegido, o deselecciona el sirope
- **THEN** la imagen principal es la foto del cono con Alegría solo

#### Scenario: Sirope sin foto para el sabor

- **WHEN** el cliente selecciona "Alegría" y un sirope que no tiene foto con ese sabor
- **THEN** la imagen principal es la foto del cono con Alegría solo y no la del cono clásico

#### Scenario: Volver a la base clásica en la Barquilla

- **WHEN** el cliente tiene "Alegría" y "Nutella" seleccionados y vuelve a "Yogurt Griego Clásico"
- **THEN** la imagen principal pasa a la foto del cono clásico con Nutella

#### Scenario: Entrada sin fotos de la Barquilla

- **WHEN** la entrada vigente no tiene fotos del cono y el cliente selecciona "Alegría" y "Nutella"
- **THEN** la imagen principal es la foto del cono clásico con Nutella

#### Scenario: Foto del sabor que no carga

- **WHEN** el cliente selecciona "Alegría" y "Nutella" y la foto del cono con Alegría y Nutella responde con error
- **THEN** la vista previa muestra "Imagen no disponible en este momento" y no la foto del cono con Alegría solo ni la del cono clásico

### Requirement: Fotos de la Barquilla en la entrada del sabor del mes

La entrada del sabor del mes SHALL poder incluir, en el campo opcional `imagenes_barquilla`, la
foto del cono con el sabor solo y una foto por sirope, identificada por el id del sirope. Cambiar
las fotos de un sabor SHALL requerir solo editar la entrada, sin modificar archivos del tema. Sin
miniatura cargada, la opción del sabor SHALL usar como miniatura la foto del cono con el sabor solo.

#### Scenario: Sabor nuevo con sus fotos

- **WHEN** el comerciante crea la entrada de diciembre con sus fotos en `imagenes_barquilla`
- **THEN** el armador de la Barquilla muestra esas fotos durante la vigencia, sin cambios en el tema

#### Scenario: Miniatura del sabor

- **WHEN** la entrada vigente de la Barquilla no tiene miniatura y sí la foto del cono con el sabor
- **THEN** la opción del sabor muestra esa foto como miniatura
