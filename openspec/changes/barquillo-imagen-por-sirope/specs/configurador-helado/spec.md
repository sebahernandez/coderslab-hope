# Spec Delta

## ADDED Requirements

### Requirement: Vista previa de la Barquilla según el sirope elegido
El armador de la Barquilla SHALL mostrar como imagen principal la foto del cono con el sirope seleccionado, cuando ese sirope tiene una foto asignada. Sin sirope seleccionado SHALL mostrar la imagen base del cono. Este comportamiento MUST aplicarse solo al armador de la Barquilla; los armadores de Helado Hope, Mixo Hope y Milkshake MUST NOT cambiar.

#### Scenario: Elegir un sirope con foto
- **WHEN** el cliente selecciona "Nutella" en el armador de la Barquilla
- **THEN** la imagen principal pasa a ser la foto del cono con Nutella

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
- **THEN** la imagen principal de ese armador se comporta igual que antes del cambio

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
- **THEN** ve los chips de los 9 siropes nuevos, cada uno con su miniatura, la estrella ★ y la etiqueta premium

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

