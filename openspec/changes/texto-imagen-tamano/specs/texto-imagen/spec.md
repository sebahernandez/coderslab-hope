## ADDED Requirements

### Requirement: Tamaño de imagen configurable por breakpoint

La sección "Texto con imagen" SHALL ofrecer un ajuste "Tamaño de la imagen (escritorio)" y otro "Tamaño de la imagen (móvil)", expresados en porcentaje del ancho de la columna de imagen, con rango de 40 % a 100 % y valor por defecto 100 %. Reducir el tamaño SHALL achicar la imagen conservando su proporción y SHALL NOT modificar el ancho de la columna de imagen, el ancho de la columna de texto ni la separación entre ambas.

#### Scenario: Valor por defecto conserva el render actual
- **WHEN** una sección existente se carga sin haber guardado los nuevos ajustes
- **THEN** la imagen ocupa el 100 % de su columna, igual que antes del cambio

#### Scenario: Reducir el tamaño en escritorio
- **WHEN** el comerciante fija "Tamaño de la imagen (escritorio)" en 70 % en una pantalla de 750 px o más
- **THEN** el ancho de la imagen es el 70 % del ancho de su columna, su alto se reduce en la misma proporción y el texto permanece en la misma posición

#### Scenario: Reducir el tamaño en móvil
- **WHEN** el comerciante fija "Tamaño de la imagen (móvil)" en 80 % en una pantalla de 749 px o menos
- **THEN** el ancho de la imagen es el 80 % del ancho disponible y el tamaño de escritorio no se ve afectado

### Requirement: Alineación horizontal de la imagen reducida

La sección SHALL ofrecer un ajuste "Alineación horizontal de la imagen" con los valores inicio, centro y final, que ubica la imagen dentro de su columna cuando su tamaño es menor al 100 %. La alineación SHALL usar propiedades lógicas para respetar la dirección del texto (LTR/RTL). El valor por defecto SHALL ser centro.

#### Scenario: Imagen reducida centrada
- **WHEN** el tamaño es 70 % y la alineación es centro
- **THEN** la imagen queda centrada horizontalmente en su columna con espacio libre igual a ambos lados

#### Scenario: Imagen reducida al final en RTL
- **WHEN** el tamaño es 70 %, la alineación es final y el documento tiene `dir="rtl"`
- **THEN** la imagen queda pegada al borde izquierdo de su columna

### Requirement: Proporción "Según la imagen" sin recortes

Cuando la proporción del breakpoint activo es "Según la imagen", el marco de la imagen SHALL adoptar la proporción intrínseca de la imagen mostrada en ese breakpoint (imagen móvil en móvil si existe), de modo que la imagen se vea completa, sin recorte y sin franjas vacías, sea cual sea el encaje elegido. Con proporciones fijas, el comportamiento de encaje ("Cubrir" o "Contener") SHALL mantenerse como hoy.

#### Scenario: Imagen completa con "Según la imagen"
- **WHEN** la proporción de escritorio es "Según la imagen", el encaje es "Cubrir" y la imagen es de 4:3
- **THEN** el marco mide 4:3 y la imagen se muestra entera, sin recorte

#### Scenario: Imagen móvil con proporción propia
- **WHEN** la proporción móvil es "Según la imagen" y hay una imagen móvil de 4:5 distinta a la de escritorio
- **THEN** en pantallas de 749 px o menos el marco mide 4:5 y la imagen móvil se ve completa

#### Scenario: Proporción fija con encaje Cubrir
- **WHEN** la proporción es "Horizontal (5:4)" y el encaje es "Cubrir" con una imagen de otra proporción
- **THEN** la imagen llena el marco 5:4 y puede recortarse, igual que antes del cambio

### Requirement: Imagen responsive acorde al tamaño mostrado

El atributo `sizes` de la imagen SHALL reflejar el ancho efectivo mostrado (ancho de columna multiplicado por el tamaño configurado) para que el navegador no descargue una resolución mayor a la necesaria. La imagen SHALL conservar `width` y `height` intrínsecos.

#### Scenario: `sizes` con imagen reducida
- **WHEN** el ancho de columna es 55 % y el tamaño de escritorio es 60 %, con ancho de página
- **THEN** el `sizes` para escritorio corresponde a aproximadamente el 33 % del viewport (y su equivalente en px por encima de 1600 px)
