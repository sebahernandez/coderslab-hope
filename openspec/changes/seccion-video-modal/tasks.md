# Tasks

## 1. Componente de modal

- [x] 1.1 Crear `assets/video-modal.js` con `VideoModal extends DialogComponent` (inyecta el `<template>` del video en `showDialog`, vacía el reproductor en `closeDialog`, limpia en `disconnectedCallback`) y registrar `video-modal`; verificar que el archivo no tiene errores de sintaxis (`node --check`).
- [x] 1.2 Agregar `@theme/video-modal` al import map de `snippets/scripts.liquid`; verificar que el resto de entradas queda intacto (`git diff`).

## 2. Sección

- [x] 2.1 Crear `sections/video-hope-modal.liquid` con contrato de sección, layout de dos columnas (lado de media, ancho, alineación vertical, orden móvil), media con `<picture>` e imagen móvil y placeholder; verificar en el editor que se apila a ≤ 749 px.
- [x] 2.2 Implementar el botón de play centrado (solo con video) y la modal `<video-modal>` con `<dialog ref="dialog">`, botón de cerrar y `<template>` del video (subido con `video_tag`, YouTube nocookie / Vimeo con iframe); cargar el script del componente solo cuando hay video; verificar abrir, Escape, clic fuera, foco de vuelta al play y que al cerrar se detiene el audio.
- [x] 2.3 Implementar los bloques `heading`, `text` y `feature` (icono imagen/SVG, título, descripción, colores propios, tamaños escritorio/móvil) con grilla de columnas escritorio/móvil; verificar que cada tarjeta respeta sus colores.
- [x] 2.4 Usar claves de locale existentes (o agregarlas en `locales/en.default.json`) para "Reproducir video" y "Cerrar"; verificar que el botón de play y el de cerrar tienen nombre accesible.
- [x] 2.5 Agregar preset "Video Hope modal" con los textos y colores de la referencia; verificar que al insertar la sección se ve como la imagen.

## 3. Validación y despliegue

- [x] 3.1 Validar JSON del schema, rangos (≥ 3 pasos, default alineado) y defaults de select con script; correr `shopify theme check` sin ofensas en los archivos tocados.
- [x] 3.2 Subir los archivos a un tema de desarrollo con `shopify theme push --only … --nodelete` y verificar que el servidor no reporta errores.
- [ ] 3.3 Verificar en el editor a 1280, 800 y 390 px: dos columnas / apilado, grilla 2×2 y móvil, sin scroll horizontal; probar video subido y de YouTube.
- [ ] 3.4 Commit + push a `develop` y confirmar que los archivos aparecen en `HOPE-development`.

## Workflow follow-up

- Push a `main` (tema live) solo con pedido explícito del usuario.
- Archivar el cambio tras la verificación.
