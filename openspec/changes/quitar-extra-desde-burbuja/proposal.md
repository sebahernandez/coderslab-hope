# Proposal

## Why

En Helado Hope y Mixo Hope cada extra elegido aparece como una burbuja `+1` sobre el helado, pero la burbuja es solo decorativa: para quitar un extra el cliente tiene que volver a buscar su chip en el panel. En el asistente móvil ese chip suele estar en otro paso, así que corregir una selección obliga a navegar hacia atrás. La burbuja ya representa al extra; lo natural es poder quitarlo tocándola.

## What Changes

- Cada burbuja de la vista previa pasa a ser un control accionable: al hacer clic, tocarla o activarla con teclado, el extra que representa se quita de la selección.
- Quitar desde la burbuja equivale exactamente a deseleccionar el chip: la burbuja desaparece, el chip que la añadió vuelve a su estado normal (sin resaltado ni pill de costo), y el total, el desglose de extras, el contador de toppings, el aviso de costo adicional y el resumen de extras se recalculan.
- Las reglas de cobro no cambian: al quitar un básico incluido, el siguiente básico pasa a ocupar el cupo incluido; al quitar el único sirope, la compra vuelve a quedar bloqueada hasta elegir uno.
- La burbuja muestra que es accionable: cursor de puntero, y al pasar el cursor o recibir foco la insignia `+1` cambia a `×`.
- Al quitar un extra se muestra un aviso breve con su nombre ("Quitaste …"), que también se anuncia a lectores de pantalla.
- Las burbujas son alcanzables con teclado, tienen nombre accesible ("Quitar …") y, tras quitar una, el foco pasa a una burbuja vecina.
- Textos nuevos en `locales/en.default.json` y `locales/es.json`.

Fuera de alcance: deshacer la eliminación, reordenar burbujas, cambiar sus posiciones o su tope de 6, y cualquier cambio en la Barquilla o el Milkshake (no tienen burbujas).

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `configurador-helado`: se agrega el requisito de quitar un extra desde su burbuja en la vista previa de Helado Hope y Mixo Hope.

## Impact

- `assets/hope-customizer-v2.js`: `renderBubbles()` genera botones; nueva función compartida de alternar extra, usada por los chips y por las burbujas; listener delegado en `#hope-bubbles`; manejo de foco y aviso.
- `assets/hope-customizer-v2.css`: burbuja como botón (interacción, foco visible, área táctil, insignia `×`). Este archivo también lo carga la Barquilla, que no renderiza burbujas.
- `sections/custom-product-v2.liquid`: la capa `#hope-bubbles` deja de estar oculta a tecnologías de asistencia y recibe los textos traducidos por `data-*`.
- `locales/en.default.json`, `locales/es.json`: claves `hope_customizer.bubbles.*`.
- Sin cambios en carrito, variantes, precios ni datos de tienda. Aplica a los productos que usan la plantilla `helado-v2` (Helado Hope y Mixo Hope).
