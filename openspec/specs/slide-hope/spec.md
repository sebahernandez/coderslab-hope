# Slide Hope

## Purpose

Define cómo la sección Slide Hope muestra banners de imagen, fijos o en carrusel, con imágenes independientes para móvil y escritorio, ancho, altura y encaje configurables por imagen y bordes siempre redondeados.

## Requirements

### Requirement: Modo fijo o carrusel

La sección SHALL ofrecer un ajuste de modo con dos valores: "Slide" y "Fija". En modo "Fija" SHALL renderizarse solo el primer bloque de imagen, sin flechas, paginación ni autoplay. En modo "Slide" SHALL renderizarse todos los bloques como un carrusel navegable.

#### Scenario: Modo fija con varios bloques
- **WHEN** el comerciante elige "Fija" y la sección tiene 3 bloques de imagen
- **THEN** solo se muestra la imagen del primer bloque y no aparecen flechas ni puntos de paginación

#### Scenario: Modo slide con varios bloques
- **WHEN** el comerciante elige "Slide" y la sección tiene 3 bloques
- **THEN** se muestra un carrusel con 3 diapositivas navegables con flechas, paginación y deslizamiento táctil

#### Scenario: Modo slide con un solo bloque
- **WHEN** el modo es "Slide" y hay un único bloque
- **THEN** la imagen se muestra sin flechas ni paginación

### Requirement: Autoplay opcional del carrusel

En modo "Slide", la sección SHALL permitir activar el avance automático con una velocidad configurable en segundos. El avance automático SHALL estar desactivado por defecto.

#### Scenario: Autoplay activo
- **WHEN** el autoplay está activado a 5 s y hay más de un bloque
- **THEN** el carrusel avanza a la siguiente diapositiva cada 5 s

### Requirement: Imágenes independientes por breakpoint

Cada bloque SHALL tener una imagen de escritorio y una imagen de móvil opcional. En anchos de 749 px o menos SHALL mostrarse la imagen móvil cuando está configurada; si no, la de escritorio. En anchos mayores SHALL mostrarse la de escritorio. Esto SHALL aplicar igual en modo "Fija" y "Slide".

#### Scenario: Imagen móvil configurada
- **WHEN** un bloque tiene imagen de escritorio y móvil y el visitante ve la página a 390 px
- **THEN** se muestra la imagen móvil y no la de escritorio

#### Scenario: Sin imagen móvil
- **WHEN** un bloque solo tiene imagen de escritorio y el visitante ve la página a 390 px
- **THEN** se muestra la imagen de escritorio

#### Scenario: Bloque sin imágenes
- **WHEN** un bloque no tiene imagen de escritorio ni móvil
- **THEN** en el editor se muestra un marcador de posición y en la tienda el bloque no ocupa espacio

### Requirement: Ancho centrado o fullscreen por imagen

Cada bloque SHALL ofrecer un ajuste de ancho: "Centrado" limita la imagen al ancho máximo de página del tema con su margen lateral; "Fullscreen" extiende la imagen al ancho completo del viewport. El contenido SHALL NOT provocar desplazamiento horizontal.

#### Scenario: Ancho centrado en escritorio
- **WHEN** un bloque está en "Centrado" y el viewport mide 1600 px
- **THEN** la imagen no supera el ancho máximo de página y queda centrada horizontalmente

#### Scenario: Ancho fullscreen
- **WHEN** un bloque está en "Fullscreen"
- **THEN** la imagen ocupa el ancho completo del viewport sin barra de desplazamiento horizontal

### Requirement: Altura configurable por imagen

Cada bloque SHALL ofrecer una unidad de altura ("Según la imagen", "px", "vh", "vw") y un valor independiente para escritorio y para móvil. Con "Según la imagen" la altura SHALL seguir la relación de aspecto de la imagen activa en ese breakpoint; con otra unidad, la imagen SHALL medir exactamente el valor elegido en esa unidad.

#### Scenario: Altura en px
- **WHEN** la unidad es "px", el valor de escritorio es 450 y el de móvil 300
- **THEN** la imagen mide 450 px de alto en escritorio y 300 px en 749 px o menos

#### Scenario: Altura en vh
- **WHEN** la unidad es "vh" y el valor de escritorio es 60
- **THEN** la imagen mide el 60 % del alto del viewport en escritorio

#### Scenario: Altura según la imagen
- **WHEN** la unidad es "Según la imagen"
- **THEN** la imagen se muestra con su relación de aspecto original, sin recorte

### Requirement: Encaje de la imagen

Cada bloque SHALL ofrecer un encaje "Cubrir" (cover) o "Contener" (contain) y una posición de encuadre. Con "Cubrir" la imagen SHALL llenar todo su contenedor recortando lo sobrante según la posición; con "Contener" SHALL verse completa dentro del contenedor.

#### Scenario: Cubrir con altura fija
- **WHEN** el encaje es "Cubrir", la altura es 300 px y la imagen es más alta que ancha
- **THEN** la imagen llena el contenedor y se recorta respetando la posición elegida

#### Scenario: Contener con altura fija
- **WHEN** el encaje es "Contener" y la altura es 300 px
- **THEN** la imagen se ve completa dentro del contenedor, sin recorte

### Requirement: Bordes siempre redondeados

La imagen de cada bloque SHALL mostrarse siempre con las esquinas redondeadas, en ambos modos, ambos anchos y ambos breakpoints. El radio SHALL ser configurable en la sección con un mínimo mayor que 0.

#### Scenario: Radio aplicado en fullscreen
- **WHEN** un bloque está en "Fullscreen" con encaje "Cubrir"
- **THEN** las cuatro esquinas visibles de la imagen están redondeadas con el radio configurado

#### Scenario: Radio mínimo
- **WHEN** el comerciante mueve el radio al mínimo permitido
- **THEN** las esquinas siguen siendo redondeadas (radio mayor que 0)

### Requirement: Enlace y accesibilidad de la imagen

Cada bloque SHALL permitir un enlace opcional; si existe, toda la imagen SHALL ser un enlace navegable por teclado. Cada imagen SHALL tener texto alternativo: el configurado en el bloque o, si está vacío, el alt de la imagen en Shopify.

#### Scenario: Imagen con enlace
- **WHEN** un bloque tiene un enlace a la colección de promos
- **THEN** al hacer clic o pulsar Enter sobre la imagen enfocada se navega a esa colección

#### Scenario: Imagen sin enlace
- **WHEN** un bloque no tiene enlace
- **THEN** la imagen no es enfocable ni clicable
