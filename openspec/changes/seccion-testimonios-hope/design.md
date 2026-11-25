# Design

## Context

Las secciones custom recientes (`box-items`, `video-hope-modal`) usan bloques locales, labels de schema en español literal, custom properties inline por instancia y un `{% stylesheet %}` estático. `carousel-testimonials.liquid` existe con estilos fijos y queda intacta. La sync GitHub → Shopify descarta en silencio schemas inválidos (p. ej. `range` < 3 pasos).

## Goals / Non-Goals

**Goals:**
- Tarjetas de testimonio configurables de forma aislada, sin JavaScript.
- Markup preparado para agregar el modo slide más adelante sin romper datos guardados.

**Non-Goals:**
- Carrusel/slide, autoplay o navegación (ver cambio `testimonios-hope-slide`).
- Testimonios dinámicos desde apps de reseñas o metaobjetos.

## Decisions

1. **Bloques locales `testimonial`** en un único archivo. Cada bloque tiene ~18 ajustes; no justifica theme blocks. *Alternativa*: theme blocks → sobrecosto sin beneficio.

2. **Estrellas en SVG inline generadas con un bucle Liquid** (`for i in (1..5)`), llenas hasta `rating`, con `aria-hidden` y un `<span class="visually-hidden">` con "{rating} de 5 estrellas" vía clave de locale (`t` con interpolación). *Alternativa*: caracteres ★ → menos control de color/tamaño.

3. **Avatar con `image_tag`** a 2× del tamaño configurado (`widths` acotados), circular, `loading: lazy`, alt configurable (vacío si decorativo).

4. **Lista semántica preparada para slide**: `<ul class="testimonios-hope__track" role="list">` con `<li class="testimonios-hope__slide">` por testimonio. Hoy el track es un grid; el futuro modo slide podrá convertir el mismo track en un contenedor con scroll-snap y añadir controles sin cambiar la estructura de bloques ni sus IDs de ajustes.

5. **Colores**: ajustes de color del bloque sin default (vacío = esquema). Los colores de la referencia (vino `#6b0f3a` en títulos/nombre, estrellas `#9c2a5f`, borde `#f3dbe5`, texto `#4a4a4a`) se fijan en el preset.

6. **Opciones de 1–2 valores como `select`** (p. ej. columnas móviles); todo `range` con ≥ 3 pasos y default alineado.

## Risks / Trade-offs

- [Tarjetas de distinta altura según el largo del texto] → grilla con `align-items: stretch` para igualar alturas por fila.
- [Schema rechazado en servidor] → validar subiendo a un tema de desarrollo antes del push a `develop`.
- [Estructura no apta para slide] → mitigado con la decisión 4; el cambio futuro reutiliza el track.

## Migration Plan

Sección nueva. Deploy: commit + push a `develop` → verificar en `HOPE-development` → `main` solo con pedido explícito. Rollback: quitar la sección o revertir el commit.
