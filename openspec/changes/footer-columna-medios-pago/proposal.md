# Proposal

## Why

El footer no presenta los medios de pago de Hope. Una columna dedicada permitirá reconocer Stripe, Zelle y Pago Móvil manteniendo la organización visual actual en desktop y móvil.

## What Changes

- Añadir una quinta columna titulada «Medios de pago» después de Horario, sin alterar el contenido ni el orden relativo de marca, menú, ubicación y horario.
- Incluir tres bloques «Medio de pago» con nombre y selector de imagen (`image_picker`): Stripe, Zelle y Pago Móvil, en ese orden inicial. Las imágenes se seleccionan desde el editor de Shopify, con proporciones preservadas y nombres accesibles.
- Integrar la columna con los colores, tipografía, alineación y espaciado del footer; adaptar la distribución al ancho disponible sin desbordamiento horizontal.
- Permitir seleccionar y reemplazar las imágenes y reordenar los bloques desde el editor del tema; conservar el apilado vertical en móvil. Sin imagen seleccionada, mostrar el nombre del medio.

## Capabilities

### New Capabilities

- `footer-medios-pago`: presentación accesible y responsive de los medios de pago dentro de las columnas del footer.

### Modified Capabilities

Ninguna. Las specs existentes no cubren esta presentación del footer.

## Impact

- Configuración del footer en `sections/footer-group.json` y, si se requiere, estilos acotados en `sections/footer.liquid`.
- Reutilización de bloques `group` y `text` de Horizon y nuevo bloque `hope-payment-method` con schema editable; sin nuevas dependencias ni cambios en checkout o métodos de pago de la tienda.
- Selección de los archivos existentes `stripe`, `zelle` y `pago-movil` mediante el selector de imágenes del editor. No se requieren consultas de Shopify Files ni URLs obtenidas por CLI; la configuración inicial puede dejar las imágenes sin seleccionar.
- Verificación visual en desktop, anchos intermedios y móvil, junto con Theme Check.
