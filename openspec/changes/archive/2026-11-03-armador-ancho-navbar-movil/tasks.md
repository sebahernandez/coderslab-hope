# Tasks

## 1. Estilos

- [x] 1.1 En `sections/header.liquid`, publicar `--hope-navbar-gutter-mobile` en `:root` con un bloque `{% style %}` a partir de `glass_float_margin`, solo cuando el header de vidrio está activo y no es transparente en la plantilla actual
- [x] 1.2 En `assets/toppings-customizer.css`, usar `var(--hope-navbar-gutter-mobile, var(--page-margin, 16px))` como `padding-inline` de `.hopecfg` por debajo de 750 px, y conservar 0.75rem en 750–1023 px y 1.25rem desde 1024 px
- [x] 1.3 Confirmar que `assets/milkshake-customizer.css` y `assets/hope-customizer-v2.css` no redefinen `padding-inline` de `.hopecfg`

## 2. Verificación

- [x] 2.1 Con Playwright contra `shopify theme dev`, medir `getBoundingClientRect()` de `.header__columns` y `.hopecfg__frame` a 320, 375, 390, 414, 640 y 749 px en Helado Hope, Mixo Hope, Milkshake y Barquillo: bordes con diferencia ≤ 1 px y sin scroll horizontal
- [x] 2.2 Verificar a 750, 1023 y 1280 px que el ancho del armador no cambia respecto de `main` (superado por el grupo 3: el escritorio ahora también se alinea)
- [x] 2.3 Ejecutar Theme Check sobre los archivos modificados

## 3. Escritorio y tablet

- [x] 3.1 En `assets/toppings-customizer.css`, desde 750 px usar `var(--page-margin)` como `padding-inline` de `.hopecfg` (en lugar de 0.75rem / 1.25rem)
- [x] 3.2 Cambiar `max-width` de `.hopecfg__frame` de `80rem` a `var(--page-content-width, 80rem)`
- [x] 3.3 Con Playwright, medir navbar y tarjeta a 750, 1023, 1024, 1280, 1440, 1530, 1920 y 2560 px en los 4 armadores: bordes con diferencia ≤ 1 px y sin scroll horizontal; repetir la medición móvil de 2.1
