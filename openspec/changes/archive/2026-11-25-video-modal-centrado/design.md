# Design

## Context

`.video-hope-modal__dialog` se abre con `showModal()` (vía `DialogComponent`) y se centra con `position: fixed` + `margin: auto`. Su regla `[open]` reutiliza los keyframes globales `elementSlideInTop` de `assets/base.css`, que animan `margin-top` de `var(--padding-sm)` a `0` con `forwards`. Al terminar, el valor final `margin-top: 0` persiste y pisa el `auto` superior: la modal queda arriba. Ver proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Centrado estable de la modal durante y después de la animación.
- Video completo en pantallas bajas.

**Non-Goals:**
- Cambiar `elementSlideInTop` global ni otras modales del tema (`.dialog-modal`, carrito, etc.).
- Cambiar comportamiento JS, accesibilidad o schema.

## Decisions

1. **Keyframes propios en el stylesheet de la sección** (`video-hope-modal-in` / `video-hope-modal-out`) que animan solo `opacity` y `transform: translateY(...)`. Así `margin: auto` no se toca y el centrado lo resuelve la UA del `<dialog>` modal.
   - Alternativa descartada: editar `elementSlideInTop` en `base.css` → afecta a todas las modales del tema que hoy dependen de él.
   - Alternativa descartada: quitar `forwards` → el centrado se arregla al final, pero el salto de margen durante la animación sigue moviendo el layout; además AGENTS.md pide animar `transform`/`opacity`.
2. **Centrado explícito**: declarar `inset: 0`, `margin: auto` y `height: fit-content` en el dialog para no depender de estilos por defecto de la UA ni de reglas globales de `dialog`.
3. **Ancho limitado por la altura**: `width: min(92vw, 1000px, calc(92dvh * 16 / 9))`, para que el reproductor 16:9 nunca supere `92dvh` en móvil horizontal. Se mantiene `max-height: 92dvh` como red de seguridad.
4. **Movimiento reducido**: con `prefers-reduced-motion: reduce`, la animación queda solo en `opacity` (sin desplazamiento).

## Risks / Trade-offs

- [Navegadores sin `dvh`] → añadir antes un fallback con `vh` en `width` y `max-height`.
- [El cierre usa la clase `dialog-closing` que `DialogComponent` espera por `animationend`] → la nueva animación de cierre sigue existiendo en `.dialog-closing`, así que el evento se dispara igual; verificar que la modal se cierra y el video se detiene.
