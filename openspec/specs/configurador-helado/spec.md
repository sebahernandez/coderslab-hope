# Configurador de Helado (Armador "Crea tu Hope")

## Purpose

Permitir que el cliente arme su helado personalizado en la página de producto, eligiendo toppings y
siropes con vista previa en tiempo real, y añadirlo al carrito. Cubre las dos variantes de interfaz
en producción: v1 multimodo (swap de imágenes Cloudinary) y v2 con burbujas "+1" flotantes sobre un
vaso fijo.

## Requirements

### Requirement: Selección múltiple de toppings y siropes

El sistema SHALL permitir seleccionar múltiples toppings y siropes sin límite superior, respetando
las reglas de inclusión del modelo de cobro (ver capacidad `cobro-extras`).

#### Scenario: El cliente elige varios toppings

- **WHEN** el cliente marca tres chips de topping estándar
- **THEN** los tres quedan seleccionados y la vista previa refleja cada extra elegido

#### Scenario: Validación mínima de sirope

- **WHEN** el cliente intenta añadir al carrito sin ningún sirope seleccionado
- **THEN** el sistema muestra un aviso de validación y no añade el producto

### Requirement: Vista previa dinámica del armado

El sistema SHALL actualizar la vista previa del helado al cambiar la selección: la v1 intercambia la
composición de imagen Cloudinary (cuenta `slealu5f`, carpeta `hope/catalog`) y la v2 muestra una
burbuja circular con insignia rosa `+1` anclada sobre el helado por cada extra.

#### Scenario: Preview v2 al agregar un extra (burbuja)

- **WHEN** el cliente selecciona un topping en la interfaz v2 (`custom-product-v2.liquid`)
- **THEN** aparece una burbuja con el emoji/imagen del ingrediente en su ancla calibrada y la última
  seleccionada lleva anillo rosa

### Requirement: Inicialización idempotente de la sección

El sistema SHALL inicializar el configurador de forma idempotente por raíz de sección y re-inicializar
tras `shopify:section:load`, evitando doble inicialización cuando el asset global se carga en toda la
tienda.

#### Scenario: Recarga de la sección en el editor de temas

- **WHEN** Shopify dispara `shopify:section:load` sobre la sección del configurador
- **THEN** el configurador se re-inicializa una sola vez sin duplicar estado ni listeners

### Requirement: Aislamiento de estilos y de inicialización por variante

El sistema SHALL scopear todos los estilos bajo `.hopecfg` y usar atributos raíz distintos por
variante (`data-hopecfg` para v1, `data-hopecfg-v2` para v2) para que el JS global de v1 no capture la
sección v2.

#### Scenario: v2 no es capturada por el JS global de v1

- **WHEN** la página v2 se carga con el asset global `toppings-customizer.js` presente
- **THEN** el JS global (que inicializa sobre `[data-hopecfg]`) no inicializa la raíz v2
  (`[data-hopecfg-v2]`)

### Requirement: Flujo de armado en tres pasos

El sistema SHALL guiar el armado en tres pasos ordenados: (1) elegir tamaño, (2) elegir toppings,
(3) elegir sirope (`STEP_LABELS = ["Elige tu tamaño", "Elige tus toppings", "Elige tu sirope"]`). El
tamaño SHALL ser de selección única; toppings y siropes SHALL ser de selección múltiple.

#### Scenario: Recorrido de los tres pasos

- **WHEN** el cliente abre el armador
- **THEN** ve los pasos "Elige tu tamaño", "Elige tus toppings" y "Elige tu sirope" en ese orden,
  con el tamaño como selección única y toppings/siropes como selección múltiple

#### Scenario: Aplica por igual a Helado Hope y Mixo Hope

- **WHEN** el armador se sirve para Helado Hope o para Mixo Hope (misma sección `custom-product-v2`)
- **THEN** el flujo de tres pasos es idéntico, diferenciándose solo la tabla de precios base del
  producto

### Requirement: Etiqueta dinámica del botón de avanzar de paso

En la vista móvil, el botón que avanza de paso en el wizard v2 SHALL mostrar el número del paso al
que lleva ("Continuar paso 2", "Continuar paso 3") en vez de un texto genérico, actualizándose junto
con el resto del estado del wizard cada vez que cambia el paso activo, incluida la carga inicial.

#### Scenario: Etiqueta al iniciar el armador (paso 1 de 3)

- **WHEN** el cliente abre el armador y ve el paso 1 de 3 (tamaño)
- **THEN** el botón de avanzar muestra el texto "Continuar paso 2"

#### Scenario: Etiqueta al avanzar al paso 2 de 3

- **WHEN** el cliente presiona el botón de avanzar desde el paso 1 (tamaño) y llega al paso 2 de 3
  (toppings)
- **THEN** el botón de avanzar muestra el texto "Continuar paso 3"

#### Scenario: Botón de avanzar oculto en el último paso

- **WHEN** el cliente llega al paso 3 de 3 (sirope)
- **THEN** el botón de avanzar no se muestra (solo aparecen "Atrás" y "Añadir al carrito"), por lo que
  no hay una etiqueta "Continuar paso 4"
