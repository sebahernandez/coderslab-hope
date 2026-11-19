# Spec Delta

## ADDED Requirements

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

## MODIFIED Requirements

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
