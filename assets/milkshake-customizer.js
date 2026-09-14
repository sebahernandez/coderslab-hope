/**
 * milkshake-customizer.js — Armador Milkshake ("Crea tu Milkshake")
 *
 * Producto de combos pre-armados (opción única "Combo"). El cliente elige 1 combo,
 * que se resuelve a una variante nativa del producto y se añade al carrito. NO hay
 * tamaño, toppings ni siropes. La presentación de cada combo (emoji, ingredientes,
 * imagen Cloudinary) la aporta el metafield custom.milkshake_combos, renderizado por
 * la sección; este JS solo lee los data-attributes de cada card.
 *
 * Reutiliza la línea gráfica global (.hopecfg / hopecfg__*) y el mismo pipeline de
 * carrito nativo Horizon que hope-customizer-v2.js. Es idempotente y solo actúa sobre
 * raíces [data-hopecfg-ms].
 */

(function () {
  "use strict";

  function initConfigurator(root) {
    if (root.dataset.hopecfgMsInit === "true") return;
    root.dataset.hopecfgMsInit = "true";

    var $ = function (s) { return root.querySelector(s); };
    var $$ = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); };

    // ---- Datos de producto/variantes inyectados por Liquid ----
    var PRODUCTS = {};
    try {
      var dataEl = root.querySelector("[data-hopecfg-products]");
      if (dataEl) PRODUCTS = JSON.parse(dataEl.textContent || "{}");
    } catch (e) {
      PRODUCTS = {};
    }

    var CLOUD = root.dataset.cloudinaryAccount || "slealu5f";
    var FOLDER = root.dataset.cloudinaryFolder || "hope/catalog";
    var MONEY_FORMAT = root.dataset.moneyFormat || "${{amount}}";
    var BASE_ASSET = root.dataset.baseAsset || "hope-milkshake-strawberry-cutout-v3";

    // Assets del vaso que tienen fondo y requieren e_background_removal.
    function needsBackgroundRemoval(asset) {
      return (
        asset.indexOf("2d-") === 0 ||
        asset === "hope-mixo-fixed-default-v1" ||
        asset === "hope-milkshake-vanilla-cutout-v1" ||
        asset === "hope-milkshake-chocolate-cutout-v1" ||
        asset === "hope-milkshake-chocolate-cutout-v2"
      );
    }

    function catalogUrl(asset, width) {
      width = width || 1000;
      var t = needsBackgroundRemoval(asset)
        ? "e_background_removal/f_auto,q_auto,w_" + width
        : "f_auto,q_auto,w_" + width;
      return "https://res.cloudinary.com/" + CLOUD + "/image/upload/" + t + "/" + FOLDER + "/" + asset;
    }

    function formatMoney(cents) {
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
      var value;
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

    // ---- Estado: solo el combo elegido ----
    var comboButtons = $$("[data-group='combo'] .hopecfg__choice");
    var firstCombo = comboButtons.length ? comboButtons[0].dataset.id : null;
    var state = { combo: firstCombo };

    // ---- Resolución de variante nativa por nombre de combo (option1) ----
    function variantForCombo(comboName) {
      var p = PRODUCTS.milkshake;
      if (!p || !p.variants) return null;
      for (var i = 0; i < p.variants.length; i++) {
        if (p.variants[i].option1 === comboName) return p.variants[i];
      }
      return null;
    }
    function variantForState() { return variantForCombo(state.combo); }

    // ---- Lectura de datos de la card activa ----
    function comboButton(id) {
      return $("[data-group='combo'] [data-id='" + (window.CSS && CSS.escape ? CSS.escape(id) : id) + "']");
    }
    function readAsset(id) {
      var el = comboButton(id);
      return el ? (el.dataset.asset || "") : "";
    }
    function readLabel(id) {
      var el = comboButton(id);
      return el ? (el.dataset.label || id) : id;
    }

    // Combo siempre válido (siempre hay uno activo por defecto).
    function isValidSelection() { return !!state.combo && !!variantForState(); }

    // ---- Precios ----
    function updatePrice() {
      var priceEl = $("#price");
      if (priceEl) {
        var variant = variantForState();
        priceEl.textContent = variant ? variant.price_formatted : "—";
      }
      // Precio por card
      $$("[data-group='combo'] .hopecfg__choice").forEach(function (btn) {
        var v = variantForCombo(btn.dataset.id);
        var sub = btn.querySelector("[data-combo-price]");
        if (sub) sub.textContent = v ? v.price_formatted : "";
      });
      // Etiqueta del combo en la vista previa
      var label = $("#ms-combo-label");
      if (label) label.textContent = state.combo ? readLabel(state.combo) : "—";

      var buyBtn = $("#buy");
      var hintEl = $("#buy-hint");
      if (buyBtn) {
        var valid = isValidSelection();
        buyBtn.disabled = !valid;
        buyBtn.classList.toggle("is-disabled", !valid);
        if (hintEl) hintEl.textContent = valid ? "" : "Este producto aún no está vinculado.";
      }
    }

    // ---- Vista previa ----
    function updatePreview() {
      var cup = $("#product-preview");
      if (!cup) return;
      var asset = state.combo ? readAsset(state.combo) : "";
      cup.src = catalogUrl(asset || BASE_ASSET);
    }

    // ---- Render general ----
    function render() {
      $$("[data-group='combo'] .hopecfg__choice").forEach(function (b) {
        b.classList.toggle("is-active", b.dataset.id === state.combo);
      });
      updatePreview();
      updatePrice();
    }

    // ---- Eventos de selección ----
    var optionsRoot = $("#hope-options");
    if (optionsRoot) {
      optionsRoot.addEventListener("click", function (e) {
        var b = e.target.closest("button[data-id]");
        if (!b) return;
        var group = b.closest("fieldset").dataset.group;
        if (group !== "combo") return;
        state.combo = b.dataset.id;
        render();
      });
    }

    var resetBtn = $("#reset-view");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        state.combo = firstCombo;
        render();
      });
    }

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

    function buildProperties() {
      var props = {};
      if (state.combo) props["Combo"] = readLabel(state.combo);
      return props;
    }

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
      var start = { x: sourceRect.left + sourceRect.width / 2 - size / 2, y: sourceRect.top + sourceRect.height / 2 - size / 2 };
      var end = { x: destRect.left + destRect.width / 2 - size / 2, y: destRect.top + destRect.height / 2 - size / 2 };
      var c1 = { x: start.x, y: start.y - 200 };
      var c2 = { x: end.x - 300, y: end.y - 100 };
      function bezier(t, p0, p1, p2, p3) {
        var cX = 3 * (p1.x - p0.x), bX = 3 * (p2.x - p1.x) - cX, aX = p3.x - p0.x - cX - bX;
        var cY = 3 * (p1.y - p0.y), bY = 3 * (p2.y - p1.y) - cY, aY = p3.y - p0.y - cY - bY;
        return { x: aX * t * t * t + bX * t * t + cX * t + p0.x, y: aY * t * t * t + bY * t * t + cY * t + p0.y };
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
        if (progress < 1) requestAnimationFrame(step);
        else { fly.style.opacity = "0"; setTimeout(function () { fly.remove(); }, 200); }
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
        var variant = variantForState();
        if (!variant) { showToast("Este producto aún no está vinculado. Configúralo en el tema.", true); return; }
        if (variant.available === false) { showToast("Sin stock para este combo.", true); return; }

        var routes = (window.Theme && window.Theme.routes) || {};
        var addUrl = routes.cart_add_url || "/cart/add.js";
        var product = PRODUCTS.milkshake || null;
        var payload = { items: [{ id: variant.id, quantity: 1, properties: buildProperties() }] };
        var sectionIds = cartSectionIds();
        if (sectionIds.length) {
          payload.sections = sectionIds.join(",");
          payload.sections_url = window.location.pathname;
        }

        buyBtn.disabled = true;
        flyToCart();

        fetch(addUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        })
          .then(function (r) { return r.json().then(function (json) { return { ok: r.ok, json: json }; }); })
          .then(function (res) {
            if (!res.ok || (res.json && res.json.status)) {
              var msg = (res.json && (res.json.description || res.json.message)) || "No se pudo añadir al carrito.";
              showToast(msg, true);
              return;
            }
            document.dispatchEvent(new CustomEvent("cart:update", {
              bubbles: true,
              detail: {
                resource: res.json,
                sourceId: root.id || "hopecfg-milkshake",
                data: {
                  source: "product-form-component",
                  productId: product ? String(product.id) : undefined,
                  itemCount: 1,
                  sections: res.json.sections,
                },
              },
            }));
            showToast("¡Tu selección fue añadida! ✨", false);
            var drawer = document.querySelector("cart-drawer-component");
            if (drawer && typeof drawer.open === "function") drawer.open();
          })
          .catch(function () { showToast("No se pudo añadir al carrito. Inténtalo de nuevo.", true); })
          .then(function () { buyBtn.disabled = false; });
      });
    }

    // ---- Miniaturas de cada card = imagen del combo (mismo cutout que el preview) ----
    comboButtons.forEach(function (btn) {
      var img = btn.querySelector("[data-combo-img]");
      var asset = btn.dataset.asset;
      if (img && asset) img.src = catalogUrl(asset, 200);
    });

    // ---- Arranque ----
    render();
  }

  function initAll() {
    Array.prototype.slice.call(document.querySelectorAll("[data-hopecfg-ms]")).forEach(initConfigurator);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
  document.addEventListener("shopify:section:load", initAll);
})();
