# Tasks

## 1. Sección

- [x] 1.1 Crear `sections/testimonios-hope.liquid` con contrato de sección, título/subtítulo (tamaños, colores, alineación, escritorio/móvil) y el track `<ul role="list">` con columnas escritorio/tablet/móvil y separaciones; verificar que sin bloques no se renderiza grilla vacía.
- [x] 1.2 Implementar el bloque `testimonial` (avatar, calificación 1–5, nombre, texto, fondo, borde, radio, padding, colores y tamaños con valores móviles) con `{{ block.shopify_attributes }}`; verificar que cambiar una tarjeta no altera las otras.
- [x] 1.3 Implementar las estrellas SVG con texto accesible "{n} de 5 estrellas" usando una clave en `locales/en.default.json` (agregarla si no existe); verificar que el lector de pantalla obtiene el texto y las estrellas son `aria-hidden`.
- [x] 1.4 Agregar preset "Testimonios Hope" con los 3 testimonios y colores de la referencia; verificar que al insertar la sección se ve como la imagen.

## 2. Validación y despliegue

- [x] 2.1 Validar JSON del schema, rangos (≥ 3 pasos, default alineado) y defaults de select con script; correr `shopify theme check` sin ofensas en los archivos tocados.
- [x] 2.2 Subir los archivos a un tema de desarrollo con `shopify theme push --only … --nodelete` y verificar que el servidor no reporta errores.
- [x] 2.3 Verificar en el editor a 1280, 800 y 390 px: 3 / 2 / 1 columnas, alturas iguales por fila, sin scroll horizontal ni controles de carrusel.
- [x] 2.4 Commit + push a `develop` y confirmar que el archivo aparece en `HOPE-development`.

## Workflow follow-up

- Push a `main` (tema live) solo con pedido explícito del usuario.
- Archivar el cambio tras la verificación.
- El modo slide queda en el cambio `testimonios-hope-slide`.
