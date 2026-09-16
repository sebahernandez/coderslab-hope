/**
 * hope-customizer-v2.js — Configurador Hope V2 ("Crea tu helado")
 *
 * Reglas de negocio (Helado Hope / Mixo Hope):
 *  - Tamaño: Pequeño/Mediano/Grande = precio base ($5/$7/$9), variante nativa.
 *  - Toppings estándar: los primeros 2 van INCLUIDOS en el precio base; cada
 *    topping estándar adicional cuesta $1.00 (fijo). Sin límite superior.
 *  - Toppings premium: sin límite; cada uno cobra su precio individual; NO
 *    consumen los 2 estándar incluidos.
 *  - Siropes: el primero va INCLUIDO; cada sirope adicional cobra su precio
 *    individual. Sin límite (acumulativo).
 *
 * Cobro (tienda no-Plus, sin Functions):
 *  - El costo de los toppings estándar extra ($1 c/u a partir del 3.º) va BAKEADO
 *    en el precio de la variante del helado. El producto tiene variantes
 *    Tamaño × "Toppings extra" (0..MAX_EXTRA_TOPPINGS); el JS elige la que
 *    corresponde a (tamaño, nº de toppings extra). NO se genera línea aparte por
 *    estos. Así "el extra no es un producto": se ve solo el helado con su precio.
 *  - Premium y siropes adicionales tienen precio VARIABLE (no bakeables en
 *    variantes), así que se cobran en la línea add-on "Extras personalizados"
 *    ($0.10 × cantidad). Esta línea solo aparece si hay premium/siropes extra.
 * El desglose legible va como line item properties en la línea del helado. Ambas
 * líneas comparten un `_hope_ext` oculto para la limpieza de huérfanos (ver
 * toppings-customizer.js, listener global).
 * NOTA: se usa `_hope_ext` (no `_grupo`) a propósito, para NO activar el viejo
 * Cart Transform (hope-functions) que fusiona líneas con `_grupo` — ese modelo es
 * solo-Plus y debe quedar inerte; aquí el cobro es 100% nativo por add-on.
 *
 * Es idempotente y solo actúa sobre raíces [data-hopecfg-v2].
 */

(function () {
  "use strict";

  // Posiciones (en % del escenario) donde caen las burbujas sobre el helado.
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

    // ---- Reglas de negocio (configurables por data-attr) ----
    var FREE_TOPPINGS = parseInt(root.dataset.freeToppings || "2", 10);      // estándar incluidos
    var EXTRA_TOPPING_CENTS = parseInt(root.dataset.extraToppingCents || "100", 10); // c/topping estándar extra
    var FREE_SYRUPS = parseInt(root.dataset.freeSyrups || "1", 10);          // siropes incluidos
    // Máx. de toppings estándar extra que soportan las variantes del helado.
    // El costo de estos ($1 c/u) va BAKEADO en el precio de la variante
    // (Tamaño × Toppings extra), no en la línea add-on.
    var MAX_EXTRA_TOPPINGS = parseInt(root.dataset.maxExtraToppings || "12", 10);
    var EXTRAS_UNIT_CENTS = 10;                                              // precio unitario del add-on ($0.10)
    var EXTRAS_VARIANT_ID = parseInt(root.dataset.extrasVariantId || "0", 10) || 0;

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
    // Arreglos ordenados por orden de selección (para decidir cuáles van incluidos).
    var state = {
      size: "small",
      toppings: [], // estándar, sin límite (primeros FREE_TOPPINGS incluidos)
      premium: [],  // premium, sin límite (cada uno con precio)
      syrups: [],   // siropes, sin límite (primeros FREE_SYRUPS incluidos)
      lastKey: null,
    };

    var SIZE_NAME = { small: "Pequeño", medium: "Mediano", large: "Grande" };

    // ---- Nº de toppings estándar extra (más allá de los incluidos) ----
    // Total sin límite en la UI, pero para el cobro se topa a MAX_EXTRA_TOPPINGS
    // porque es lo que soportan las variantes (Tamaño × Toppings extra).
    function standardExtraCount() { return Math.max(0, state.toppings.length - FREE_TOPPINGS); }
    function cappedExtraCount() { return Math.min(standardExtraCount(), MAX_EXTRA_TOPPINGS); }

    // ---- Variante nativa (Tamaño × Toppings extra) = base + $1·nºextra ----
    function findVariant(sizeName, extraCount) {
      var p = PRODUCTS.helado;
      if (!p || !p.variants) return null;
      var target = String(extraCount);
      for (var i = 0; i < p.variants.length; i++) {
        var v = p.variants[i];
        if (v.option1 === sizeName && String(v.option2) === target) return v;
      }
      return null;
    }
    function findSizeVariant(sizeName) { return findVariant(sizeName, 0); }
    function variantForState() {
      return findVariant(SIZE_NAME[state.size] || state.size, cappedExtraCount());
    }
    // Precio de la variante seleccionada (ya incluye los toppings extra bakeados).
    function baseCents() {
      var v = variantForState();
      return v ? v.price : null;
    }

    function centsOf(group, id) {
      if (!id) return 0;
      var sel = window.CSS && CSS.escape ? CSS.escape(id) : id;
      var el = $("[data-group='" + group + "'] [data-id='" + sel + "']");
      return el ? parseInt(el.dataset.precioCents || "0", 10) : 0;
    }

    // ---- Cálculo de extras (en centavos) ----
    // Toppings estándar extra: su costo ($1 c/u) va BAKEADO en el precio de la
    // variante del helado, NO en la línea add-on. Aquí se calcula solo para
    // mostrarlo en el desglose.
    function standardExtraCents() { return cappedExtraCount() * EXTRA_TOPPING_CENTS; }
    function premiumCents() {
      var t = 0;
      state.premium.forEach(function (id) { t += centsOf("premium", id); });
      return t;
    }
    function syrupExtraCents() {
      var t = 0;
      state.syrups.forEach(function (id, i) { if (i >= FREE_SYRUPS) t += centsOf("syrup", id); });
      return t;
    }
    // Extras que SÍ se cobran por la línea add-on ($0.10/u): premium + siropes
    // adicionales (precio variable que no se puede bakear en variantes).
    function addonExtrasCents() { return premiumCents() + syrupExtraCents(); }
    // Total de extras (para mostrar): bakeados + add-on.
    function extrasCents() { return standardExtraCents() + addonExtrasCents(); }
    function totalCents() {
      var b = baseCents();
      return b == null ? null : b + addonExtrasCents();
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

    // ---- Validación: al menos 1 sirope (obligatorio, el incluido) ----
    function isValidSelection() { return state.syrups.length >= 1; }
    function missingMessage() {
      if (state.syrups.length < 1) return "elige 1 sirope";
      return "";
    }

    // ---- Lista ordenada de extras seleccionados (para burbujas/stack) ----
    function selectedExtras() {
      var out = [];
      state.toppings.forEach(function (id) { out.push({ key: "topping:" + id, group: "topping", id: id }); });
      state.premium.forEach(function (id) { out.push({ key: "premium:" + id, group: "premium", id: id }); });
      state.syrups.forEach(function (id) { out.push({ key: "syrup:" + id, group: "syrup", id: id }); });
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

    // ---- Render mini-stack ----
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

    // ---- Marca de costo en los chips (Incluido / +$) ----
    function setChipPrice(btn, text, extra) {
      var s = btn.querySelector(".hopecfg__chip-price");
      if (!s) {
        s = document.createElement("span");
        s.className = "hopecfg__chip-price";
        btn.appendChild(s);
      }
      s.textContent = text;
      s.classList.toggle("is-extra-cost", !!extra);
      s.classList.toggle("is-included", !extra && text === "Incluido");
    }

    function renderChipPrices() {
      // Toppings estándar: primeros FREE_TOPPINGS "Incluido"; extras "+$1.00".
      $$("[data-group='topping'] .hopecfg__choice").forEach(function (b) {
        var idx = state.toppings.indexOf(b.dataset.id);
        if (idx === -1) { setChipPrice(b, "", false); return; }
        if (idx < FREE_TOPPINGS) setChipPrice(b, "Incluido", false);
        else setChipPrice(b, "+" + formatMoney(EXTRA_TOPPING_CENTS), true);
      });
      // Premium: siempre su precio individual.
      $$("[data-group='premium'] .hopecfg__choice").forEach(function (b) {
        var c = parseInt(b.dataset.precioCents || "0", 10);
        setChipPrice(b, c > 0 ? "+" + formatMoney(c) : "", state.premium.indexOf(b.dataset.id) !== -1);
      });
      // Siropes: primeros FREE_SYRUPS "Incluido"; el resto su precio.
      $$("[data-group='syrup'] .hopecfg__choice").forEach(function (b) {
        var c = parseInt(b.dataset.precioCents || "0", 10);
        var idx = state.syrups.indexOf(b.dataset.id);
        if (idx !== -1 && idx < FREE_SYRUPS) { setChipPrice(b, "Incluido", false); return; }
        setChipPrice(b, c > 0 ? "+" + formatMoney(c) : "", idx >= FREE_SYRUPS && idx !== -1);
      });
    }

    // ---- Aviso de costo adicional por toppings (regla UX) ----
    function renderWarning() {
      var warn = $("#topping-warning");
      if (warn) warn.hidden = state.toppings.length <= FREE_TOPPINGS;
    }

    // ---- Precio y gating del botón ----
    function updatePrice() {
      var priceEl = $("#price");
      var total = totalCents();
      if (priceEl) priceEl.textContent = total == null ? "—" : formatMoney(total);

      $$("#size-options .hopecfg__choice").forEach(function (btn) {
        var v = findSizeVariant(SIZE_NAME[btn.dataset.id]);
        var sub = btn.querySelector("[data-size-price]");
        if (sub && v) sub.textContent = formatMoney(v.price);
      });

      var countEl = $("[data-topping-count]");
      if (countEl) {
        var n = state.toppings.length;
        var extra = standardExtraCount();
        countEl.textContent = extra > 0 ? n + " (" + extra + " con costo)" : n + "/" + FREE_TOPPINGS;
      }

      // Desglose de extras bajo el total.
      var breakEl = $("#extras-breakdown");
      if (breakEl) {
        var e = extrasCents();
        breakEl.textContent = e > 0 ? "Incluye " + formatMoney(e) + " en extras" : "";
      }

      var buyBtn = $("#buy");
      var hintEl = $("#buy-hint");
      if (buyBtn) {
        var valid = isValidSelection();
        var hasVariant = !!variantForState();
        var ok = valid && hasVariant;
        buyBtn.disabled = !ok;
        buyBtn.classList.toggle("is-disabled", !ok);
        if (hintEl) hintEl.textContent = valid ? (hasVariant ? "" : "Combinación no disponible") : "Falta: " + missingMessage();
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
        var idx = state.toppings.indexOf(b.dataset.id);
        b.classList.toggle("is-active", idx !== -1);
        b.classList.toggle("is-extra-cost", idx >= FREE_TOPPINGS);
      });
      $$("[data-group='premium'] .hopecfg__choice").forEach(function (b) {
        b.classList.toggle("is-active", state.premium.indexOf(b.dataset.id) !== -1);
      });
      $$("[data-group='syrup'] .hopecfg__choice").forEach(function (b) {
        var idx = state.syrups.indexOf(b.dataset.id);
        b.classList.toggle("is-active", idx !== -1);
        b.classList.toggle("is-extra-cost", idx >= FREE_SYRUPS && idx !== -1);
      });

      renderChipPrices();
      renderWarning();
      renderBubbles();
      renderStack();
      updatePrice();
    }

    // ---- Utilidad: alternar id en un arreglo ordenado ----
    function toggleInArray(arr, id) {
      var i = arr.indexOf(id);
      if (i === -1) { arr.push(id); return true; }
      arr.splice(i, 1); return false;
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
          var added = toggleInArray(state.toppings, id);
          state.lastKey = added ? "topping:" + id : (state.lastKey === "topping:" + id ? null : state.lastKey);
        } else if (group === "premium") {
          var addedP = toggleInArray(state.premium, id);
          state.lastKey = addedP ? "premium:" + id : (state.lastKey === "premium:" + id ? null : state.lastKey);
        } else if (group === "syrup") {
          var addedS = toggleInArray(state.syrups, id);
          state.lastKey = addedS ? "syrup:" + id : (state.lastKey === "syrup:" + id ? null : state.lastKey);
        }
        render();
      });
    }

    var resetBtn = $("#reset-view");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        state.size = "small";
        state.toppings = [];
        state.premium = [];
        state.syrups = [];
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

    function groupId() {
      // Id único (sin Date.now/random dependencias problemáticas): timestamp + contador.
      return "hope-" + Date.now().toString(36) + "-" + Math.floor(Math.random() * 1e6).toString(36);
    }

    function buildMainProperties(grupo) {
      var props = {};
      var incl = state.toppings.slice(0, FREE_TOPPINGS).map(function (id) { return readLabel("topping", id); });
      var adic = state.toppings.slice(FREE_TOPPINGS).map(function (id) { return readLabel("topping", id); });
      if (incl.length) props["Toppings incluidos"] = incl.join(", ");
      if (adic.length) props["Toppings adicionales"] = adic.join(", ") + " (+" + formatMoney(standardExtraCents()) + ")";
      if (state.premium.length) {
        props["Premium"] = state.premium.map(function (id) {
          return readLabel("premium", id) + " (+" + formatMoney(centsOf("premium", id)) + ")";
        }).join(", ");
      }
      var sInc = state.syrups.slice(0, FREE_SYRUPS).map(function (id) { return readLabel("syrup", id); });
      var sAdd = state.syrups.slice(FREE_SYRUPS).map(function (id) {
        return readLabel("syrup", id) + " (+" + formatMoney(centsOf("syrup", id)) + ")";
      });
      if (sInc.length) props["Sirope incluido"] = sInc.join(", ");
      if (sAdd.length) props["Siropes adicionales"] = sAdd.join(", ");
      if (grupo) props["_hope_ext"] = grupo;
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

        var grupo = groupId();
        // Los toppings estándar extra ya van bakeados en el precio de la variante.
        // La línea add-on solo cobra premium + siropes adicionales (precio variable).
        var addonCents = addonExtrasCents();
        var product = PRODUCTS.helado || null;

        // La línea del helado va AL FINAL para que quede arriba en el carrito
        // (Horizon muestra lo último añadido primero). Los extras primero.
        var items = [];
        if (addonCents > 0 && EXTRAS_VARIANT_ID) {
          items.push({
            id: EXTRAS_VARIANT_ID,
            quantity: Math.round(addonCents / EXTRAS_UNIT_CENTS),
            properties: { "Para": (product && product.title) || "Helado", "_hope_ext": grupo },
          });
        }
        items.push({ id: variant.id, quantity: 1, properties: buildMainProperties(addonCents > 0 ? grupo : null) });

        if (addonCents > 0 && !EXTRAS_VARIANT_ID) {
          showToast("Falta vincular el producto de extras en el tema.", true);
          return;
        }

        var routes = (window.Theme && window.Theme.routes) || {};
        var addUrl = routes.cart_add_url || "/cart/add.js";
        var payload = { items: items };
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

    // ---- Arranque ----
    var cupEl = $("#product-preview");
    if (cupEl && !cupEl.getAttribute("src")) cupEl.src = catalogUrl(BASE_ASSET);
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
