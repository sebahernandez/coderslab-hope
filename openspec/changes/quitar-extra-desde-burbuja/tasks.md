# Tasks

## 1. Textos y marcado

- [x] 1.1 Agregar `hope_customizer.bubbles.remove`, `hope_customizer.bubbles.removed` y `hope_customizer.bubbles.group_label` en `locales/en.default.json` y `locales/es.json`. Verificar que ambos archivos siguen siendo JSON válido.
- [x] 1.2 En `sections/custom-product-v2.liquid`, quitar `aria-hidden="true"` de `#hope-bubbles` y agregar `role="group"`, `tabindex="-1"` y `aria-label` con la clave `group_label`. Agregar en la raíz `[data-hopecfg-v2]` los atributos `data-bubble-remove-label` y `data-bubble-removed-label` renderizados con `t: name: '__NAME__'` y escapados. Actualizar el comentario de la capa.

## 2. Lógica en `assets/hope-customizer-v2.js`

- [x] 2.1 Extraer del listener de `#hope-options` la rama de `topping` y `syrup` a `toggleExtra(group, id)` (alterna el id, ajusta `state.lastKey`, marca `state.hasInteracted`, llama `render()`) y hacer que el listener la use. Verificar que seleccionar y deseleccionar chips se comporta igual que antes.
- [x] 2.2 Agregar `removeExtra(group, id)`: no hace nada si el id no está seleccionado; si lo está, delega en `toggleExtra`.
- [x] 2.3 Agregar una función local de escape para atributos HTML y usarla en `renderBubbles()`.
- [x] 2.4 Cambiar `renderBubbles()` para generar `<button type="button" class="hope2__bubble">` con `data-group`, `data-id` y `aria-label` armado desde `data-bubble-remove-label`; imagen con `alt=""`; emoji e insignia con `aria-hidden="true"`; insignia con los dos textos `+1` y `×`; sin `title`.
- [x] 2.5 Registrar un listener `click` delegado en `#hope-bubbles` que resuelva la burbuja con `closest`, guarde su índice y si el foco estaba dentro de la capa, llame `removeExtra`, restaure el foco (mismo índice, si no la anterior, si no la capa) solo cuando el foco estaba en la capa, y llame `showToast` con el texto de `data-bubble-removed-label`.
- [x] 2.6 Actualizar el comentario de cabecera del archivo y el de `renderBubbles()` para reflejar que las burbujas quitan el extra.

## 3. Estilos en `assets/hope-customizer-v2.css`

- [x] 3.1 En `.hope2__bubble`: reset de botón (`padding: 0`, `font: inherit`, `color: inherit`, `appearance: none`), `pointer-events: auto` y `cursor: pointer`, conservando borde, fondo, sombra y animación actuales. Verificar que la burbuja se ve igual que antes en reposo.
- [x] 3.2 Alternar los textos de la insignia: `+1` visible por defecto y `×` con `:focus-visible` y con `:hover` dentro de `@media (hover: hover)`.
- [x] 3.3 Agregar `:focus-visible` con un contorno visible que no se confunda con el anillo de `.is-last`.
- [x] 3.4 Agregar `::before` con `inset` negativo para que el área táctil llegue a 44 × 44 px en el bloque móvil donde la burbuja mide 38 px.

## 4. Verificación

- [x] 4.1 Levantar `shopify theme dev` y, en Helado Hope a 1280 px, seleccionar 3 toppings básicos, 1 premium y 1 sirope. Quitar un básico desde su burbuja y verificar: la burbuja desaparece, el chip queda sin resaltado ni pill, el total baja en el costo de un básico adicional, los 2 básicos restantes muestran "Incluido" y el contador de toppings y el resumen de extras se actualizan.
- [x] 4.2 Repetir quitando un básico que figuraba como "Incluido" con 3 básicos seleccionados. Verificar que el adicional pasa a "Incluido" y el total baja en el costo de un básico adicional.
- [x] 4.3 Quitar el premium desde su burbuja. Verificar que el total baja en el costo de un premium, el desglose se actualiza y el aviso de costo adicional se oculta si ya no quedan extras pagados.
- [x] 4.4 Quitar el único sirope desde su burbuja. Verificar que el botón de compra queda deshabilitado con la indicación de sirope faltante, y que al volver a elegirlo en su chip se rehabilita.
- [x] 4.5 Con una selección armada, quitar un extra desde su burbuja y añadir al carrito. Verificar que las propiedades de la línea y el precio no incluyen el extra quitado.
- [x] 4.6 A 390 px, en el asistente móvil, ir al paso de siropes y quitar un topping desde su burbuja. Verificar que el total cambia de inmediato, que aparece el aviso "Quitaste …" y que al volver al paso de toppings el chip está sin seleccionar.
- [x] 4.7 A 390 px con 6 extras, medir el área táctil de cada burbuja (≥ 44 × 44 px) y verificar que ninguna área cubre el centro de otra burbuja. Ajustar el `inset` de 3.4 si ocurre.
- [x] 4.8 Con teclado: recorrer las burbujas con Tab, verificar foco visible e insignia `×`, quitar con Enter y con Espacio, y comprobar que el foco pasa a la burbuja del mismo índice, a la anterior, o a la capa cuando no queda ninguna.
- [x] 4.9 Verificar en el árbol de accesibilidad que cada burbuja es un botón con nombre "Quitar {extra}", que la capa es un grupo con nombre y que el aviso se anuncia una sola vez por eliminación.
- [x] 4.10 Verificar con ratón que al pasar el cursor el puntero es de mano y la insignia cambia a `×`, y que hacer clic fuera de las burbujas sobre la imagen no hace nada.
- [x] 4.11 Repetir 4.1, 4.4 y 4.6 en Mixo Hope.
- [x] 4.12 Abrir la Barquilla y el Milkshake a 390 px y 1280 px. Verificar que su vista previa y su selección no cambiaron.
- [x] 4.13 Recargar la sección desde el editor de temas (`shopify:section:load`) y verificar que un clic en una burbuja quita un solo extra (sin listeners duplicados).
- [x] 4.14 Ejecutar Theme Check y `openspec validate quitar-extra-desde-burbuja --strict`. Verificar que no hay errores nuevos respecto de `main`.

## Workflow follow-up

- Publicar con commit y push a `main`, previo `git fetch` + rebase y con confirmación del usuario (publica en vivo).
- Verificar en la tienda en vivo Helado Hope y Mixo Hope después de la sincronización.
- Archivar el change una vez verificado.

## Notas de verificación (2026-11-20)

- Verificado con Playwright contra `shopify theme dev` (tema de desarrollo #190437523708) a 1280 px y 390 px, en Helado Hope y Mixo Hope.
- 4.1–4.3: con 3 básicos + 1 premium + 1 sirope el total es $8.50; quitar el básico adicional lo deja en $7.50, quitar un "Incluido" reasigna el cupo y también baja $1.00, y quitar el premium baja $1.50 y oculta el aviso de costo adicional.
- 4.5: todas las variantes de Helado Hope figuran sin stock en la tienda, así que no se hizo un alta real. Se verificó el cuerpo del `POST /cart/add` interceptado (forzando `available` en el JSON de la página y abortando la petición): una sola línea, variante Pequeño × 0 extras, sin el topping ni el premium quitados.
- 4.7: círculo de 38 px con área táctil de 44 px; la distancia mínima entre centros con 6 burbujas es 45 px, por lo que ninguna área cubre el centro de otra.
- 4.9: verificado con el árbol de accesibilidad del navegador (grupo "Extras seleccionados", botones "Quitar {extra}"), no con un lector de pantalla real. La eliminación escribe solo en `#toast`.
- 4.10: el cambio de insignia a `×` se comprobó por estilos computados al pasar el cursor y con `:focus-visible`.
- 4.11: en Mixo Hope, a 1280 px, quitar el básico adicional baja de $7.50 a $6.50 y quitar el único sirope bloquea la compra con "Falta: elige 1 sirope"; a 390 px se repitió el flujo del asistente (4.6).
- 4.12: el handle de la Barquilla es `barquillo`. Ni la Barquilla ni el Milkshake renderizan `#hope-bubbles`; sin scroll horizontal en ambos anchos.
- 4.13: simulado despachando `shopify:section:load` dos veces en `document`; un clic siguió quitando un solo extra. No se probó dentro del editor de temas.
- 4.14: Theme Check no reporta errores en los archivos tocados; las dos advertencias de `custom-product-v2.liquid` (`RemoteAsset`, `ValidScopedCSSClass`) están en líneas que este cambio no modifica.
- En `locales/en.default.json` el archivo ya contenía comentarios `//` (JSONC de Shopify); `es.json` valida como JSON estricto.
