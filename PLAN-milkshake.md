# Plan: Producto "Milkshake" + customizer dedicado (combos pre-armados)

## Context

Producto nuevo **Milkshake**: NO es personalizable como Helado Hope / Mixo Hope. Es de **opción única**
= un **combo pre-armado**. El cliente **no elige toppings ni siropes**, así que el customizer actual
(tamaño × extras, 2 toppings + sirope, burbujas "+1") no aplica. Por decisión de diseño, en vez de usar la
página de producto nativa de Shopify, se construye un **armador dedicado** con la misma línea gráfica: una
grilla de combos donde el cliente elige uno → se resuelve a la variante nativa → se agrega al carrito.

**Nota sobre Shopify:** no hay MCP de Shopify. El proyecto opera Shopify vía **Shopify CLI**
(`shopify store execute --store hopesweet ... --allow-mutations`), igual que se crearon Helado Hope y Mixo
Hope. Se usará ese mismo flujo con la mutación `productSet`.

**Decisiones confirmadas con el usuario:**
- Arquitectura: **sección dedicada nueva** (clonar patrón autónomo v2/Mixo).
- Opción nativa se llama **"Combo"**; cada valor = un combo (Fresa / Vainilla / Chocolate).
- **Mismo precio**: **$7,00** para los tres.
- Muestra el **aviso "solo para delivery"** (banner rosa con ícono de camión, igual que Mixo Hope).
- Preview: **usar los cutouts Cloudinary existentes** (los 3 sabores ya tienen asset usado por el modo
  milkshake v1) para que el preview se vea real; **emoji** en las cards de selección. El campo `asset` del
  metafield queda cableado, así que cambiar/añadir imágenes luego es trivial.

## Datos concretos de los combos (confirmados)
| Combo (option1) | Gramos | Ingredientes | Emoji | Asset Cloudinary (preview) | Precio |
|---|---|---|---|---|---|
| Fresa | 150 g | Helado yogurt + Fresa + Sirope Fresa | 🍓 | `hope-milkshake-strawberry-cutout-v3` | $7,00 |
| Vainilla | 150 g | Helado yogurt + Chocolate blanco crocante + Sirope Vainilla | 🌼 | `hope-milkshake-vanilla-cutout-v1` | $7,00 |
| Chocolate | 150 g | Helado yogurt + Chocolate negro + Sirope Chocolate | 🍫 | `hope-milkshake-chocolate-cutout-v2` | $7,00 |

Nota: `-vanilla-cutout-v1` y `-chocolate-cutout-v2` requieren `e_background_removal` en `catalogUrl` (ya
contemplado en la lista de assets con fondo del JS existente; se replica en el JS del milkshake). Estos
cutouts del vaso viven en `hope/catalog` y son distintos de la colección de ingredientes de abajo.

---

## Imágenes Cloudinary — colección de ingredientes/toppings (fuente de verdad)

Colección compartida: **https://collection.cloudinary.com/slealu5f/2ad6d8e36ad00470c6cd2dd871ce11ab**
(cuenta `slealu5f`). Son **43 PNG con transparencia**, ubicados en la **raíz** de la cuenta (NO en
`hope/catalog`), cada uno con un sufijo aleatorio de subida. Al tener transparencia **no requieren**
`e_background_removal`.

Patrón de URL de entrega:
`https://res.cloudinary.com/slealu5f/image/upload/f_auto,q_auto,w_<W>/<public_id>.png`
(la versión `v<n>` es opcional; sirve para cache-busting).

Listado completo de `public_id` (43):
- **Frutas**: `arandanos_wurmgy`, `cerezas_x5e0kj`, `fresa_sg1qj6`, `kiwi_ohraul`, `mango_lkrsyw`,
  `melocoton_mbr7vr`, `moras_lbwhee`, `patilla_cugvkf`, `pina_qpxq3k`, `uva_hffueu`
- **Crocantes/cereales/dulces**: `flips_srrzh2`, `fruit-loops_nqcqfc`, `granola_ghzmmi`, `m_m_cvmay7`,
  `malvaviscos_oomj1u`, `mini-brownies_unbmxn`, `mini-chocolates_vm0tp5`, `oreo_odrkyt`, `pirulin_moxhoc`,
  `coco-rallado_xnhap0`, `hershey_s_xlhsqh`, `maní_con_ajonjolí_vatr53`, `migas-de-torta_igbq0x`,
  `miga-de-cocosette_gwizuv`, `miga-de-susy_ylxo2q`, `chocolate-blanco-crocante_mm8nm4`, `Bolero_xsksv9`
- **Cremas/siropes**: `arequipe_gdowkc`, `crema-choco-avellana-con-trozos_vscite`,
  `crema-de-avellana-tostada_dxvmit`, `crema-de-mango-con-parchita_m7sihe`, `crema-de-parchita_wy8pcm`,
  `crema-de-pistacho-dulce_vibfvw`, `crema-de-pistacho-salado_dunelo`, `leche-condensada_ju4q3s`,
  `lluvia-de-chocolate_rryrxn`, `lluvia-de-chocolate-blanco_fyjqzo`, `lluvia-de-colores_omtwi0`,
  `maracuya-pulpa_udgivt`, `miel_tlmmed`, `nutella_pptvix`, `sirope-de-chocolate-negro_pdkrfu`,
  `sirope-de-fresa_e7ysfk`

Para el **Milkshake** los ingredientes de cada combo tienen imagen aquí (`fresa`, `sirope-de-fresa`,
`chocolate-blanco-crocante`, `sirope-de-chocolate-negro`, chocolate negro), pero el **preview** del armador
sigue siendo el cutout del vaso; estas imágenes solo se usarían si se quiere ilustrar los ingredientes.

---

## Parte 1 — Crear el producto en Shopify (CLI + `productSet`)

Archivos de trabajo (en scratchpad, no en el repo del tema):
- `milkshake-productset.graphql` — mutación `productSet`.
- `milkshake-vars.json` — variables con título, handle, opción "Combo", variantes (una por combo, mismo
  precio), `templateSuffix: "milkshake"`, y el metafield de presentación.

Definición del producto:
- **title**: `Milkshake`, **handle**: `milkshake`.
- **productOptions**: una sola opción `Combo` con `values` = nombres de combos.
- **variants**: 3 (Fresa, Vainilla, Chocolate), `price: 7.00` cada una,
  `optionValues: [{ optionName: "Combo", name: <combo> }]`.
- **templateSuffix**: `milkshake` → usará `templates/product.milkshake.json`.
- **metafield** `custom.milkshake_combos` (type `json`, lista): un objeto por combo
  `{ "combo": "Fresa", "emoji": "🍓", "gramos": "150 g", "ingredientes": "Helado yogurt + Fresa + Sirope Fresa", "asset": "hope-milkshake-strawberry-cutout-v3" }`
  (y análogos para Vainilla/Chocolate, ver tabla arriba). El armador lo lee para pintar cada card y el
  preview (match por nombre de combo = `option1`). `asset` vacío → fallback a emoji.

Comando (patrón ya validado en el proyecto):
```
shopify store execute --store hopesweet \
  --query-file milkshake-productset.graphql \
  --variable-file milkshake-vars.json \
  --allow-mutations
```

Tras crear: **publicar** en Tienda online y POS (misma operación que Mixo Hope, `publishablePublish`).

---

## Parte 2 — Customizer dedicado (clon simplificado del patrón v2)

Se reutiliza **toda la infraestructura** del v2 (root con data-attrs, JSON de variantes inyectado, pipeline
`/cart/add.js` + refresh de secciones + `cart:update` + apertura del drawer + toast + `flyToCart`,
`formatMoney`, `catalogUrl`) y se **reemplaza el núcleo de dominio** por una selección única de combo.

Archivos nuevos:

### `templates/product.milkshake.json`
Referencia la sección `custom-product-milkshake` como `main` (settings vacíos → defaults del schema).

### `sections/custom-product-milkshake.liquid` (clon de `sections/custom-product-v2.liquid`)
- Carga `milkshake-customizer.css` / `.js` (assets propios, NO globales).
- `p_milkshake = section.settings.producto_milkshake | default: closest.product | default: product`.
- Inyecta `products_json` con variantes (`id`, `option1` = combo, `price`, `price_formatted`, `available`).
- Inyecta `combos_json` desde `p_milkshake.metafields.custom.milkshake_combos.value`.
- Root: `class="hopecfg hopecfg--milkshake"` + **`data-hopecfg-ms`** (atributo propio para que el
  `toppings-customizer.js` global —que inicializa sobre `[data-hopecfg]`— NO lo capture, igual que hace v2
  con `data-hopecfg-v2`). Mantiene clase `hopecfg` para heredar el layout base y el fondo rosa
  (`body:has(.hopecfg)`) definidos globalmente en `assets/toppings-customizer.css`.
- data-attrs: `data-money-format`, `data-cloudinary-account`, `data-cloudinary-folder`, `data-base-asset`.
- **Preview panel**: logo + `<img id="product-preview">` (imagen del combo o base). Sin capa de burbujas.
- **Config panel**: eyebrow + `titulo_dinamico` ("Crea tu Milkshake"); **banner delivery**
  `.hope2__delivery-notice` (visible por setting `solo_delivery`, default `true`); un único fieldset
  `data-group="combo"` con una card por combo (emoji + nombre + ingredientes + gramos + precio).
- **Footer** idéntico al v2: `#price`, `#buy-hint`, `#reset-view`, `#buy`, toast.
- **Schema**: `logo`, `eyebrow`, `titulo`, `texto_boton`, `producto_milkshake` (product picker),
  `cloudinary_account/folder`, `base_asset`, `solo_delivery` (checkbox, default true). Un `preset`.

### `assets/milkshake-customizer.js` (clon de `assets/hope-customizer-v2.js`)
Conserva casi idéntico: init idempotente sobre `[data-hopecfg-ms]` (init en `DOMContentLoaded` +
`shopify:section:load`), `catalogUrl`, `formatMoney`, y **todo el bloque de `/cart/add.js`** (payload con
`sections`, evento `cart:update`, `open()` del `cart-drawer-component`, toast, `flyToCart`). Reemplaza:
- `state = { combo: <primer combo> }` (sin size/toppings/premium/syrup).
- `variantForState()`: busca la variante cuyo `option1 === state.combo` (match por nombre, **no por
  posición** — evita la fragilidad del modo milkshake v1).
- Selección: delegación de click sobre `data-group="combo"`, selección única (siempre hay uno activo).
- `isValidSelection()`: siempre válido (hay un combo activo por defecto) → botón "Añadir" siempre habilitado.
- Preview: al cambiar de combo, intercambia la imagen vía `catalogUrl(asset)` si el combo tiene `asset`;
  aplica `e_background_removal` para `-vanilla-cutout-v1` / `-chocolate-cutout-v2`; si no hay asset, mantiene
  `base_asset`.
- `buildProperties()`: `{ "Combo": state.combo }` (para legibilidad en carrito/pedido).

### `assets/milkshake-customizer.css`
Solo lo específico del milkshake: grilla de cards de combo (`.hopecfg--milkshake` scoped), estilo de
`ingredientes` / `gramos`, y `.hope2__delivery-notice` (copiar la regla desde `hope-customizer-v2.css`, ya
que esa clase NO es global). El resto del layout (`.hopecfg__*`, chips, botones, footer, fondo rosa) se
hereda del CSS global `toppings-customizer.css`.

---

## Parte 3 — Usar las imágenes de ingredientes en Hope y Mixo (chips con imagen)

Hoy los chips de toppings/siropes de Hope y Mixo muestran **solo emoji**
(`snippets/hope-extra-chip.liquid` emite `data-emoji` pero NO `data-image`; el JS `readImage` lee
`dataset.image` pero siempre llega vacío → cae en emoji). Objetivo: mostrar la **imagen real** del
ingrediente en cada chip usando la colección de arriba.

Pasos:
1. **Metafield**: añadir a cada item de `custom.opciones_customizador` (categorías → items) un campo
   `imagen` con el `public_id` correspondiente (p. ej. `fresa` → `fresa_sg1qj6`, `granola` →
   `granola_ghzmmi`, `oreo` → `oreo_odrkyt`, sirope chocolate → `sirope-de-chocolate-negro_pdkrfu`, etc.).
   El mapeo item→public_id se hace por nombre usando el **listado de 43** de este documento. Actualizar el
   metafield del producto `helado-hope` y de `mixo-hope` vía `metafieldsSet` (CLI, `--allow-mutations`).
2. **Snippet** `snippets/hope-extra-chip.liquid`: emitir `data-image="{{ item.imagen }}"` cuando exista, y
   renderizar un `<img class="hopecfg__chip-img" ...>` dentro del chip (con `<span>` emoji como fallback si
   `imagen` está vacío).
3. **JS** (`assets/hope-customizer-v2.js` y `assets/toppings-customizer.js`): estas imágenes están en la
   **raíz** (no en `hope/catalog`) y **con transparencia**. Ajustar la construcción de URL para ingredientes
   de raíz: `https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto,w_<W>/<public_id>.png` (sin
   carpeta y **sin** `e_background_removal`). Opción limpia: si `data-image` contiene `/` o un sufijo
   `_xxxxxx`, tratarlo como public_id de raíz; si no, usar el `catalogUrl` de `hope/catalog` actual.
   Reutilizar el mismo helper en el JS del milkshake.
4. **CSS**: estilar `.hopecfg__chip-img` (tamaño/encaje dentro del chip) en el CSS correspondiente.
5. **Verificación**: en `theme dev`, abrir `/products/helado-hope` y `/products/mixo-hope`, confirmar que los
   chips muestran las imágenes (y fallback a emoji donde no haya `imagen`), y que el flujo de carrito sigue
   igual.

Nota: este cambio es **independiente** de la creación del Milkshake; puede aplicarse antes, después o en
paralelo. El Milkshake ya nace con su preview de cutout; estas imágenes de ingredientes son para los chips
de los armadores configurables (Hope/Mixo).

---

## Archivos a crear (resumen)
- `templates/product.milkshake.json`
- `sections/custom-product-milkshake.liquid`
- `assets/milkshake-customizer.js`
- `assets/milkshake-customizer.css`
- (scratchpad) `milkshake-productset.graphql`, `milkshake-vars.json`

## Archivos a modificar (Parte 3 — imágenes en Hope/Mixo)
- `snippets/hope-extra-chip.liquid` — emitir `data-image` + `<img>` con fallback a emoji.
- `assets/hope-customizer-v2.js` y `assets/toppings-customizer.js` — resolver URL de ingredientes en raíz
  (sin carpeta, sin `e_background_removal`).
- CSS correspondiente — `.hopecfg__chip-img`.
- Metafield `custom.opciones_customizador` de `helado-hope` y `mixo-hope` — añadir `imagen` (public_id).

## Referencias reutilizadas (no reescribir)
- `sections/custom-product-v2.liquid` — plantilla de la sección (clonar y simplificar).
- `assets/hope-customizer-v2.js` — plantilla del JS (clonar; conservar red/carrito, reemplazar estado).
- `assets/hope-customizer-v2.css` — origen de `.hope2__delivery-notice`.
- `assets/toppings-customizer.css` — layout base global `.hopecfg__*` + fondo rosa (se hereda).
- Modo milkshake v1 (`assets/toppings-customizer.js`, líneas ~99-105) — origen de los 3 assets cutout.

## Verificación (end-to-end)
1. `shopify theme dev --store hopesweet` (sin `--theme-editor-sync`) → abrir `/products/milkshake`.
2. Con Playwright (127.0.0.1:9292): comprobar que
   - se renderiza una card por combo con emoji + ingredientes + gramos + precio;
   - seleccionar un combo lo marca activo, actualiza `#price` y cambia la imagen del preview;
   - el banner "solo para delivery" aparece;
   - "Añadir al carrito" agrega la **variante correcta** (match por nombre de combo), abre el drawer y
     muestra la propiedad `Combo`;
   - el `toppings-customizer.js` global NO interfiere (no hay doble init).
3. Confirmar en Admin que el producto quedó publicado en Tienda online (y POS).
