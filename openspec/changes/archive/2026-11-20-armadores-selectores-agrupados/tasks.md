# Tasks

## 1. Componente compartido de conjunto

- [x] 1.1 Capturar el estado actual antes de tocar nada: con `shopify theme dev` y Playwright, tomar capturas de la Barquilla (390 px y 1280 px) y de los pasos de toppings y siropes de Helado Hope y Mixo Hope (390 px y 1280 px), y anotar total y líneas del carrito de un Helado Hope con 2 toppings clásicos + 1 topping premium + 1 sirope clásico. Verificar que las capturas y la anotación quedan guardadas fuera del tema para comparar después.
- [x] 1.2 Crear `snippets/hope-option-set.liquid` con `{% doc %}` y los parámetros `id`, `title`, `premium`, `cost`, `included`, `chips` (contenedor `role="group"` + `aria-labelledby`, encabezado y grilla; sin salida si `chips` está vacío). Verificar con Theme Check que no reporta errores en el snippet.
- [x] 1.3 Agregar las claves `hope_customizer.sets` (`classics`, `premium`, `included`, `included_count` con `one`/`other`, `extra_each`, `each`, `premium_note`) en `locales/en.default.json` y `locales/es.json`. Verificar que ambos archivos son JSON válido y que tienen las mismas claves.
- [x] 1.4 Agregar en `assets/hope-customizer-v2.css` las reglas `hope2__set`, `hope2__set-head`, `hope2__set-cost`, `hope2__set-cost--included`, `hope2__set-grid`, `hope2__set-note`, la regla del chip en grilla con el selector `:is(#topping-options, #syrup-options)` y el ocultamiento de estrella y etiqueta "premium", con los valores actuales de la Barquilla (incluidos los cortes de 749 px y 1024 px). Verificar que el archivo no tiene errores de sintaxis y que las reglas usan propiedades lógicas.

## 2. Migrar la Barquilla al componente

- [x] 2.1 En `sections/custom-product-barquillo.liquid`, reemplazar los dos bloques `.hopecfg__barq-set` por `render 'hope-option-set'`, tomando "Clásicos", "Premium" e "Incluido" de los locales y conservando el "+$1.00". Verificar en el HTML servido que cada chip aparece una sola vez y conserva `data-id`, `data-premium`, `data-image` y `data-label`.
- [x] 2.2 Quitar del `{% stylesheet %}` de la Barquilla las reglas `barq-set`, `barq-subhead`, `barq-cost` y `barq-grid` ya mudadas, dejando solo las propias (grupo visible sin asistente, nota, ocultar `.hopecfg__chip-price`). Verificar con `rg "barq-(set|subhead|cost|grid)"` que no quedan referencias en el tema.
- [x] 2.3 Comparar la Barquilla con las capturas de 1.1 a 390 px y 1280 px, y probar elegir un sirope clásico, uno premium, deseleccionar y reiniciar. Verificar que se ve igual, que el total muestra "$1.00 en sirope premium" con un premium y que el contador pasa de 0/1 a 1/1.

## 3. Toppings y siropes de Helado Hope y Mixo Hope

- [x] 3.1 En `sections/custom-product-v2.liquid`, armar el arreglo único de toppings (todas las categorías distintas de `Sirope`), capturar clásicos (orden de los datos) y premium (`sort_natural: 'nombre'`) y renderizar los dos conjuntos con `hope-option-set` dentro de `#topping-options`; los chips de respaldo van en un único conjunto "Clásicos". Verificar en el HTML servido que `fieldset#topping-options[data-group=topping]` se conserva y que cada `data-id` aparece una sola vez.
- [x] 3.2 Hacer lo mismo en `#syrup-options` con `cat_sirope.items`. Verificar que los premium salen en orden alfabético y que, sin ítems premium, no aparece el encabezado "Premium ★".
- [x] 3.3 Armar el texto de costo de cada encabezado desde `free_toppings`, `free_syrups`, `extra_topping_cents` y `premium_cents`, omitiendo "N incluidos" cuando el cupo es 0. Verificar que con los valores guardados se lee "2 incluidos · +$1.00 c/u adicional", "1 incluido · +$1.00 c/u adicional" y "+$1.50 c/u", y que al cambiar `premium_cents` en el editor de temas cambia el encabezado.
- [x] 3.4 Quitar los dos `render 'hope-pricing-guide'`, agregar la nota `hope2__set-note` bajo la leyenda de cada paso, borrar `snippets/hope-pricing-guide.liquid`, sus estilos en `hope-customizer-v2.css` y las claves `hope_customizer.pricing.*` de ambos locales. Verificar con `rg "hope-pricing-guide|hope2__pricing|hope_customizer.pricing"` que no quedan referencias.
- [x] 3.5 En `assets/hope-customizer-v2.css`, eliminar la lista vertical con `max-height: 15rem` y el aviso "Desliza para ver más"; agregar `overflow: visible` para `#topping-options` y `#syrup-options` bajo `.hopecfg--v2`; alinear `.hopecfg__chip-price` al final del chip en grilla. En `assets/hope-customizer-v2.js`, eliminar `setupScrollIndicators` y su llamada. Verificar con `rg "scrollmore|setupScrollIndicators"` que no quedan referencias y que la consola del navegador no muestra errores al cargar el armador.
- [x] 3.6 Verificar en Helado Hope a 390 px: dos columnas del mismo ancho en toppings y siropes, sin scroll horizontal ni scroll interno, sin nombres cortados (incluido el nombre más largo), sin estrella ni etiqueta "premium" en los chips, y pie con "Continuar" / "Añadir al carrito" alcanzable con el scroll de la página en cada paso.
- [x] 3.7 Verificar en Helado Hope a 1280 px que los conjuntos y la grilla se ven con el mismo diseño que en la Barquilla y que el armador no desborda su contenedor.

## 4. Verificación de integración

- [x] 4.1 Repetir en Helado Hope la selección anotada en 1.1 (2 toppings clásicos + 1 topping premium + 1 sirope clásico), más un tercer topping clásico. Verificar que los dos primeros chips dicen "Incluido", el tercero muestra el costo del básico adicional, el premium muestra su costo, y que el total y las líneas del carrito coinciden con lo anotado para la misma selección.
- [ ] 4.2 Recorrer el asistente móvil de Helado Hope y de Mixo Hope, con y sin sabor del mes vigente. Verificar orden de pasos, "Paso N de M", botones de avanzar y retroceder, validación de sirope obligatorio y que la vista previa y las burbujas "+1" siguen respondiendo a cada extra.
- [x] 4.3 Verificar teclado y lector de pantalla en un paso de v2: el foco recorre los chips en orden visual, cada conjunto se anuncia con su título y la estrella decorativa no se anuncia.
- [x] 4.4 Abrir el armador de Milkshake y comparar con producción. Verificar que tamaño y tarjetas de combo no cambiaron.
- [x] 4.5 Ejecutar Theme Check sobre el tema y `openspec validate armadores-selectores-agrupados --strict`. Verificar que no hay errores nuevos respecto de `main`.

## Workflow follow-up

- Publicar con commit y push a `main`, previo `git fetch` + rebase y con confirmación del usuario (publica en vivo).
- Verificar en la tienda en vivo los cuatro armadores después de la sincronización.
- Archivar el change una vez verificado.

## Notas de verificación (2026-11-20)

- Verificado contra el tema de desarrollo (`shopify theme dev` y enlace de vista previa sobre el dominio real), a 390 px y 1280 px.
- 3.3: los precios del básico adicional y del premium que muestra el encabezado son los mismos que usa el cobro. La sección los toma de los precios reales de Shopify (diferencia entre variantes y precio de "Extras personalizados") y solo usa `extra_topping_cents` / `premium_cents` como respaldo, por lo que cambiar esos dos ajustes no altera el encabezado mientras exista el producto de extras. Se comprobó que un cambio de ajustes sí se refleja con `free_toppings: 0` ("Clásicos +$1.00 c/u", sin "incluidos").
- 4.1: el carrito se probó con el enlace de vista previa; en `127.0.0.1` todas las variantes figuran sin stock y el armador no añade.
- 4.2: pendiente solo el caso "sin sabor del mes vigente"; hoy hay uno activo y probarlo exige cambiar datos de la tienda. El resto del recorrido está verificado en Helado Hope y Mixo Hope.
- 4.3: verificado con teclado y con el árbol de accesibilidad del navegador, no con un lector de pantalla real.
