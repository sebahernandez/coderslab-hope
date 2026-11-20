# Spec Delta

## ADDED Requirements

### Requirement: Tarjeta del armador visible completa en escritorio
En viewports de al menos 1024 px de ancho y 540 px de alto, la tarjeta de cada armador (Helado Hope, Mixo Hope, Milkshake y Barquilla) SHALL mostrarse completa dentro del viewport al cargar la página, sin que el cliente tenga que desplazar la página para ver la vista previa, las opciones, el total o los botones de acción.

#### Scenario: Carga en un portátil común
- **WHEN** el cliente abre cualquiera de los cuatro armadores en un viewport de 1366×768 sin desplazar la página
- **THEN** el borde superior de la tarjeta queda debajo del navbar y el borde inferior queda dentro del viewport, con el total y "Añadir al carrito" visibles completos

#### Scenario: Otros tamaños de escritorio
- **WHEN** el cliente abre un armador en 1024×768, 1280×720, 1440×900 o 1920×1080
- **THEN** la tarjeta completa queda dentro del viewport sin desplazar la página

#### Scenario: El footer del sitio sigue disponible
- **WHEN** el cliente desplaza la página hacia abajo en un armador de escritorio
- **THEN** llega al footer del sitio como hasta ahora

### Requirement: Tarjeta del armador visible completa en móvil
En viewports de menos de 1024 px de ancho y al menos 540 px de alto, la tarjeta de cada armador SHALL mostrarse completa dentro del viewport al cargar la página y en cada paso del asistente, con la vista previa, el indicador de paso y los botones del pie visibles sin desplazar la página. El alto MUST calcularse sobre el viewport con la barra del navegador visible.

#### Scenario: Paso inicial del asistente en un teléfono
- **WHEN** el cliente abre Helado Hope o Mixo Hope en un viewport de 390×844 sin desplazar la página
- **THEN** ve completos la vista previa, el encabezado del paso y el botón de avanzar, y el borde inferior de la tarjeta queda dentro del viewport

#### Scenario: Pasos con muchas opciones
- **WHEN** el cliente avanza al paso de toppings o de siropes en un viewport de 375×667
- **THEN** la tarjeta conserva el mismo alto y posición, y "Atrás", "Siguiente" o "Añadir al carrito" siguen visibles sin desplazar la página

#### Scenario: Barquilla y Milkshake en un teléfono pequeño
- **WHEN** el cliente abre Barquilla o Milkshake en un viewport de 360×640
- **THEN** la tarjeta completa queda dentro del viewport, con la vista previa y "Añadir al carrito" visibles

#### Scenario: Tablet en vertical
- **WHEN** el cliente abre un armador en un viewport de 768×1024
- **THEN** la tarjeta completa queda dentro del viewport sin desplazar la página

### Requirement: Scroll interno limitado a la zona de opciones
Cuando las opciones de un armador no caben en la tarjeta, el sistema SHALL desplazarlas dentro de una única zona de opciones de la tarjeta, mientras la vista previa y el pie con el total y los botones permanecen fijos. La zona de opciones MUST NOT tener desplazamiento horizontal ni áreas de scroll anidadas, y todas las opciones MUST ser alcanzables con ese scroll.

#### Scenario: Recorrer los toppings en móvil
- **WHEN** el cliente está en el paso de toppings de Helado Hope en un viewport móvil y desplaza la lista
- **THEN** se desplazan solo las opciones dentro de la tarjeta, llega hasta el último topping premium, y la vista previa y el pie no se mueven

#### Scenario: Recorrer las opciones en escritorio
- **WHEN** el cliente desplaza la columna de opciones de un armador en escritorio
- **THEN** llega hasta la última opción de sirope sin que la página se desplace mientras la lista tenga recorrido

#### Scenario: Cambio de paso reinicia la posición
- **WHEN** el cliente desplazó la lista de un paso y pulsa "Siguiente" o "Atrás" en el asistente móvil
- **THEN** el paso nuevo se muestra desde su inicio

#### Scenario: Opciones que caben completas
- **WHEN** las opciones del paso caben en la zona de opciones
- **THEN** no aparece barra de scroll interna

#### Scenario: La selección se refleja sin desplazar
- **WHEN** el cliente selecciona una opción que está al final de la lista
- **THEN** la vista previa y el total actualizados quedan visibles sin desplazar la página ni la lista

### Requirement: Tarjeta del armador alineada con la altura del navbar
La tarjeta de cada armador SHALL comenzar inmediatamente debajo del navbar con una separación de entre 8 y 24 px, sin quedar tapada por él, y SHALL adaptarse a la altura real del navbar.

#### Scenario: Separación con el navbar
- **WHEN** el cliente abre un armador en escritorio o en móvil
- **THEN** la separación entre el borde inferior del navbar y el borde superior de la tarjeta está entre 8 y 24 px

#### Scenario: El navbar cambia de altura
- **WHEN** la altura del navbar cambia por configuración del tema o por el ancho del viewport
- **THEN** la tarjeta sigue comenzando debajo del navbar y completa dentro del viewport

### Requirement: Respaldo en viewports de poca altura
En viewports de menos de 540 px de alto, el armador SHALL conservar el flujo con scroll de página en lugar del alto ajustado al viewport, de modo que todas las opciones y los botones de acción sigan siendo alcanzables.

#### Scenario: Teléfono en horizontal
- **WHEN** el cliente abre un armador en un viewport de 844×390
- **THEN** puede llegar a todas las opciones y a "Añadir al carrito" desplazando la página, sin controles recortados ni inaccesibles

### Requirement: Tamaño mínimo de texto en móvil
En viewports de menos de 1024 px de ancho, todo texto visible de los armadores (Helado Hope, Mixo Hope, Milkshake y Barquilla) SHALL medir al menos 12 px. Las etiquetas cortas en mayúsculas y negrita (antetítulo, etiqueta del total, gramos) MAY medir 11 px como mínimo. Los nombres de las opciones a elegir y el texto de los botones de acción MUST medir al menos 13 px.

#### Scenario: Nombres de toppings y siropes
- **WHEN** el cliente ve el paso de toppings o de siropes de Helado Hope, Mixo Hope o Barquilla en un viewport de 375×667
- **THEN** el nombre de cada opción mide al menos 13 px y se lee completo, sin recortes ni desplazamiento horizontal

#### Scenario: Botones de acción
- **WHEN** el cliente ve el pie de cualquiera de los cuatro armadores en un viewport móvil
- **THEN** el texto de "Atrás", del botón de avanzar y de "Añadir al carrito" mide al menos 13 px y cabe en una línea dentro del botón

#### Scenario: Etiquetas pequeñas
- **WHEN** el cliente ve el antetítulo del armador, la etiqueta "Total" o los gramos de un combo de Milkshake en un viewport móvil
- **THEN** cada una mide al menos 11 px

#### Scenario: Textos de apoyo
- **WHEN** el cliente ve el indicador de paso, el subtítulo de la base del helado o los ingredientes de un combo de Milkshake en un viewport móvil
- **THEN** cada uno mide al menos 12 px

#### Scenario: La tarjeta sigue entrando en el viewport
- **WHEN** el cliente abre cualquiera de los cuatro armadores en un viewport de 360×640 con los tamaños de texto mínimos aplicados
- **THEN** la tarjeta completa queda dentro del viewport y los botones del pie siguen visibles

#### Scenario: Escritorio sin cambios
- **WHEN** el cliente abre un armador en un viewport de al menos 1024 px de ancho
- **THEN** los tamaños de texto son los mismos que antes de este cambio

### Requirement: Encabezado compacto en el asistente móvil
En el asistente móvil de Helado Hope y Mixo Hope, el título del armador y el aviso de disponibilidad SHALL mostrarse solo en el primer paso, de modo que al entrar a un paso de toppings o de siropes se vean opciones sin desplazar la lista. El indicador de paso y el encabezado del paso MUST seguir visibles en todos los pasos.

#### Scenario: Primer paso con título y aviso
- **WHEN** el cliente abre Helado Hope o Mixo Hope en un viewport móvil
- **THEN** ve el título del armador y el aviso de disponibilidad sobre el primer paso

#### Scenario: Opciones visibles al entrar al paso de toppings
- **WHEN** el cliente avanza al paso de toppings en un viewport de 375×667 o 360×640
- **THEN** el título y el aviso de disponibilidad no se muestran, el indicador "Paso N de M" sí, y al menos dos opciones se ven completas sin desplazar la lista

#### Scenario: Volver al primer paso
- **WHEN** el cliente pulsa "Atrás" hasta el primer paso
- **THEN** el título y el aviso de disponibilidad vuelven a mostrarse

#### Scenario: Escritorio, Barquilla y Milkshake sin cambios
- **WHEN** el cliente abre un armador en escritorio, o Barquilla o Milkshake en móvil
- **THEN** el título y el aviso de disponibilidad se muestran siempre
