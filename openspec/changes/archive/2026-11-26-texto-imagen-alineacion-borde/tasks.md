# Tasks

## 1. Esquema y lógica Liquid

- [x] 1.1 Agregar la opción `{ "value": "edge", "label": "Hacia el borde exterior" }` a `image_align` en el esquema de `sections/text-image.liquid`, con `info` que explique que sigue a "Imagen en escritorio" y se centra en móvil; conservar default `center` y los valores existentes. Verificar que el JSON del schema es válido y que la opción aparece en el editor.
- [x] 1.2 Resolver en el bloque `{% liquid %}` `image_justify` (escritorio: `edge` → `flex-end` si `media_side == 'end'`, si no `flex-start`) e `image_justify_mobile` (`edge` → `center`, resto igual a escritorio), y exponer `--ti-image-justify-mobile`. Verificar en el HTML renderizado los valores de las variables para `media_side` end/start.
- [x] 1.3 Calcular el `align-items` vertical para contain desde `image_position` (`top` → `flex-start`, `bottom` → `flex-end`, resto → `center`) y exponerlo como variable; agregar los modificadores `text-image__frame--contain-desktop` / `--contain-mobile` al marco (en `<a>` y `<div>`) solo cuando hay imagen y el encaje efectivo del breakpoint es `contain`. Verificar las clases en el HTML con `ratio: auto` y con ratio fijo + Contener.
- [x] 1.4 Actualizar el comentario de contrato de la sección para mencionar la alineación de la imagen contenida.

## 2. CSS

- [x] 2.1 En el `{% stylesheet %}`, estilos de `.text-image__frame--contain-desktop` (≥750 px) y `--contain-mobile` (≤749 px): marco `display: flex`, `justify-content` y `align-items` por variable, sin radio ni `overflow: hidden`; `picture` con `display: contents`; `img` con `object-fit: fill` y `border-radius: var(--ti-radius)`, dimensionada por eje según la proporción (`width: 100%; height: auto`, o `width: auto; height: 100%` con el modificador `--by-height-*` que Liquid agrega cuando la imagen es más angosta que el marco). Usar `--ti-image-justify-mobile` en móvil para el marco contain y para `.text-image__media`. Verificar con Playwright que "Cubrir" no cambia (captura antes/después).

## 3. Verificación

- [x] 3.1 Con `shopify theme dev` y Playwright sobre la home (ratio 3:2, Contener, imagen a la derecha), fijar "Hacia el borde exterior" y comprobar que el borde derecho del `img` coincide con el de `.text-image__media` y que las esquinas visibles están redondeadas; repetir con "A la izquierda".
- [x] 3.2 Verificar a 375 px que con "Hacia el borde exterior" la imagen queda centrada, y con `dir="rtl"` que inicio/final se invierten.
- [x] 3.3 Verificar que con alineación "Centro" (default) la posición de la imagen coincide con el render actual, y que `ratio: auto` sigue mostrando la imagen completa sin franjas.
- [x] 3.4 Correr `shopify theme check` sobre `sections/text-image.liquid` y resolver hallazgos válidos.

## Workflow follow-up

- Commit y push a `develop`; a `main` solo si se pide explícitamente.
- Archivar el cambio y sincronizar el spec `texto-imagen` tras verificar.
