# Cobro de Extras (Toppings, Siropes y Premium)

## Purpose

Definir cómo se calcula y cobra el precio de un helado personalizado (Helado Hope y Mixo Hope),
combinando un precio base por tamaño con el cobro de extras mediante un modelo híbrido: básicos
bakeados en la variante y premium mediante una línea add-on. Funciona en tiendas Development / no-Plus
sin Shopify Functions.

## Requirements

### Requirement: Precio base por tamaño

El sistema SHALL determinar el precio base según la opción de tamaño de la variante. Helado Hope:
Pequeño $6.00 / Mediano $7.50 / Grande $9.00. Mixo Hope: Pequeño $5.00 / Mediano $7.00 / Grande $9.00.

#### Scenario: Selección de tamaño sin extras

- **WHEN** el cliente elige "Mediano" en Helado Hope sin extras adicionales
- **THEN** el precio de la línea del helado es $7.50 y se añade una sola línea al carrito

### Requirement: Cobro de básicos incluidos y adicionales en la variante

El sistema SHALL incluir 2 toppings y 1 sirope sin costo. Cada básico adicional cuesta $1.00 fijo
(ignorando `precio_cents`) y este costo va bakeado en la variante mediante la opción interna
`Toppings extra` (0..20); el JS selecciona la variante `(tamaño, min(paidExtras, 20))`.

#### Scenario: Tercer topping básico

- **WHEN** el cliente selecciona un tercer topping estándar
- **THEN** se muestra el aviso `#topping-warning`, el chip extra se marca `+$1.00` y la variante
  seleccionada sube $1.00 sobre el base

### Requirement: Cobro de premium mediante línea add-on de $1.50 fijo

El sistema SHALL cobrar cada topping premium (flag `item.premium`) a $1.50 fijo, sin consumir los
incluidos, mediante una segunda línea add-on (producto `extras-personalizados`, variant
`67600613900540`) con `qty = nº de premium`. La línea del helado y la línea add-on comparten la
property oculta `_hope_ext` para agruparse.

#### Scenario: Un topping premium seleccionado

- **WHEN** el cliente añade el helado con un topping premium
- **THEN** el carrito tiene 2 líneas: el helado por su variante de tamaño y una línea add-on de $1.50
  con qty 1, ambas con la property `_hope_ext`

#### Scenario: Sin premium no hay línea add-on

- **WHEN** el cliente añade el helado sin ningún premium
- **THEN** el carrito tiene una sola línea (la del helado) y no se crea línea add-on

### Requirement: Total consistente entre JS y variante

El sistema SHALL calcular el total como `variante (base + básicos adicionales) + premiumCount ·
PREMIUM_CENTS`, donde `PREMIUM_CENTS = 150`, y reflejar ese total en la interfaz antes de añadir al
carrito.

#### Scenario: Total mostrado coincide con el cobrado

- **WHEN** el cliente tiene 3 básicos (1 adicional) y 2 premium en Mediano de Helado Hope
- **THEN** el total mostrado es $7.50 + $1.00 + 2·$1.50 = $11.50 y coincide con la suma de las líneas
  del carrito
