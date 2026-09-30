# Spec Delta

## ADDED Requirements

### Requirement: Tope de extras básicos bakeados en la variante

El sistema SHALL topar en 20 (`MAX_EXTRA_TOPPINGS`) la cantidad de extras básicos pagados que se
reflejan en el precio de la variante. El conteo que elige la variante es
`min(paidBasicToppings + paidBasicSyrups, 20)`; los básicos pagados por encima de 20 NO incrementan
el precio de la variante.

#### Scenario: Más de 20 básicos pagados

- **WHEN** el cliente selecciona básicos que superan los 20 pagados (más allá de los incluidos)
- **THEN** la variante seleccionada corresponde a 20 extras (precio = base + $20.00) y los básicos
  adicionales no suman más al precio de la variante

### Requirement: Precio premium plano y uniforme

El sistema SHALL cobrar cada ítem premium (topping o sirope, marcado con `data-premium`) a un precio
plano de $1.50 (`PREMIUM_CENTS`), ignorando su `precio_cents` individual. Los premium NUNCA consumen
los cupos incluidos (2 toppings / 1 sirope) y SHALL cobrarse en la línea add-on (ver capacidad
`carrito-nativo`), con `qty` igual al número total de premium.

#### Scenario: Premium de topping y de sirope cuestan lo mismo

- **WHEN** el cliente selecciona un topping premium y un sirope premium, con `precio_cents` distintos
- **THEN** ambos se cobran a $1.50 cada uno (se ignora `precio_cents`) y la línea add-on lleva
  `qty = 2`

#### Scenario: Premium no consume los incluidos

- **WHEN** el cliente selecciona 2 toppings básicos y 1 topping premium
- **THEN** los 2 básicos quedan como incluidos (sin costo adicional) y el premium se cobra aparte a
  $1.50

### Requirement: Condiciones y validaciones de la interfaz

El sistema SHALL mostrar un aviso al superar los toppings incluidos (`FREE_TOPPINGS = 2`) y marcar
los chips adicionales con `+$1.00`, y SHALL exigir al menos 1 sirope seleccionado para habilitar el
añadido al carrito (`isValidSelection` requiere `syrups.length >= 1`).

#### Scenario: Aviso al superar los toppings incluidos

- **WHEN** el cliente selecciona un tercer topping básico
- **THEN** se muestra el aviso de toppings y los chips adicionales se marcan con `+$1.00`

#### Scenario: Bloqueo sin sirope

- **WHEN** el cliente intenta añadir al carrito con 0 siropes seleccionados
- **THEN** el sistema impide el añadido e indica que debe elegir 1 sirope
