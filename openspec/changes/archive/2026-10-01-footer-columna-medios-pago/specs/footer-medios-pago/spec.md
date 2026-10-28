# Spec Delta

## Purpose

Permitir que los visitantes reconozcan los medios de pago de Hope mediante una columna del footer integrada con su organización y presentación en desktop y móvil.

## ADDED Requirements

### Requirement: Columna de medios de pago

El footer SHALL presentar una columna titulada «Medios de pago» después de Horario. SHALL conservar el contenido y el orden relativo de las columnas existentes: marca, menú, ubicación y horario, así como la zona inferior de políticas.

#### Scenario: Consulta del footer
- **WHEN** un visitante llega al footer
- **THEN** encuentra la columna de medios de pago después de Horario y las columnas y políticas existentes conservan su contenido y orden relativo

### Requirement: Imágenes de los medios de pago

La columna SHALL mostrar las imágenes seleccionadas desde la biblioteca de Shopify para Stripe, Zelle y Pago Móvil. El orden inicial SHALL ser Stripe, Zelle y Pago Móvil; el orden guardado por el administrador SHALL determinar su presentación. Cada imagen SHALL conservar su proporción, mostrar el logo completo y tener un nombre accesible correspondiente: Stripe, Zelle o Pago Móvil.

#### Scenario: Imágenes configuradas
- **WHEN** se carga el footer con las tres imágenes configuradas
- **THEN** los logos se cargan desde Shopify, sin recorte ni deformación, en el orden Stripe, Zelle y Pago Móvil, con nombres accesibles

### Requirement: Integración visual responsive

La nueva columna SHALL heredar los colores y la tipografía del footer y mantener una alineación y espaciado coherentes con las columnas informativas. En desktop ancho SHALL compartir la fila de columnas; en móvil SHALL apilarse después de Horario. En anchos intermedios SHALL permitir redistribución sin recortar contenido ni generar desplazamiento horizontal.

#### Scenario: Desktop ancho
- **WHEN** se consulta el footer a 1440 px de ancho
- **THEN** las cinco columnas comparten la fila, los logos son legibles y la nueva columna mantiene el estilo de las columnas informativas

#### Scenario: Móvil estrecho
- **WHEN** se consulta el footer a 320 o 390 px de ancho
- **THEN** las columnas se apilan en su orden, Medios de pago aparece después de Horario y no existe desbordamiento horizontal provocado por el footer

#### Scenario: Anchos intermedios
- **WHEN** se consulta el footer a 749, 750, 1024 o 1280 px de ancho
- **THEN** todos los contenidos y logos permanecen visibles, sin solaparse ni provocar desplazamiento horizontal, conservando el orden de lectura

### Requirement: Configuración desde el editor del tema

El editor del tema SHALL ofrecer un bloque «Medio de pago» por medio, con selector de imagen y nombre editable. SHALL permitir seleccionar o reemplazar individualmente las imágenes y reordenar los bloques. Si una imagen no está configurada, el footer SHALL mantener identificable el medio correspondiente mediante su nombre y evitar imágenes rotas o placeholders visibles al visitante.

#### Scenario: Configuración inicial
- **WHEN** la columna se incorpora al tema sin imágenes seleccionadas
- **THEN** muestra los nombres Stripe, Zelle y Pago Móvil, y cada bloque ofrece un selector de imagen en el editor

#### Scenario: Reordenar medios
- **WHEN** el administrador mueve Pago Móvil antes de Zelle y guarda
- **THEN** el footer presenta Stripe, Pago Móvil y Zelle en el orden configurado, en desktop y móvil

#### Scenario: Sustitución de imagen
- **WHEN** el administrador reemplaza la imagen de Zelle desde el editor y guarda
- **THEN** el footer muestra la imagen seleccionada sin cambiar Stripe, Pago Móvil ni el orden de los medios

#### Scenario: Imagen sin configurar
- **WHEN** se elimina la selección de una de las imágenes
- **THEN** el nombre del medio sigue visible y no se muestra una imagen rota ni un placeholder
