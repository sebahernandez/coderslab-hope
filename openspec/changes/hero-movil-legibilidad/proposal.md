# Proposal

## Why

Un análisis con Playwright de la tienda live (`hopeheladeria.com`) a 360, 390 y 430 px muestra que en móvil la sección "Hero Banner Helados" (`sections/hero-text.liquid`) monta los textos sobre el sujeto de la foto de fondo: el texto oscuro (#630022) queda sobre la crema/chocolate en Helado Hope, Milkshakes y sobre todo en Contacto, donde el título y la descripción son prácticamente ilegibles. Además, los márgenes laterales se suman: 15 px de padding de la sección + 16 px del gutter de `section--page-width` = 31 px por lado (hasta 60–71 px en las variantes donde el bloque de texto de `min-width: 300px` queda centrado), lo que desperdicia ancho útil en pantallas angostas.

Evidencia (390 px): `textLeft` 31–40 px, `textRight` 42–51 px; el fondo usa `background-size: cover` + `background-position: center` fijo con altura mínima de 400 px, por lo que el recorte del sujeto depende del ancho del dispositivo y no se puede controlar.

## What Changes

- Reducir el espacio lateral en móvil a un único gutter (el `--page-margin` de 16 px del tema), eliminando el padding horizontal duplicado de la sección y el `min-width: 300px` del bloque de texto.
- Controlar la posición de la imagen de fondo: usar el punto focal que el comerciante define en Shopify (`image.presentation.focal_point`) y permitir sobrescribirlo por breakpoint (escritorio / móvil) con un ajuste de posición.
- Renderizar el fondo como imagen real responsiva (`<picture>` + `object-fit: cover` + `object-position`) en lugar de `background-image`, con `srcset`/`sizes`, dimensiones intrínsecas y carga prioritaria cuando es la primera sección.
- Nueva opción de altura móvil "Según la imagen" que usa la relación de aspecto de la imagen móvil para mostrarla completa sin recorte.
- Protección de contraste configurable: velo en degradado orientado hacia la zona del texto (derivado de la alineación horizontal y la posición vertical), velo sólido o ninguno, con color y opacidad elegibles, más sombra de texto opcional.
- Posicionamiento del contenido sobre una rejilla de 3×3 (horizontal × vertical) por breakpoint para que texto y velo compartan la misma zona.
- Ajustar los valores de las 7 instancias existentes (index, cómo-comprar, contacto) para que el texto sea legible en móvil.

## Capabilities

### New Capabilities
- `hero-banner`: presentación de la sección Hero Banner Helados — posicionamiento de imagen de fondo y contenido por breakpoint, protección de contraste del texto y márgenes laterales en móvil.

### Modified Capabilities
<!-- Ninguna: no existe un spec previo de la sección hero. -->

## Impact

- `sections/hero-text.liquid`: markup del fondo, CSS (mover a `{% stylesheet %}` estático + `{% style %}` dinámico), schema (nuevos settings; el actual tiene 12, quedará por debajo del límite).
- `blocks/_hero-text-row.liquid` y `blocks/_hero-button.liquid`: solo si la alineación del bloque debe heredar la zona de la sección (sin cambiar IDs de settings existentes).
- `templates/index.json`, `templates/page.como-comprar.json`, `templates/page.contact.json`: valores de los nuevos settings por instancia. Estos archivos se sincronizan desde el admin de Shopify; hay riesgo de conflicto con ediciones del comerciante.
- Sin dependencias nuevas; sin JavaScript nuevo.
