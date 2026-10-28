# Tasks

## 1. Referencia visual

- [x] 1.1 Capturar el footer actual en preview local desktop y móvil para comparar contenido, orden, tipografía, colores y políticas; verificar que la referencia muestra marca, menú, ubicación y horario en ese orden.

## 2. Integrar la columna editable

- [x] 2.1 Crear `blocks/hope-payment-method.liquid` con selector de imagen y nombre configurable, tamaño contenido, proporción preservada y texto alternativo; verificar en preview el logo completo y el fallback de nombre al vaciar la imagen, y ejecutar `shopify theme check` sin nuevos errores atribuibles al bloque.
- [x] 2.2 Añadir el grupo «Medios de pago» después de `group_horario` en `sections/footer-group.json`, con encabezado coherente con Ubicación/Horario y los tres bloques con nombres Stripe, Zelle y Pago Móvil en ese orden inicial y selectores de imagen sin configurar. Verificar que los IDs, contenido, enlaces y orden de los cuatro bloques previos y las políticas se conservan; comprobar que el footer sin selección muestra los tres nombres sin placeholders y documentar la ruta Footer → Medios de pago → bloque → seleccionar imagen y guardar.
- [x] 2.3 Ajustar la distribución de la fila del footer con estilos acotados en `sections/footer.liquid` y configuración de anchos/gap cuando corresponda. Verificar fila de cinco columnas a 1440 px, apilado ordenado a 320 y 390 px, y ausencia de solapamiento o desbordamiento a 749, 750, 1024 y 1280 px; guardar capturas y medidas de ancho del footer en el cambio.

## 3. Verificación de integración

- [x] 3.1 Seleccionar las imágenes existentes `stripe`, `zelle` y `pago-movil` desde los selectores del editor, si hay una sesión disponible. Verificar carga, proporción, nombres accesibles, sustitución independiente, reordenamiento de los medios y persistencia al guardar; comprobar el fallback al vaciar una imagen y restaurar el orden inicial. Si el editor no está disponible, verificar el render con imágenes de prueba y registrar la selección final de archivos por el administrador como configuración pendiente, sin bloquear la entrega del código.
- [x] 3.2 Ejecutar `shopify theme check` sobre el tema final y revisar el footer en inicio y una página de producto en desktop y móvil; registrar resultados y errores preexistentes si existen, contrastar las capturas con la referencia inicial y confirmar que las políticas y otras imágenes del tema conservan su presentación. Comprobar la matriz de anchos también con imágenes seleccionadas o de prueba, además del estado sin imágenes.
