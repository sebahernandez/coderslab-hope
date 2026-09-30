# Tasks

## 1. Etiqueta dinámica en el botón de avanzar

- [x] 1.1 En `assets/hope-customizer-v2.js`, dentro de `setStep(i)` (líneas ~404-425), añadir lógica que
      actualice el texto de `.hope2__nav-label` dentro del botón `[data-step-next]` a "Continuar paso "
      + (paso destino humano), usando `STEP_LABELS.length` para no asumir siempre 3 pasos; verificar
      que la función sigue sin lanzar error cuando el botón no existe (defensivo, igual que el resto de
      `setStep`).
- [x] 1.2 En `sections/custom-product-v2.liquid` (línea ~285), cambiar el texto por defecto del
      `<span class="hope2__nav-label">` dentro de `.hope2__nav--next` de "Siguiente" a "Continuar paso
      2", como valor inicial coherente con lo que fija `setStep(0)` al cargar.
- [x] 1.3 Confirmar que el botón "Atrás" (`hope2__nav--prev`) y el botón final "Añadir al carrito" no
      se modifican.

## 2. Verificación visual en el armador real

- [x] 2.1 Levantar `shopify theme dev` y abrir el armador v2 (Helado Hope) en un viewport móvil
      (375×667) con Playwright; confirmado que en el paso 1 de 3 el botón de avanzar dice "Continuar
      paso 2" (captura de pantalla + lectura DOM).
- [x] 2.2 Clic en el botón de avanzar: en el paso 2 de 3 el texto cambia a "Continuar paso 3"; sin
      desborde (`scrollWidth === clientWidth === 152px`) y mismo alto (47.67px) que antes.
- [x] 2.3 Avanzado al paso 3 de 3: el botón de avanzar computa `display: none` (oculto), sin que se
      llegue a mostrar nunca una etiqueta "Continuar paso 4".
- [x] 2.4 Repetido en Mixo Hope (misma sección `custom-product-v2`): mismas etiquetas "Continuar paso
      2" → "Continuar paso 3", confirmando que el cambio aplica igual.
