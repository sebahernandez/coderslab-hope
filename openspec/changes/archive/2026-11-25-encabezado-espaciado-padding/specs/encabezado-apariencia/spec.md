# Spec Delta

## ADDED Requirements

### Requirement: Separación vertical interna al encabezado

La separación superior e inferior configurada para la barra SHALL ocupar espacio dentro del propio
encabezado. SHALL formar parte de su altura medida y NO SHALL desplazar ni solaparse con elementos fuera del
encabezado, con o sin franja y con o sin glassmorphism.

#### Scenario: Separación superior sin franja

- **WHEN** la franja está desactivada y el margen superior está en 12 px
- **THEN** la cápsula queda a 12 px del borde superior del encabezado, la altura medida del encabezado
  incluye esos 12 px y ningún elemento fuera del encabezado se desplaza por esa separación

#### Scenario: Separación inferior sin franja

- **WHEN** la franja está desactivada y el margen inferior está en 20 px
- **THEN** los 20 px quedan dentro del encabezado y el contenido siguiente empieza donde termina la altura
  medida del encabezado, sin un desplazamiento adicional

#### Scenario: Aspecto con valores guardados

- **WHEN** se publica el cambio sobre una tienda con margen superior de 12 px y franja activa
- **THEN** la cápsula conserva la misma posición visual que antes del cambio y la franja sigue cubriendo
  desde el borde superior del viewport hasta el borde inferior del encabezado

#### Scenario: Separación en cero

- **WHEN** los márgenes superior e inferior están en 0
- **THEN** el encabezado se ve y mide igual que sin separación
