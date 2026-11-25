# Proposal

## Why

La home necesita una vitrina "Productos" con tarjetas independientes (Helado Hope, Mixo Hope, Milkshakes, Barquilla) que lleven a cada armador. Hoy no existe una sección donde cada tarjeta sea totalmente editable por separado (imagen, textos, colores, tamaños, espaciados y botón) ni con ajustes propios para móvil, así que cada cambio visual requiere tocar código.

## What Changes

- Nueva sección "Tarjetas de productos" con título opcional y una grilla responsive de tarjetas.
- Cada tarjeta es un bloque independiente que el comerciante agrega, ordena y elimina desde el editor.
- La imagen de cada tarjeta puede ser personalizada (subida) o tomarse del producto seleccionado; la personalizada tiene prioridad. Imagen móvil opcional.
- Título, texto y enlace del botón pueden heredarse del producto seleccionado o escribirse a mano.
- Cada tarjeta tiene sus propios ajustes de colores, tamaños de texto, padding, margin, radio de esquinas y botón (estilo, colores, radio, tamaño, icono flecha), con valores independientes para escritorio y móvil donde aplique.
- La sección define columnas por breakpoint (escritorio / tablet / móvil), separación, ancho y espaciado vertical, también con valores móviles independientes.
- Preset con las 4 tarjetas de la referencia visual.

## Capabilities

### New Capabilities
- `tarjetas-productos`: sección de vitrina con tarjetas de producto independientes, cada una configurable por separado y con ajustes responsive propios.

### Modified Capabilities
<!-- Ninguna: no cambia el comportamiento de specs existentes. -->

## Impact

- Archivos nuevos: `sections/product-tiles.liquid` y theme blocks bajo `blocks/` (tarjeta y sus piezas internas).
- Sin cambios en JavaScript, carrito, armadores ni datos de la tienda.
- Despliegue: commit + push a `develop` (tema `HOPE-development`); a `main` solo con pedido explícito.
- Riesgo de validación de schema en servidor no detectado por Theme Check (ver design.md).
