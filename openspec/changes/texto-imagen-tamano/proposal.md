# Proposal

## Why

En la sección "Texto con imagen" (`sections/text-image.liquid`) el comerciante no puede achicar la imagen sin efectos secundarios: el único control (`media_width`) reduce la columna completa y desplaza el texto, y con la configuración guardada en la portada (proporción 5:4 + encaje "Cubrir") la foto se recorta. Se necesita reducir el tamaño visual de la imagen manteniendo su proporción original, sin recortes.

## What Changes

- Nuevo control **"Tamaño de la imagen"** (escritorio y móvil, en %) que escala la imagen dentro de su columna sin alterar el ancho de la columna ni la posición del texto.
- Nuevo control **"Alineación horizontal de la imagen"** para ubicar la imagen reducida dentro de su columna (inicio, centro, final).
- La opción de proporción **"Según la imagen"** pasa a garantizar que la imagen se muestre completa (sin recorte ni franjas vacías), independientemente del encaje elegido.
- Se mantienen intactos los IDs y valores existentes (`media_width`, `ratio_desktop`, `ratio_mobile`, `image_fit`); los nuevos settings tienen valores por defecto que reproducen el render actual (100 %), por lo que la configuración guardada no cambia de aspecto hasta que el comerciante la ajuste.

## Capabilities

### New Capabilities
- `texto-imagen`: comportamiento de la imagen de la sección "Texto con imagen": tamaño, proporción, encaje y alineación configurables por breakpoint.

### Modified Capabilities
<!-- Ninguna: la sección no tiene spec previo. -->

## Impact

- `sections/text-image.liquid`: schema (nuevos settings), variables CSS inline, reglas de `.text-image__media` / `.text-image__frame`, atributo `sizes` de la imagen.
- `templates/index.json`: sin cambios obligatorios; tras el despliegue el comerciante puede elegir "Según la imagen" y bajar el tamaño desde el editor.
- Sin JavaScript nuevo ni dependencias.
