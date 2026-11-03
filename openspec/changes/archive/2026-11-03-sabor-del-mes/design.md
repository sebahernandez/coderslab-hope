# Design

## Context

- Helado Hope y Mixo Hope usan la misma sección `sections/custom-product-v2.liquid` (template
  `product.helado-v2.json`) con `assets/hope-customizer-v2.js/.css`. El preview es una imagen de
  Cloudinary (`data-base-asset`, cuenta `slealu5f`, carpeta `hope/catalog`) con burbujas "+1"
  posicionadas por `BUBBLE_ANCHORS` (porcentajes calibrados al vaso clásico).
- El wizard móvil se controla con `data-step` en la raíz y `STEP_LABELS` (3 pasos fijos); el CSS
  mapea `data-step="0|1|2"` a `#size-options`, `#topping-options`, `#syrup-options`.
- El carrito usa variantes Tamaño × "Toppings extra" + línea add-on para premium, unidas por
  `_hope_ext`. El desglose para cocina viaja en properties visibles (`buildMainProperties()`).
- El tema live se despliega con commit + push a `main` (integración GitHub). Los datos de tienda
  (metaobjetos, archivos) se crean en el admin o con `shopify store execute --allow-mutations`.

## Goals / Non-Goals

**Goals:**
- Que el comerciante cambie el sabor del mes (texto + imágenes + vigencia) desde el admin, sin
  deploy.
- Programar sabores por adelantado y que se activen/desactiven solos por fecha.
- Reutilizar el mismo contenido en Helado Hope y Mixo Hope (y en el futuro en un banner del home).
- Cero impacto en precios, variantes, add-on premium y carrito nativo.

**Non-Goals:**
- Recargo por sabor del mes (si se requiere, cambio aparte: implicaría una 3.ª opción de variante
  o un add-on).
- Control de stock del sabor del mes.
- Milkshake y Barquillo.
- Traducciones a otros idiomas (la tienda opera en español).

## Decisions

### D1. Origen del contenido e imágenes del sabor del mes → **Metaobjeto `sabor_del_mes`**

Esta es la duda principal. Alternativas evaluadas:

| # | Opción | Dónde se edita | Pros | Contras |
|---|--------|----------------|------|---------|
| A | **Ajustes de la sección** (`image_picker`, `text`, `date` vía texto) en `custom-product-v2` | Personalizar tema › página de producto | Lo más simple de construir; vista previa en vivo en el editor | Se edita en el editor de tema (más riesgoso para un usuario no técnico); sin programación por fechas; el JSON del template se reescribe desde Shopify y puede desincronizar el repo (ya pasó: commit "Update from Shopify"); contenido atado a ese template |
| B | **Metaobjeto `sabor_del_mes`** (entradas con nombre, descripción, imágenes, fechas) | Contenido › Metaobjetos | Formulario dedicado y simple; imágenes subidas a Archivos de Shopify (CDN, `image_url` responsive); permite cargar varios meses por adelantado y activarlos por fecha; reutilizable en Helado, Mixo y home; no toca el repo | Hay que crear la definición una vez; sin vista previa inmediata en el editor (se ve al recargar la página) |
| C | **Metafields del producto** (`custom.sabor_mes_*`) en Helado Hope y Mixo Hope | Producto › Metafields | Por producto, editable en el admin | Hay que duplicar los datos en 2 productos cada mes; sin historial ni programación |
| D | **Asset de Cloudinary por texto** (convención actual: `hope-vanilla-cup-cutout-v1`) | Cloudinary + un campo de texto | Coherente con el preview actual; `e_background_removal` automático | El comerciante debe subir a Cloudinary y copiar un ID: frágil y técnico; el texto igual necesita otro origen (A/B/C) |
| E | **Producto o variante "Sabor del mes"** | Productos | Usa la imagen del producto; habilitaría precio/stock propio | Sobredimensionado si no cambia el precio; ensucia catálogo/colecciones y el cálculo de variantes actual |

**Decisión: B (metaobjeto)**, con un campo opcional de Cloudinary para el vaso (mezcla B + D)
y un interruptor en la sección (de A) para apagar todo rápido.

Definición `sabor_del_mes` (acceso Storefront: lectura):

| Campo | Tipo | Requerido | Uso |
|-------|------|-----------|-----|
| `nombre` | single_line_text | sí | "Alegría" (título del banner y de la opción) |
| `descripcion` | multi_line_text | sí | Texto del banner |
| `subtitulo_opcion` | single_line_text | no | Default "Sabor del Mes · Edición Limitada" |
| `imagen_banner` | file_reference (imagen) | sí | Foto del helado en el banner (izquierda) |
| `imagen_decorativa` | file_reference (imagen) | no | Fruta decorativa a la derecha del banner |
| `imagen_vaso` | file_reference (imagen) | no | Vaso del sabor para el preview (PNG transparente, mismo encuadre que el clásico) |
| `cloudinary_vaso` | single_line_text | no | ID de Cloudinary alternativo para el vaso; tiene prioridad sobre `imagen_vaso` |
| `miniatura` | file_reference (imagen) | no | Miniatura de la opción; si falta usa `imagen_banner` |
| `fecha_inicio` | date | sí | Inicio de vigencia |
| `fecha_fin` | date | sí | Fin de vigencia ("Hasta el 30 de noviembre") |
| `etiqueta_insignia` | single_line_text | no | Default "Edición limitada" |
| `producto` | product_reference | no | Producto donde aplica (Helado Hope o Mixo Hope); vacío = ambos |

### D2. Selección de la entrada vigente → recorrer `shop.metaobjects.sabor_del_mes.values` en Liquid

Se compara `'now' | date: '%Y-%m-%d'` contra `fecha_inicio`/`fecha_fin` (formato ISO, comparación
de strings). Se descartan las entradas cuyo `producto` es otro producto; entre las restantes, una
entrada asociada al producto actual gana sobre una sin producto (compartida), y a igualdad gana la
de inicio más reciente (clave `rango|fecha_inicio`). Así Helado Hope y Mixo Hope, que comparten el
template `helado-v2` (y por eso los mismos ajustes de sección), pueden tener sabores distintos,
p. ej. entradas `alegria` (Helado) y `alegria-mixo` (Mixo).
Alternativa descartada: ajuste de sección tipo `metaobject` (el comerciante elige la entrada a
mano): más control pero obliga a entrar al editor cada mes y no apaga sola al vencer. Se agrega
igual un ajuste opcional `sabor_del_mes_forzado` (`metaobject`) para forzar una entrada (útil para
probar antes de la fecha), más `mostrar_sabor_del_mes` (checkbox, default true).

### D3. Mes en español → derivado de `fecha_fin` con un arreglo de nombres en Liquid

"Hasta el 30 de noviembre" y "Sabor del mes · Noviembre" se generan con `fecha_fin | date: '%-d'`
y el índice `%-m` sobre `enero,febrero,…` (el filtro `date` de Liquid devuelve meses en inglés).
Alternativa: campos de texto libres — más trabajo mensual y propenso a errores.

### D4. Base como line item property, no como variante

`Base: <nombre>` (y `Alegría (Sabor del mes)` para el sabor) se añade en `buildMainProperties()`
solo cuando hay sabor vigente. Precio y variante no cambian.
Alternativa: 3.ª opción de producto "Base" — duplicaría las 63 variantes por producto y obligaría
a recrear variantes cada mes. Descartada mientras no haya recargo.

### D5. Preview: swap de la imagen base + insignia

Liquid emite `data-flavor-cup-url` (URL absoluta de `imagen_vaso | image_url: width: 1000`) o
`data-flavor-cup-asset` (ID Cloudinary). El JS, con `state.base === 'mes'`, usa esa fuente en lugar
de `BASE_ASSET`; si no hay ninguna, mantiene la clásica. La insignia "Sabor del mes" es un elemento
del preview que se muestra con una clase en la raíz (`is-flavor-month`).
Las burbujas siguen usando `BUBBLE_ANCHORS`: por eso la imagen del vaso debe respetar el encuadre
del vaso clásico (ver riesgos).

### D6. Paso de base y wizard

- Nuevo `<fieldset id="base-options" data-group="base">` antes de `#size-options`, renderizado
  solo con sabor vigente; botones con `aria-pressed` igual que los tamaños.
- La numeración de las `legend` se calcula en Liquid con un offset (`step_offset` = 1 si hay
  sabor).
- `STEP_LABELS` se arma en JS según exista `#base-step`; el CSS móvil deja de mapear pasos por
  índice: la raíz expone `data-step-key` (`base|size|topping|syrup`) más `data-step-first` y
  `data-step-last`, y el CSS muestra el grupo y los botones según esa clave (se mantiene
  `data-step` numérico por compatibilidad).
- Banner y fieldset de base van dentro de un contenedor `#base-step` (con clase `hopecfg__group`)
  para que el wizard móvil los muestre juntos como un único paso.
- El ajuste `metaobject` no admite `visible_if` (Theme Check) y exige que la definición exista
  antes de subir el tema: la definición se crea antes del deploy.

### D7. Banner como snippet: imagen completa diseñada

`snippets/hope-flavor-banner.liquid` recibe el metaobjeto y muestra `imagen_banner` completa
(el diseño ya trae insignia, vigencia, nombre y descripción), con `image_url` + `widths`/`sizes`,
`loading="eager"` (arriba del pliegue) y un alt que reconstruye el texto desde los campos
(nombre, "hasta el <día> de <mes>", descripción). Decisión del usuario (opción A) tras comparar con
banner armado en HTML (opción B: foto suelta + texto renderizado). Trade-off aceptado: en móvil el
texto de la imagen queda pequeño. `imagen_decorativa`, `etiqueta_insignia` y `subtitulo_opcion`
siguen en la definición pero el banner no usa los dos primeros.

## Risks / Trade-offs

- [Caché de páginas de Shopify: `'now'` es la hora del render cacheado] → la vigencia es por día;
  un desfase de minutos/horas en el cambio de mes es aceptable. Si se necesita exactitud, usar el
  ajuste `sabor_del_mes_forzado`.
- [Imagen del vaso con otro encuadre desalinea las burbujas "+1"] → documentar en el campo
  (`imagen_vaso`) las medidas: PNG transparente, cuadrado, mismo tamaño/posición del vaso que el
  clásico; alternativa `cloudinary_vaso` con `e_background_removal`.
- [Metaobjeto sin acceso Storefront no aparece en Liquid] → crear la definición con
  `access.storefront: PUBLIC_READ` y verificarlo en la tarea de datos.
- [Más de 50 entradas acumuladas] → `values` pagina; se recomienda borrar sabores viejos o
  limitar a las últimas entradas. Bajo riesgo (1 por mes).
- [El cliente añade dos helados idénticos con distinta base] → quedan en líneas separadas por
  tener properties distintas; es el comportamiento deseado.
- [Reordenar pasos rompe el CSS del wizard por IDs] → migrar a `data-step-index` y revalidar los
  escenarios del wizard (3 y 4 pasos) con Playwright.

- [Banner con texto horneado: ilegible en pantallas angostas y sin texto real para lectores de
  pantalla] → alt descriptivo generado desde los campos; si en el futuro se necesita legibilidad
  móvil, agregar un campo `imagen_banner_movil` o volver a la opción B.

## Migration Plan

1. Crear la definición de metaobjeto y la entrada "Alegría" (admin o CLI). Sin efecto visible
   hasta que el tema lea los datos.
2. Desplegar el tema (commit + push a `main`). Si no hay entrada vigente, el armador queda igual
   que hoy.
3. Rollback: desmarcar `mostrar_sabor_del_mes` en la sección o despublicar/borrar la entrada; para
   rollback de código, revertir el commit.

## Open Questions

- Texto exacto del subtítulo de la opción clásica ("Nuestro sabor tradicional") y si debe ser
  editable: por ahora ajuste de sección con ese default.
- Si en el futuro se quiere el banner también en el home, se reutiliza el snippet (fuera de este
  cambio).
