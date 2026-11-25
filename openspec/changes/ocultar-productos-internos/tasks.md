# Tasks

## 1. Datos de la tienda

- [ ] 1.1 Con confirmación del usuario, aplicar `metafieldsSet` (`seo.hidden` = `1`, `number_integer`) al producto 15398337839356 y verificar con una query que el metafield quedó guardado y el producto sigue publicado en Tienda online

## 2. Buscador

- [x] 2.1 Añadir la guarda por tag `addon` con contador exacto en ambas ramas de `snippets/predictive-search-products-list.liquid`; verificar con Playwright en `shopify theme dev` que al abrir el buscador no aparece "Extras personalizados" y se muestran los demás productos
- [x] 2.2 Añadir la guarda en `sections/search-results.liquid`; verificar que `/search?q=extras` no lista el add-on (y que las sugerencias predictivas tampoco, tras el metafield)

## 3. Listas de productos

- [x] 3.1 Añadir la guarda en `sections/main-collection.liquid` (ambos bucles); verificar que `/collections/all` no muestra el add-on y sí el resto del catálogo
- [x] 3.2 Añadir la guarda en `sections/collection-showcase.liquid`, `snippets/carousel-slider.liquid` y `sections/product-list.liquid`, con contador donde haya `limit`; verificar en la home y una colección que las listas no muestran el add-on
- [x] 3.3 Añadir la guarda en `sections/product-recommendations.liquid` y `blocks/product-recommendations.liquid`; verificar en la ficha de Helado Hope que ninguna recomendación es el add-on

## 4. Verificación integral

- [ ] 4.1 Armar un Helado Hope con un topping premium y agregarlo al carrito; verificar que aparecen las dos líneas (helado + "Extras personalizados" $1.50) como antes
- [x] 4.2 Ejecutar `shopify theme check` sobre los archivos tocados y resolver hallazgos válidos
- [ ] 4.3 Commit + push a `develop` y verificar en HOPE-development el buscador y `/collections/all`

## Workflow follow-up

- Publicar a `main` solo con confirmación explícita del usuario.
- Comprobar `/sitemap_products_1.xml` en el live tras publicar.
- Archivar el change.
