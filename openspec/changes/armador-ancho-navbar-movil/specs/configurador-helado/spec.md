# Spec Delta

## ADDED Requirements

### Requirement: Ancho móvil del armador alineado con el navbar

En viewports móviles (menores a 750 px), la tarjeta de cada armador SHALL tener el mismo ancho que el panel del navbar, con sus bordes izquierdo y derecho alineados a los del navbar (tolerancia de 1 px), y sin provocar desplazamiento horizontal de la página. A partir de 750 px el armador SHALL conservar su ancho y márgenes anteriores al cambio.

#### Scenario: Alineación en anchos móviles habituales
- **WHEN** un visitante abre cualquier armador (Helado Hope, Mixo Hope, Milkshake o Barquillo) a 320, 375, 390, 414, 640 o 749 px de ancho
- **THEN** los bordes izquierdo y derecho de la tarjeta del armador coinciden con los del navbar con una diferencia máxima de 1 px y la página no tiene desplazamiento horizontal

#### Scenario: Margen lateral configurado en el navbar
- **WHEN** el comerciante cambia la separación del borde del navbar de vidrio en el editor del tema
- **THEN** la tarjeta del armador usa ese mismo margen lateral en móvil y ambos siguen alineados

#### Scenario: Navbar sin panel de vidrio
- **WHEN** el navbar de vidrio está desactivado o el header es transparente en esa plantilla
- **THEN** la tarjeta del armador usa el margen de página móvil del tema y la página no tiene desplazamiento horizontal

#### Scenario: Escritorio y tablet sin cambios
- **WHEN** el armador se muestra a 750 px o más
- **THEN** el ancho, márgenes y distribución de la tarjeta son los mismos que antes del cambio
