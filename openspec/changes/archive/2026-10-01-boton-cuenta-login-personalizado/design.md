# Design

## Context

Ver `proposal.md` - Why. Solo contexto necesario:

- El botón de cuenta del navbar se renderiza en **un único punto**: `snippets/header-actions.liquid` (llamado desde `sections/header.liquid:63`), que a su vez renderiza `account-popover` (escritorio) y `account-drawer` (móvil). Ambos usan `snippets/account-button.liquid` para el icono y comparten `snippets/account-actions.liquid` para el panel.
- Hoy todo es nativo de Shopify: `routes.storefront_login_url` (enlace de acceso en `account-actions.liquid:34`), `routes.account_login_url` (aviso del carrito en `cart-products.liquid:17`) y `routes.account_url` / `routes.account_addresses_url` para clientes autenticados.
- El estado de sesión es server-side en Liquid (`customer`), y `request.design_mode` distingue el editor de la tienda publicada.
- El popover se abre por `<details>/<summary>`; el drawer por `dialog-component` con `on:click="/showDialog"`. Ambos dependen de que el botón NO sea un enlace de navegación.

## Goals / Non-Goals

**Goals:**

- Un único punto de decisión para "sin sesión → login personalizado" en escritorio y móvil.
- Una única fuente de verdad para la URL de login dentro del tema.
- Cero cambios de datos de tienda, checkout, `locales/` y `config/`.

**Non-Goals:**

- Integrar la autenticación ni el post-login con el sistema externo (lo maneja `admin.hopeicecream.shop`).
- Cambiar las rutas de clientes autenticados (pedidos/perfil siguen en Shopify).
- Reemplazar el resto de apariciones de rutas de cuenta no relacionadas con "iniciar sesión".

## Decisions

**D1 - La rama de navegación vive en `header-actions.liquid`, no en popover/drawer.**
Es el único punto donde se decide qué botón de cuenta existe. Un solo `if customer == null and request.design_mode == false` renderiza el enlace directo; si no, renderiza popover + drawer como hoy. Escritorio y móvil quedan cubiertos con la misma decisión (el enlace usa la clase `account-button header-actions__action`, que ya está estilada para ambos viewports).
*Alternativa descartada:* ramificar dentro de `account-popover.liquid` y `account-drawer.liquid` por separado → dos puntos de decisión que pueden divergir, y duplicar la lógica de `design_mode`.

**D2 - Detección de sesión server-side en Liquid, sin JavaScript.**
`customer` ya resuelve en servidor; no hay que interceptar clics. Menos superficie, funciona sin JS y respeta el guard de `shop.customer_accounts_enabled` existente en `header-actions.liquid:10`.
*Alternativa descartada:* JS que redirige al hacer clic → innecesario, rompe la vista previa del editor y añade dependencia de `assets/`.

**D3 - URL centralizada en `snippets/hope-login-url.liquid`, que emite la URL.**
Cada uso la obtiene con `{% render 'hope-login-url' %}` dentro del atributo `href`. Cambiar la URL (o el parámetro `shopDomain`) pasa a ser un solo archivo.
*Alternativa descartada:* theme setting en `settings_schema.json` → habilitable después si la URL cambia a menudo; por ahora añadiría superficie de cambio en `config/` sin beneficio (la URL es estable). *Descartada también:* hardcodear en los 3 sitios → las 3 copias se desincronizan.

**D4 - `account-button.liquid` acepta `href` como atributo existente.**
El snippet ya soporta `attributes`; se le pasa `tag: 'a'` y `attributes: 'href="..."'` (capturado en la variable del padre) para reutilizar icono/avatar/`aria-label` sin duplicar markup. Se añade `text-decoration: none` al CSS de `.account-button` para que el ancla no herede subrayado.
*Alternativa descartada:* markup nuevo paralelo para el enlace → duplica la lógica de icono/avatar y su CSS.

**D5 - Enlaces internos: reemplazar solo el `href` de login, conservar `design_mode`.**
En `account-actions.liquid:33-46` se sustituye la rama `{% else %}{{ routes.storefront_login_url }}{% endif %}` por la URL personalizada, manteniendo `request.design_mode → routes.account_url` para no sacar al editor del iframe. En `cart-products.liquid:17` se pasa la URL personalizada como parámetro `link` a la cadena `actions.log_in_html` (no se toca `locales/`).

**D6 - El `shop | login_button` (Shop Pay) de `account-actions` se conserva.**
Con D1, un visitante sin sesión ya no llega al popover/drawer (salvo en modo editor), por lo que ese botón queda inalcanzable en la tienda publicada. Eliminarlo queda fuera del alcance y no aporta comportamiento observable nuevo.

## Risks / Trade-offs

- [La autenticación externa no establezca sesión de Shopify (`customer` sigue nulo tras loguearse)] → El botón seguiría redirigiendo al login (comportamiento aceptable y consistente con el spec), pero el popover autenticado nunca se mostraría. Verificar con el sistema externo cómo devuelve la sesión al storefront; no cambia specs ni tareas.
- [La URL externa caiga o cambie] → Todo el acceso a cuenta del tema depende de un solo snippet: revert del cambio + `shopify theme push` restaura el flujo nativo completo.
- [El editor de temas se rompa navegando fuera del iframe] → Mitigado por D5/`design_mode` (requisito con scenarios propios en el spec).
- [El `href` con `?` y `=` dentro de un atributo Liquid] → Sin `&` ni comillas en la URL; si en el futuro se añaden parámetros, usar `escape` en la salida del snippet.
- [El popover/drawer quedan "muertos" para no autenticados] → Efecto deseado; D6 mantiene el código para el caso autenticado y el editor, sin ramas extra.

## Migration Plan

1. Implementar en local y verificar con `shopify theme dev` (127.0.0.1:9292) + Playwright: sin sesión (escritorio y móvil) y con sesión simulada.
2. Desplegar con `shopify theme push` (las carpetas `openspec/` y `.claude/` no se suben).
3. Rollback: `git revert` del commit + `shopify theme push`.

## Open Questions

- ¿El sistema externo redirige de vuelta al storefront tras el login y con qué sesión? Afecta solo a cuándo se verá el popover autenticado; se puede responder después sin tocar specs, enfoque ni desglose de tareas.
