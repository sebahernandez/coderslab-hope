# Tasks

## 1. Bloque de tarjeta

- [x] 1.1 Crear `blocks/product-tile.liquid` con `{% doc %}`, schema agrupado (Producto, Imagen, Título, Texto, Botón, Tarjeta) y variantes móviles; verificar que el JSON del schema parsea y que todo `range` tiene ≥ 3 pasos y default alineado al step.
- [x] 1.2 Implementar la resolución de contenido (imagen personalizada → producto → placeholder; título/texto/enlace manual → producto) y el `<picture>` con imagen móvil; verificar con una tarjeta solo-producto, una solo-manual y una vacía en el editor.
- [x] 1.3 Implementar el botón (relleno/contorno, colores, hover, radio, tamaño, ancho completo móvil, flecha `aria-hidden`) y omitirlo sin texto; verificar foco visible con teclado.
- [x] 1.4 Escribir el CSS en `{% stylesheet %}` consumiendo custom properties por instancia con cambio a valores móviles ≤ 749 px; verificar que cambiar una tarjeta no altera las otras.

## 2. Sección contenedora

- [x] 2.1 Crear `sections/product-tiles.liquid` con contrato de sección, título opcional, `{% content_for 'blocks' %}` aceptando `product-tile`, columnas escritorio/tablet/móvil, separación, ancho, padding vertical y tamaño de título con variantes móviles; verificar que sin bloques no se renderiza grilla vacía.
- [x] 2.2 Agregar preset "Tarjetas de productos" con las 4 tarjetas de la referencia (Helado Hope, Mixo Hope, Milkshakes, Barquilla) y estilos de la imagen; verificar que al insertar la sección se ve como la referencia.

## 3. Validación y despliegue

- [x] 3.1 Correr `shopify theme check` filtrado a los archivos nuevos sin ofensas.
- [x] 3.2 Subir los archivos a un tema de desarrollo con `shopify theme push --only … --nodelete` y verificar que el servidor no reporta errores de schema (plan B: si el schema de la tarjeta es rechazado por tamaño, extraer el botón a `blocks/_product-tile-button.liquid` como bloque estático).
- [ ] 3.3 Verificar en el editor a 1280, 800 y 390 px: columnas 4/2/1, sin scroll horizontal, textos largos ajustados, imagen móvil aplicada.
- [ ] 3.4 Commit + push a `develop` y confirmar que los archivos aparecen en `HOPE-development` (pull del archivo desde el tema).

## Workflow follow-up

- Push a `main` (tema live) solo con pedido explícito del usuario.
- Archivar el cambio tras la verificación.
