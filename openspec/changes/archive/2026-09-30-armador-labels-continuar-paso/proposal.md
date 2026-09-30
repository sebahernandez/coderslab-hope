# Proposal

## Why

En el wizard móvil del armador v2 (`custom-product-v2.liquid`, usado por Helado Hope y Mixo Hope), el
botón que avanza de paso siempre dice "Siguiente", sin importar a qué paso lleva. El cliente pide que
en su lugar indique explícitamente el paso al que avanza: "Continuar paso 2" (desde el paso de tamaño,
que lleva al paso de toppings) y "Continuar paso 3" (desde el paso de toppings, que lleva al paso de
sirope), para que quede más claro cuánto falta del recorrido de 3 pasos.

## What Changes

- El botón de avanzar del wizard móvil (`.hope2__nav--next`) deja de mostrar el texto fijo "Siguiente"
  y en su lugar muestra "Continuar paso 2" cuando el cliente está en el paso 1 de 3 (tamaño) y
  "Continuar paso 3" cuando está en el paso 2 de 3 (toppings). El botón sigue oculto en el paso 3 de 3
  (sirope), donde ya no aplica avanzar de paso.
- El texto se actualiza dinámicamente junto con el resto del estado del wizard (indicador de paso,
  mostrar/ocultar botones) cada vez que cambia `data-step`, incluida la carga inicial en el paso 1.
- El botón "Atrás" no cambia (sigue diciendo "Atrás"); tampoco cambia el botón final "Añadir al
  carrito".
- Cambio de contenido/JS acotado al wizard móvil: no se modifica el flujo de 3 pasos, el orden, ni la
  lógica de habilitación de los botones.

## Capabilities

### New Capabilities

(ninguna)

### Modified Capabilities

- `configurador-helado`: se añade un requisito sobre la etiqueta dinámica del botón que avanza de paso
  en el wizard móvil, indicando el número de paso destino en vez de un texto genérico "Siguiente".

## Impact

- `sections/custom-product-v2.liquid`: texto inicial del `<span class="hope2__nav-label">` dentro de
  `.hope2__nav--next` (línea ~285), que pasa de "Siguiente" a "Continuar paso 2" como valor por defecto
  (para que coincida con lo que el JS fija de inmediato en el paso 1, y sirva de fallback si el JS no
  llegara a ejecutarse).
- `assets/hope-customizer-v2.js`: función `setStep()` (líneas ~404-425), que ya actualiza el indicador
  de paso (`STEP_LABELS`) y ahora también debe actualizar el texto de `.hope2__nav-label` dentro del
  botón `[data-step-next]` según el paso destino.
- Afecta a los dos productos que usan esta sección: Helado Hope y Mixo Hope. Milkshake no tiene este
  wizard y queda fuera de alcance.
- Solo vista móvil (el wizard de pasos y estos botones no se muestran en escritorio).
