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
El armador de la Barquilla SHALL mostrar como imagen principal la foto del cono con el sirope seleccionado, cuando ese sirope tiene una foto asignada. Sin sirope seleccionado SHALL mostrar la imagen base del cono. La foto es la única señal del sirope elegido en la vista previa: el armador de la Barquilla MUST NOT superponer una burbuja ni una insignia `+1` sobre la imagen. Este comportamiento MUST aplicarse solo al armador de la Barquilla; los armadores de Helado Hope, Mixo Hope y Milkshake MUST NOT cambiar.

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
Si el sirope seleccionado no tiene foto asignada, o su foto no carga, el armador de la Barquilla SHALL mostrar la imagen base del cono. La selección, el precio y la compra MUST seguir disponibles. Si el cliente cambia de sirope antes de que cargue una foto, MUST quedar visible la foto del último sirope elegido.

#### Scenario: Sirope sin foto asignada
- **WHEN** el cliente selecciona un sirope que no tiene foto asignada
- **THEN** la imagen principal muestra la imagen base del cono y el botón de compra queda habilitado

#### Scenario: Foto que no carga
- **WHEN** la foto del sirope seleccionado responde con error
- **THEN** la imagen principal muestra la imagen base del cono y no queda vacía

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
El armador de la Barquilla SHALL presentar los siropes en dos conjuntos con encabezado propio: "Clásicos", con la marca "Incluido", para los siropes estándar, y "Premium ★", con la marca "+$1.00", para los siropes premium. Los clásicos MUST conservar el orden definido en los datos del producto y los premium MUST mostrarse en orden alfabético por nombre. Todos los chips MUST tener el mismo ancho dentro de una grilla, con el nombre completo visible en varias líneas si no cabe en una. El costo MUST indicarse en el encabezado del conjunto y en el desglose del total: los chips MUST NOT repetir la estrella ★, la etiqueta "premium" ni el costo. Un conjunto sin siropes MUST NOT mostrarse. Los armadores de Helado Hope, Mixo Hope y Milkshake MUST NOT cambiar.

#### Scenario: Dos conjuntos con su costo
- **WHEN** el cliente abre el armador de la Barquilla
- **THEN** ve el conjunto "Clásicos" marcado "Incluido" con los siropes estándar y, debajo, el conjunto "Premium ★" marcado "+$1.00" con los siropes premium

#### Scenario: Premium en orden alfabético
- **WHEN** el cliente recorre el conjunto "Premium ★"
- **THEN** los siropes aparecen ordenados alfabéticamente, de "Buenissimo blanco" a "Variegato tiramisù italiano"

#### Scenario: Grilla uniforme en móvil
- **WHEN** el cliente abre el armador de la Barquilla a 390 px de ancho
- **THEN** los chips se muestran en dos columnas del mismo ancho, sin desplazamiento horizontal y sin nombres cortados

#### Scenario: Chip premium seleccionado
- **WHEN** el cliente selecciona "Crema Lotus"
- **THEN** el chip queda resaltado sin mostrar estrella, etiqueta ni costo, y el total indica que incluye $1.00 en sirope premium

#### Scenario: Otros armadores conservan su selector
- **WHEN** el cliente abre el armador de Helado Hope o Mixo Hope
- **THEN** los chips de sirope se muestran igual que antes del cambio, con la estrella ★ y la etiqueta premium en los premium
