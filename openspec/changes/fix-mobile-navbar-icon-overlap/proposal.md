# Proposal

## Why

El usuario reporta que los iconos de búsqueda y cuenta se solapan en el navbar móvil. El layout reserva 44 px para un grupo que puede contener cuenta y carrito, dificultando ver y activar los controles por separado.

## What Changes

- Ajustar la distribución móvil para reservar espacio según los controles visibles y evitar solapamientos entre búsqueda, cuenta, carrito, menú y logo.
- Mantener áreas táctiles de al menos 44 × 44 px y separación consistente con los tokens del tema.
- Conservar el logo centrado y verificar el ajuste con y sin sesión, con cuentas desactivadas y en el editor.
- Mantener las funciones de los controles y la distribución de escritorio.

## Capabilities

### New Capabilities

- `navbar-movil`: distribución adaptable y accesibilidad de los controles del header móvil.

### Modified Capabilities

Ninguna. `acceso-cuenta` define los destinos y acciones de cuenta; `menu-movil` define el contenido del drawer. Sus requisitos se conservan.

## Impact

Principalmente CSS móvil de `sections/header.liquid` y, si resulta necesario, `snippets/header-actions.liquid`. La composición de `snippets/header-row.liquid`, búsqueda y variantes de cuenta se conserva. Verificación visual y funcional contra el tema local; sin nuevas dependencias, cambios de datos ni despliegue como parte de esta propuesta.
