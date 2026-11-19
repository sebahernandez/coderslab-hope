# Design

## Context

Motivación y alcance: ver `proposal.md`. Requisitos: ver `specs/`.

Estado observado en el código (2026-11-19):

- Los cuatro armadores comparten el mismo markup de vista previa: `<div class="hopecfg__stage">` con `<img id="product-preview" class="hopecfg__cup">`. El escenario ya es `position: relative` y `overflow: hidden` (`assets/toppings-customizer.css`).
- Cada armador cambia la imagen a su manera:

| Armador | Archivo | Cómo cambia `src` | Indicador hoy | Ante error |
|---|---|---|---|---|
| Helado Hope v1 | `toppings-customizer.js` | `setPreviewImage` precarga con contador de petición; `setPreview` (pestañas, arranque) asigna directo | `is-loading` en la **imagen** (opacidad 0.82), sin spinner | se traga el error; queda la imagen anterior |
| Helado / Mixo v2 | `hope-customizer-v2.js` | asigna directo en `render()` al cambiar la base | spinner solo en la primera carga | `revealCup` muestra la imagen rota |
| Milkshake | `milkshake-customizer.js` | asigna directo en `updatePreview()`, sin control de peticiones viejas | spinner en cada cambio | `revealCup` muestra la imagen rota |
| Barquilla | `barquillo-customizer.js` | precarga con `previewToken` y asigna al cargar | spinner solo en la primera carga | muestra el cono base como respaldo |

- El spinner existe duplicado en `hope-customizer-v2.css` (`.hopecfg__stage.is-loading::after`, keyframes `hope2-spin`, sin regla de movimiento reducido) y en `milkshake-customizer.css` (keyframes `ms-thumb-spin`, con regla de movimiento reducido). v1 no carga ninguno de los dos.
- `assets/toppings-customizer.css` es el único CSS presente en los cuatro armadores: se carga global desde `layout/theme.liquid:35`, junto a `toppings-customizer.js` con `defer`.
- Los JS de los armadores son IIFE independientes; no usan el import map de `snippets/scripts.liquid` ni comparten ningún módulo.
- Dentro del escenario conviven la capa de burbujas `+1` de v2 (`z-index: 5`) y la insignia del sabor del mes (`z-index: 3`); el spinner actual usa `z-index: 4`.
- En v2 y Milkshake la imagen parte con `opacity: 0` y se revela con `is-loaded`.

## Goals / Non-Goals

**Goals:**

- Un solo mecanismo de carga de la vista previa, usado por los cuatro armadores, que resuelva precarga, descarte de respuestas viejas, tiempo límite y estados visibles.
- Un solo juego de estilos para el indicador y el mensaje, con un único dueño.
- Migrar un armador por vez, de modo que cada paso sea verificable y reversible por separado.

**Non-Goals:**

- Unificar `catalogUrl`, los toasts u otros helpers duplicados entre armadores.
- Cambiar qué imagen corresponde a cada selección, o las reglas de respaldo por falta de dato (sirope sin foto).
- Reintentos automáticos en segundo plano, o un botón de "Reintentar".
- Tocar miniaturas, banner, carrito o la animación de volar al carrito más allá de que no se rompa.

## Decisions

### 1. Helper compartido `assets/hope-preview-loader.js`, cargado global

Un script nuevo, sin dependencias, que expone `window.HopePreview.create(stage, img, options)` y devuelve un controlador con `show(url)`. Cada armador crea un controlador en su inicialización y reemplaza sus asignaciones a `src` por `controller.show(url)`.

Se carga en `layout/theme.liquid`, con `defer`, **antes** de `toppings-customizer.js`. Los scripts con `defer` se ejecutan en orden de documento, y los scripts de las secciones están en el `body`, así que el helper queda disponible para los cuatro.

- *Alternativa: copiar el helper en los cuatro JS.* Descartada: hoy el problema es justamente tener cuatro variantes del mismo mecanismo.
- *Alternativa: cargarlo desde cada sección.* Descartada: v1 no tiene tags propios (su JS es global y corre en el `head`, antes que cualquier script del `body`), así que igual haría falta tocar el layout.
- *Costo aceptado:* un script chico más en todas las páginas, como ya ocurre con `toppings-customizer.js`. Cada armador MUST comprobar `window.HopePreview` y, si falta, asignar `src` directo como hoy, para que un fallo de carga del helper no deje al armador sin imagen.

### 2. Contrato del controlador

`show(url)`:

1. Incrementa un token propio del controlador; todo resultado con token viejo se ignora (cubre "Solo cuenta la última selección", para imagen y para error).
2. Si `url` es igual a la imagen ya mostrada y el estado es `loaded`, no hace nada. Si el estado es `error`, vuelve a pedirla aunque la URL sea la misma (cubre el reintento sobre la misma opción).
3. Precarga con `new Image()`. Recién al cargar asigna `img.src`, así la imagen anterior sigue visible mientras tanto.
4. Arranca un temporizador de 15 s; si vence antes de `load`, se trata como error y se descarta la precarga.
5. Estados expuestos en el escenario con clases: `is-loading`, `is-error`, y `is-loaded` en la imagen (se conservan los nombres actuales para no romper el CSS de v2 y Milkshake que parte de `opacity: 0`).

`show("")` o sin URL es un error de dato, no de red: el armador decide la imagen de respaldo antes de llamar (así se mantiene "sirope sin foto asignada → cono base").

El controlador no conoce Cloudinary ni el estado de cada armador: recibe URLs completas. Se le pasa el elemento del escenario y la imagen, no consulta por `id`, porque puede haber más de una sección.

- *Alternativa: escuchar `load`/`error` sobre la imagen real, como hacen v2 y Milkshake.* Descartada: obliga a vaciar o cambiar el `src` antes de saber si la nueva carga, y deja ver la imagen rota.

### 3. Estilos en `assets/toppings-customizer.css`

Las reglas del spinner se mueven ahí y se eliminan de `hope-customizer-v2.css` y `milkshake-customizer.css` (el spinner de miniaturas `.ms__thumb` de Milkshake no se toca). Un solo `@keyframes`, con regla `prefers-reduced-motion: reduce` que quita el giro.

- **Cargando:** `.hopecfg__stage.is-loading::after` (spinner, `z-index: 4`, bajo las burbujas) y `.hopecfg__stage.is-loading .hopecfg__cup` atenuada. La aparición del spinner lleva un retraso de ~150 ms vía `transition-delay`, para que una imagen en caché no lo haga parpadear.
- **Error:** `.hopecfg__stage.is-error .hopecfg__cup` oculta con `visibility: hidden` (conserva el espacio y evita el ícono de imagen rota) y el elemento del mensaje visible, centrado, `z-index: 4`.
- En v1 se elimina `.hopecfg__cup.is-loading { opacity: .82 }`: la clase deja de ponerse en la imagen.

Los selectores llevan la especificidad necesaria para ganarle a `.hopecfg--v2 .hopecfg__cup { opacity: 0 }`, que se carga después.

### 4. Mensaje como elemento real, en un snippet compartido

Snippet nuevo `snippets/hope-preview-status.liquid`, renderizado dentro de `.hopecfg__stage` en las cuatro secciones:

```liquid
<p class="hopecfg__stage-status" role="status" aria-live="polite" hidden></p>
```

El helper escribe el texto al entrar en error y lo vacía al salir. Se usa un elemento con `role="status"` propio del escenario (un solo dueño del anuncio de este estado) en lugar del toast global, que es efímero y se usa para el carrito. El texto por defecto vive en el snippet como `data-error-text="Imagen no disponible en este momento"`, igual que el resto del copy de los armadores, que hoy está escrito en español en las secciones.

- *Alternativa: generar el texto con `::after { content: ... }`.* Descartada: no se anuncia de forma fiable y el copy quedaría en el CSS.
- *Alternativa: clave en `locales/`.* Diferida: ningún texto de los armadores usa locales hoy; hacerlo solo aquí sería inconsistente. El snippet deja un único punto para migrarlo.

El estado de carga no se anuncia: se marca el escenario con `aria-busy="true"` mientras carga.

### 5. Respaldo de la Barquilla

`setPreview` en `barquillo-customizer.js` conserva la elección de URL (foto sabor+sirope → cono del sabor solo → foto del sirope → cono base), que resuelve la falta de dato. Lo que se elimina es el respaldo en `onerror`: el error lo maneja el controlador y muestra el mensaje.

### 6. Orden de migración

1. Helper + CSS + snippet, sin cambiar ningún armador (no debe alterar nada visible).
2. Barquilla (ya precarga con token; es el cambio más chico).
3. Milkshake.
4. v2 (Helado Hope y Mixo Hope).
5. v1 (el más distinto: tres modos, clase en la imagen, JS global).
6. Recién entonces, borrar las reglas duplicadas del spinner en v2 y Milkshake.

Cada paso se verifica solo y puede publicarse por separado.

### 7. Verificación

Playwright contra `shopify theme dev`, interceptando las peticiones de imagen del `preview` (`res.cloudinary.com` y `cdn.shopify.com`) para forzar tres casos: demora de 2 s, error 500 y petición que nunca responde. Para el caso de 15 s se usa el reloj simulado del navegador en lugar de esperar. No hay suite de tests en el repo; la verificación es manual asistida y queda descrita por tarea.

## Risks / Trade-offs

- [Los cuatro armadores comparten helper y CSS: un error afecta a todos] → Migración por pasos; cada armador conserva el camino directo si `window.HopePreview` no existe.
- [Cloudinary con `e_background_removal` puede tardar más de 15 s en la primera petición de una combinación nueva y mostrar el mensaje aunque la imagen vaya a existir] → La precarga de combinaciones que ya hace v1 lo reduce; el mensaje desaparece al volver a elegir la opción. El tiempo límite queda como constante única en el helper.
- [Al precargar y luego asignar `src`, el navegador reutiliza la respuesta en caché, pero depende de las cabeceras de caché] → Es el patrón que ya usan v1 y la Barquilla en producción.
- [En error, las burbujas `+1` de v2 quedan flotando sin vaso detrás] → Aceptado: siguen informando los extras elegidos (lo pide el requisito de armado disponible sin imagen). Se revisa visualmente en la tarea de v2.
- [La animación de volar al carrito toma `preview.src`; en error la imagen está oculta] → Cada armador comprueba que agregar al carrito funciona en estado de error; si no hay imagen visible, se omite la animación.
- [Mover el spinner cambia mínimamente su aspecto en Milkshake o v2] → Se toman las medidas y colores actuales de v2 como referencia única.
- [Helado Hope v1 no está asignado a ningún producto y, con los datos actuales, casi toda combinación de topping y sirope pide una imagen compuesta `2d-*` que no existe en Cloudinary: ahora muestra el mensaje donde antes dejaba la copa base en silencio] → Aceptado (decisión del usuario, 2026-11-19): es lo que pide la spec y ningún cliente llega a esa plantilla. Si v1 vuelve a usarse, hay que cargar esas imágenes o tratar la falta de imagen compuesta como dato faltante.
- [El orden `defer` asume que el helper está antes que `toppings-customizer.js` en el layout] → Verificación explícita en la tarea del helper.

## Migration Plan

Despliegue por commit + push a `main`, con confirmación previa, un paso de migración por commit. Rollback: revertir el commit del armador afectado; el helper, el CSS y el snippet son inertes si ningún armador los usa. No hay migración de datos.

## Open Questions

- ¿Conviene mostrar, además del mensaje, un ícono? No cambia specs ni tareas; se decide al maquetar el estado de error.
