# Design

## Context

- El add-on (gid 15398337839356) está ACTIVE, publicado en Tienda online, tag `addon`, templateSuffix
  `addon`, sin colecciones y sin metafield `seo.hidden`. Su página ya redirige
  (`sections/addon-redirect.liquid`).
- El buscador vacío lista `settings.empty_state_collection.products | default: collections.all.products`
  (`snippets/predictive-search-empty-state.liquid`), y por eso aparece el add-on. Las sugerencias y
  `/search` vienen de la búsqueda nativa de Shopify.
- Las listas recorren `products` / `collection.products` con `limit:` en varios lugares (ver Impact de
  proposal.md).

## Goals / Non-Goals

**Goals:**
- Dos capas: dato en la tienda (búsqueda nativa y SEO) + guarda en Liquid (listas del tema).

**Non-Goals:**
- Despublicar el add-on de Tienda online: rompería `/cart/add` del armador.
- Cambiar el carrito, el cobro o la redirección de la página del add-on.

## Decisions

1. **`seo.hidden = 1` en el producto** (metafield `seo.hidden`, tipo `number_integer`). Es el mecanismo
   nativo de Shopify: saca el producto de la búsqueda de la tienda (sugerencias y `/search`) y del sitemap,
   y agrega `noindex`, sin quitarle la publicación. Alternativa descartada: filtrar solo en Liquid las
   sugerencias; la API predictiva devuelve como mucho N resultados y filtrar después deja huecos.
2. **Guarda Liquid por tag `addon`** en cada bucle de productos:
   `if product.tags contains 'addon'` → `continue`. Cubre `collections.all` y colecciones automáticas,
   que `seo.hidden` no filtra. Alternativa descartada: excluir por handle (no escala a futuros add-ons).
3. **Conteo exacto con `limit`.** Donde el bucle usa `limit:`, se recorre sin `limit` (o con un margen) y se
   lleva un contador de productos renderizados, cortando con `break` al llegar al límite, para que omitir
   un interno no reduzca la cantidad mostrada. En bucles paginados (`main-collection`, `search-results`)
   se acepta que una página muestre uno menos.
4. **Guarda también en la rama de "vistos recientemente"** de `predictive-search-products-list` (por ids):
   si el producto encontrado es interno o nulo, no se renderiza.

## Risks / Trade-offs

- [`seo.hidden` tarda en reflejarse en el índice de búsqueda] → verificar tras unos minutos; la guarda Liquid
  cubre el estado vacío del buscador de inmediato.
- [Conteos de colección (`products_count`) siguen incluyendo al add-on en `/collections/all`] → visible
  solo si la sección muestra el total; aceptado y anotado.
- [Un producto real etiquetado `addon` por error desaparecería] → convención documentada en la spec.

## Migration Plan

1. Mutación `metafieldsSet` en el producto (requiere confirmación: cambia datos live).
2. Commit + push del tema a `develop` (tema HOPE-development) y verificación; a `main` solo con
   confirmación explícita.
Rollback: borrar el metafield y revertir el commit.
