# Design

## Context

Estado observado en `sections/footer-group.json` (rama `develop`):

- Sección `footer` con `color_scheme: scheme-2` (fondo `#ffb9d138`, rosa translúcido; texto `#630022`).
- `block_order`: `divider_hFm3am` (arriba) → `group_tbFfTQ` (fila) → `footer_utilities_KRaGcH` (políticas).
- Fila `group_tbFfTQ`: `group_4aCyy7` (logo + texto) · `menu_AtwCFE` (`main-menu`) · `group_ubicacion` (`text_ubicacion`) · `group_horario` (`text_horario`) · `group_medios_pago` (título + 3 `hope-payment-method`).
- `footer-utilities`: `_footer-policy-list` visible; copyright y redes deshabilitados. `_footer-policy-list` alinea a la izquierda en escritorio (`justify-content: flex-start`).
- Esquemas: `scheme-1` es blanco con texto casi negro (`#000000cf`); ningún esquema combina fondo blanco con texto vino.
- El editor de Shopify commitea este JSON ("Update from Shopify"); hay que partir del último estado remoto.

## Goals / Non-Goals

**Goals:**
- Reordenar con los bloques existentes, sin reescribir `footer.liquid`.
- Conservar IDs de bloques y su contenido para no perder configuración.

**Non-Goals:**
- Cambiar textos (los horarios conservan el texto actual aunque la imagen de referencia muestre otro formato).
- Rediseñar los logos de pago o el menú.

## Decisions

1. **Fusionar Ubicación y Horario moviendo bloques, no reescribiendo textos.** Se mueve `text_horario` dentro de `group_ubicacion` (después de `text_ubicacion`) y se elimina el grupo vacío `group_horario`. Los IDs de texto se conservan. *Alternativa*: un solo bloque de texto con ambos → perdería la edición independiente.

2. **Mover el divisor** en `block_order` de la sección: `group_tbFfTQ` → `divider_hFm3am` → `footer_utilities_KRaGcH`, y dar al divisor padding vertical para separar las zonas.

3. **Nuevo esquema de color "Footer blanco"** en `config/settings_data.json` (copia de `scheme-2` con `background: #ffffff` y el resto de tokens iguales), asignado a la sección `footer`. *Alternativa*: usar `scheme-1` → el texto pasaría a gris oscuro y se perdería el vino de la referencia. *Alternativa*: override CSS → saltea el sistema de esquemas y no es editable.

4. **Políticas a lo ancho**: en `blocks/_footer-policy-list.liquid`, en escritorio (≥ 750 px) cambiar a `justify-content: space-between` y que la lista ocupe todo el ancho disponible. Es un bloque usado solo por el footer.

5. **Grid de columnas en `sections/footer.liquid`**: durante la implementación se encontró que la fila no la controla el ajuste `space-between` del grupo sino un grid propio en el `{% stylesheet %}` de `footer.liquid` (agregado por el cambio de medios de pago) con 5 columnas en ≥ 1200 px y 3 en tablet. Se ajusta a 4 columnas `1.3fr 1fr 1.3fr 0.9fr` en ≥ 1200 px y 2 columnas en 750–1199 px. Los grupos conservan su ancho `custom`.

## Risks / Trade-offs

- [Cambios simultáneos desde el editor de Shopify sobre `footer-group.json`] → `git pull --rebase` inmediatamente antes de editar y de pushear; editar con un script que preserve el resto del JSON.
- [`footer-group.json` es configuración del comerciante] → solo se tocan orden, el esquema y padding del divisor; contenido intacto.
- [Esquema nuevo en `settings_data.json`, también editable desde el admin] → se agrega al final sin modificar los existentes.
- [El live (`main`) puede tener un footer distinto al de `develop`] → este cambio solo va a `develop`; antes de pasar a `main` revisar diferencias.

## Migration Plan

Commit + push a `develop` → verificar en `HOPE-development` → `main` solo con pedido explícito. Rollback: revertir el commit (restaura orden, esquema y CSS).
