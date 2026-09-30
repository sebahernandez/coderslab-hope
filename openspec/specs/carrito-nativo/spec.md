# Carrito Nativo (Integración con Horizon)

## Purpose

Integrar el botón "Añadir al carrito" de los configuradores con el carrito nativo del tema Horizon
(drawer, burbuja/badge, fly-to-cart) sin importar módulos ES, replicando el flujo nativo mediante
`fetch` y eventos del tema.

## Requirements

### Requirement: Alta en el carrito replicando el flujo nativo

El sistema SHALL hacer POST a `window.Theme.routes.cart_add_url` (`/cart/add.js`) con `items[]`, los
`sections` de `cart-items-component` y `sections_url`, para que el drawer se regenere con el contenido
actualizado.

#### Scenario: Añadir un helado desde el configurador

- **WHEN** el cliente pulsa "Añadir al carrito"
- **THEN** se hace el POST a `/cart/add.js` con las secciones solicitadas y la respuesta incluye el
  HTML de sección para morph del drawer

### Requirement: Evento cart:update para sincronizar UI

El sistema SHALL disparar en `document` un `CustomEvent('cart:update')` con
`detail.data.source = 'product-form-component'` y las `sections`, de modo que `cart-icon.js` sume el
itemCount y `component-cart-items.js` haga morph del drawer.

#### Scenario: La burbuja y el drawer reaccionan al alta

- **WHEN** se dispara `cart:update` tras añadir un producto
- **THEN** la burbuja del header rebota sumando el itemCount y el drawer se actualiza por morph

### Requirement: Animación fly-to-cart y apertura del drawer

El sistema SHALL animar un fly-to-cart (curva bézier) desde el botón hasta
`.header-actions__cart-icon` y abrir el drawer con `cart-drawer-component.open()`.

#### Scenario: Feedback visual al añadir

- **WHEN** el cliente añade un producto
- **THEN** se ve la animación fly-to-cart y el drawer se abre

### Requirement: Badge cuenta solo líneas principales

El sistema SHALL sobrescribir el contador del badge (`.cart-bubble__text-count`) para contar solo las
líneas SIN property `Para` (las líneas add-on de extras no cuentan), recalculando en load, en
`cart:update` y en `shopify:section:load`. El cambio es solo visual; en checkout los extras siguen
siendo líneas separadas.

#### Scenario: Extras no inflan el contador

- **WHEN** el carrito tiene un helado más su línea add-on de extras
- **THEN** el badge muestra 1, no 2

### Requirement: Limpieza de líneas huérfanas

El sistema SHALL, al detectar un `_hope_ext` sin su línea padre (helado eliminado), quitar sus líneas
add-on vía `/cart/update.js` y re-disparar `cart:update` con un guard anti-bucle.

#### Scenario: Eliminar el helado limpia sus extras

- **WHEN** el cliente elimina del carrito el helado que tenía extras premium
- **THEN** la línea add-on asociada (mismo `_hope_ext`) se elimina automáticamente
