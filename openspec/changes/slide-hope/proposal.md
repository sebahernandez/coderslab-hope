# Proposal

## Why

Hope necesita publicar banners promocionales (como "2 barquillas sabor Alegría") con piezas gráficas distintas para móvil y escritorio, siempre con bordes redondeados, y poder elegir entre un banner fijo o un carrusel. Las secciones actuales (`slideshow` de Horizon, `custom-image`, `slider-imperdibles`) no permiten imágenes independientes por breakpoint con control de ancho, altura y encaje por imagen.

## What Changes

- Nueva sección `sections/slide-hope.liquid` ("Slide Hope") agregable desde el editor del tema.
- Ajuste de sección **Modo**: `Slide` (carrusel) o `Fija` (una sola imagen, la del primer bloque).
- Las imágenes se agregan como **bloques** "Imagen", cada uno con:
  - Imagen de escritorio e imagen de móvil independientes (la móvil es opcional y cae a la de escritorio).
  - **Ancho**: `Centrado` (limitado al ancho máximo de página) o `Fullscreen` (ancho completo del viewport).
  - **Altura**: unidad (`Según la imagen`, `px`, `vh`, `vw`) con valor independiente para escritorio y móvil.
  - **Encaje** (`object-fit`): `cover` o `contain`, con posición del encuadre.
  - Enlace opcional y texto alternativo.
- Bordes redondeados SIEMPRE aplicados a la imagen (radio configurable, nunca 0).
- En modo Slide: autoplay opcional con velocidad, flechas y paginación, reutilizando el componente de slideshow de Horizon.

## Capabilities

### New Capabilities
- `slide-hope`: banner de imágenes de la sección Slide Hope — modo fijo/carrusel, imágenes por breakpoint, ancho centrado/fullscreen, altura y encaje por imagen, bordes redondeados.

### Modified Capabilities
<!-- Ninguna: no cambia el comportamiento de hero-banner ni de otras secciones. -->

## Impact

- Archivo nuevo: `sections/slide-hope.liquid` (markup, `{% stylesheet %}` y schema con bloques locales).
- Reutiliza snippets existentes `slideshow`, `slideshow-slide`, `slideshow-controls` y el módulo `slideshow.js` (ya cargado globalmente en `snippets/scripts.liquid`). Sin nuevas dependencias ni JS propio.
- Sin cambios en templates existentes; el comerciante la agrega desde el editor. Despliegue por push a `main`.
