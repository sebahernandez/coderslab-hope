# Tasks

## 1. Configuración del footer

- [x] 1.1 Hacer `git pull --rebase origin develop` y respaldar los valores actuales del footer (menú, textos, medios de pago) para comparar; verificar que el árbol de trabajo está limpio.
- [x] 1.2 Agregar el esquema "Footer blanco" en `config/settings_data.json` (copia de `scheme-2` con fondo `#ffffff`) y asignarlo a la sección `footer` en `sections/footer-group.json`; verificar que ambos JSON siguen siendo válidos.
- [x] 1.3 En `sections/footer-group.json`, mover `text_horario` dentro de `group_ubicacion`, eliminar `group_horario` vacío y dejar la fila en el orden marca · menú · Ubicación/Horario · Medios de pago; verificar con un script que los textos, el menú y los medios de pago son idénticos a los respaldados.
- [x] 1.4 Mover `divider_hFm3am` entre la fila y `footer_utilities_KRaGcH` y darle padding vertical; verificar el `block_order` resultante.

## 2. Políticas

- [x] 2.1 En `blocks/_footer-policy-list.liquid`, distribuir las políticas a lo ancho en ≥ 750 px y mantener el wrap centrado en móvil; verificar con `shopify theme check` sin ofensas nuevas.

## 3. Validación y despliegue

- [x] 3.1 Subir los archivos a un tema de desarrollo con `shopify theme push --only … --nodelete` y verificar que el servidor no reporta errores.
- [ ] 3.2 Verificar en el editor a 1440, 1024, 750 y 390 px: orden de columnas, Ubicación/Horario en una columna, divisor sobre las políticas, políticas a lo ancho, fondo blanco y sin scroll horizontal.
- [ ] 3.3 Commit + push a `develop` y confirmar que los cambios aparecen en `HOPE-development`.

## Workflow follow-up

- Antes de pasar a `main`, comparar `footer-group.json` de `main` y `develop`.
- Push a `main` (tema live) solo con pedido explícito del usuario.
- Archivar el cambio tras la verificación.
