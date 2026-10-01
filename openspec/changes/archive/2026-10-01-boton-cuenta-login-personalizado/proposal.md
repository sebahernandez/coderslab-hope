# Proposal

## Why

El botón de cuenta del navbar lleva hoy al login nativo de Shopify (popover/drawer con `routes.storefront_login_url` / `routes.account_login_url`), pero Hope autentica a sus usuarios en un sistema externo (`admin.hopeicecream.shop`). Un visitante que pulsa "cuenta" cae en el flujo de Shopify, que no es el de la tienda, y se pierde antes de iniciar sesión.

## What Changes

- El botón de cuenta del navbar, para clientes **no autenticados**, navega directamente a la URL de login personalizada `https://admin.hopeicecream.shop/mi-cuenta/login?shopDomain=hopeheladeria.com` en escritorio y móvil, sin abrir popover ni drawer.
- Para clientes **autenticados** se conserva el comportamiento actual: popover en escritorio y drawer en móvil con pedidos, perfil y cierre de sesión.
- Los enlaces "Iniciar sesión" visibles en la tienda (bloque de acceso de `account-actions` y el aviso del carrito vacío) apuntan a la misma URL personalizada, para no perder al usuario en el flujo nativo de Shopify.
- La URL de login pasa a tener **una sola fuente de verdad** en el tema (snippet dedicado), en lugar de repetirse en cada uso.
- En el editor de temas (`request.design_mode`) se conserva el popover/drawer actual, para que la vista previa siga siendo navegable.

## Capabilities

### New Capabilities

- `acceso-cuenta`: comportamiento del acceso a cuenta desde el navbar: destino del botón de cuenta según estado de autenticación (login personalizado vs. popover/drawer), destino de los enlaces de inicio de sesión de la tienda y comportamiento en modo editor.

### Modified Capabilities

<!-- Ninguna capability existente cambia de requerimientos: menu-navegacion y menu-movil
     cubren el menú del header, no el botón de cuenta. -->

## Impact

- **Código afectado** (solo tema, Liquid):
  - `snippets/account-popover.liquid` (escritorio, rama no autenticada → enlace directo)
  - `snippets/account-drawer.liquid` (móvil, rama no autenticada → enlace directo)
  - `snippets/account-button.liquid` (posible parametrización de `href`)
  - `snippets/account-actions.liquid` (enlace "Iniciar sesión" → URL personalizada)
  - `snippets/cart-products.liquid` (enlace de login del carrito vacío → URL personalizada)
  - nuevo `snippets/hope-login-url.liquid` (fuente única de la URL)
- **Sin cambios**: `config/settings_schema.json`, `config/settings_data.json`, `locales/` (las cadenas ya existen), datos de tienda, checkout.
- **Fuera de alcance**: cuentas, órdenes y direcciones de clientes autenticados siguen resolviendo a las rutas nativas de Shopify; la sesión/redirect post-login lo maneja el sistema externo; los enlaces de "Iniciar sesión" configurados en menús de navegación (si existieran) se editan en el admin, no en el código.
- **Despliegue/verificación**: `shopify theme push`; prueba con Playwright contra `shopify theme dev` (127.0.0.1:9292), storefront en password `loldet`.
