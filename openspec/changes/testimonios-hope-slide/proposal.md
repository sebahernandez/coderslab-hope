# Proposal

> **Estado: planificado para el futuro.** No implementar hasta que se pida. Depende de que `seccion-testimonios-hope` esté implementado y archivado (crea la capability `testimonios-hope`). Faltan `design.md` y `tasks.md`, que se generan al retomarlo.

## Why

La sección "Testimonios Hope" nace estática con 3 testimonios. Cuando haya más testimonios, mostrarlos todos a la vez alarga la página; un modo slide permite mostrar varios en el mismo espacio y navegar entre ellos, sobre todo en móvil.

## What Changes

- Nuevo ajuste de sección "Modo de visualización": `Grilla` (actual, por defecto) o `Slide`.
- En modo `Slide`: carrusel con deslizamiento táctil, flechas anterior/siguiente y paginación por puntos, testimonios visibles por vista configurables en escritorio y móvil, y autoplay opcional desactivado por defecto.
- En modo `Grilla`, el comportamiento actual se mantiene sin cambios; los datos guardados de las secciones existentes siguen funcionando.

## Capabilities

### New Capabilities
<!-- Ninguna. -->

### Modified Capabilities
- `testimonios-hope`: la grilla estática pasa a ser uno de dos modos; se agrega el modo slide.

## Impact

- `sections/testimonios-hope.liquid` (ajustes y markup del modo slide) y probablemente un módulo JS para la navegación, o reutilizar el carrusel existente del tema si encaja.
- Compatibilidad: el default `Grilla` preserva las secciones ya configuradas.
