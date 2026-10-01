# Acceso a Cuenta (Navbar)

## Purpose

Define cómo accede el cliente a su cuenta desde el navbar de la tienda Hope: a dónde lleva el botón de cuenta según el estado de autenticación, a dónde apuntan los enlaces de inicio de sesión visibles en la tienda y qué comportamiento se conserva en el editor de temas.

## Requirements

### Requirement: Botón de cuenta sin sesión lleva al login personalizado

Cuando `shop.customer_accounts_enabled` está activo y NO existe un cliente autenticado (`customer` nulo), el botón de cuenta del navbar SHALL navegar directamente a `https://admin.hopeicecream.shop/mi-cuenta/login?shopDomain=hopeheladeria.com` en la misma pestaña, tanto en escritorio como en móvil. Al activarlo NO SHALL abrirse ni el popover de escritorio ni el drawer móvil. El botón SHALL conservar su icono/apariencia actual y su etiqueta de accesibilidad (`accessibility.account`).

#### Scenario: Escritorio sin sesión navega al login personalizado

- **WHEN** un visitante no autenticado pulsa el botón de cuenta del navbar en viewport de escritorio (≥750px)
- **THEN** el navegador navega a `https://admin.hopeicecream.shop/mi-cuenta/login?shopDomain=hopeheladeria.com` y NO se abre el popover de cuenta

#### Scenario: Móvil sin sesión navega al login personalizado

- **WHEN** un visitante no autenticado pulsa el botón de cuenta del navbar en viewport móvil (<750px)
- **THEN** el navegador navega a `https://admin.hopeicecream.shop/mi-cuenta/login?shopDomain=hopeheladeria.com` y NO se abre el drawer de cuenta

#### Scenario: Botón conserva icono y accesibilidad

- **WHEN** se renderiza el botón de cuenta para un visitante no autenticado
- **THEN** muestra el mismo icono de cuenta que hoy y mantiene un `aria-label` con la cadena `accessibility.account` accesible para lectores de pantalla

#### Scenario: Cuentas de cliente desactivadas no muestran el botón

- **WHEN** `shop.customer_accounts_enabled` es falso
- **THEN** no se renderiza el botón de cuenta en el navbar (comportamiento actual conservado)

### Requirement: Cliente autenticado conserva popover y drawer

Cuando existe un cliente autenticado (`customer` presente), el botón de cuenta del navbar SHALL mantener el comportamiento actual: abrir el popover en escritorio y el drawer en móvil con las acciones de cuenta (pedidos, perfil/direcciones y cierre de sesión), y NO SHALL redirigir al login personalizado.

#### Scenario: Escritorio autenticado abre el popover

- **WHEN** un cliente autenticado pulsa el botón de cuenta en viewport de escritorio
- **THEN** se abre el popover de cuenta con sus acciones y NO se navega a ninguna URL de login

#### Scenario: Móvil autenticado abre el drawer

- **WHEN** un cliente autenticado pulsa el botón de cuenta en viewport móvil
- **THEN** se abre el drawer de cuenta con sus acciones y NO se navega a ninguna URL de login

#### Scenario: Acciones de la cuenta autenticada siguen en la tienda

- **WHEN** el cliente autenticado pulsa "Pedidos" o "Perfil" dentro del popover/drawer
- **THEN** se navega a las rutas nativas de cuenta de Shopify (`routes.account_url`, `routes.account_addresses_url`), sin cambiar

### Requirement: Los enlaces de inicio de sesión apuntan al login personalizado

Todos los enlaces de "Iniciar sesión" que el tema muestra a clientes no autenticados SHALL apuntar a `https://admin.hopeicecream.shop/mi-cuenta/login?shopDomain=hopeheladeria.com` en lugar de las rutas nativas de Shopify (`routes.storefront_login_url`, `routes.account_login_url`), para que ninguna ruta de la tienda lleve al usuario al flujo de autenticación de Shopify.

#### Scenario: Enlace de acceso dentro del popover/drawer

- **WHEN** un visitante no autenticado llega al bloque de inicio de sesión de `account-actions` (popover o drawer) y pulsa el enlace de iniciar sesión
- **THEN** el navegador navega a la URL de login personalizada

#### Scenario: Enlace de login del carrito vacío

- **WHEN** un visitante no autenticado con el carrito vacío pulsa el enlace "Inicia sesión" del mensaje de carrito
- **THEN** el navegador navega a la URL de login personalizada

#### Scenario: Cadenas de texto sin cambios

- **WHEN** se muestran esos enlaces
- **THEN** el texto visible ("Iniciar sesión", "¿Tienes una cuenta? ...") proviene de las cadenas de `locales/` existentes, sin nuevas cadenas ni traducciones

### Requirement: El editor de temas conserva el comportamiento actual

Cuando la página se renderiza en modo editor (`request.design_mode`), el botón de cuenta SHALL mantener el popover/drawer actual aunque no haya cliente autenticado, para que la vista previa del editor siga siendo navegable sin salir del iframe.

#### Scenario: Vista previa del editor con cliente simulado no autenticado

- **WHEN** el tema se visualiza en el editor de Shopify con un cliente no autenticado
- **THEN** el botón de cuenta abre el popover/drawer actual en lugar de navegar al login personalizado

#### Scenario: Enlaces de login en modo editor

- **WHEN** se renderiza el enlace de inicio de sesión en modo editor
- **THEN** conserva el destino actual de editor (`routes.account_url`), para no sacar al editor de la vista previa
