# Proposal

## Why

Hoy ningún armador cabe completo en la pantalla: el cliente tiene que desplazar la página para ver la
vista previa, las opciones y el botón de compra al mismo tiempo. Medido en producción (2026-11-20):

- Escritorio (los cuatro armadores): la tarjeta empieza en y=152 px y mide `min(88dvh, 900px)`, por lo
  que su borde inferior queda 44–72 px por debajo del viewport (1280×720, 1366×768, 1440×900 y
  1920×1080). El total y "Añadir al carrito" quedan cortados.
- Móvil, Helado Hope / Mixo Hope / Barquilla: la tarjeta no tiene alto acotado (≈900 px en una pantalla
  de 844 px; más de 2.000 px en Barquilla) y las opciones se recorren con el scroll de la página.
- Móvil, Milkshake: ya tiene scroll interno, pero a 375×667 la tarjeta se pasa 69 px del viewport.

El negocio quiere que el armador se vea siempre entero, en escritorio y en móvil, y que lo único que se
desplace sea la lista de opciones a elegir.

## What Changes

- La tarjeta de cada armador se dimensiona al espacio visible: empieza justo debajo del navbar flotante
  y termina dentro del viewport, en escritorio y en móvil.
- La vista previa y el pie (total, "Atrás", "Siguiente", "Añadir al carrito") quedan siempre visibles;
  solo la zona de opciones se desplaza por dentro de la tarjeta.
- En móvil, Helado Hope, Mixo Hope y Barquilla pasan de alto libre con scroll de página a alto acotado
  con scroll interno en la zona de opciones. La vista previa y el pie se compactan para dejar más
  espacio a las opciones.
- En móvil se fija un tamaño mínimo de texto en los cuatro armadores: hoy hay textos de 8 a 11.5 px
  (etiqueta "Total" 8 px, antetítulo 9 px, gramos del Milkshake 9 px, botón "Añadir al carrito" 11 px,
  nombres de toppings y siropes 12 px). Suben al mínimo legible (12 px; 11 px para etiquetas cortas en
  mayúsculas) sin agrandar los textos que ya se leen bien.
- Se reduce el espacio vacío entre el navbar y la tarjeta (hoy 66 px en escritorio) y debajo de ella.
- En viewports muy bajos (menos de 540 px de alto, por ejemplo un teléfono en horizontal) el armador
  conserva el flujo actual con scroll de página, porque no hay alto suficiente para un layout fijo usable.
- **Revierte una decisión del cambio en curso `armadores-selectores-agrupados`**: ese cambio estableció
  que en móvil las opciones se recorren con el scroll de la página, sin lista con scroll interno. Este
  cambio lo reemplaza por scroll interno de toda la zona de opciones (un solo contenedor por paso, sin
  scroll anidado ni horizontal). La cláusula correspondiente del delta de ese cambio debe retirarse
  antes de archivarlo.

Fuera de alcance: el footer del sitio sigue debajo del armador, así que la página conserva scroll para
llegar a él; no se cambia el orden de los pasos, el cobro, la vista previa ni el contenido de las opciones.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `configurador-helado`: se agregan requisitos de ajuste de la tarjeta del armador al viewport
  (escritorio y móvil), scroll interno limitado a la zona de opciones, alineación con la altura del
  navbar, respaldo para viewports muy bajos y tamaño mínimo de texto en móvil. Aplica a Helado Hope,
  Mixo Hope, Milkshake y Barquilla.

## Impact

- `assets/toppings-customizer.css`: reglas del contenedor compartido (`.hopecfg`, `.hopecfg__frame`),
  que es global y lo usan los cuatro armadores y el armador v1 heredado.
- `assets/hope-customizer-v2.css`: reglas móviles de Helado Hope / Mixo Hope / Barquilla (alto de la
  tarjeta, vista previa, panel de opciones y pie) y tamaños de texto móviles.
- `assets/milkshake-customizer.css`: tamaños de texto móviles de las tarjetas de combo (ingredientes,
  gramos).
- Sin cambios previstos en Liquid, JavaScript, esquemas, traducciones ni datos de la tienda.
- `openspec/changes/armadores-selectores-agrupados/specs/configurador-helado/spec.md`: retirar la
  cláusula y el escenario de "scroll de la página" que este cambio reemplaza.
- Despliegue: push a `main` publica en vivo; requiere confirmación del usuario.
