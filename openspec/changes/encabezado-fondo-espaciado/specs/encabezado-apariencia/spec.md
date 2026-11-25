# Spec Delta

## Purpose

Permite al comerciante controlar desde el editor de temas la apariencia del encabezado de Hope: una franja
de color de fondo a ancho completo, la altura mínima de la barra y su espaciado interior y exterior.

## ADDED Requirements

### Requirement: Franja de fondo a ancho completo

La sección del encabezado SHALL ofrecer un ajuste para activar una franja de fondo y un selector de color
que admita transparencia. Con la franja activa, el color SHALL cubrir todo el ancho del viewport detrás de
la barra o cápsula, incluido el espacio del margen superior, en escritorio y en móvil.

#### Scenario: Activar la franja con un color sólido

- **WHEN** el comerciante activa la franja y elige un color opaco
- **THEN** el encabezado muestra ese color de borde a borde de la pantalla, desde el borde superior del
  viewport hasta el borde inferior del encabezado, con la cápsula encima

#### Scenario: Color con transparencia

- **WHEN** el comerciante elige un color con opacidad parcial
- **THEN** la franja se muestra con esa opacidad y el contenido detrás se ve a través de ella

#### Scenario: Franja desactivada

- **WHEN** la franja está desactivada (valor por defecto)
- **THEN** el encabezado se ve igual que antes del cambio: sin fondo a ancho completo y con la cápsula
  flotando sobre el contenido

### Requirement: Reserva de espacio con franja activa

Con la franja activa, el encabezado SHALL reservar su altura en el flujo de la página, de modo que el
inicio de la primera sección quede visible debajo de él y no oculto tras la franja. Con la franja inactiva
SHALL conservarse el comportamiento actual.

#### Scenario: Primera sección visible bajo la franja

- **WHEN** la franja está activa con un color opaco y se carga la página de inicio
- **THEN** el borde superior de la primera sección queda justo debajo del encabezado, sin quedar tapado

#### Scenario: Encabezado transparente por plantilla

- **WHEN** una plantilla usa el encabezado transparente (inicio, producto o colección)
- **THEN** la franja no se aplica en esa plantilla y el comportamiento transparente se mantiene

### Requirement: Altura mínima configurable

La sección SHALL ofrecer un control de altura mínima de la barra en píxeles. El valor `0` SHALL significar
altura automática, respetando el selector existente de altura compacta/estándar; un valor mayor SHALL
fijar la altura mínima con el contenido centrado verticalmente.

#### Scenario: Altura automática

- **WHEN** la altura mínima está en 0
- **THEN** la altura de la barra la determinan el contenido y el selector compacta/estándar, como antes

#### Scenario: Altura mínima mayor que el contenido

- **WHEN** el comerciante fija una altura mínima de 96 px
- **THEN** la barra mide al menos 96 px y logo, menú y accesos quedan centrados verticalmente

### Requirement: Espaciado personalizado opcional

La sección SHALL ofrecer una casilla de espaciado personalizado, desactivada por defecto. Desactivada, el
padding y los márgenes SHALL ser los actuales. Activada, SHALL mostrar controles de padding superior,
inferior y lateral de la barra y de margen lateral, aplicados a escritorio.

#### Scenario: Espaciado por defecto intacto

- **WHEN** el comerciante no activa el espaciado personalizado
- **THEN** el padding y los márgenes del encabezado son idénticos a los previos al cambio

#### Scenario: Ajustar padding interior

- **WHEN** el comerciante activa el espaciado personalizado y cambia el padding lateral a 40 px
- **THEN** el logo y los accesos quedan a 40 px del borde interior de la cápsula en escritorio

#### Scenario: Ajustar margen lateral

- **WHEN** el comerciante fija un margen lateral de 48 px en escritorio
- **THEN** la cápsula queda separada 48 px de cada borde del área del encabezado y la franja, si está
  activa, sigue cubriendo todo el ancho

### Requirement: Margen superior disponible sin glassmorphism

El margen superior existente del encabezado SHALL seguir guardado con su identificador y valor actuales y
SHALL estar visible y aplicarse tanto con glassmorphism activo como inactivo.

#### Scenario: Valor guardado conservado

- **WHEN** se publica el cambio sobre una tienda con margen superior guardado en 12 px
- **THEN** el encabezado mantiene 12 px de separación superior sin intervención del comerciante

#### Scenario: Glassmorphism desactivado

- **WHEN** el comerciante desactiva el glassmorphism
- **THEN** el control de margen superior sigue visible en el editor y su valor se aplica a la barra

### Requirement: Margen inferior configurable

La sección SHALL ofrecer un control de margen inferior, siempre visible junto al margen superior, que
separe la barra del borde inferior del encabezado en todas las resoluciones. El valor por defecto `0`
SHALL conservar el aspecto actual.

#### Scenario: Margen inferior con franja activa

- **WHEN** la franja está activa y el comerciante fija un margen inferior de 20 px
- **THEN** la franja muestra 20 px bajo la cápsula y la primera sección empieza debajo de ese margen

### Requirement: Borde del glassmorphism configurable

Con glassmorphism activo, la sección SHALL ofrecer controles de grosor (0–6 px), color y opacidad del
borde de la cápsula. Los valores por defecto SHALL reproducir el borde actual: 2 px blanco al 90 %.

#### Scenario: Borde por defecto intacto

- **WHEN** el comerciante no toca los controles del borde
- **THEN** la cápsula conserva su borde blanco de 2 px al 90 % de opacidad

#### Scenario: Borde personalizado

- **WHEN** el comerciante fija 4 px, color #630022 y opacidad 50 %
- **THEN** la cápsula muestra un borde de 4 px en rgba(99, 0, 34, 0.5)

#### Scenario: Sin borde

- **WHEN** el grosor del borde es 0
- **THEN** la cápsula no muestra borde y los controles de color y opacidad se ocultan

### Requirement: Compatibilidad con ajustes existentes

El cambio SHALL conservar los identificadores, tipos y opciones de todos los ajustes existentes del
encabezado, y el editor de temas SHALL aceptar el schema resultante sin descartarlo.

#### Scenario: Schema aceptado por la sincronización

- **WHEN** el cambio se sincroniza desde GitHub al tema de Shopify
- **THEN** el editor muestra los nuevos controles del encabezado y los valores guardados previos siguen
  aplicados

#### Scenario: Alineación móvil conservada

- **WHEN** se visualiza la tienda en un ancho de 375 px con la franja activa
- **THEN** los controles del navbar móvil siguen visibles y alineados, y los componentes que usan el
  margen lateral móvil del navbar siguen alineados con él
