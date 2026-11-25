# Design

## Context

- `snippets/icon.liquid` ya dibuja paths SVG (viewBox 20×20) para instagram, tiktok, facebook, whatsapp, youtube, x, threads, pinterest, spotify y otras; `blocks/_social-link.liquid` lo usa dentro de `<svg viewBox="0 0 20 20">`.
- Las secciones custom recientes (`text-image`, `video-hope-modal`, `testimonios-hope`) usan bloques locales, labels en español literal, custom properties inline por instancia y `{% stylesheet %}` estático.
- La sync GitHub → Shopify descarta en silencio schemas inválidos (`range` < 3 pasos).

## Goals / Non-Goals

**Goals:**
- Botones sociales totalmente configurables por bloque, con destino `_blank`/`_self`.
- Sin JavaScript; reutilizar los iconos existentes del tema.

**Non-Goals:**
- Feed de Instagram, contadores de seguidores o embeds.
- Leer automáticamente los enlaces sociales globales del tema.

## Decisions

1. **Bloques locales `heading`, `text`, `social_button`** en un solo archivo, como `video-hope-modal`. *Alternativa*: theme blocks → sin beneficio con ~20 ajustes por botón.

2. **Imagen en ajustes de sección, no en bloque.** Hay una sola imagen y ocupa una columna estructural fija; como bloque podría duplicarse o mezclarse con el texto. Así el comerciante solo reordena el contenido.

3. **Icono por `select` de red** que se pasa a `{% render 'icon', icon: network %}` dentro de `<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">`. Opción `none` sin icono. Nombre accesible: si el botón no tiene texto, `aria-label` con el nombre de la red (texto del option, literal).

4. **Destino como `select` (`_blank` / `_self`)**, default `_blank`. Con `_blank` se agrega `rel="noopener noreferrer"`. En el editor (`request.design_mode`) un botón sin URL se muestra atenuado para poder seleccionarlo; en la tienda no se renderiza.

5. **Agrupación de botones consecutivos**: igual que las tarjetas en `video-hope-modal`, los `social_button` consecutivos se envuelven en un único contenedor flex con `flex-wrap: wrap` y `gap` configurable en la sección.

6. **Colores**: ajustes de color sin default (vacío = esquema); el preset aplica la referencia (fondo `#fdf0f5`, título `#6b0f3a`, texto `#5a4a52`, botón contorno blanco con borde `#ead7df`, texto/icono `#6b0f3a`).

7. **Opciones de 1–2 valores como `select`** y todo `range` con ≥ 3 pasos y default alineado.

## Risks / Trade-offs

- [El snippet `icon` cambia o elimina una red] → solo se ofrecen redes verificadas en el snippet actual; `none` como salida segura.
- [URL de WhatsApp mal formada] → el `info` del ajuste sugiere el formato `https://wa.me/<número>`.
- [Schema rechazado en servidor] → validar con script y subiendo a un tema de desarrollo antes del push a `develop`.

## Migration Plan

Sección nueva. Deploy: commit + push a `develop` → verificar en `HOPE-development` → `main` solo con pedido explícito. Rollback: quitar la sección o revertir el commit.
