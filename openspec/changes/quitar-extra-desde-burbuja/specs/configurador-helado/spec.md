# Spec Delta

## ADDED Requirements

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
