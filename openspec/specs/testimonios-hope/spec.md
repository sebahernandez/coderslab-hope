# Testimonios Hope

## Purpose

Define cómo la sección "Testimonios Hope" muestra opiniones de clientes en tarjetas independientes, cada una con avatar, estrellas, nombre y texto configurables, en una grilla responsive.

## Requirements

### Requirement: Testimonios como bloques independientes

La sección SHALL renderizar una tarjeta por cada bloque de testimonio, en el orden guardado. Cada testimonio SHALL poder agregarse, reordenarse, ocultarse y eliminarse sin afectar a los demás, y sus ajustes de colores, tamaños y espaciados MUST NOT alterar otras tarjetas.

#### Scenario: Color de borde distinto
- **WHEN** el comerciante cambia el color de borde solo del segundo testimonio
- **THEN** solo esa tarjeta cambia su borde

#### Scenario: Sin testimonios
- **WHEN** la sección no tiene bloques de testimonio
- **THEN** se muestran solo el título y subtítulo configurados, sin grilla vacía

### Requirement: Contenido de cada testimonio

Cada tarjeta SHALL mostrar avatar, calificación en estrellas, nombre y texto, renderizando cada elemento solo cuando tiene valor. La calificación SHALL configurarse de 1 a 5 y mostrar esa cantidad de estrellas llenas sobre 5, con un texto accesible que indique la calificación.

#### Scenario: Calificación de 4
- **WHEN** un testimonio tiene calificación 4
- **THEN** se ven 4 estrellas llenas y 1 vacía, y un lector de pantalla anuncia "4 de 5 estrellas"

#### Scenario: Sin avatar
- **WHEN** un testimonio no tiene imagen de avatar
- **THEN** la tarjeta se muestra sin avatar y el resto del contenido se mantiene alineado

### Requirement: Grilla estática sin carrusel

La sección SHALL mostrar todos los testimonios simultáneamente en una grilla con columnas configurables para escritorio, tablet y móvil, sin flechas, paginación ni desplazamiento automático.

#### Scenario: Tres testimonios en escritorio
- **WHEN** hay 3 testimonios y la sección se ve a 1280 px con 3 columnas
- **THEN** los 3 testimonios se ven en una fila, sin controles de navegación

### Requirement: Diseño responsive con ajustes móviles

En anchos de 749 px o menos la grilla SHALL usar las columnas móviles configuradas, y los tamaños de texto, padding y separaciones SHALL usar sus valores móviles. La sección MUST NOT generar scroll horizontal y los textos largos SHALL ajustarse dentro de la tarjeta.

#### Scenario: Vista móvil
- **WHEN** la sección se ve a 390 px con 1 columna móvil
- **THEN** los testimonios se apilan uno debajo del otro, sin scroll horizontal
