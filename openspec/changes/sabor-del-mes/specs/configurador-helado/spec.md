# Spec Delta

## MODIFIED Requirements

### Requirement: Flujo de armado en tres pasos

El sistema SHALL guiar el armado en tres pasos ordenados: (1) elegir tamaño, (2) elegir toppings,
(3) elegir sirope (`STEP_LABELS = ["Elige tu tamaño", "Elige tus toppings", "Elige tu sirope"]`). El
tamaño SHALL ser de selección única; toppings y siropes SHALL ser de selección múltiple. Cuando hay
un sabor del mes vigente (ver capacidad `sabor-del-mes`), el sistema SHALL anteponer el paso
"Elige la base del helado" (selección única), quedando cuatro pasos ordenados: base, tamaño,
toppings, sirope; la numeración visible de los grupos SHALL ajustarse en consecuencia.

#### Scenario: Recorrido de los tres pasos

- **WHEN** el cliente abre el armador y no hay sabor del mes vigente
- **THEN** ve los pasos "Elige tu tamaño", "Elige tus toppings" y "Elige tu sirope" en ese orden,
  con el tamaño como selección única y toppings/siropes como selección múltiple

#### Scenario: Recorrido de cuatro pasos con sabor del mes

- **WHEN** el cliente abre el armador y hay sabor del mes vigente
- **THEN** ve "1 · Elige la base del helado", "2 · Elige tu tamaño", "3 · Elige tus toppings" y
  "4 · Elige tu sirope" en ese orden, y el indicador móvil muestra "Paso 1 de 4"

#### Scenario: Aplica por igual a Helado Hope y Mixo Hope

- **WHEN** el armador se sirve para Helado Hope o para Mixo Hope (misma sección `custom-product-v2`)
- **THEN** el flujo (de tres o cuatro pasos según haya sabor vigente) es idéntico, diferenciándose
  solo la tabla de precios base del producto

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

- **WHEN** el cliente llega al último paso (sirope), sea el 3 de 3 o el 4 de 4
- **THEN** el botón de avanzar no se muestra (solo aparecen "Atrás" y "Añadir al carrito"), por lo que
  no hay una etiqueta que apunte a un paso inexistente

#### Scenario: Etiquetas con cuatro pasos

- **WHEN** hay sabor del mes vigente y el cliente está en el paso 3 de 4 (toppings)
- **THEN** el botón de avanzar muestra "Continuar paso 4"
