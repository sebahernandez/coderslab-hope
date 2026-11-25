# Spec Delta

## MODIFIED Requirements

### Requirement: Columna de medios de pago

El footer SHALL presentar una columna titulada «Medios de pago» como cuarta y última columna de la fila principal, después de la columna que agrupa Ubicación y Horario. SHALL conservar el contenido de las columnas existentes: marca, menú, ubicación y horario, así como la zona inferior de políticas.

#### Scenario: Consulta del footer
- **WHEN** un visitante llega al footer
- **THEN** encuentra la columna de medios de pago a la derecha de la columna Ubicación/Horario, y las columnas y políticas existentes conservan su contenido

### Requirement: Integración visual responsive

La columna SHALL heredar los colores y la tipografía del footer y mantener una alineación y espaciado coherentes con las columnas informativas. En desktop ancho SHALL compartir la fila de cuatro columnas; en móvil SHALL apilarse después de la columna Ubicación/Horario. En anchos intermedios SHALL permitir redistribución sin recortar contenido ni generar desplazamiento horizontal.

#### Scenario: Desktop ancho
- **WHEN** se consulta el footer a 1440 px de ancho
- **THEN** las cuatro columnas comparten la fila, los logos son legibles y en fila, y la columna mantiene el estilo de las columnas informativas

#### Scenario: Móvil estrecho
- **WHEN** se consulta el footer a 320 o 390 px de ancho
- **THEN** las columnas se apilan en su orden, Medios de pago aparece después de Ubicación/Horario y no existe desbordamiento horizontal provocado por el footer

#### Scenario: Anchos intermedios
- **WHEN** se consulta el footer a 749, 750, 1024 o 1280 px de ancho
- **THEN** todos los contenidos y logos permanecen visibles, sin solaparse ni provocar desplazamiento horizontal, conservando el orden de lectura
