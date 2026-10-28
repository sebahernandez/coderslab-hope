# Spec Delta

## ADDED Requirements

### Requirement: Tamaño táctil consistente de los controles del wizard móvil

En la vista móvil (`max-width: 1023px`) el sistema SHALL mostrar los controles de navegación del pie
del wizard v2 ("Atrás", "Siguiente" y "Añadir al carrito") con una altura consistente entre sí de al
menos 44px (mínimo táctil del tema), de modo que ninguno se vea notoriamente más delgado que el resto
de los controles de la misma fila (incluido el botón circular "Reiniciar").

#### Scenario: Altura consistente entre Atrás, Siguiente y Añadir al carrito

- **WHEN** el cliente ve el pie del armador v2 en un viewport móvil (`max-width: 1023px`)
- **THEN** los botones "Atrás", "Siguiente" y "Añadir al carrito" comparten la misma altura, de al
  menos 44px

#### Scenario: Botón "Siguiente" visible solo en su propia fila

- **WHEN** el cliente está en el paso de tamaño o de toppings y "Atrás" o los botones del último paso
  están ocultos
- **THEN** "Siguiente" ocupa el ancho disponible de la fila manteniendo la nueva altura, sin verse
  comprimido ni desalineado
