# Design

## Context

En `sections/header.liquid` ("Apariencia configurable"):

- `.header:not([transparent]) .header__row--top` recibe `margin-block-start: var(--glass-float-margin)`.
- La última fila recibe `margin-block-end: var(--header-margin-block-end)`.
- Solo `.header--band` declara `display: flow-root`, que contiene esos márgenes. Sin franja, los márgenes
  colapsan a través de `.header` hacia afuera.
- `--header-height` se mide con `getBoundingClientRect()` (`assets/header.js`) y `offsetHeight`
  (`assets/critical.js`) sobre el header. Ninguno incluye márgenes colapsados hacia afuera.
- Con glassmorphism, la cápsula visual es `.header__columns`; `.header__row` tiene fondo transparente. Sin
  glassmorphism, `.header__row` pinta el color del esquema.

## Goals / Non-Goals

**Goals:**
- Que la separación vertical sea padding y entre en la altura medida en todos los casos.
- Mantener la posición visual de la cápsula con los valores guardados.

**Non-Goals:**
- Cambiar el margen lateral (móvil o escritorio) ni el schema.
- Renombrar las etiquetas "Margen superior/inferior" del editor (se conservan para no confundir al
  comerciante; el ID tampoco cambia).

## Decisions

1. **Padding en `.header` (contenedor), no en `.header__row`.** Se aplica
   `padding-block-start: var(--glass-float-margin, 0px)` y
   `padding-block-end: var(--header-margin-block-end, 0px)` sobre `.header:not([transparent])`.
   - Por qué: el padding del contenedor nunca colapsa y entra en `offsetHeight`/`getBoundingClientRect`.
     La franja (pintada en `.header`) cubre el padding igual que cubría el margen contenido.
   - Alternativa descartada: padding en `.header__row--top`. Sin glassmorphism la fila pinta el color del
     esquema, así que el espacio quedaría coloreado y alteraría el aspecto actual; además mezcla el
     espaciado de la fila con `--padding-block-*` de `.header__columns`.
   - Alternativa descartada: `display: flow-root` en `.header` siempre. Contiene el margen, pero mantiene
     el concepto equivocado y depende de un efecto colateral del BFC.
2. **Quitar las reglas de margen** de la fila superior/última fila para no duplicar la separación.
3. **`display: flow-root` de `.header--band`** deja de ser necesario para contener márgenes; se puede
   conservar (inocuo) o quitar. Se conserva para minimizar el diff, actualizando su comentario.
4. Verificar que `.header` no tenga un fondo propio fuera de la franja que haga visible el padding sin
   glassmorphism; si lo tiene, el padding debe quedar transparente o se reevalúa.

## Risks / Trade-offs

- [`--header-height` crece en el caso sin franja (ahora incluye la separación)] → Es el comportamiento
  correcto; revisar visualmente que el offset de la primera sección y `.hopecfg` sigan alineados.
- [Encabezado sticky con `scroll-up`: la animación de ocultar usa la altura] → La altura ya incluirá la
  separación, por lo que la barra se oculta completa; verificar en preview.
- [Encabezado transparente por plantilla] → Las reglas siguen limitadas a `:not([transparent])`; sin cambio.

## Migration Plan

Cambio solo de CSS, sin datos. Deploy normal vía `develop`. Rollback: revertir el commit.
