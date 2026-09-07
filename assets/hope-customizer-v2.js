/**
 * hope-customizer-v2.js — Configurador Hope V2 ("Crea tu helado Hope")
 *
 * Variante del configurador enfocada solo en el Helado Hope (modo 2d), con una
 * diferencia visual clave respecto a custom-product-helado:
 *  - El vaso base es fijo (no se intercambian composiciones Cloudinary).
 *  - Cada extra elegido (topping / premium / sirope) aparece como una burbuja
 *    circular flotando sobre el helado, con una insignia "+1", tal como el mock.
 *
 * Reutiliza la línea gráfica global (.hopecfg / hopecfg__*) y la lógica de
 * carrito nativo (variante Tamaño × nivel de Extras + line item properties).
 *
 * Es idempotente y solo actúa sobre raíces [data-hopecfg-v2].
 */

(function () {
  "use strict";

  // Posiciones (en % del escenario) donde caen las burbujas sobre el helado.
  // Pensadas para agruparse alrededor del remolino superior del vaso.
  var BUBBLE_ANCHORS = [
    { top: 32, left: 31 },
    { top: 26, left: 62 },
    { top: 45, left: 48 },
    { top: 40, left: 71 },
    { top: 20, left: 50 },
    { top: 52, left: 34 },
  ];

  function initConfigurator(root) {
    if (root.dataset.hopecfgV2Init === "true") return;
    root.dataset.hopecfgV2Init = "true";

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
    var BASE_ASSET = root.dataset.baseAsset || "hope-vanilla-cup-cutout-v1";

    function catalogUrl(asset, width) {
      width = width || 1000;
      var needsBg = asset.indexOf("2d-") === 0 || asset === "hope-mixo-fixed-default-v1";
      var t = needsBg ? "e_background_removal/f_auto,q_auto,w_" + width : "f_auto,q_auto,w_" + width;
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

    // ---- Estado ----
    var state = {
      size: "small",
      toppings: new Set(), // exactamente 2
      premium: null,       // opcional, máx 1
      syrup: null,         // obligatorio, 1
      lastKey: null,       // último extra elegido (para resaltar su burbuja)
    };

    var SIZE_NAME = { small: "Pequeño", medium: "Mediano", large: "Grande" };

    // ---- Resolución de variante nativa (Tamaño × nivel de Extras) ----
    function heladoMinCents(sizeName) {
      var p = PRODUCTS.helado;
      if (!p || !p.variants) return null;
      var min = null;
      p.variants.forEach(function (v) {
        if (v.option1 === sizeName && (min === null || v.price < min)) min = v.price;
      });
      return min;
    }
    function heladoLevel() { return state.premium ? "Con premium" : "Estándar"; }
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
      return findHeladoVariant(SIZE_NAME[state.size] || state.size, heladoLevel());
    }

    // ---- Lectura de datos de los chips ----
    function readLabel(group, id) {
      var el = $("[data-group='" + group + "'] [data-id='" + id + "']");
      return el ? (el.dataset.label || id) : id;
    }
    function readEmoji(group, id) {
      var el = $("[data-group='" + group + "'] [data-id='" + id + "']");
      return el ? (el.dataset.emoji || "") : "";
    }
    function readImage(group, id) {
      var el = $("[data-group='" + group + "'] [data-id='" + id + "']");
      return el ? (el.dataset.image || "") : "";
    }

    // ---- Validación (2 toppings + 1 sirope) ----
    function isValidSelection() { return state.toppings.size === 2 && !!state.syrup; }
    function missingMessage() {
      var faltan = [];
      var n = state.toppings.size;
      if (n < 2) faltan.push("elige " + (2 - n) + " topping" + (2 - n === 1 ? "" : "s"));
      if (!state.syrup) faltan.push("elige 1 sirope");
      return faltan.join(" y ");
    }

    // ---- Lista ordenada de extras seleccionados ----
    function selectedExtras() {
      var out = [];
      state.toppings.forEach(function (id) {
        out.push({ key: "topping:" + id, group: "topping", id: id });
      });
      if (state.premium) out.push({ key: "premium:" + state.premium, group: "premium", id: state.premium });
      if (state.syrup) out.push({ key: "syrup:" + state.syrup, group: "syrup", id: state.syrup });
      return out;
    }

    // ---- Render de burbujas flotantes sobre el helado ----
    function renderBubbles() {
      var layer = $("#hope-bubbles");
      if (!layer) return;
      var extras = selectedExtras();
      layer.innerHTML = extras.slice(0, BUBBLE_ANCHORS.length).map(function (ex, i) {
        var anchor = BUBBLE_ANCHORS[i];
        var label = readLabel(ex.group, ex.id);
        var emoji = readEmoji(ex.group, ex.id);
        var img = readImage(ex.group, ex.id);
        var isLast = ex.key === state.lastKey;
        var inner = img
          ? '<img class="hope2__bubble-img" src="' + img + '" alt="' + label + '" loading="lazy">'
          : '<span class="hope2__bubble-emoji">' + emoji + "</span>";
        return (
          '<span class="hope2__bubble' + (isLast ? " is-last" : "") + '"' +
          ' style="top:' + anchor.top + "%;left:" + anchor.left + '%"' +
          ' title="' + label + '">' +
          inner +
          '<span class="hope2__bubble-badge">+1</span>' +
          "</span>"
        );
      }).join("");
    }

    // ---- Render mini-stack (esquina inferior de la vista previa) ----
    function renderStack() {
      var extras = selectedExtras();
      var stack = $("#hope-stack");
      var label = $("#hope-extras-label");
      if (stack) {
        stack.innerHTML = extras.map(function (ex) {
          var img = readImage(ex.group, ex.id);
          var emoji = readEmoji(ex.group, ex.id);
          var lbl = readLabel(ex.group, ex.id);
          return img
            ? '<span title="' + lbl + '"><img src="' + img + '" alt="' + lbl + '"></span>'
            : '<span title="' + lbl + '">' + emoji + "</span>";
        }).join("");
      }
      if (label) {
        var n = extras.length;
        label.textContent = n
          ? n + " " + (n === 1 ? "extra añadido" : "extras añadidos")
          : "Aún sin extras";
      }
    }

    // ---- Precios y gating del botón ----
    function updatePrice() {
      var priceEl = $("#price");
      if (priceEl) {
        var variant = variantForState();
        priceEl.textContent = variant ? variant.price_formatted : "—";
      }
      $$("#size-options .hopecfg__choice").forEach(function (btn) {
        var min = heladoMinCents(SIZE_NAME[btn.dataset.id]);
        var sub = btn.querySelector("[data-size-price]");
        if (sub && min != null) sub.textContent = formatMoney(min);
      });
      var countEl = $("[data-topping-count]");
      if (countEl) countEl.textContent = state.toppings.size + "/2";

      var buyBtn = $("#buy");
      var hintEl = $("#buy-hint");
      if (buyBtn) {
        var valid = isValidSelection();
        buyBtn.disabled = !valid;
        buyBtn.classList.toggle("is-disabled", !valid);
        if (hintEl) hintEl.textContent = valid ? "" : "Falta: " + missingMessage();
      }
    }

    // ---- Render general ----
    function render() {
      var zoom = { small: 0.86, medium: 0.94, large: 1 };
      var cup = $("#product-preview");
      if (cup) cup.style.transform = "scale(" + (zoom[state.size] || 1) + ")";

      $$("[data-group='size'] .hopecfg__choice").forEach(function (b) {
        b.classList.toggle("is-active", b.dataset.id === state.size);
      });
      $$("[data-group='topping'] .hopecfg__choice").forEach(function (b) {
        b.classList.toggle("is-active", state.toppings.has(b.dataset.id));
      });
      $$("[data-group='premium'] .hopecfg__choice").forEach(function (b) {
        b.classList.toggle("is-active", state.premium === b.dataset.id);
      });
      $$("[data-group='syrup'] .hopecfg__choice").forEach(function (b) {
        b.classList.toggle("is-active", state.syrup === b.dataset.id);
      });

      renderBubbles();
      renderStack();
      updatePrice();
    }

    // ---- Eventos de selección ----
    var optionsRoot = $("#hope-options");
    if (optionsRoot) {
      optionsRoot.addEventListener("click", function (e) {
        var b = e.target.closest("button[data-id]");
        if (!b) return;
        var group = b.closest("fieldset").dataset.group;
        var id = b.dataset.id;
        if (group === "size") {
          state.size = id;
        } else if (group === "topping") {
          if (state.toppings.has(id)) {
            state.toppings.delete(id);
            if (state.lastKey === "topping:" + id) state.lastKey = null;
          } else {
            if (state.toppings.size >= 2) return;
            state.toppings.add(id);
            state.lastKey = "topping:" + id;
          }
        } else if (group === "premium") {
          state.premium = state.premium === id ? null : id;
          state.lastKey = state.premium ? "premium:" + id : null;
        } else if (group === "syrup") {
          state.syrup = state.syrup === id ? null : id;
          state.lastKey = state.syrup ? "syrup:" + id : null;
        }
        render();
      });
    }

    var resetBtn = $("#reset-view");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        state.size = "small";
        state.toppings.clear();
        state.premium = null;
        state.syrup = null;
        state.lastKey = null;
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
      var tnames = [];
      state.toppings.forEach(function (id) { tnames.push(readLabel("topping", id)); });
      if (tnames.length) props["Toppings"] = tnames.join(", ");
      if (state.premium) props["Premium"] = readLabel("premium", state.premium);
      if (state.syrup) props["Sirope"] = readLabel("syrup", state.syrup);
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
        if (!isValidSelection()) { showToast("Falta: " + missingMessage(), true); return; }
        var variant = variantForState();
        if (!variant) { showToast("Este producto aún no está vinculado. Configúralo en el tema.", true); return; }
        if (variant.available === false) { showToast("Sin stock para esta opción.", true); return; }

        var routes = (window.Theme && window.Theme.routes) || {};
        var addUrl = routes.cart_add_url || "/cart/add.js";
        var product = PRODUCTS.helado || null;
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
                sourceId: root.id || "hopecfg-v2",
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

    // Etiqueta de referencia "Incluido" en toppings gratuitos (0 cents),
    // para que muestren su precio como Premium/Sirope (que sí tienen costo extra).
    $$("[data-group='topping'] .hopecfg__choice").forEach(function (b) {
      if ((b.dataset.precioCents || "0") === "0" && !b.querySelector(".hopecfg__chip-price")) {
        var s = document.createElement("span");
        s.className = "hopecfg__chip-price";
        s.textContent = "Incluido";
        b.appendChild(s);
      }
    });

    // ---- Arranque ----
    var cup = $("#product-preview");
    if (cup && !cup.getAttribute("src")) cup.src = catalogUrl(BASE_ASSET);
    render();
  }

  function initAll() {
    Array.prototype.slice.call(document.querySelectorAll("[data-hopecfg-v2]")).forEach(initConfigurator);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
  document.addEventListener("shopify:section:load", initAll);
})();
