# Spec Delta

## MODIFIED Requirements

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
