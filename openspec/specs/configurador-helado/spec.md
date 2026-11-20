# Configurador de Helado (Armador "Crea tu Hope")

## Purpose

Permitir que el cliente arme su helado personalizado en la página de producto, eligiendo toppings y
siropes con vista previa en tiempo real, y añadirlo al carrito. Cubre las dos variantes de interfaz
en producción: v1 multimodo (swap de imágenes Cloudinary) y v2 con burbujas "+1" flotantes sobre un
vaso fijo.

## Requirements

### Requirement: Selección múltiple de toppings y siropes

El sistema SHALL permitir seleccionar múltiples toppings y siropes sin límite superior, respetando
las reglas de inclusión del modelo de cobro (ver capacidad `cobro-extras`).

#### Scenario: El cliente elige varios toppings

- **WHEN** el cliente marca tres chips de topping estándar
- **THEN** los tres quedan seleccionados y la vista previa refleja cada extra elegido

#### Scenario: Validación mínima de sirope

- **WHEN** el cliente intenta añadir al carrito sin ningún sirope seleccionado
- **THEN** el sistema muestra un aviso de validación y no añade el producto

### Requirement: Vista previa dinámica del armado

El sistema SHALL actualizar la vista previa del helado al cambiar la selección: la v1 intercambia la
composición de imagen Cloudinary (cuenta `slealu5f`, carpeta `hope/catalog`) y la v2 muestra una
burbuja circular con insignia rosa `+1` anclada sobre el helado por cada extra.

#### Scenario: Preview v2 al agregar un extra (burbuja)

- **WHEN** el cliente selecciona un topping en la interfaz v2 (`custom-product-v2.liquid`)
- **THEN** aparece una burbuja con el emoji/imagen del ingrediente en su ancla calibrada y la última
  seleccionada lleva anillo rosa

### Requirement: Quitar un extra desde su burbuja

En los armadores de Helado Hope y Mixo Hope, cada burbuja `+1` de la vista previa SHALL ser un control que quita de la selección el extra que representa. Quitar un extra desde su burbuja MUST producir el mismo resultado que deseleccionar su chip: el chip vuelve a su estado sin seleccionar y el total se recalcula con las reglas de cobro vigentes. Activar una burbuja MUST NOT añadir extras ni modificar el tamaño o la base. La Barquilla y el Milkshake MUST NOT cambiar.

#### Scenario: Quitar un topping desde su burbuja

- **WHEN** el cliente tiene un topping seleccionado y hace clic o toca su burbuja
- **THEN** la burbuja desaparece, el chip de ese topping queda sin seleccionar y sin pill de costo, y el resumen de extras deja de contarlo

#### Scenario: Se descuenta un básico adicional

- **WHEN** el cliente tiene 3 toppings básicos seleccionados y quita uno desde su burbuja
- **THEN** el total baja en el costo de un básico adicional y los 2 toppings restantes muestran "Incluido"

#### Scenario: Quitar un incluido reasigna el cupo

- **WHEN** el cliente tiene 3 toppings básicos y quita desde su burbuja uno de los dos que figuraban como "Incluido"
- **THEN** el topping que tenía costo adicional pasa a mostrar "Incluido" y el total baja en el costo de un básico adicional

#### Scenario: Se descuenta un premium

- **WHEN** el cliente quita desde su burbuja un topping o sirope premium
- **THEN** el total baja en el costo de un premium y el desglose de extras refleja el nuevo monto

#### Scenario: Quitar el único sirope

- **WHEN** el cliente tiene un solo sirope seleccionado y lo quita desde su burbuja
- **THEN** el botón de añadir al carrito queda deshabilitado y se muestra la misma indicación de sirope faltante que al deseleccionar el chip

#### Scenario: Quitar con el chip en otro paso del asistente móvil

- **WHEN** en el asistente móvil el cliente está en el paso de siropes y quita un topping desde su burbuja
- **THEN** el total se actualiza de inmediato y, al volver al paso de toppings, ese chip aparece sin seleccionar

#### Scenario: Volver a elegir un extra quitado

- **WHEN** el cliente quita un extra desde su burbuja y luego selecciona de nuevo su chip
- **THEN** el extra vuelve a quedar seleccionado, con su burbuja y su costo, como en cualquier selección nueva

#### Scenario: El carrito refleja la selección tras quitar

- **WHEN** el cliente quita un extra desde su burbuja y luego añade el producto al carrito
- **THEN** la línea añadida no incluye ese extra ni su costo

#### Scenario: La burbuja se reconoce como accionable

- **WHEN** el cliente pasa el cursor sobre una burbuja o la enfoca con teclado
- **THEN** el cursor es de puntero, la insignia `+1` cambia a `×` y, con teclado, el foco es visible

#### Scenario: Quitar con teclado

- **WHEN** el cliente enfoca una burbuja con el teclado y pulsa Enter o Espacio
- **THEN** el extra se quita y el foco pasa a la burbuja que ocupa su lugar, o a la anterior si era la última, o a la capa de burbujas si no queda ninguna

#### Scenario: Nombre accesible de la burbuja

- **WHEN** una tecnología de asistencia lee una burbuja
- **THEN** la anuncia como un botón cuyo nombre indica la acción y el extra, por ejemplo "Quitar Fresa"

#### Scenario: Aviso al quitar

- **WHEN** el cliente quita un extra desde su burbuja
- **THEN** se muestra un aviso breve con el nombre del extra quitado y ese aviso se anuncia una sola vez a lectores de pantalla

#### Scenario: Área táctil suficiente en móvil

- **WHEN** el cliente ve las burbujas en un ancho de teléfono
- **THEN** cada burbuja responde al toque en un área de al menos 44 × 44 px aunque su círculo visible sea menor

#### Scenario: Otros armadores sin cambios

- **WHEN** el cliente abre la Barquilla o el Milkshake
- **THEN** su vista previa y su selección se comportan igual que antes del cambio

### Requirement: Inicialización idempotente de la sección

El sistema SHALL inicializar el configurador de forma idempotente por raíz de sección y re-inicializar
tras `shopify:section:load`, evitando doble inicialización cuando el asset global se carga en toda la
tienda.

#### Scenario: Recarga de la sección en el editor de temas

- **WHEN** Shopify dispara `shopify:section:load` sobre la sección del configurador
- **THEN** el configurador se re-inicializa una sola vez sin duplicar estado ni listeners

### Requirement: Aislamiento de estilos y de inicialización por variante

El sistema SHALL scopear todos los estilos bajo `.hopecfg` y usar atributos raíz distintos por
variante (`data-hopecfg` para v1, `data-hopecfg-v2` para v2) para que el JS global de v1 no capture la
sección v2.

#### Scenario: v2 no es capturada por el JS global de v1

- **WHEN** la página v2 se carga con el asset global `toppings-customizer.js` presente
- **THEN** el JS global (que inicializa sobre `[data-hopecfg]`) no inicializa la raíz v2
  (`[data-hopecfg-v2]`)

### Requirement: Flujo de armado en tres pasos

El sistema SHALL guiar el armado en tres pasos ordenados: (1) elegir tamaño, (2) elegir toppings,
(3) elegir sirope. El tamaño SHALL ser de selección única; toppings y siropes SHALL ser de
selección múltiple. Cuando hay
un sabor del mes vigente (ver capacidad `sabor-del-mes`), el sistema SHALL anteponer el paso
"Elige la base del helado" (selección única), quedando cuatro pasos ordenados: base, tamaño,
toppings, sirope; la numeración visible de los grupos SHALL ajustarse en consecuencia.

#### Scenario: Recorrido de los tres pasos

- **WHEN** el cliente abre el armador y no hay sabor del mes vigente
- **THEN** ve los pasos "Elige tu tamaño", "Elige tus toppings" y "Elige tu sirope" en ese orden,
  con el tamaño como selección única y toppings/siropes como selección múltiple

#### Scenario: Recorrido de cuatro pasos con sabor del mes

- **WHEN** el cliente abre el armador y hay sabor del mes vigente
- **THEN** ve "1 · Elige la base del helado", "2 · Elige tu tamaño", "3 · Elige tus toppings" y
  "4 · Elige tu sirope" en ese orden, y el indicador móvil muestra "Paso 1 de 4"

#### Scenario: Aplica por igual a Helado Hope y Mixo Hope

- **WHEN** el armador se sirve para Helado Hope o para Mixo Hope (misma sección `custom-product-v2`)
- **THEN** el flujo (de tres o cuatro pasos según haya sabor vigente) es idéntico, diferenciándose
  solo la tabla de precios base del producto

### Requirement: Etiqueta dinámica del botón de avanzar de paso

En la vista móvil, el botón que avanza de paso en el wizard v2 SHALL mostrar el número del paso al
que lleva ("Continuar paso 2", "Continuar paso 3") en vez de un texto genérico, actualizándose junto
con el resto del estado del wizard cada vez que cambia el paso activo, incluida la carga inicial.

#### Scenario: Etiqueta al iniciar el armador (paso 1 de 3)

- **WHEN** el cliente abre el armador y ve el paso 1 de 3 (tamaño)
- **THEN** el botón de avanzar muestra el texto "Continuar paso 2"

#### Scenario: Etiqueta al avanzar al paso 2 de 3

- **WHEN** el cliente presiona el botón de avanzar desde el paso 1 (tamaño) y llega al paso 2 de 3
  (toppings)
- **THEN** el botón de avanzar muestra el texto "Continuar paso 3"

#### Scenario: Botón de avanzar oculto en el último paso

- **WHEN** el cliente llega al último paso (sirope), sea el 3 de 3 o el 4 de 4
- **THEN** el botón de avanzar no se muestra (solo aparecen "Atrás" y "Añadir al carrito"), por lo que
  no hay una etiqueta que apunte a un paso inexistente

#### Scenario: Etiquetas con cuatro pasos

- **WHEN** hay sabor del mes vigente y el cliente está en el paso 3 de 4 (toppings)
- **THEN** el botón de avanzar muestra "Continuar paso 4"

### Requirement: Tamaño táctil consistente de los controles del wizard móvil

En la vista móvil (`max-width: 1023px`) el sistema SHALL mostrar los controles de navegación del pie
del wizard v2 ("Atrás", "Siguiente" y "Añadir al carrito") con una altura consistente entre sí de al
menos 44px (mínimo táctil del tema), de modo que ninguno se vea notoriamente más delgado que el resto
de los controles de la misma fila (incluido el botón circular "Reiniciar").

#### Scenario: Altura consistente entre Atrás, Siguiente y Añadir al carrito

- **WHEN** el cliente ve el pie del armador v2 en un viewport móvil (`max-width: 1023px`)
- **THEN** los botones "Atrás", "Siguiente" y "Añadir al carrito" comparten la misma altura, de al
  menos 44px

#### Scenario: Botón "Siguiente" visible solo en su propia fila

- **WHEN** el cliente está en el paso de tamaño o de toppings y "Atrás" o los botones del último paso
  están ocultos
- **THEN** "Siguiente" ocupa el ancho disponible de la fila manteniendo la nueva altura, sin verse
  comprimido ni desalineado

### Requirement: Precio del tamaño visible en dólares desde la carga
En el armador v2, cada tarjeta de tamaño (Pequeño, Mediano, Grande) SHALL mostrar el precio base en
dólares de su variante sin extras desde el primer render del HTML, sin depender de que se ejecute el
JavaScript. Las tarjetas MUST NOT mostrar texto provisional en onzas ni cambiar de contenido o de tamaño
cuando el JavaScript termina de cargar.

#### Scenario: Primer render con precios
- **WHEN** el cliente abre Helado Hope o Mixo Hope y el JavaScript del armador todavía no se ejecutó
- **THEN** las tarjetas de tamaño muestran el precio base de cada tamaño en dólares (por ejemplo
  $6.00, $7.50 y $9.00 en Helado Hope) y no muestran "4 oz", "8 oz" ni "12 oz"

#### Scenario: Sin salto al cargar el JavaScript
- **WHEN** el JavaScript del armador termina de inicializarse
- **THEN** el texto y la estructura del precio de cada tarjeta de tamaño quedan iguales a los del primer
  render, sin cambio de layout visible

#### Scenario: Variante de tamaño no disponible en los datos
- **WHEN** no existe una variante sin extras para alguno de los tamaños
- **THEN** esa tarjeta muestra un texto de respaldo neutral ("—") en lugar de onzas, y las demás tarjetas
  siguen mostrando su precio

### Requirement: Aviso de disponibilidad con diseño único
Todos los armadores (Helado Hope, Mixo Hope, Barquillo y Milkshake) SHALL mostrar el aviso de disponibilidad con el mismo diseño visual: fondo rosado claro, borde fino rosado, esquinas redondeadas, texto de 12px en peso medio y color rosado apagado, e ícono de 16px que hereda el color del texto. Ningún armador MUST NOT aplicar un estilo propio distinto al aviso.

#### Scenario: Mismo aspecto en Helado Hope y Milkshake
- **WHEN** el cliente abre el armador de Helado Hope y luego el de Milkshake con el aviso visible
- **THEN** ambos avisos tienen el mismo fondo, borde, radio, tamaño de texto, peso, color e ícono

#### Scenario: El texto cambia sin alterar el diseño
- **WHEN** la consulta de disponibilidad responde "Disponible solo para compra presencial", "Disponible solo para delivery", "Disponible para delivery y compra presencial" o un mensaje de error
- **THEN** solo cambia el texto del aviso; el diseño y el ícono se mantienen

### Requirement: Ícono de local en el aviso de disponibilidad
El aviso de disponibilidad SHALL mostrar un ícono de local/tienda (fachada con toldo) en lugar del ícono de camión, en todos los armadores y para todos los estados de disponibilidad. El ícono MUST ser decorativo y quedar oculto para tecnologías de asistencia.

#### Scenario: Ícono de local visible
- **WHEN** el cliente abre cualquier armador con el aviso visible
- **THEN** a la izquierda del texto aparece un ícono de local y no un camión

#### Scenario: Ícono ignorado por lectores de pantalla
- **WHEN** un lector de pantalla recorre el aviso
- **THEN** solo se anuncia el texto de disponibilidad, no el ícono

### Requirement: Ancho del armador alineado con el navbar

La tarjeta de cada armador SHALL tener el mismo ancho que el panel del navbar en todos los anchos de viewport, con sus bordes izquierdo y derecho alineados a los del navbar (tolerancia de 1 px), y sin provocar desplazamiento horizontal de la página.

#### Scenario: Alineación en anchos móviles
- **WHEN** un visitante abre cualquier armador (Helado Hope, Mixo Hope, Milkshake o Barquillo) a 320, 375, 390, 414, 640 o 749 px de ancho
- **THEN** los bordes izquierdo y derecho de la tarjeta del armador coinciden con los del navbar con una diferencia máxima de 1 px y la página no tiene desplazamiento horizontal

#### Scenario: Alineación en tablet y escritorio
- **WHEN** un visitante abre cualquier armador a 750, 1023, 1024, 1280, 1440, 1530, 1920 o 2560 px de ancho
- **THEN** los bordes izquierdo y derecho de la tarjeta coinciden con los del navbar con una diferencia máxima de 1 px, incluso cuando el navbar alcanza su ancho máximo y queda centrado

#### Scenario: Margen lateral configurado en el navbar
- **WHEN** el comerciante cambia la separación del borde del navbar de vidrio en el editor del tema
- **THEN** la tarjeta del armador usa ese mismo margen lateral en móvil y ambos siguen alineados

#### Scenario: Ancho de página del tema
- **WHEN** el comerciante cambia el ancho de página del tema
- **THEN** la tarjeta del armador adopta el mismo ancho máximo que el navbar en escritorio

#### Scenario: Navbar sin panel de vidrio
- **WHEN** el navbar de vidrio está desactivado o el header es transparente en esa plantilla
- **THEN** la tarjeta del armador usa el margen de página móvil del tema y la página no tiene desplazamiento horizontal

### Requirement: Vista previa de la Barquilla según el sirope elegido
El armador de la Barquilla SHALL mostrar como imagen principal la foto del cono con el sirope seleccionado, cuando ese sirope tiene una foto asignada. Sin sirope seleccionado SHALL mostrar la imagen base del cono. Con el sabor del mes seleccionado aplica la capacidad `sabor-del-mes`. La vista previa MUST NOT superponer una burbuja ni una insignia `+1` sobre la imagen. Este comportamiento MUST aplicarse solo a la Barquilla; los armadores de Helado Hope, Mixo Hope y Milkshake MUST NOT cambiar.

#### Scenario: Elegir un sirope con foto
- **WHEN** el cliente selecciona "Nutella" en el armador de la Barquilla
- **THEN** la imagen principal pasa a ser la foto del cono con Nutella

#### Scenario: Sin burbuja sobre la imagen
- **WHEN** el cliente selecciona cualquier sirope en el armador de la Barquilla
- **THEN** sobre la imagen principal no aparece ninguna burbuja ni insignia `+1`

#### Scenario: Cambiar de sirope
- **WHEN** el cliente tiene "Arequipe" seleccionado y elige "Sirope de fresa"
- **THEN** la imagen principal pasa a ser la foto del cono con sirope de fresa

#### Scenario: Deseleccionar el sirope
- **WHEN** el cliente vuelve a pulsar el sirope que tiene seleccionado
- **THEN** la imagen principal vuelve a la imagen base del cono

#### Scenario: Reiniciar el armador
- **WHEN** el cliente pulsa "Reiniciar" con un sirope seleccionado
- **THEN** la imagen principal vuelve a la imagen base del cono

#### Scenario: Otros armadores sin cambios
- **WHEN** el cliente selecciona un sirope en el armador de Helado Hope o Mixo Hope
- **THEN** la imagen principal de ese armador se comporta igual que antes del cambio y conserva sus burbujas `+1`

### Requirement: Respaldo de la vista previa de la Barquilla
Si el sirope seleccionado no tiene foto asignada, el armador de la Barquilla SHALL mostrar la imagen base del cono. Si la foto del sirope seleccionado no carga, SHALL mostrar el mensaje de imagen no disponible en lugar de una imagen de respaldo. La selección, el precio y la compra MUST seguir disponibles. Si el cliente cambia de sirope antes de que cargue una foto, MUST quedar visible la foto del último sirope elegido.

#### Scenario: Sirope sin foto asignada
- **WHEN** el cliente selecciona un sirope que no tiene foto asignada
- **THEN** la imagen principal muestra la imagen base del cono y el botón de compra queda habilitado

#### Scenario: Foto que no carga
- **WHEN** la foto del sirope seleccionado responde con error
- **THEN** la vista previa muestra "Imagen no disponible en este momento" y no la imagen base del cono, y el botón de compra queda habilitado

#### Scenario: Cambio rápido de sirope
- **WHEN** el cliente elige "Miel" y, antes de que cargue su foto, elige "Nutella"
- **THEN** la imagen que queda visible es la del cono con Nutella

### Requirement: Siropes premium adicionales de la Barquilla
El armador de la Barquilla SHALL ofrecer, además de los siropes actuales, 9 siropes premium ★: Buenissimo blanco, Buenissimo pistacchio, Crema Lotus, Perfetina arachide, Variegato amarena, Variegato arancia, Variegato gran crocante, Variegato gran nocciola y Variegato tiramisù italiano. Cada uno MUST mostrar una miniatura con su sirope en el chip y tener foto principal. Ningún sirope MUST aparecer dos veces en el selector.

#### Scenario: Sirope nuevo con miniatura
- **WHEN** el cliente abre el armador de la Barquilla
- **THEN** ve los chips de los 9 siropes nuevos dentro del conjunto "Premium ★", cada uno con su miniatura

#### Scenario: Precio de un sirope nuevo
- **WHEN** el cliente selecciona "Crema Lotus"
- **THEN** el total muestra $2.50, el chip indica +$1.00 y la imagen principal pasa a la foto del cono con Crema Lotus

#### Scenario: Línea del carrito con sirope nuevo
- **WHEN** el cliente agrega al carrito una Barquilla con "Variegato amarena"
- **THEN** se agrega una sola línea de la variante premium ($2.50) con la property "Sirope" = "Variegato amarena ★"

#### Scenario: Siropes actuales conservan su precio
- **WHEN** el cliente selecciona "Arequipe"
- **THEN** el total muestra $1.50 y el chip indica "Incluido"

#### Scenario: Sin siropes duplicados
- **WHEN** el cliente recorre el selector de siropes de la Barquilla
- **THEN** cada sirope aparece una sola vez (22 chips en total)

### Requirement: Miniaturas de sirope de la Barquilla
Cada chip de sirope del armador de la Barquilla SHALL mostrar como miniatura la barquilla con ese sirope aplicado, recortada de su foto principal. Los armadores de Helado Hope y Mixo Hope MUST conservar sus miniaturas actuales.

#### Scenario: Miniatura de un sirope existente
- **WHEN** el cliente abre el armador de la Barquilla
- **THEN** el chip "Sirope de fresa" muestra la barquilla con sirope de fresa y no el ícono del ingrediente

#### Scenario: Helado Hope conserva sus miniaturas
- **WHEN** el cliente abre el armador de Helado Hope
- **THEN** el chip "Sirope de fresa" muestra el mismo ícono de ingrediente que antes del cambio

### Requirement: Siropes de la Barquilla agrupados y ordenados
El armador de la Barquilla SHALL presentar los siropes en dos conjuntos con encabezado propio: "Clásicos", marcado "Incluido", para los siropes estándar, y "Premium ★", marcado "+$1.00", para los premium. Los clásicos MUST conservar el orden definido en los datos del producto y los premium MUST mostrarse en orden alfabético por nombre. Un conjunto sin siropes MUST NOT mostrarse.

#### Scenario: Dos conjuntos con su costo
- **WHEN** el cliente abre el armador de la Barquilla
- **THEN** ve el conjunto "Clásicos" marcado "Incluido" con los siropes estándar y, debajo, el conjunto "Premium ★" marcado "+$1.00" con los siropes premium

#### Scenario: Premium en orden alfabético
- **WHEN** el cliente recorre el conjunto "Premium ★"
- **THEN** los siropes aparecen ordenados alfabéticamente, de "Buenissimo blanco" a "Variegato tiramisù italiano"

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

### Requirement: Costo del chip seleccionado como pill sobre la caja
En el armador de Helado Hope y Mixo Hope, el costo del chip de topping o de sirope seleccionado SHALL mostrarse como una pill superpuesta sobre el borde superior de su caja, alineada al final. La pill MUST NOT reducir el ancho del nombre, cambiar el tamaño de la caja, tapar el contenido del chip ni superponerse a otros elementos. Un chip no seleccionado MUST NOT mostrar pill. El texto de la pill MUST ser legible sobre su fondo.

#### Scenario: Seleccionar no cambia el nombre ni la caja
- **WHEN** el cliente selecciona el topping premium de nombre más largo en un teléfono de 390 px de ancho
- **THEN** el nombre conserva el mismo número de líneas que antes de seleccionarlo, la caja conserva su alto y los demás chips no se desplazan

#### Scenario: Pill de costo adicional
- **WHEN** el cliente selecciona un sirope premium en Helado Hope
- **THEN** aparece sobre el borde superior de la caja de ese chip una pill con el costo del premium (por ejemplo "+$1.50") y el total suma ese costo

#### Scenario: Pill de incluido y de básico adicional
- **WHEN** el cliente selecciona tres toppings clásicos con dos incluidos
- **THEN** los dos primeros chips muestran la pill "Incluido" y el tercero muestra la pill con el costo del básico adicional

#### Scenario: Sin pill al deseleccionar
- **WHEN** el cliente deselecciona un chip que mostraba pill
- **THEN** la pill desaparece y la caja queda igual que antes de seleccionarla

#### Scenario: Pill en la primera fila y entre filas
- **WHEN** hay chips seleccionados en la primera fila de un conjunto y en filas contiguas
- **THEN** ninguna pill se superpone al encabezado del conjunto, a la nota del paso ni al chip de la fila superior, ninguna queda recortada y ninguna tapa el nombre ni la miniatura de su chip

#### Scenario: Mixo Hope igual que Helado Hope
- **WHEN** el cliente selecciona toppings y siropes en el armador de Mixo Hope
- **THEN** el costo se muestra en la misma pill y con el mismo comportamiento que en Helado Hope

#### Scenario: Lector de pantalla
- **WHEN** un lector de pantalla enfoca un chip seleccionado
- **THEN** anuncia el nombre del chip seguido de su costo

#### Scenario: Contraste de la pill
- **WHEN** se muestra la pill "Incluido" o la pill de un costo adicional
- **THEN** su texto tiene un contraste de al menos 4.5:1 sobre el fondo de la pill y los dos estados se distinguen por el texto, no solo por el color

#### Scenario: Barquilla y Milkshake sin cambios de contenido
- **WHEN** el cliente selecciona un sirope en la Barquilla o un combo en Milkshake
- **THEN** el chip de la Barquilla sigue sin mostrar costo y Milkshake se ve igual que antes del cambio

### Requirement: Indicador de carga en la vista previa
Los armadores de Helado Hope (v1 y v2), Mixo Hope, Milkshake y Barquilla SHALL mostrar un indicador de carga sobre la vista previa mientras la imagen de la selección actual no está lista, en la primera carga y en cada cambio de selección que cambie la imagen. Mientras carga, la imagen anterior SHALL quedar visible y atenuada. El indicador MUST desaparecer cuando la imagen se muestra, y MUST NOT aparecer si la imagen ya está disponible.

#### Scenario: Primera carga del armador
- **WHEN** el cliente abre un armador y la imagen base todavía no llegó
- **THEN** la vista previa muestra el indicador de carga hasta que la imagen base se muestra

#### Scenario: Cambio de selección con imagen lenta
- **WHEN** el cliente elige el sirope "Nutella" en la Barquilla y su foto tarda 2 segundos en llegar
- **THEN** durante esos 2 segundos la vista previa muestra la imagen anterior atenuada con el indicador de carga encima, y luego la foto del cono con Nutella sin indicador

#### Scenario: Imagen ya disponible
- **WHEN** el cliente vuelve a elegir una opción cuya imagen ya se cargó antes en esa visita
- **THEN** la imagen cambia sin que el indicador de carga llegue a verse

#### Scenario: Mismo comportamiento en los cuatro armadores
- **WHEN** el cliente cambia de combo en Milkshake, de base en Helado Hope o Mixo Hope con sabor del mes vigente, de topping o sirope en Helado Hope v1, o de sirope en la Barquilla, con la red lenta
- **THEN** en los cuatro casos la vista previa muestra el mismo indicador de carga hasta que la imagen nueva se muestra

#### Scenario: Cambio que no cambia la imagen
- **WHEN** el cliente cambia el tamaño en Helado Hope, que no cambia la imagen
- **THEN** no aparece el indicador de carga

### Requirement: Mensaje cuando la imagen no está disponible
Si la imagen de la selección actual responde con error, o no termina de cargar en 15 segundos, la vista previa SHALL mostrar el texto "Imagen no disponible en este momento" en lugar de la imagen. La vista previa MUST NOT mostrar el ícono de imagen rota del navegador, ni dejar visible la imagen de una selección anterior, ni dejar el indicador de carga girando.

#### Scenario: La imagen responde con error
- **WHEN** el cliente elige un combo en Milkshake y su imagen responde con error
- **THEN** la vista previa muestra "Imagen no disponible en este momento", sin ícono de imagen rota y sin indicador de carga

#### Scenario: La imagen no termina de cargar
- **WHEN** la imagen de la selección actual lleva 15 segundos sin terminar de cargar
- **THEN** la vista previa deja de mostrar el indicador de carga y muestra "Imagen no disponible en este momento"

#### Scenario: No queda la imagen de otra selección
- **WHEN** el cliente tiene visible el cono con "Miel", elige "Nutella" y la foto de Nutella responde con error
- **THEN** la vista previa muestra el mensaje y no la foto del cono con Miel

#### Scenario: Falla la imagen base al abrir
- **WHEN** el cliente abre un armador y la imagen base responde con error
- **THEN** la vista previa muestra "Imagen no disponible en este momento"

### Requirement: Armado y compra disponibles sin imagen
Mientras la vista previa muestra el indicador de carga o el mensaje de imagen no disponible, la selección, el precio y la compra MUST seguir funcionando igual que con la imagen visible. Los demás elementos de la vista previa (burbujas `+1`, insignia del sabor del mes y resumen de extras) MUST seguir reflejando la selección.

#### Scenario: Comprar con la imagen no disponible
- **WHEN** la vista previa de la Barquilla muestra "Imagen no disponible en este momento" con "Nutella" elegido y el cliente pulsa "Añadir al carrito"
- **THEN** la línea se agrega al carrito con `Sirope: Nutella ★` y el mismo precio que con la imagen visible

#### Scenario: Seguir armando mientras carga
- **WHEN** la vista previa muestra el indicador de carga y el cliente cambia otra opción
- **THEN** la opción queda seleccionada y el total se actualiza sin esperar a la imagen

### Requirement: Recuperación tras una imagen no disponible
Cuando la vista previa muestra el mensaje de imagen no disponible, cualquier cambio de selección, o volver a elegir la misma opción, SHALL pedir la imagen de nuevo. Si esa imagen carga, el mensaje MUST desaparecer y la imagen SHALL mostrarse.

#### Scenario: Otra opción carga bien
- **WHEN** la vista previa muestra el mensaje por la foto de "Nutella" y el cliente elige "Miel", cuya foto carga
- **THEN** el mensaje desaparece y se muestra la foto del cono con Miel

#### Scenario: Reintento sobre la misma opción
- **WHEN** la vista previa muestra el mensaje por la foto de "Nutella", el cliente deselecciona y vuelve a elegir "Nutella", y esta vez la foto carga
- **THEN** el mensaje desaparece y se muestra la foto del cono con Nutella

#### Scenario: Reiniciar el armador
- **WHEN** la vista previa muestra el mensaje y el cliente pulsa "Reiniciar"
- **THEN** el armador pide la imagen base y, si carga, la muestra sin mensaje

### Requirement: Solo cuenta la última selección
Con cambios rápidos de selección, la vista previa SHALL reflejar únicamente el resultado de la última selección. Ni la imagen ni el error de una selección anterior MUST quedar visibles cuando llegan tarde.

#### Scenario: Llega tarde la imagen anterior
- **WHEN** el cliente elige "Miel" y, antes de que cargue su foto, elige "Nutella", y la foto de Miel llega después que la de Nutella
- **THEN** la imagen que queda visible es la del cono con Nutella

#### Scenario: Llega tarde el error anterior
- **WHEN** el cliente elige "Miel", cuya foto va a fallar, y antes de que falle elige "Nutella", cuya foto carga
- **THEN** la vista previa muestra la foto del cono con Nutella y no el mensaje de imagen no disponible

### Requirement: Accesibilidad del estado de la vista previa
El mensaje de imagen no disponible SHALL anunciarse a los lectores de pantalla una vez por cada fallo, sin mover el foco. El indicador de carga MUST NOT anunciarse en cada cambio de selección. Con la preferencia de movimiento reducido activa, el indicador de carga MUST mostrarse sin animación de giro. El mensaje MUST ser legible sobre el fondo de la vista previa en los cuatro armadores.

#### Scenario: Lector de pantalla ante un fallo
- **WHEN** la imagen de la selección actual responde con error mientras el foco está en un chip de sirope
- **THEN** el lector de pantalla anuncia "Imagen no disponible en este momento" y el foco sigue en el chip

#### Scenario: Movimiento reducido
- **WHEN** el cliente tiene activa la preferencia de movimiento reducido y una imagen está cargando
- **THEN** el indicador de carga se ve, pero no gira

#### Scenario: Mensaje en pantalla angosta
- **WHEN** la vista previa muestra el mensaje a 375 px de ancho
- **THEN** el texto se lee completo dentro de la vista previa, sin recortes ni scroll horizontal

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
