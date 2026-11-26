## ADDED Requirements

### Requirement: Zoom suave de imagen en hover

Con el ajuste "Zoom de imagen en hover" activado, al pasar el cursor sobre una tarjeta su imagen (o placeholder) SHALL ampliarse con una transición suave y SHALL volver suavemente a su tamaño original al retirar el cursor. La ampliación MUST quedar recortada dentro del contenedor de la imagen, respetando su radio y proporción, y MUST NOT desplazar ni redimensionar el resto de la tarjeta ni de la grilla.

#### Scenario: Cursor entra y sale de la tarjeta
- **WHEN** el visitante, con mouse, pasa el cursor sobre la tarjeta "Helado Hope" y luego lo retira
- **THEN** la imagen se amplía de forma gradual mientras el cursor está encima y regresa de forma gradual a su tamaño original al salir

#### Scenario: Zoom recortado por el contenedor
- **WHEN** la tarjeta tiene radio de imagen 12 px y el cursor está sobre ella
- **THEN** la imagen ampliada no sobresale del contenedor, mantiene las esquinas redondeadas y el título, texto y botón no cambian de posición

#### Scenario: Placeholder sin imagen
- **WHEN** la tarjeta no tiene imagen ni producto y el cursor está sobre ella
- **THEN** el placeholder aplica el mismo zoom suave

### Requirement: Zoom con foco de teclado

Con el ajuste de zoom activado, la imagen de una tarjeta SHALL aplicar el mismo zoom cuando un elemento enfocable dentro de la tarjeta recibe foco de teclado, y SHALL volver a su tamaño al perder el foco.

#### Scenario: Tab hasta el botón
- **WHEN** el visitante, con teclado, enfoca el botón "Arma tu mixo" de una tarjeta
- **THEN** la imagen de esa tarjeta se amplía y vuelve a su tamaño al mover el foco a otra tarjeta

### Requirement: Zoom desactivable por tarjeta

Cada tarjeta SHALL tener un ajuste "Zoom de imagen en hover", activado por defecto. Desactivado, la imagen de esa tarjeta MUST NOT ampliarse en hover ni en foco, y el resto de tarjetas MUST conservar su propio ajuste. Las tarjetas guardadas antes de este cambio SHALL comportarse como activadas.

#### Scenario: Una tarjeta sin zoom
- **WHEN** el comerciante desactiva el zoom solo en la tarjeta "Barquilla" y el visitante pasa el cursor por todas las tarjetas
- **THEN** "Barquilla" mantiene su imagen fija y las demás tarjetas sí aplican el zoom

#### Scenario: Tarjeta existente tras el despliegue
- **WHEN** una tarjeta configurada antes del cambio se muestra sin que el comerciante la edite
- **THEN** su imagen aplica el zoom en hover

### Requirement: Zoom omitido con movimiento reducido o puntero táctil

La imagen MUST NOT animarse cuando el visitante tiene activada la preferencia de movimiento reducido ni en dispositivos cuyo único puntero no es fino (pantallas táctiles), para evitar movimiento no deseado o un zoom que quede fijo tras un toque.

#### Scenario: Movimiento reducido
- **WHEN** el sistema del visitante tiene activado "reducir movimiento" y pasa el cursor sobre una tarjeta
- **THEN** la imagen no cambia de tamaño

#### Scenario: Toque en móvil
- **WHEN** el visitante toca una tarjeta en un teléfono a 390 px
- **THEN** la imagen no queda ampliada
