# Tasks

## 1. Datos: mapa sirope → foto

- [x] 1.1 Verificar que responden 200 (`curl -sI`) las 22 URLs de foto principal (`f_auto,q_auto,w_800`) y las 9 URLs de miniatura (`c_crop,x_212,y_0,w_600,h_600/c_scale,w_120/f_auto,q_auto`) de las tablas de `design.md`
- [x] 1.2 Revisar visualmente las 9 miniaturas recortadas y confirmar que en cada una se ve el copo con el sirope; si alguna no encuadra, ajustar `x`/`y` solo para ese item y registrarlo en `design.md`
- [x] 1.3 Mutar el metafield `custom.opciones_customizador` del Barquillo (gid 15447288709372) con `shopify store execute --allow-mutations`: agregar `imagen_barquillo` a los 13 items actuales sin tocar sus demás campos, y agregar al final los 9 items nuevos (`premium: true`, `precio_cents: 30`, `emoji`, `imagen`, `imagen_barquillo`) de `design.md`. Verificar con una lectura de la Admin API que hay 22 items, ids únicos, 4 estándar y 18 premium, y que los campos originales de los 13 no cambiaron
- [x] 1.4 Reemplazar `imagen` de los 13 siropes actuales del metafield del Barquillo por el recorte de su foto principal (mismo recorte que los nuevos). Verificar con la Admin API que los 22 items usan el recorte de `v5ovpy2d` y que no cambió ningún otro campo, y con Playwright que los 22 chips cargan su miniatura

## 2. Sección del armador de la Barquilla

- [x] 2.1 En `sections/custom-product-barquillo.liquid`, renderizar `<script type="application/json" data-barq-syrup-previews>` con `{ id: imagen_barquillo }`, construido desde `cat_sirope.items` y omitiendo los items sin el campo. Actualizar el comentario de contrato de la sección. Verificar en `shopify theme dev` que el JSON es válido y tiene 22 entradas, y que se renderizan 22 chips (los 9 nuevos con miniatura y ★)

## 3. Lógica de vista previa

- [x] 3.1 En `assets/barquillo-customizer.js`, leer el mapa una vez e implementar `setPreview(id)` (precarga con `Image()`, `previewToken` contra cargas obsoletas, vuelta a `BASE_IMAGE` sin URL o con error), llamada desde `render()`. Actualizar el comentario de cabecera. Verificar que la selección, la deselección y "Reiniciar" cambian la imagen en `theme dev`
- [x] 3.2 Verificar el respaldo con Playwright: bloquear la URL de una foto (`route.abort`) y confirmar que queda la imagen base y que el botón de compra sigue habilitado; elegir dos siropes seguidos con la red ralentizada y confirmar que queda la foto del último

## 4. Verificación integrada

- [x] 4.1 Con Playwright, en 390 px y 1280 px, recorrer los 22 siropes y capturar pantallas. Confirmar que cada foto corresponde a su sirope (en especial `crema-parchita` → `sirope-parchita`), que el cono no salta de tamaño, que las miniaturas nuevas se ven bien en el chip activo e inactivo, y que con 22 chips el panel hace scroll y el total sigue visible
- [x] 4.2 Verificar el precio: un sirope estándar (Arequipe) muestra $1.50 e "Incluido"; uno nuevo (Crema Lotus) muestra $2.50 y +$1.00. Agregar "Variegato amarena" al carrito contra hopeheladeria.com (no `theme dev`, que responde 422) y confirmar una sola línea premium con "Sirope" = "Variegato amarena ★"
- [x] 4.3 Confirmar que el armador de Helado Hope no cambia: no muestra los siropes nuevos y, al elegir un sirope, su imagen principal se comporta igual que antes
- [x] 4.4 Ejecutar `shopify theme check` sobre los archivos tocados sin hallazgos nuevos
- [x] 4.5 Actualizar la memoria del proyecto (`hope-barquillo.md`): campo `imagen_barquillo`, cuenta Cloudinary `v5ovpy2d`, los 9 siropes exclusivos de la Barquilla (su metafield ya no es copia exacta del de Helado Hope)

## Workflow follow-up

- Desplegar con commit + push a `main` previa confirmación del usuario (publica en vivo) y validar en hopeheladeria.com/products/barquillo.
- Archivar el change con `/opsx:archive`.
