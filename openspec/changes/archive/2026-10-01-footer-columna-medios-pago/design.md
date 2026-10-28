# Design

## Context

Ver `proposal.md` para la motivación. `sections/footer-group.json` contiene un grupo horizontal `group_tbFfTQ` con gap de 65 px, `vertical_on_mobile: true` y cuatro hijos: `group_4aCyy7`, `menu_AtwCFE`, `group_ubicacion` y `group_horario`. Ubicación y Horario usan grupos con textos alineados a la izquierda. Las políticas pertenecen a un bloque posterior independiente.

`sections/footer.liquid` renderiza bloques de Horizon. `snippets/layout-panel-style.liquid` configura las filas sin wrap; el tema usa 750 px para el cambio de distribución móvil. `blocks/payment-icons.liquid` depende de `shop.enabled_payment_types` y genera SVG de proveedores: no representa los tres archivos personalizados solicitados. `blocks/image.liquid` permite imágenes del editor y ratio adaptativo, pero muestra placeholders cuando falta una imagen.

## Goals / Non-Goals

**Goals:** aprovechar la composición editable de Horizon, acotar los ajustes responsive al footer y preservar la relación de aspecto de los archivos reales.

**Non-Goals:** configurar cobros, añadir enlaces a pasarelas, modificar checkout, subir nuevos archivos, alterar otras secciones o publicar el tema durante la planificación.

## Decisions

1. **Añadir al final del grupo actual.** Crear un grupo «Medios de pago» con encabezado de estilo equivalente a Ubicación/Horario y tres elementos en orden Stripe, Zelle, Pago Móvil. Se asume posición final y ese orden conforme a la petición. Conservar IDs, enlaces, contenido y orden de los bloques actuales. Las tres instancias de pago se pueden reordenar dentro del grupo desde el editor; el orden configurado determina su lectura y presentación.
2. **Selección directa en el editor.** Cada instancia de «Medio de pago» expone un setting `image_picker` y otro de texto para el nombre en su schema. El administrador selecciona los archivos existentes `stripe`, `zelle` y `pago-movil` desde la biblioteca de Shopify. El tema renderiza el objeto de imagen seleccionado con `image_url` e `image_tag`, sin URLs externas hardcodeadas ni consultas de Files por CLI. La configuración inicial contiene los tres nombres y deja las imágenes sin seleccionar; la columna funciona con nombres hasta completar esa selección.
3. **Grupo nativo con elementos de pago específicos.** Usar `group` y `text` nativos para la columna y su encabezado, y un bloque `blocks/hope-payment-method.liquid` para cada medio, con `image_picker` y nombre configurable. Renderizar la imagen seleccionada con dimensiones intrínsecas y texto alternativo; cuando esté vacía, mostrar únicamente el nombre. Esta decisión evita los placeholders de `blocks/image.liquid` y proporciona estilos acotados sin cambiar el comportamiento de imágenes de otras secciones. La alternativa de imágenes nativas y CSS para ocultar placeholders dependería de identificar los bloques anidados y no resolvería el texto alternativo configurable de forma autónoma.
4. **Distribución acotada.** Mantener la fila en desktop ancho y el apilado móvil de Horizon. Ajustar gap y anchos flexibles o permitir wrap en el contenedor de columnas solo cuando el ancho disponible lo exija. Aplicar selectores exclusivos del footer y de su fila principal, sin afectar las políticas ni otros grupos del tema. Evitar anchos mínimos que excedan 320 px y no usar CSS `order`, para conservar el orden del DOM y la lectura accesible.
5. **Tamaño basado en las imágenes reales.** Logos completos, sin alturas/ancho forzados que distorsionen la proporción; limitar ancho y alto visual, con `contain` si se utiliza una caja uniforme. Confirmar legibilidad y espacio después de conocer las dimensiones de los archivos. No se necesita JavaScript.

## Risks / Trade-offs

- [Imágenes inicialmente sin seleccionar] → Mostrar los nombres desde el primer render y documentar la selección de imágenes en el editor; esta configuración no bloquea la implementación.
- [Cinco columnas con gap de 65 px pueden desbordar] → Ajustar únicamente la fila del footer y revisar 749/750 px, 1024, 1280 y 1440 px.
- [El editor puede regenerar `footer-group.json`] → Usar bloques compatibles con el editor y conservar la configuración de los bloques existentes.
- [Archivos con márgenes internos o tamaños distintos] → Revisar dimensiones y presentación real; preservar los logos completos y ajustar sus tamaños individuales cuando sea necesario.
- [Imagen vacía produce placeholder nativo] → Mantener el nombre visible y omitir el placeholder solo para los medios de pago.

## Migration Plan

Capturar el footer previo. Integrar la columna en el tema local con los tres nombres y selectores vacíos, ejecutar Theme Check y verificar el preview en los anchos definidos. Desde el editor, seleccionar las imágenes existentes y verificar el render configurado; usar imágenes de prueba si la sesión del editor no está disponible y registrar como pendiente la selección final de los archivos por el administrador. La publicación se realiza en una fase posterior cuando sea solicitada. Para revertir, retirar el grupo añadido y sus estilos/bloques específicos, conservando los cuatro bloques originales y las políticas.

## Configuration

En el editor del tema: Footer → Medios de pago → cada bloque «Medio de pago» → seleccionar su imagen y guardar. Asignar `stripe` a Stripe, `zelle` a Zelle y `pago-movil` a Pago Móvil. Los bloques permiten sustituir las imágenes y cambiar su orden. La selección final es configuración del tema; no requiere obtener URLs mediante CLI.
