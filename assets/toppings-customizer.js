/**
 * toppings-customizer.js — Configurador Hope ("Crea tu Hope")
 *
 * Puerto del prototipo 2D (intercambio de imágenes Cloudinary) al tema Horizon.
 *  - 3 modos (helado/2d, yogurt/mixo, milkshake) dentro de la misma sección.
 *  - Vista previa por intercambio de imágenes pre-compuestas en Cloudinary.
 *  - Carrito real vía AJAX API (/cart/add.js) con line item properties.
 *
 * El script se carga globalmente (theme.liquid), por eso:
 *  - Es idempotente: cada root se inicializa una sola vez (data-hopecfg-init).
 *  - No hace nada si no hay [data-hopecfg] en la página.
 */

(function () {
  "use strict";

  function initConfigurator(root) {
    if (root.dataset.hopecfgInit === "true") return;
    root.dataset.hopecfgInit = "true";

    var $ = function (s) { return root.querySelector(s); };
    var $$ = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); };

    // ---- Datos de productos/variantes inyectados por Liquid ----
    var PRODUCTS = {};
    try {
      var dataEl = root.querySelector("[data-hopecfg-products]");
      if (dataEl) PRODUCTS = JSON.parse(dataEl.textContent || "{}");
    } catch (e) {
      PRODUCTS = {};
    }

    var CLOUD = root.dataset.cloudinaryAccount || "slealu5f";
    var FOLDER = root.dataset.cloudinaryFolder || "hope/catalog";

    // Modo fijo del configurador (helado/mixo/milkshake). Los tabs son opcionales.
    var MODE_MAP = { helado: "2d", mixo: "yogurt", milkshake: "milkshake" };
    var INITIAL_PREVIEW = MODE_MAP[root.dataset.modo] || "2d";
    var TABS_VISIBLE = !!root.querySelector(".hopecfg__tabs");

    // Formato de dinero del tema, para calcular base + extras en el total.
    var MONEY_FORMAT = root.dataset.moneyFormat || "${{amount}}";

    function formatMoney(cents) {
      var value = "";
      var placeholder = /\{\{\s*(\w+)\s*\}\}/;
      function fmt(number, precision, thousands, decimal) {
        precision = precision == null ? 2 : precision;
        thousands = thousands == null ? "," : thousands;
        decimal = decimal == null ? "." : decimal;
        if (isNaN(number) || number == null) return "0";
        number = (number / 100).toFixed(precision);
        var parts = number.split(".");
        var dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + thousands);
        var cents2 = parts[1] ? decimal + parts[1] : "";
        return dollars + cents2;
      }
      var match = MONEY_FORMAT.match(placeholder);
      var token = match ? match[1] : "amount";
      switch (token) {
        case "amount_no_decimals": value = fmt(cents, 0); break;
        case "amount_with_comma_separator": value = fmt(cents, 2, ".", ","); break;
        case "amount_no_decimals_with_comma_separator": value = fmt(cents, 0, "."); break;
        case "amount_with_space_separator": value = fmt(cents, 2, " ", ","); break;
        case "amount_no_decimals_with_space_separator": value = fmt(cents, 0, " ", ""); break;
        case "amount_with_apostrophe_separator": value = fmt(cents, 2, "'", "."); break;
        default: value = fmt(cents, 2);
      }
      return MONEY_FORMAT.replace(placeholder, value);
    }

    // Lee datos del botón (precio/variante del add-on) por grupo+id.
    function extraButton(group, id) {
      return $("[data-group='" + group + "'] [data-id='" + id + "']");
    }
    function extraCentsOf(group, id) {
      var b = extraButton(group, id);
      return b ? parseInt(b.dataset.precioCents || "0", 10) || 0 : 0;
    }
    function extraVariantOf(group, id) {
      var b = extraButton(group, id);
      return b ? (b.dataset.variantId || "") : "";
    }

    // ---- Estado ----
    var state = {
      product: "yogurt", // "yogurt" (helado/mixo) | "milkshake"
      preview: "2d",     // "2d" | "yogurt" | "milkshake"
      size: "small",
      toppings2d: new Set(),
      toppingsYogurt: new Set(),
      premium: null, // topping premium opcional (id o null)
      syrup: null,
      flavor: "strawberry",
    };

    // Orden de variantes por posición: small/medium/large ↔ variantes 0/1/2
    var sizeOrder = ["small", "medium", "large"];
    var flavorOrder = ["strawberry", "vanilla", "chocolate"];

    var flavorData = {
      strawberry: { label: "Fresa", asset: "hope-milkshake-strawberry-cutout-v3" },
      vanilla: { label: "Vainilla", asset: "hope-milkshake-vanilla-cutout-v1" },
      chocolate: { label: "Chocolate", asset: "hope-milkshake-chocolate-cutout-v2" },
    };

    var syrupAssetNames = {
      chocolate: "chocolate",
      berries: "red-berries",
      passion: "passion-fruit",
      "salted-caramel": "salted-caramel",
      "white-chocolate": "white-chocolate",
    };
    var toppingIds = ["strawberry", "pineapple", "banana", "mango", "peanut", "granola", "oreo", "brownie"];
    var syrupIds = Object.keys(syrupAssetNames);

    var imageCache = new Set();
    var previewRequest = 0;

    // ---- Helpers Cloudinary (idénticos al prototipo) ----
    function catalogUrl(asset, width) {
      width = width || 1000;
      var needsBackgroundRemoval =
        asset.indexOf("2d-") === 0 ||
        asset === "hope-mixo-fixed-default-v1" ||
        asset === "hope-milkshake-vanilla-cutout-v1" ||
        asset === "hope-milkshake-chocolate-cutout-v1" ||
        asset === "hope-milkshake-chocolate-cutout-v2";
      var transformation = needsBackgroundRemoval
        ? "e_background_removal/f_auto,q_auto,w_" + width
        : "f_auto,q_auto,w_" + width;
      return "https://res.cloudinary.com/" + CLOUD + "/image/upload/" + transformation + "/" + FOLDER + "/" + asset;
    }

    function activeToppings() {
      return state.preview === "yogurt" ? state.toppingsYogurt : state.toppings2d;
    }

    function get2dAsset(topping, syrupId) {
      if (typeof topping === "undefined") {
        topping = state.toppings2d.values().next().value || null;
      }
      if (typeof syrupId === "undefined") syrupId = state.syrup;
      var syrup = syrupId ? syrupAssetNames[syrupId] : null;
      if (!topping && !syrup) return "hope-vanilla-cup-cutout-v1";
      if (!topping) return "2d-base-" + syrup + "-syrup-v1";
      if (!syrup) return "2d-base-" + topping + "-v1";
      if (topping === "pineapple" && (syrup === "salted-caramel" || syrup === "white-chocolate")) {
        return "2d-" + topping + "-" + syrup + "-syrup-v2";
      }
      if (topping === "banana" && syrup === "chocolate") {
        return "2d-banana-chocolate-syrup-v2";
      }
      return "2d-" + topping + "-" + syrup + "-syrup-v1";
    }

    function preloadImage(url) {
      if (imageCache.has(url)) return Promise.resolve();
      return new Promise(function (resolve, reject) {
        var image = new Image();
        image.onload = function () { imageCache.add(url); resolve(); };
        image.onerror = reject;
        image.src = url;
      });
    }

    function setPreviewImage(asset, mode) {
      var preview = $("#product-preview");
      if (!preview) return;
      var url = catalogUrl(asset);
      var request = ++previewRequest;
      if (preview.getAttribute("src") === url) {
        preview.classList.remove("is-loading");
        return;
      }
      preview.classList.add("is-loading");
      preloadImage(url).then(function () {
        if (request !== previewRequest || state.preview !== mode) return;
        preview.src = url;
      }).catch(function () {}).then(function () {
        if (request === previewRequest) preview.classList.remove("is-loading");
      });
    }

    function preload2dCombinations() {
      var topping = state.toppings2d.values().next().value || null;
      var assets = topping
        ? [get2dAsset(topping, null)].concat(syrupIds.map(function (id) { return get2dAsset(topping, id); }))
        : ["hope-vanilla-cup-cutout-v1"].concat(toppingIds.map(function (id) { return get2dAsset(id, state.syrup); }));
      assets.forEach(function (asset) { preloadImage(catalogUrl(asset)).catch(function () {}); });
    }

    // ---- Precios desde variantes reales ----
    function currentModeKey() {
      if (state.preview === "milkshake") return "milkshake";
      if (state.preview === "yogurt") return "yogurt";
      return "helado";
    }

    function currentProductData() {
      return PRODUCTS[currentModeKey()] || null;
    }

    // Tamaño (state.size) → valor de la opción nativa "Tamaño".
    var SIZE_NAME = { small: "Pequeño", medium: "Mediano", large: "Grande" };

    // Precio mínimo (cents) de un tamaño = variante "Estándar" (para el "desde" del chip de tamaño).
    function heladoMinCents(sizeName) {
      var p = PRODUCTS.helado;
      if (!p || !p.variants) return null;
      var min = null;
      p.variants.forEach(function (v) {
        if (v.option1 === sizeName && (min === null || v.price < min)) min = v.price;
      });
      return min;
    }

    // Nivel de la opción "Extras": con o sin topping premium.
    function heladoLevel() {
      return state.premium ? "Con premium" : "Estándar";
    }

    // Variante nativa por (tamaño × nivel).
    function findHeladoVariant(sizeName, level) {
      var p = PRODUCTS.helado;
      if (!p || !p.variants) return null;
      for (var i = 0; i < p.variants.length; i++) {
        var v = p.variants[i];
        if (v.option1 === sizeName && v.option2 === level) return v;
      }
      return null;
    }

    function variantForState() {
      var p = currentProductData();
      if (!p || !p.variants || !p.variants.length) return null;
      if (state.preview === "milkshake") {
        var idx = flavorOrder.indexOf(state.flavor);
        return p.variants[idx] || p.variants[0];
      }
      if (state.preview === "yogurt") {
        return p.variants[0];
      }
      var sizeName = SIZE_NAME[state.size] || state.size;
      return findHeladoVariant(sizeName, heladoLevel());
    }

    // ¿La configuración cumple los requisitos para añadir? 2 toppings normales + 1 sirope.
    function isValidSelection() {
      if (state.preview !== "2d") return true;
      return activeToppings().size === 2 && !!state.syrup;
    }
    function missingMessage() {
      var faltan = [];
      var n = activeToppings().size;
      if (n < 2) faltan.push("elige " + (2 - n) + " topping" + (2 - n === 1 ? "" : "s"));
      if (!state.syrup) faltan.push("elige 1 sirope");
      return faltan.join(" y ");
    }

    function updatePrice() {
      var priceEl = $("#price");
      if (!priceEl) return;
      var variant = variantForState();
      priceEl.textContent = variant ? variant.price_formatted : "—";

      // "Desde" por tamaño (precio mínimo = Estándar) en los chips de tamaño.
      $$("#size-options .hopecfg__choice").forEach(function (btn) {
        var min = heladoMinCents(SIZE_NAME[btn.dataset.id]);
        var sub = btn.querySelector("[data-size-price]");
        if (sub && min != null) sub.textContent = formatMoney(min);
      });
      var mp = PRODUCTS.milkshake;
      $$(".hopecfg__milkshake-choice").forEach(function (btn) {
        var i = flavorOrder.indexOf(btn.dataset.id);
        var sub = btn.querySelector("[data-flavor-price]");
        if (sub && mp && mp.variants[i]) sub.textContent = mp.variants[i].price_formatted;
      });

      // Contador de toppings normales (x/2) y gating del botón.
      var countEl = $("[data-topping-count]");
      if (countEl && state.preview === "2d") countEl.textContent = activeToppings().size + "/2";
      var buyBtn = $("#buy");
      var hintEl = $("#buy-hint");
      if (buyBtn) {
        var valid = isValidSelection();
        buyBtn.disabled = !valid;
        buyBtn.classList.toggle("is-disabled", !valid);
        if (hintEl) hintEl.textContent = valid ? "" : "Falta: " + missingMessage();
      }
    }

    // ---- Toggles de modo/producto ----
    function setProduct(product) {
      state.product = product;
      var yogurt = product === "yogurt";
      var mixo = state.preview === "yogurt";
      $("#yogurt-options").classList.toggle("is-hidden", !yogurt);
      $("#milkshake-options").classList.toggle("is-hidden", yogurt);
      $("#size-options").classList.toggle("is-hidden", mixo);
      $("#syrup-options").classList.toggle("is-hidden", mixo);
      $("#topping-title").textContent = mixo ? "Elige tus toppings" : "2 · Elige 2 toppings";

      // Solo sobreescribimos los textos cuando hay tabs (multi-modo).
      // En modo fijo respetamos el eyebrow/título definidos en el editor de tema.
      if (TABS_VISIBLE) {
        if (state.preview === "2d") {
          setText("#eyebrow", "Helado de yogurt griego");
          setText("#page-title", "Crea tu helado Hope");
        } else if (mixo) {
          setText("#eyebrow", "Mixo · Yogurt griego en capas");
          setText("#page-title", "Crea tu yogurt");
        } else {
          setText("#eyebrow", "Yogurt griego + proteína");
          setText("#page-title", "Elige tu milkshake");
        }
      }
      render();
    }

    function setText(sel, txt) {
      var el = $(sel);
      if (el) el.textContent = txt;
    }

    function setPreview(mode) {
      var preview = $("#product-preview");
      var config = {
        "2d": { asset: "hope-vanilla-cup-cutout-v1", alt: "Helado de vainilla Hope", product: "yogurt" },
        yogurt: { asset: "hope-mixo-fixed-default-v1", alt: "Mixos de yogurt griego Hope", product: "yogurt" },
        milkshake: { asset: "hope-milkshake-strawberry-cutout-v3", alt: "Milkshakes Hope", product: "milkshake" },
      };
      var selected = config[mode];
      state.preview = mode;
      $("#preview-panel").dataset.view = mode;
      $("#config-panel").dataset.view = mode === "yogurt" ? "mixo" : mode;
      if (preview) {
        preview.src = catalogUrl(selected.asset);
        preview.alt = selected.alt;
        preview.dataset.mode = mode;
      }
      $$(".hopecfg__tab").forEach(function (btn) {
        var active = btn.dataset.preview === mode;
        btn.classList.toggle("is-active", active);
        btn.setAttribute("aria-selected", String(active));
      });
      setProduct(selected.product);
    }

    // ---- Render ----
    function render() {
      if (state.product === "yogurt") {
        if (state.preview === "2d") {
          var zoom = { small: 0.83, medium: 0.94, large: 1 };
          $("#product-preview").style.transform = "scale(" + zoom[state.size] + ")";
          setPreviewImage(get2dAsset(), "2d");
        } else {
          $("#product-preview").style.transform = "none";
        }

        var toppings = activeToppings();
        $$("#yogurt-options [data-group='size'] .hopecfg__choice").forEach(function (b) {
          b.classList.toggle("is-active", b.dataset.id === state.size);
        });
        $$("#yogurt-options [data-group='topping'] .hopecfg__choice").forEach(function (b) {
          b.classList.toggle("is-active", toppings.has(b.dataset.id));
        });
        $$("#yogurt-options [data-group='premium'] .hopecfg__choice").forEach(function (b) {
          b.classList.toggle("is-active", state.premium === b.dataset.id);
        });
        $$("#yogurt-options [data-group='syrup'] .hopecfg__choice").forEach(function (b) {
          b.classList.toggle("is-active", state.syrup === b.dataset.id);
        });

        var selected = [];
        toppings.forEach(function (id) {
          var el = $("[data-group='topping'] [data-id='" + id + "']");
          if (el) selected.push(el);
        });
        if (state.premium) {
          var pEl = $("[data-group='premium'] [data-id='" + state.premium + "']");
          if (pEl) selected.push(pEl);
        }
        if (state.preview === "2d" && state.syrup) {
          var sEl = $("[data-group='syrup'] [data-id='" + state.syrup + "']");
          if (sEl) selected.push(sEl);
        }
        $("#selected-stack-left").innerHTML = selected.map(function (b) {
          return '<span title="' + b.dataset.label + '">' + b.dataset.emoji + "</span>";
        }).join("");
        var labels = selected.map(function (b) { return b.dataset.label; });
        $("#extras-label-left").textContent = labels.length
          ? labels.length + " " + (labels.length === 1 ? "extra seleccionado" : "extras seleccionados")
          : "Sin extras";
      } else {
        var flavor = flavorData[state.flavor];
        $("#product-preview").style.transform = "none";
        if (state.preview === "milkshake") setPreviewImage(flavor.asset, "milkshake");
        $("#selected-stack-left").innerHTML = "";
        $("#extras-label-left").textContent = "Sin extras";
        $$(".hopecfg__milkshake-choice").forEach(function (b) {
          b.classList.toggle("is-active", b.dataset.id === state.flavor);
        });
      }
      updatePrice();
    }

    // ---- Eventos ----
    $$(".hopecfg__tab").forEach(function (b) {
      b.addEventListener("click", function () { setPreview(b.dataset.preview); });
    });

    $("#yogurt-options").addEventListener("click", function (e) {
      var b = e.target.closest("button[data-id]");
      if (!b) return;
      var group = b.closest("fieldset").dataset.group;
      var id = b.dataset.id;
      if (group === "size") state.size = id;
      if (group === "topping") {
        // Normales: exactamente 2 (máx 2 al seleccionar).
        var toppings = activeToppings();
        if (toppings.has(id)) {
          toppings.delete(id);
        } else {
          if (toppings.size >= 2) return; // ya hay 2, no permite un 3º
          toppings.add(id);
        }
      }
      if (group === "premium") {
        // Premium: opcional, máximo 1 (toggle único; otro premium lo reemplaza).
        state.premium = state.premium === id ? null : id;
      }
      if (group === "syrup") state.syrup = state.syrup === id ? null : id;
      render();
      if (state.preview === "2d") preload2dCombinations();
    });

    $("#milkshake-options").addEventListener("click", function (e) {
      var b = e.target.closest("button[data-id]");
      if (!b) return;
      state.flavor = b.dataset.id;
      render();
    });

    $("#reset-view").addEventListener("click", function () {
      if (state.preview === "2d") {
        state.size = "small";
        state.toppings2d.clear();
        state.premium = null;
        state.syrup = null;
      } else if (state.preview === "yogurt") {
        state.toppingsYogurt.clear();
      } else if (state.preview === "milkshake") {
        state.flavor = "strawberry";
      }
      render();
    });

    // ---- Carrito real ----
    var buyBtn = $("#buy");

    function showToast(msg, isError) {
      var toast = $("#toast");
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.toggle("is-error", !!isError);
      toast.classList.add("is-visible");
      clearTimeout(toast._t);
      toast._t = setTimeout(function () { toast.classList.remove("is-visible"); }, 2200);
    }

    // Properties informativas del line item (los toppings/sirope específicos).
    // El precio ya lo fija la variante (Tamaño × nivel de Extras); estas propiedades
    // solo muestran QUÉ toppings/sirope eligió el cliente.
    function buildProperties() {
      var props = {};
      if (state.product !== "yogurt") return props;
      var tnames = [];
      activeToppings().forEach(function (id) { tnames.push(readLabel("topping", id)); });
      if (tnames.length) props["Toppings"] = tnames.join(", ");
      if (state.premium) props["Premium"] = readLabel("premium", state.premium);
      if (state.preview === "2d" && state.syrup) props["Sirope"] = readLabel("syrup", state.syrup);
      return props;
    }

    function readSizeLabel() {
      var el = $("#size-options [data-id='" + state.size + "'] .hopecfg__choice-name");
      return el ? el.textContent.trim() : state.size;
    }
    function readLabel(group, id) {
      var el = $("[data-group='" + group + "'] [data-id='" + id + "']");
      return el ? (el.dataset.label || id) : id;
    }
    function labelsFor(set, group) {
      var out = [];
      set.forEach(function (id) { out.push(readLabel(group, id)); });
      return out.join(", ");
    }

    // Anima una miniatura del vaso configurado volando hacia el ícono del carrito
    // (réplica del <fly-to-cart> nativo de Horizon, autocontenida).
    function flyToCart() {
      var preview = $("#product-preview");
      var cartIcon = document.querySelector(".header-actions__cart-icon");
      if (!preview || !cartIcon || !buyBtn) return;

      var sourceRect = buyBtn.getBoundingClientRect();
      var destRect = cartIcon.getBoundingClientRect();
      var size = 56;

      var fly = document.createElement("div");
      fly.className = "hopecfg-fly";
      fly.style.backgroundImage = "url(" + preview.src + ")";
      fly.style.width = size + "px";
      fly.style.height = size + "px";
      document.body.appendChild(fly);

      var start = {
        x: sourceRect.left + sourceRect.width / 2 - size / 2,
        y: sourceRect.top + sourceRect.height / 2 - size / 2,
      };
      var end = {
        x: destRect.left + destRect.width / 2 - size / 2,
        y: destRect.top + destRect.height / 2 - size / 2,
      };
      var c1 = { x: start.x, y: start.y - 200 };
      var c2 = { x: end.x - 300, y: end.y - 100 };

      function bezier(t, p0, p1, p2, p3) {
        var cX = 3 * (p1.x - p0.x), bX = 3 * (p2.x - p1.x) - cX, aX = p3.x - p0.x - cX - bX;
        var cY = 3 * (p1.y - p0.y), bY = 3 * (p2.y - p1.y) - cY, aY = p3.y - p0.y - cY - bY;
        return {
          x: aX * t * t * t + bX * t * t + cX * t + p0.x,
          y: aY * t * t * t + bY * t * t + cY * t + p0.y,
        };
      }

      var startTime = null;
      var duration = 600;
      fly.style.transform = "translate(" + start.x + "px," + start.y + "px)";
      fly.style.opacity = "1";

      function step(now) {
        if (!startTime) startTime = now;
        var progress = Math.min((now - startTime) / duration, 1);
        var pos = bezier(progress, start, c1, c2, end);
        var scale = 1 - progress * 0.5;
        fly.style.transform = "translate(" + pos.x + "px," + pos.y + "px) scale(" + scale + ")";
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          fly.style.opacity = "0";
          setTimeout(function () { fly.remove(); }, 200);
        }
      }
      requestAnimationFrame(step);
    }

    function cartSectionIds() {
      var ids = [];
      document.querySelectorAll("cart-items-component[data-section-id]").forEach(function (el) {
        var id = el.dataset.sectionId;
        if (id && ids.indexOf(id) === -1) ids.push(id);
      });
      return ids;
    }

    if (buyBtn) {
      buyBtn.addEventListener("click", function () {
        if (!isValidSelection()) {
          showToast("Falta: " + missingMessage(), true);
          return;
        }
        var variant = variantForState();
        if (!variant) {
          showToast("Este producto aún no está vinculado. Configúralo en el tema.", true);
          return;
        }
        if (variant.available === false) {
          showToast("Sin stock para esta opción.", true);
          return;
        }

        var routes = (window.Theme && window.Theme.routes) || {};
        var addUrl = routes.cart_add_url || "/cart/add.js";
        var product = currentProductData();

        // Modelo nativo: UNA variante (Tamaño × nivel de Extras) con properties
        // informativas (toppings/sirope específicos). Sin _grupo, sin bundle.
        var payload = { items: [{ id: variant.id, quantity: 1, properties: buildProperties() }] };
        var sectionIds = cartSectionIds();
        if (sectionIds.length) {
          payload.sections = sectionIds.join(",");
          payload.sections_url = window.location.pathname;
        }

        buyBtn.disabled = true;
        flyToCart(); // arranca la animación en el click, como el flujo nativo

        fetch(addUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        })
          .then(function (r) {
            return r.json().then(function (json) { return { ok: r.ok, json: json }; });
          })
          .then(function (res) {
            if (!res.ok || (res.json && res.json.status)) {
              var msg = (res.json && (res.json.description || res.json.message)) || "No se pudo añadir al carrito.";
              showToast(msg, true);
              return;
            }
            // Evento nativo de Horizon: burbuja (+1, rebote) y drawer (morph por sections)
            document.dispatchEvent(new CustomEvent("cart:update", {
              bubbles: true,
              detail: {
                resource: res.json,
                sourceId: root.id || "hopecfg",
                data: {
                  source: "product-form-component",
                  productId: product ? String(product.id) : undefined,
                  itemCount: 1, // suma 1 al badge: los extras no cuentan como producto
                  sections: res.json.sections,
                },
              },
            }));
            showToast("¡Tu selección fue añadida! ✨", false);
            // Abre el drawer del tema si existe
            var drawer = document.querySelector("cart-drawer-component");
            if (drawer && typeof drawer.open === "function") drawer.open();
          })
          .catch(function () {
            showToast("No se pudo añadir al carrito. Inténtalo de nuevo.", true);
          })
          .then(function () { buyBtn.disabled = false; });
      });
    }

    // ---- Arranque ----
    setPreview(INITIAL_PREVIEW);
    var warmInitial2dAssets = function () {
      var assets = toppingIds.map(function (id) { return get2dAsset(id, null); })
        .concat(syrupIds.map(function (id) { return get2dAsset(null, id); }))
        .concat(Object.keys(flavorData).map(function (k) { return flavorData[k].asset; }));
      assets.forEach(function (asset) { preloadImage(catalogUrl(asset)).catch(function () {}); });
    };
    if ("requestIdleCallback" in window) window.requestIdleCallback(warmInitial2dAssets);
    else setTimeout(warmInitial2dAssets, 300);
  }

  function initAll() {
    Array.prototype.slice.call(document.querySelectorAll("[data-hopecfg]")).forEach(initConfigurator);
  }


  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
  document.addEventListener("shopify:section:load", initAll);
  // Modelo nativo: el carrito, la burbuja y la cantidad los maneja Horizon.
  // (Se retiran setupOrphanCleanup / setupHopeBadge / setupBundleQuantity del modelo bundle.)
})();
