# Spec Delta

## ADDED Requirements

### Requirement: Toppings y siropes de Helado Hope y Mixo Hope agrupados y ordenados
El armador de Helado Hope y Mixo Hope SHALL presentar los toppings y los siropes, cada uno en su paso, en dos conjuntos con encabezado propio: "Clásicos" para las opciones estándar y "Premium ★" para las premium. Los clásicos MUST conservar el orden definido en los datos del producto y los premium MUST mostrarse en orden alfabético por nombre. Un conjunto sin opciones MUST NOT mostrarse.

#### Scenario: Dos conjuntos en el paso de toppings
- **WHEN** el cliente llega al paso "Elige tus toppings" de Helado Hope
- **THEN** ve el conjunto "Clásicos" con los toppings estándar y, debajo, el conjunto "Premium ★" con los toppings premium

#### Scenario: Dos conjuntos en el paso de siropes
- **WHEN** el cliente llega al paso "Elige tu sirope" de Mixo Hope
- **THEN** ve el conjunto "Clásicos" con los siropes estándar y, debajo, el conjunto "Premium ★" con los siropes premium

#### Scenario: Premium en orden alfabético
- **WHEN** el cliente recorre un conjunto "Premium ★"
- **THEN** las opciones aparecen ordenadas alfabéticamente por nombre

#### Scenario: Producto sin opciones premium
- **WHEN** los datos del producto no traen ningún sirope premium
- **THEN** el paso de siropes muestra solo el conjunto "Clásicos", sin encabezado "Premium ★" vacío

### Requirement: Costo de cada conjunto en su encabezado
Cada encabezado de conjunto del armador de Helado Hope y Mixo Hope SHALL mostrar el costo de sus opciones, tomado de la configuración del armador y nunca fijado en el código. El de "Clásicos" MUST indicar cuántas opciones están incluidas y el precio de cada adicional; el de "Premium ★" MUST indicar el precio por unidad. Cada paso MUST informar que los premium se cobran aparte y no cuentan como incluidos.

#### Scenario: Encabezados de toppings
- **WHEN** el armador tiene 2 toppings incluidos, $1.00 por básico adicional y $1.50 por premium
- **THEN** "Clásicos" muestra "2 incluidos · +$1.00 c/u adicional" y "Premium ★" muestra "+$1.50 c/u"

#### Scenario: Encabezados de siropes
- **WHEN** el armador tiene 1 sirope incluido, $1.00 por básico adicional y $1.50 por premium
- **THEN** "Clásicos" muestra "1 incluido · +$1.00 c/u adicional" y "Premium ★" muestra "+$1.50 c/u"

#### Scenario: Cambia la configuración de precios
- **WHEN** el comerciante cambia el precio del premium a $2.00 en la configuración del armador
- **THEN** el encabezado "Premium ★" muestra "+$2.00 c/u" sin tocar el código

#### Scenario: Sin opciones incluidas
- **WHEN** el armador está configurado con 0 toppings incluidos
- **THEN** el encabezado "Clásicos" de toppings muestra solo el precio por unidad, sin la mención de incluidos

### Requirement: Chips de Helado Hope y Mixo Hope en grilla uniforme
Los chips de topping y de sirope del armador de Helado Hope y Mixo Hope SHALL tener el mismo ancho dentro de una grilla y mostrar el nombre completo, en varias líneas si no cabe en una. Los chips MUST NOT repetir la estrella ★ ni la etiqueta "premium". El chip seleccionado MUST seguir mostrando su costo. Las opciones MUST NOT tener desplazamiento horizontal.

#### Scenario: Grilla uniforme en móvil
- **WHEN** el cliente abre el paso de toppings a 390 px de ancho
- **THEN** los chips se muestran en dos columnas del mismo ancho, sin nombres cortados, sin desplazamiento horizontal y sin el aviso "Desliza para ver más"

#### Scenario: Chip premium seleccionado
- **WHEN** el cliente selecciona un topping premium
- **THEN** el chip queda resaltado y muestra su costo, sin estrella ni etiqueta "premium", y el total suma ese costo

#### Scenario: Básico incluido y básico con costo
- **WHEN** el cliente selecciona tres toppings clásicos con 2 incluidos
- **THEN** los dos primeros chips muestran "Incluido" y el tercero muestra el costo del básico adicional

### Requirement: Organización de selectores compartida entre armadores
La organización en conjuntos con encabezado y grilla uniforme SHALL verse y comportarse igual en el armador de la Barquilla y en el de Helado Hope y Mixo Hope. Agruparlos MUST NOT cambiar las reglas de selección, los límites, los precios, los pasos del asistente ni las líneas del carrito de ningún armador. El armador de Milkshake MUST NOT cambiar.

#### Scenario: La Barquilla se ve igual que antes
- **WHEN** el cliente abre el armador de la Barquilla después del cambio
- **THEN** los conjuntos "Clásicos" (Incluido) y "Premium ★" (+$1.00), la grilla y los chips se ven igual que antes del cambio

#### Scenario: Mismo aspecto de conjunto en ambos armadores
- **WHEN** el cliente compara el paso de siropes de Helado Hope con el de la Barquilla
- **THEN** los encabezados de conjunto, la separación entre conjuntos y la grilla de chips tienen el mismo diseño

#### Scenario: Selección y cobro sin cambios
- **WHEN** el cliente arma un Helado Hope con dos toppings clásicos, un topping premium y un sirope clásico y lo añade al carrito
- **THEN** el total y las líneas del carrito son los mismos que antes del cambio para esa misma selección

#### Scenario: Asistente móvil sin cambios
- **WHEN** el cliente recorre el armador de Helado Hope en móvil
- **THEN** los pasos, su orden, el indicador "Paso N de M" y los botones de avanzar y retroceder funcionan igual que antes del cambio

#### Scenario: Milkshake sin cambios
- **WHEN** el cliente abre el armador de Milkshake
- **THEN** el selector de tamaño y las tarjetas de combo se muestran igual que antes del cambio

## MODIFIED Requirements

### Requirement: Chips de sirope de la Barquilla en grilla uniforme
Los chips de sirope del armador de la Barquilla SHALL tener el mismo ancho dentro de una grilla y mostrar el nombre completo, en varias líneas si no cabe en una. Los chips MUST NOT repetir la estrella ★, la etiqueta "premium" ni el costo, que se indican en el encabezado del conjunto y en el desglose del total. El armador de Milkshake MUST NOT cambiar.

#### Scenario: Grilla uniforme en móvil
- **WHEN** el cliente abre el armador de la Barquilla a 390 px de ancho
- **THEN** los chips se muestran en dos columnas del mismo ancho, sin desplazamiento horizontal, sin nombres cortados y con nombres de tres líneas como máximo

#### Scenario: Chip premium seleccionado
- **WHEN** el cliente selecciona "Crema Lotus"
- **THEN** el chip queda resaltado sin mostrar estrella, etiqueta ni costo, y el total indica que incluye $1.00 en sirope premium

#### Scenario: Otros armadores conservan su selector
- **WHEN** el cliente abre el armador de Milkshake
- **THEN** las tarjetas de combo se muestran igual que antes del cambio
