# Design

## Context

Motivación y alcance: ver `proposal.md`. Estado observado en el código:

- **Barquilla (referencia)** — `sections/custom-product-barquillo.liquid:239-286`. Dentro de `fieldset#syrup-options[data-group=syrup]` hay dos bloques `.hopecfg__barq-set` (`role="group"` + `aria-labelledby`), cada uno con un encabezado `.hopecfg__barq-subhead` (título + `.hopecfg__barq-cost`) y una grilla `.hopecfg__barq-grid`. Los chips salen de `snippets/hope-extra-chip.liquid`. Clásicos en orden del metafield; premium con `sort_natural: 'nombre'`. Un conjunto vacío no se renderiza. Todo su CSS vive en el `{% stylesheet %}` de la propia sección (l.355-473), con el prefijo `barq` y scopeado a `.hopecfg--barquillo`: nada es reutilizable tal cual. Los textos ("Clásicos", "Incluido", "+$1.00") están escritos en el Liquid.
- **Helado Hope / Mixo Hope** — `sections/custom-product-v2.liquid:324-385`. `#topping-options` tiene un único `.hopecfg__chips.topping-grid` con todos los ítems de las categorías distintas de `Sirope`, básicos y premium mezclados; `#syrup-options` tiene un único `.hopecfg__chips` igual. Encima de cada uno se renderiza `hope-pricing-guide` (incluidos / básico adicional / premium).
- **CSS compartido** — `assets/hope-customizer-v2.css` lo cargan las dos secciones y ambos roots llevan `.hopecfg--v2`. `assets/toppings-customizer.css` es global (`layout/theme.liquid:35`).
- **Reglas móviles que hoy mandan sobre los chips** (≤1023 px):
  - `toppings-customizer.css:752-785`: `#topping-options` / `#syrup-options` con `overflow:hidden`; `.topping-grid` y `#syrup-options > .hopecfg__chips` como fila con scroll horizontal; chips con `min-width:max-content`.
  - `hope-customizer-v2.css:751-807`: las mismas dos listas como columna con `max-height:15rem` y scroll vertical; chips a ancho completo.
  - `hope-customizer-v2.css:809-856` + `hope-customizer-v2.js:757-775` (`setupScrollIndicators`): aviso "Desliza para ver más".
- **JS de `hope-customizer-v2.js`**: delegación en `#hope-options` con `closest("button[data-id]")` y `closest("fieldset").dataset.group`; bucles sobre `[data-group='topping'|'syrup'] .hopecfg__choice`; `isPremium` lee `data-premium` del chip; `renderChipPrices` agrega `.hopecfg__chip-price` al chip seleccionado. Nada depende del orden en el DOM ni del contenedor inmediato del chip, salvo `setupScrollIndicators`.
- **Cobro en v2**: `free_toppings` (2), `free_syrups` (1), `extra_topping_cents` (100), `premium_cents` (150) son ajustes de la sección. Los básicos se cobran por orden de selección; los premium nunca ocupan cupo incluido.

Restricciones: los dos armadores están en producción; no se cambian ids de fieldset, `data-group`, atributos `data-*` del chip ni el root de cada sección, porque de ellos dependen el JS, el asistente móvil y la vista previa.

## Goals / Non-Goals

**Goals:**

- Una sola implementación del "conjunto de opciones" (marcado, estilos, textos), usada por la Barquilla y por Helado Hope / Mixo Hope.
- Que la Barquilla quede idéntica a la vista después de migrar al componente compartido.
- No tocar la lógica de selección, cobro ni asistente.

**Non-Goals:**

- Milkshake y el armador v1 (`custom-product-helado`): ver `proposal.md`.
- Subdividir los toppings por categoría del metafield (frutas, galletas, etc.): hoy no se muestran las categorías y no se pidió.
- Volver configurables los títulos de conjunto desde el editor de temas.
- Mover a un ajuste el "+$1.00" de la Barquilla, que hoy es una constante en su JS y en su Liquid.

## Decisions

### 1. Snippet compartido `hope-option-set` para un conjunto

Nuevo `snippets/hope-option-set.liquid` que renderiza un conjunto: contenedor con `role="group"` y `aria-labelledby`, encabezado (título, estrella opcional, costo) y grilla con los chips ya capturados. Parámetros: `id` (único, con `section.id`), `title`, `premium` (boolean: agrega la estrella decorativa), `cost` (texto), `included` (boolean: variante verde del costo) y `chips` (HTML capturado). Si `chips` está vacío no renderiza nada.

La separación clásico/premium y el orden se quedan en cada sección, porque el origen de los ítems difiere (una categoría en la Barquilla, varias en los toppings de v2). `hope-extra-chip` no cambia.

*Alternativa descartada*: copiar el marcado de la Barquilla en v2. Son cuatro copias del mismo bloque (dos grupos × dos conjuntos) más las dos de la Barquilla; cualquier ajuste futuro habría que repetirlo seis veces.

### 2. Clases neutras `hope2__set*` en `assets/hope-customizer-v2.css`

Las reglas de conjunto y grilla salen del `{% stylesheet %}` de la Barquilla y pasan a `hope-customizer-v2.css` con nombres sin `barq`: `hope2__set`, `hope2__set-head`, `hope2__set-cost`, `hope2__set-cost--included`, `hope2__set-grid`, `hope2__set-note`. Scope: `.hopecfg--v2` (presente en ambos roots). Se conservan los valores actuales de la Barquilla: grilla `repeat(auto-fill, minmax(9.5rem, 1fr))` (11.5rem desde 1024 px), chip con `min-height: 3.5rem`, miniatura de 2.6rem (2.25rem hasta 749 px), nombre con `white-space: normal` y `overflow-wrap: break-word`.

El prefijo `hope2__` es el que ya comparten las dos secciones (`hope2__base-grid`, `hope2__availability-modal`). El archivo es un asset cargado explícitamente por las dos secciones, que es la vía de carga existente.

*Alternativa descartada*: `toppings-customizer.css`. Es global y lo consume también el armador v1, que queda fuera de alcance; meterlo ahí amplía el radio de un error sin necesidad.

En la Barquilla quedan solo las reglas que son suyas: mostrar el grupo sin asistente (`.hopecfg__group { display: block }`) y ocultar `.hopecfg__chip-price` dentro de la grilla.

### 3. Quitar las reglas viejas en lugar de ganarles por especificidad

En `hope-customizer-v2.css` se eliminan la lista vertical con `max-height: 15rem` (l.751-807) y el aviso "Desliza para ver más" (l.809-856); en `hope-customizer-v2.js` se elimina `setupScrollIndicators` y su llamada. Como la grilla nueva no usa `.topping-grid` ni `.hopecfg__chips`, esas reglas quedarían sin consumidor.

Las reglas globales de `toppings-customizer.css:752-785` no se tocan (las usa el v1). Dos de ellas siguen alcanzando a v2 y se neutralizan desde `hope-customizer-v2.css`:

- `#topping-options, #syrup-options { overflow: hidden }` → `overflow: visible` bajo `.hopecfg--v2`.
- `#syrup-options .hopecfg__choice { min-width: max-content; line-height: 1; ... }` → la regla del chip en grilla se escribe como `.hopecfg--v2 .hopecfg__config :is(#topping-options, #syrup-options) .hope2__set-grid .hopecfg__choice` (un id + cuatro clases), que le gana y cubre también a la Barquilla. Es la misma técnica que ya usa la Barquilla, ahora en un solo lugar.

*Alternativa descartada*: dejar el scroll interno con la grilla adentro. Anida dos scrolls en móvil y corta los encabezados de conjunto; es justo lo que la Barquilla resolvió al pasar a grilla.

### 4. Texto de costo del encabezado desde los ajustes y los locales

En v2 el costo se arma en Liquid con los ajustes ya existentes:

| Conjunto | Texto | Origen |
|---|---|---|
| Clásicos (toppings) | `2 incluidos · +$1.00 c/u adicional` | `free_toppings`, `extra_topping_cents` |
| Clásicos (siropes) | `1 incluido · +$1.00 c/u adicional` | `free_syrups`, `extra_topping_cents` |
| Premium ★ | `+$1.50 c/u` | `premium_cents` |

Con cupo incluido en 0 se omite la parte "N incluidos". El encabezado de clásicos usa la variante verde (`included: true`) solo cuando el cupo es mayor que 0.

"Incluido" a secas, como en la Barquilla, sería falso en v2: el tercer topping básico cuesta $1.00. Por eso el encabezado dice cuántos entran y el chip seleccionado sigue mostrando su costo real.

Textos en `locales/en.default.json` y `locales/es.json`, bajo `hope_customizer.sets`: `classics`, `premium`, `included`, `included_count` (`one` / `other`), `extra_each`, `each`, `premium_note`. La Barquilla pasa a leer "Clásicos", "Premium" e "Incluido" de las mismas claves; su "+$1.00" se sigue armando en su sección. Se eliminan las claves `hope_customizer.pricing.*`, que solo consumía la guía de precios.

### 5. La guía de precios se retira

Se quitan los dos `render 'hope-pricing-guide'` de v2, se borra el snippet y sus estilos (`hope-customizer-v2.css:265-300`). Sus tres filas quedan cubiertas por los dos encabezados; su nota ("Los premium se cobran aparte y no cuentan como incluidos") se conserva como `hope2__set-note` bajo la leyenda de cada paso. El aviso `#topping-warning` no cambia.

*Alternativa descartada*: mantener guía y encabezados. Repite la misma información dos veces en un paso que en móvil ya crece en alto.

### 6. En v2 el chip conserva su costo y pierde estrella y etiqueta

Dentro de `.hope2__set-grid` se ocultan `.hopecfg__star` y `.hopecfg__premium-tag` (regla compartida). `.hopecfg__chip-price` se oculta solo en la Barquilla (regla propia). En el chip en grilla de v2 el costo se alinea al final de la fila (`margin-inline-start: auto`) y no se encoge, para que no empuje ni corte el nombre.

### 7. Orden y agrupación en v2

- **Toppings**: se junta en un solo arreglo los ítems de todas las categorías distintas de `Sirope` (`concat`), en el orden de categorías y del metafield. Clásicos: ese orden, filtrando `premium` falso. Premium: el mismo arreglo con `sort_natural: 'nombre'`, filtrando `premium` verdadero.
- **Siropes**: igual que la Barquilla, sobre `cat_sirope.items`.
- **Sin metafield** (chips de respaldo escritos en la sección): se muestran como un único conjunto "Clásicos"; no hay premium.

Cada chip se renderiza una sola vez, así que los `data-id` siguen siendo únicos dentro de su `data-group`.

### 8. Asistente móvil sin tocar

Los conjuntos quedan dentro de los mismos `fieldset#topping-options` y `fieldset#syrup-options`, que son los que el asistente muestra u oculta por `data-step-key`. No cambian ids, `STEP_KEYS` ni el pie con los botones.

## Risks / Trade-offs

- [El paso de toppings y el de siropes crecen en alto en móvil: de ~15rem con scroll interno a toda la grilla, y los botones de avanzar quedan más abajo] → Es el mismo comportamiento que ya tiene la Barquilla con 22 siropes. Se verifica a 390 px que el pie con "Continuar" / "Añadir al carrito" siga alcanzable y, si queda demasiado lejos, se ajusta el alto del chip en móvil, no la estructura.
- [CSS compartido: un cambio en `hope-customizer-v2.css` alcanza a los dos armadores] → Se migra primero la Barquilla al componente compartido y se compara contra su estado actual antes de tocar v2.
- [Quedan vivas reglas globales del v1 que apuntan a los mismos ids] → Se neutralizan con las dos reglas de la decisión 3 y se revisa el estilo computado del chip en móvil.
- [El costo en el chip seleccionado compite por espacio con nombres largos en dos columnas] → Nombre con salto de línea y costo sin encoger; se verifica con el nombre más largo de los datos reales.
- [Se retira la guía de precios, que alguien pudo haber pedido expresamente] → La información completa sigue presente en encabezados y nota; se puede restituir sin tocar el resto.
- [Borrar las claves `hope_customizer.pricing.*` rompe un consumidor no detectado] → Búsqueda en todo el tema antes de borrar; hoy el único consumidor es el snippet que se elimina.
- [Productos cuyos datos no marcan `premium` en ningún ítem] → Se muestra solo "Clásicos"; el conjunto vacío no se renderiza.

## Migration Plan

1. Componente compartido (snippet, CSS, textos) y migración de la Barquilla, verificando que no cambie a la vista.
2. Toppings y siropes de `custom-product-v2`, retiro de la guía de precios y del scroll interno.
3. Verificación en Helado Hope, Mixo Hope, Barquilla y Milkshake con `shopify theme dev` y Playwright.
4. Publicación: commit y push a `main`, previo `git fetch` + rebase y con confirmación, porque publica en vivo.

Rollback: revertir el commit y volver a publicar. No hay cambios de datos en la tienda.
