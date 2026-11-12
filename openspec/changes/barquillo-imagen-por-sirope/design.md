# Design

## Context

- `sections/custom-product-barquillo.liquid` renderiza los chips de sirope desde la categoría "Sirope" del metafield `custom.opciones_customizador` del producto Barquillo (gid 15447288709372, título "Barquilla"). Para eso usa el snippet compartido `hope-extra-chip.liquid`.
- `assets/barquillo-customizer.js` solo actúa sobre `[data-hopecfg-barq]`. Al arrancar, asigna `data-base-image` a `#product-preview`. Al elegir un sirope solo redibuja la burbuja "+1". `flyToCart()` usa `preview.src`.
- El metafield actual tiene 13 siropes. Las fotos están en la colección pública Cloudinary `v5ovpy2d/420d10f8e5fb0ecb9dbeabe233407443`: 22 PNG de 1024×1536 en la raíz de la cuenta, con `public_id` legible y sin sufijo aleatorio.

## Goals / Non-Goals

**Goals:**
- Cambiar la imagen principal según el sirope, sin parpadeo en blanco, y volver a la imagen base cuando falte la foto.
- Mantener la correspondencia sirope → foto como dato editable, no en el código.

- Crear los 9 siropes premium que solo existen como foto, con una miniatura derivada de esa foto.

**Non-Goals:**
- Subir o retocar fotos, o generar miniaturas con fondo transparente.
- Agregar los siropes nuevos a Helado Hope, Mixo Hope u otros armadores.
- Cambiar la burbuja "+1", el texto de ayuda o el layout del escenario.
- Tocar `hope-extra-chip.liquid` u otros armadores.

## Decisions

### 1. Correspondencia en el metafield (`imagen_barquillo`) y no en el JS
Se agrega un campo opcional `imagen_barquillo` (URL completa) a cada item del metafield del Barquillo. Es el mismo patrón que `imagen`, que ya se usa para los íconos de los chips.
- *Alternativa*: un mapa fijo `{id: public_id}` en el JS o en la sección. Se descarta porque obliga a hacer un deploy por cada sirope nuevo.
- Como el metafield del Barquillo es una copia propia (no se comparte con Helado Hope), agregar el campo no afecta a otros productos.

### 2. La sección expone un mapa JSON y no modifica el snippet compartido
La sección renderiza `<script type="application/json" data-barq-syrup-previews>` con `{ "<id>": "<url>" }`, construido desde `cat_sirope.items` y solo con los items que tienen `imagen_barquillo`. El JS lo lee una vez en `initConfigurator`.
- *Alternativa*: agregar `data-preview-image` en `hope-extra-chip.liquid`. Se descarta porque ese snippet lo usan todos los armadores, y el alcance pedido es solo la Barquilla.

### 3. Cambio de imagen con precarga y protección contra cargas obsoletas
Se agrega una función `setPreview(id)` que se llama desde `render()`:
- Sin id, o con id sin URL: vuelve a `BASE_IMAGE`, si no es ya la imagen actual.
- Con URL: crea un `Image()`, espera `load` y recién entonces asigna `cupEl.src`. Así se evita mostrar una imagen vacía mientras carga.
- Un contador `previewToken` descarta los `load`/`error` de selecciones anteriores. Esto cubre el escenario de cambio rápido de sirope.
- Ante `error`: vuelve a `BASE_IMAGE`.
- Los listeners de `load`/`error` que ya existen en `cupEl` (`revealCup`) se mantienen.
- *Alternativa*: asignar `cupEl.src` directo. Es más simple, pero puede mostrar un hueco o un fotograma intermedio con imágenes de ~1.7 MB.

### 4. Entrega transformada de Cloudinary
URL: `https://res.cloudinary.com/v5ovpy2d/image/upload/f_auto,q_auto,w_800/<public_id>.png`. Con `w_800` alcanza para el escenario en pantallas 2x y se baja el peso a decenas de KB. La URL completa queda en el metafield, así que el JS no necesita conocer la cuenta.

### 5. Mapa sirope → foto (13/13)

| id del metafield | public_id en `v5ovpy2d` |
|---|---|
| `leche-condensada` | `leche-condensada` |
| `sirope-de-fresa` | `sirope-fresa` |
| `sirope-de-chocolate-negro` | `sirope-chocolate-negro` |
| `arequipe` | `arequipe` |
| `miel` | `miel` |
| `nutella` | `nutella` |
| `crema-pistacho-salado` | `crema-de-pistacho-salado` |
| `crema-pistacho-dulce` | `crema-pistacho-dulce` |
| `chocolate-blanco-crocante` | `chocolate-blanco-crocante` |
| `crema-avellana-tostada` | `crema-avellana-tostada` |
| `crema-parchita` | `sirope-parchita` (**inferido**: no hay `crema-parchita` en la colección) |
| `crema-choco-avellana` | `crema-choco-avellana-con-trozos` |
| `crema-mango-parchita` | `crema-de-mango-con-parchita` |

Todos conservan su `premium` actual (estándar: leche condensada, fresa, chocolate negro, arequipe).

### 6. Siropes nuevos: items nuevos en el mismo metafield
Las 9 fotos sin coincidencia se convierten en items nuevos de la categoría "Sirope", agregados al final y con `premium: true`. Así los chips, el precio (+$1.00 por la variante "Extras premium" = 1), la burbuja y la property del carrito funcionan sin cambios de código.

| id (= public_id) | nombre | emoji de respaldo |
|---|---|---|
| `buenissimo-blanco` | Buenissimo blanco | 🤍 |
| `buenissimo-pistacchio` | Buenissimo pistacchio | 🟢 |
| `crema-lotus` | Crema Lotus | 🍪 |
| `perfetina-arachide` | Perfetina arachide | 🥜 |
| `variegato-amarena` | Variegato amarena | 🍒 |
| `variegato-arancia` | Variegato arancia | 🍊 |
| `variegato-gran-crocante` | Variegato gran crocante | 🍫 |
| `variegato-gran-nocciola` | Variegato gran nocciola | 🌰 |
| `variegato-tiramisu-italiano` | Variegato tiramisù italiano | ☕ |

Cada item lleva `precio_cents: 30` (dato informativo, igual que otros premium; el cobro lo decide la variante), `imagen` (miniatura) e `imagen_barquillo` (foto principal).

### 7. Miniatura: recorte fijo de la foto principal
`imagen` = `https://res.cloudinary.com/v5ovpy2d/image/upload/c_crop,x_212,y_0,w_600,h_600/c_scale,w_120/f_auto,q_auto/<public_id>.png`. El recorte toma el copo con el sirope (las 22 fotos comparten encuadre). Se probó en Variegato amarena, Crema Lotus y Perfetina arachide.
- *Alternativa*: `c_thumb,g_auto`. Se descarta porque encuadra el cono, no el sirope.
- *Alternativa*: subir cutouts transparentes. Se descarta porque no existen y requieren trabajo de diseño.
- Por pedido del usuario, los 13 siropes actuales también reemplazan su `imagen` (antes un cutout del ingrediente en `slealu5f`) por este mismo recorte de su foto. Así los 22 chips muestran la barquilla con su sabor. Como solo se modifica el metafield de la Barquilla, Helado Hope conserva sus cutouts.

## Risks / Trade-offs

- [Las miniaturas nuevas tienen fondo blanco, mientras que las actuales son transparentes] → Verificar el contraste en el chip activo e inactivo. Si desentonan, recortarlas en círculo (`r_max`) en un ajuste menor dentro de la misma URL.
- [Con 22 chips el selector crece] → Verificar en 390 px que el scroll del panel sigue funcionando y que el footer con el total queda visible.

- [`crema-parchita` → `sirope-parchita` es una suposición] → Confirmarlo visualmente en la verificación. Si no corresponde, se quita el campo de ese item y el armador muestra la imagen base.
- [Las fotos (2:3) pueden tener otra proporción o encuadre que el cono base] → Verificar con Playwright en móvil y escritorio que el cono no salta de tamaño. Si salta, ajustar la imagen base o el encuadre en un change aparte.
- [La primera selección tarda en mostrarse con una red lenta] → La imagen anterior sigue visible hasta que la nueva carga, así que la vista previa nunca queda vacía.
- [El editor de Shopify u otra persona sobrescribe el metafield sin `imagen_barquillo`] → Se vuelve a la imagen base sin romper nada. Además, se documenta en la memoria del proyecto.

## Migration Plan

1. Mutar el metafield: `imagen_barquillo` en los 13 items actuales y 9 items nuevos al final. Verificarlo con una lectura de la Admin API.
2. Desplegar el tema (commit + push a `main`, previa confirmación del usuario). El orden da igual: sin el campo, el JS nuevo muestra la imagen base, y el JS viejo ignora el campo.
3. Rollback: revertir el commit. El campo extra en el metafield no molesta. Los 9 siropes nuevos sí aparecen apenas se muta el metafield (sin depender del deploy); para retirarlos, quitar esos items con otra mutación.
