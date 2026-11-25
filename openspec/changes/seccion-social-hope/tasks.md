# Tasks

## 1. Sección

- [x] 1.1 Crear `sections/social-hope.liquid` con contrato de sección, layout de dos columnas (lado de imagen, ancho, alineación vertical, orden móvil, separación) e imagen con `<picture>`, imagen móvil, enlace opcional y placeholder; verificar en el editor que se apila a ≤ 749 px.
- [x] 1.2 Implementar los bloques `heading` y `text` (texto, etiqueta, tamaño escritorio/móvil, peso, color, espaciado) con `{{ block.shopify_attributes }}`; verificar que se pueden reordenar.
- [x] 1.3 Implementar el bloque `social_button` (texto, red → icono de `snippets/icon.liquid`, URL, destino `_blank`/`_self` con `rel="noopener noreferrer"`, posición del icono, estilo, colores normal/hover, radio, tamaño, ancho completo móvil) y agrupar botones consecutivos en una fila con wrap; verificar `target`/`rel` en el HTML renderizado y que sin URL no se renderiza fuera del editor.
- [x] 1.4 Agregar preset "Social Hope" con título, texto y botón `@hopesweetvzla` de Instagram y colores de la referencia; verificar que al insertar la sección se ve como la imagen.

## 2. Validación y despliegue

- [x] 2.1 Validar JSON del schema, rangos (≥ 3 pasos, default alineado) y defaults de select con script; correr `shopify theme check` sin ofensas en el archivo.
- [x] 2.2 Subir el archivo a un tema de desarrollo con `shopify theme push --only … --nodelete` y verificar que el servidor no reporta errores.
- [ ] 2.3 Verificar en el editor a 1280, 800 y 390 px: dos columnas / apilado, botones que se ajustan, sin scroll horizontal; probar un botón `_blank` y uno `_self`.
- [x] 2.4 Commit + push a `develop` y confirmar que el archivo aparece en `HOPE-development`.

## Workflow follow-up

- Push a `main` (tema live) solo con pedido explícito del usuario.
- Archivar el cambio tras la verificación.
