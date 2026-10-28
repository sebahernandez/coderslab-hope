# Spec Delta

## ADDED Requirements

### Requirement: Precio del tamaño visible en dólares desde la carga
En el armador v2, cada tarjeta de tamaño (Pequeño, Mediano, Grande) SHALL mostrar el precio base en
dólares de su variante sin extras desde el primer render del HTML, sin depender de que se ejecute el
JavaScript. Las tarjetas MUST NOT mostrar texto provisional en onzas ni cambiar de contenido o de tamaño
cuando el JavaScript termina de cargar.

#### Scenario: Primer render con precios
- **WHEN** el cliente abre Helado Hope o Mixo Hope y el JavaScript del armador todavía no se ejecutó
- **THEN** las tarjetas de tamaño muestran el precio base de cada tamaño en dólares (por ejemplo
  $6.00, $7.50 y $9.00 en Helado Hope) y no muestran "4 oz", "8 oz" ni "12 oz"

#### Scenario: Sin salto al cargar el JavaScript
- **WHEN** el JavaScript del armador termina de inicializarse
- **THEN** el texto y la estructura del precio de cada tarjeta de tamaño quedan iguales a los del primer
  render, sin cambio de layout visible

#### Scenario: Variante de tamaño no disponible en los datos
- **WHEN** no existe una variante sin extras para alguno de los tamaños
- **THEN** esa tarjeta muestra un texto de respaldo neutral ("—") en lugar de onzas, y las demás tarjetas
  siguen mostrando su precio
