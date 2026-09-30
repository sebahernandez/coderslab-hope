# Spec Delta

## ADDED Requirements

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
