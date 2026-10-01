# Tasks

## 1. Fuente única de la URL de login

- [x] 1.1 Crear `snippets/hope-login-url.liquid` que emita `https://admin.hopeicecream.shop/mi-cuenta/login?shopDomain=hopeheladeria.com` y verificar que `{% render 'hope-login-url' %}` imprime la URL exacta (inspección del HTML servido por `shopify theme dev`)
- [x] 1.2 Verificar con `grep` que ninguna otra copia de la URL se ha colado en el tema (solo debe aparecer en el snippet)

## 2. Botón de cuenta del navbar

- [x] 2.1 En `snippets/header-actions.liquid`, añadir la rama: si `shop.customer_accounts_enabled` y `customer` nulo y NO `request.design_mode` → renderizar el botón de cuenta como enlace `<a>` a la URL personalizada; en caso contrario renderizar `account-popover` + `account-drawer` como hoy. Verificar leyendo el HTML servido: sin sesión aparece un `<a href="https://admin.hopeicecream.shop/mi-cuenta/login?...">` y NO el `<details class="account-popover">` ni el `<dialog-component class="account-drawer">`
- [x] 2.2 Reutilizar `snippets/account-button.liquid` con `tag: 'a'` y `attributes` con el `href` (sin duplicar markup del icono), y añadir `text-decoration: none` a `.account-button` en su `{% stylesheet %}`. Verificar que el enlace conserva `aria-label` de `accessibility.account` y el icono de cuenta en el HTML servido
- [x] 2.3 Verificar en `shopify theme dev` (127.0.0.1:9292) con Playwright, viewport escritorio ≥750px y sin sesión: clic en el botón de cuenta navega a la URL personalizada y NO se abre el popover
- [x] 2.4 Verificar con Playwright en viewport móvil <750px y sin sesión: clic en el botón navega a la URL personalizada y NO se abre el drawer
- [x] 2.5 Verificar que con `shop.customer_accounts_enabled = false` no se renderiza ningún botón de cuenta (comportamiento actual conservado)

## 3. Cliente autenticado sin cambios

- [x] 3.1 Verificar con Playwright (sesión simulada de cliente en `shopify theme dev`) que en escritorio el clic abre el popover con Pedidos/Perfil/Cerrar sesión y no navega a ninguna URL de login
- [x] 3.2 Verificar con Playwright en móvil que el clic abre el drawer con las mismas acciones y no navega
- [x] 3.3 Verificar que los enlaces "Pedidos" y "Perfil" siguen apuntando a `routes.account_url` / `routes.account_addresses_url` (HTML servido)

## 4. Enlaces de inicio de sesión

- [x] 4.1 En `snippets/account-actions.liquid`, sustituir la rama no-editor del `href` del enlace de acceso por `{% render 'hope-login-url' %}` conservando `request.design_mode → routes.account_url`. Verificar en el HTML servido que el `href` del enlace "Iniciar sesión" es la URL personalizada en tienda y `routes.account_url` en el editor
- [x] 4.2 En `snippets/cart-products.liquid`, pasar la URL personalizada como parámetro `link` de la cadena `actions.log_in_html` del carrito vacío. Verificar con carrito vacío y sin sesión que el enlace "Inicia sesión" apunta a la URL personalizada
- [x] 4.3 Verificar que no se añadieron cadenas nuevas en `locales/` (git status limpio en `locales/`)

## 5. Verificación integral y despliegue

- [x] 5.1 Ejecutar `openspec validate boton-cuenta-login-personalizado --strict` y verificar que pasa sin errores
- [x] 5.2 Recorrer con Playwright los 4 escenarios del spec en `shopify theme dev` (escritorio/móvil sin sesión → login personalizado; escritorio/móvil con sesión → popover/drawer) y registrar el resultado
- [x] 5.3 Desplegar con `shopify theme push` y verificar en la tienda publicada (password `loldet`) que el botón de cuenta sin sesión navega al login personalizado
