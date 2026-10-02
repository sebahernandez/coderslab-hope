# Spec Delta

## Purpose

Define la distribución adaptable de los controles del navbar móvil de Hope para que sus accesos sean visibles, legibles y utilizables por separado.

## ADDED Requirements

### Requirement: Controles móviles sin solapamientos

El navbar SHALL mostrar los controles habilitados de búsqueda, cuenta, carrito y menú completamente visibles, sin intersección entre sus áreas táctiles ni con el logo, y sin desbordamiento horizontal, para anchos móviles entre 320 y 749 px.

#### Scenario: Visitante sin sesión
- **WHEN** un visitante sin sesión ve el navbar con búsqueda y cuentas habilitadas a 320, 360, 375, 390, 414 o 749 px
- **THEN** búsqueda, cuenta, carrito, menú y logo aparecen completos y sin solapamientos ni desplazamiento horizontal

#### Scenario: Cuenta autenticada o editor
- **WHEN** el navbar muestra el control de cuenta con sesión iniciada o en el editor del tema
- **THEN** los controles conservan la misma separación, incluido el avatar cuando corresponda

#### Scenario: Controles opcionales deshabilitados
- **WHEN** las cuentas o la búsqueda están deshabilitadas
- **THEN** los controles restantes se distribuyen sin solapamientos y no aparece un acceso deshabilitado ni una búsqueda duplicada

### Requirement: Espaciado y tamaño táctil móvil

Los accesos móviles SHALL tener áreas táctiles de al menos 44 × 44 px, alineación vertical común y una separación visible entre iconos. El logo SHALL conservar su centrado horizontal en el navbar y los controles SHALL quedar dentro de sus márgenes interiores.

#### Scenario: Pantalla móvil estrecha
- **WHEN** se muestra el navbar a 320 px con todos sus accesos habilitados
- **THEN** cada acceso mantiene al menos 44 × 44 px, el logo queda centrado y ningún control toca o excede el borde del navbar

### Requirement: Acciones independientes y compatibilidad

Los controles SHALL conservar sus etiquetas accesibles y funciones existentes. La corrección móvil SHALL conservar la distribución de escritorio a partir de 750 px.

#### Scenario: Activar búsqueda y cuenta por separado
- **WHEN** el usuario pulsa búsqueda y luego cuenta en móvil
- **THEN** búsqueda abre su modal y cuenta ejecuta exclusivamente el comportamiento correspondiente a la sesión descrito en `acceso-cuenta`

#### Scenario: Menú y carrito siguen disponibles
- **WHEN** el usuario activa menú o carrito en móvil
- **THEN** cada control ejecuta su acción existente sin activar controles adyacentes

#### Scenario: Cambio a escritorio
- **WHEN** el viewport pasa de 749 a 750 px o se muestra a 1280 px
- **THEN** el navbar conserva la distribución y funcionalidad de escritorio anteriores al cambio
