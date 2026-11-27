# Proposal

## Why

En la home, "Texto con imagen" usa proporción fija (3:2) con encaje "Contener". Como la foto es más angosta que el marco, el navegador la centra y deja franjas vacías a ambos lados: la imagen no llega al margen de la página mientras el texto sí, y se ve un "padding" que el comerciante no puede controlar. La alineación horizontal actual solo mueve el marco cuando el tamaño es menor a 100 %, no la imagen dentro del marco.

## What Changes

- La "Alineación horizontal de la imagen" pasa a ubicar también la imagen contenida dentro de su marco (inicio, centro, final), no solo el marco reducido.
- Se agrega la opción "Hacia el borde exterior", que pega la imagen al borde de la página según el lado elegido en "Imagen en escritorio" (derecha → borde derecho, izquierda → borde izquierdo). En móvil, donde las columnas se apilan, esta opción se comporta como centro.
- Con encaje "Contener", el radio de las esquinas se aplica a la imagen visible y no al marco vacío, para que la imagen conserve sus esquinas redondeadas esté donde esté.
- El valor por defecto sigue siendo "Centro": las secciones guardadas se ven igual hasta que el comerciante cambie el ajuste.

Supuesto registrado: "a tope" se interpreta como pegar la imagen al borde exterior de la página (el lado donde está la imagen), alineándola con el margen de página igual que el texto del lado opuesto.

## Capabilities

### New Capabilities

_Ninguna._

### Modified Capabilities

- `texto-imagen`: el requisito "Alineación horizontal de la imagen reducida" se amplía para cubrir la imagen contenida dentro del marco y la nueva opción "Hacia el borde exterior"; se agrega el requisito de esquinas redondeadas sobre la imagen visible con "Contener".

## Impact

- `sections/text-image.liquid`: lógica Liquid de alineación, marcado del marco, CSS del `{% stylesheet %}` y esquema (`image_align` suma la opción `edge`; IDs y valores existentes se conservan).
- Sin cambios en `templates/index.json`: el comerciante elige la nueva opción desde el editor.
- Sin dependencias nuevas ni JavaScript.
