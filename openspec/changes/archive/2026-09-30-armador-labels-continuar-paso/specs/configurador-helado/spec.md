# Spec Delta

## ADDED Requirements

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
