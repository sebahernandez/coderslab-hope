# Estructura del footer

## Purpose

Define la composición del footer de Hope: orden de las columnas informativas, separación con la zona de políticas y color de fondo, en escritorio y móvil.

## Requirements

### Requirement: Orden de columnas del footer

La fila principal del footer SHALL mostrar, de izquierda a derecha en escritorio, cuatro columnas: marca (logo y texto), menú principal, Ubicación con Horario debajo en la misma columna, y Medios de pago. En móvil las columnas SHALL apilarse en ese mismo orden de lectura.

#### Scenario: Escritorio
- **WHEN** se consulta el footer a 1440 px
- **THEN** se ven en una fila marca, menú, Ubicación/Horario y Medios de pago, en ese orden

#### Scenario: Móvil
- **WHEN** se consulta el footer a 390 px
- **THEN** las columnas se apilan en el orden marca, menú, Ubicación/Horario, Medios de pago, sin desbordamiento horizontal

### Requirement: Contenido conservado

La reorganización MUST conservar los enlaces del menú, el texto de marca, la dirección, el texto de horarios y los medios de pago con sus imágenes y nombres tal como estaban configurados.

#### Scenario: Enlaces del menú
- **WHEN** se consulta el footer después del cambio
- **THEN** el menú muestra los mismos enlaces que antes (Inicio, ¿Cómo comprar?, Productos, Contacto) apuntando a las mismas URLs

### Requirement: Divisor y zona de políticas

Bajo la fila principal el footer SHALL mostrar un divisor horizontal de ancho completo y, debajo, la lista de políticas de la tienda. En escritorio las políticas SHALL distribuirse a lo ancho del contenido; en móvil SHALL ajustarse en varias líneas centradas sin desbordamiento.

#### Scenario: Políticas en escritorio
- **WHEN** se consulta el footer a 1440 px con seis políticas publicadas
- **THEN** las seis aparecen en una línea bajo el divisor, distribuidas entre el borde izquierdo y derecho del contenido

### Requirement: Fondo blanco

El footer completo SHALL tener fondo blanco, manteniendo los títulos y enlaces en el color vino de la marca y el texto informativo legible sobre blanco.

#### Scenario: Color de fondo
- **WHEN** se consulta el footer
- **THEN** todo el footer, incluida la zona de políticas, tiene fondo blanco
