# Spec Delta

## ADDED Requirements

### Requirement: Ancho del armador alineado con el navbar

La tarjeta de cada armador SHALL tener el mismo ancho que el panel del navbar en todos los anchos de viewport, con sus bordes izquierdo y derecho alineados a los del navbar (tolerancia de 1 px), y sin provocar desplazamiento horizontal de la página.

#### Scenario: Alineación en anchos móviles
- **WHEN** un visitante abre cualquier armador (Helado Hope, Mixo Hope, Milkshake o Barquillo) a 320, 375, 390, 414, 640 o 749 px de ancho
- **THEN** los bordes izquierdo y derecho de la tarjeta del armador coinciden con los del navbar con una diferencia máxima de 1 px y la página no tiene desplazamiento horizontal

#### Scenario: Alineación en tablet y escritorio
- **WHEN** un visitante abre cualquier armador a 750, 1023, 1024, 1280, 1440, 1530, 1920 o 2560 px de ancho
- **THEN** los bordes izquierdo y derecho de la tarjeta coinciden con los del navbar con una diferencia máxima de 1 px, incluso cuando el navbar alcanza su ancho máximo y queda centrado

#### Scenario: Margen lateral configurado en el navbar
- **WHEN** el comerciante cambia la separación del borde del navbar de vidrio en el editor del tema
- **THEN** la tarjeta del armador usa ese mismo margen lateral en móvil y ambos siguen alineados

#### Scenario: Ancho de página del tema
- **WHEN** el comerciante cambia el ancho de página del tema
- **THEN** la tarjeta del armador adopta el mismo ancho máximo que el navbar en escritorio

#### Scenario: Navbar sin panel de vidrio
- **WHEN** el navbar de vidrio está desactivado o el header es transparente en esa plantilla
- **THEN** la tarjeta del armador usa el margen de página móvil del tema y la página no tiene desplazamiento horizontal
