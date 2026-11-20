# Spec Delta

## ADDED Requirements

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
