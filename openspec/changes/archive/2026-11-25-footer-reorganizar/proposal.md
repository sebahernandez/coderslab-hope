# Proposal

## Why

El footer actual reparte la información en cinco columnas (marca, menú, Ubicación, Horario, Medios de pago) sobre fondo rosa translúcido, con el divisor arriba de todo y las políticas alineadas a la izquierda. El nuevo diseño de referencia pide una composición más limpia de cuatro columnas sobre fondo blanco, con Ubicación y Horario juntos y las políticas repartidas a lo ancho bajo un divisor.

## What Changes

- Orden de la fila principal, de izquierda a derecha: **marca** (logo + texto) · **menú** · **Ubicación y Horario apilados en una misma columna** · **Medios de pago** (logos en fila).
- El divisor horizontal pasa de estar arriba del footer a separar la fila principal de la zona inferior de políticas.
- La zona inferior muestra las políticas (privacidad, reembolso, términos, envío, información de contacto, aviso legal) distribuidas a lo ancho en escritorio.
- Fondo blanco en todo el footer, conservando los colores de texto actuales (vino para títulos y enlaces).
- Se conservan sin cambios: enlaces del menú, textos de marca, dirección, horarios (texto actual) y los bloques de medios de pago con sus imágenes.

## Capabilities

### New Capabilities
- `footer-estructura`: orden de columnas, divisor, zona de políticas y fondo del footer.

### Modified Capabilities
- `footer-medios-pago`: la columna de medios de pago pasa a ser la cuarta de cuatro columnas (antes quinta de cinco, después de Horario); Ubicación y Horario comparten columna.

## Impact

- `sections/footer-group.json` (composición y ajustes del footer; también lo edita el editor de Shopify).
- `config/settings_data.json`: nuevo esquema de color "Footer blanco" (fondo blanco, texto vino).
- `blocks/_footer-policy-list.liquid`: distribución de políticas a lo ancho en escritorio.
- Despliegue: commit + push a `develop` (tema `HOPE-development`); a `main` solo con pedido explícito.
