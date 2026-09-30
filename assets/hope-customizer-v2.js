/**
 * hope-customizer-v2.js — Configurador Hope V2 ("Crea tu helado")
 *
 * Reglas de negocio (Helado Hope / Mixo Hope) — modelo HÍBRIDO:
 *  - Tamaño: Pequeño/Mediano/Grande = precio base, variante nativa.
 *  - Toppings/siropes BÁSICOS (no premium): los primeros 2 toppings + 1 sirope van
 *    INCLUIDOS; cada BÁSICO adicional cuesta $1.00 (EXTRA_UNIT_CENTS). Sin límite UI.
 *  - Toppings/siropes PREMIUM (data-premium): NUNCA cuentan como incluidos; cada uno
 *    cuesta un precio plano PREMIUM_CENTS ($1.50).
 *
 * Cobro (tienda no-Plus, sin Functions):
 *  - Los BÁSICOS pagados van BAKEADOS en la variante del helado
 *    (Tamaño × "Toppings extra" 0..MAX_EXTRA_TOPPINGS, $1 c/u). 1 línea nativa.
 *  - Los PREMIUM van en una 2ª línea add-on ("Extras personalizados",
 *    EXTRAS_VARIANT_ID, qty = nº premium @ PREMIUM_CENTS), vinculada a la línea del
 *    helado con la property `_hope_ext` (cleanup/badge por toppings-customizer.js).
 *  - El desglose legible va como line item properties en la línea del helado.
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
    var FREE_TOPPINGS = parseInt(root.dataset.freeToppings || "2", 10);      // toppings incluidos
    var EXTRA_UNIT_CENTS = parseInt(root.dataset.extraToppingCents || "100", 10); // c/extra pagado ($1.00)
    var FREE_SYRUPS = parseInt(root.dataset.freeSyrups || "1", 10);          // siropes incluidos
    // Máx. de extras pagados que soportan las variantes del helado. El costo de los
    // extras ($1 c/u) va BAKEADO en el precio de la variante (Tamaño × Toppings extra).
    var MAX_EXTRA_TOPPINGS = parseInt(root.dataset.maxExtraToppings || "20", 10);
    // Precio plano por item premium (topping o sirope) y variante del add-on que lo cobra.
    var PREMIUM_CENTS = parseInt(root.dataset.premiumCents || "150", 10);
    var EXTRAS_VARIANT_ID = parseInt(root.dataset.extrasVariantId || "0", 10) || null;

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
      toppings: [], // estándar + premium (mismo pool); primeros FREE_TOPPINGS incluidos
      syrups: [],   // siropes; primeros FREE_SYRUPS incluidos
      lastKey: null,
    };

    var SIZE_NAME = { small: "Pequeño", medium: "Mediano", large: "Grande" };

    // Etiquetas del wizard móvil (paso a paso). Desktop las ignora (ver CSS).
    var STEP_LABELS = ["Elige tu tamaño", "Elige tus toppings", "Elige tu sirope"];

    // ---- Clasificación básicos vs premium (conserva el orden de selección) ----
    function basicIds(group, arr) { return arr.filter(function (id) { return !isPremium(group, id); }); }
    function premiumIds(group, arr) { return arr.filter(function (id) { return isPremium(group, id); }); }
    function basicToppings() { return basicIds("topping", state.toppings); }
    function premiumToppings() { return premiumIds("topping", state.toppings); }
    function basicSyrups() { return basicIds("syrup", state.syrups); }
    function premiumSyrups() { return premiumIds("syrup", state.syrups); }

    // ---- Extras pagados ----
    // Solo los BÁSICOS ocupan lo incluido (2 top + 1 sirope) y van bakeados en la
    // variante ($1 c/u). Los PREMIUM nunca cuentan como incluidos y cuestan
    // PREMIUM_CENTS c/u vía la línea add-on.
    function paidBasicToppingCount() { return Math.max(0, basicToppings().length - FREE_TOPPINGS); }
    function paidBasicSyrupCount() { return Math.max(0, basicSyrups().length - FREE_SYRUPS); }
    // Conteo para elegir la variante (Tamaño × Toppings extra), topado a MAX_EXTRA_TOPPINGS.
    function variantExtraCount() { return Math.min(paidBasicToppingCount() + paidBasicSyrupCount(), MAX_EXTRA_TOPPINGS); }
    function premiumCount() { return premiumToppings().length + premiumSyrups().length; }
    function hasPaidExtras() { return variantExtraCount() > 0 || premiumCount() > 0; }

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
      return findVariant(SIZE_NAME[state.size] || state.size, variantExtraCount());
    }
    // Precio de la variante seleccionada (ya incluye TODOS los extras bakeados).
    function baseCents() {
      var v = variantForState();
      return v ? v.price : null;
    }

    // ---- Cálculo de extras (en centavos) ----
    function basicExtrasCents() { return variantExtraCount() * EXTRA_UNIT_CENTS; }
    function premiumExtrasCents() { return premiumCount() * PREMIUM_CENTS; }
    function extrasCents() { return basicExtrasCents() + premiumExtrasCents(); }
    function totalCents() {
      // Básicos ya bakeados en la variante; premium se suma (línea add-on).
      var b = baseCents();
      return b == null ? null : b + premiumExtrasCents();
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
    function isPremium(group, id) {
      var el = $("[data-group='" + group + "'] [data-id='" + id + "']");
      return !!(el && el.dataset.premium === "true");
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

    // ---- Marca de costo en los chips (Incluido / +$1.00) ----
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
      // Premium → siempre "+$1.50". Básicos → primeros incluidos, resto "+$1.00"
      // (el índice se calcula SOLO entre básicos, para que premium no ocupe incluidos).
      var basicTop = basicToppings();
      $$("[data-group='topping'] .hopecfg__choice").forEach(function (b) {
        var id = b.dataset.id;
        if (state.toppings.indexOf(id) === -1) { setChipPrice(b, "", false); return; }
        if (isPremium("topping", id)) { setChipPrice(b, "+" + formatMoney(PREMIUM_CENTS), true); return; }
        var idx = basicTop.indexOf(id);
        if (idx < FREE_TOPPINGS) setChipPrice(b, "Incluido", false);
        else setChipPrice(b, "+" + formatMoney(EXTRA_UNIT_CENTS), true);
      });
      var basicSyr = basicSyrups();
      $$("[data-group='syrup'] .hopecfg__choice").forEach(function (b) {
        var id = b.dataset.id;
        if (state.syrups.indexOf(id) === -1) { setChipPrice(b, "", false); return; }
        if (isPremium("syrup", id)) { setChipPrice(b, "+" + formatMoney(PREMIUM_CENTS), true); return; }
        var idx = basicSyr.indexOf(id);
        if (idx < FREE_SYRUPS) setChipPrice(b, "Incluido", false);
        else setChipPrice(b, "+" + formatMoney(EXTRA_UNIT_CENTS), true);
      });
    }

    // ---- Aviso de costo adicional (regla UX) ----
    function renderWarning() {
      var warn = $("#topping-warning");
      if (warn) warn.hidden = !hasPaidExtras();
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
        var conCosto = paidBasicToppingCount() + premiumToppings().length;
        countEl.textContent = conCosto > 0 ? n + " (" + conCosto + " con costo)" : n + "/" + FREE_TOPPINGS;
      }

      // Desglose de extras bajo el total.
      var breakEl = $("#extras-breakdown");
      if (breakEl) {
        var parts = [];
        if (basicExtrasCents() > 0) parts.push(formatMoney(basicExtrasCents()) + " en extras");
        if (premiumExtrasCents() > 0) parts.push(formatMoney(premiumExtrasCents()) + " en premium");
        breakEl.textContent = parts.length ? "Incluye " + parts.join(" + ") : "";
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
      var basicTopR = basicToppings();
      $$("[data-group='topping'] .hopecfg__choice").forEach(function (b) {
        var id = b.dataset.id;
        var active = state.toppings.indexOf(id) !== -1;
        b.classList.toggle("is-active", active);
        var costs = active && (isPremium("topping", id) || basicTopR.indexOf(id) >= FREE_TOPPINGS);
        b.classList.toggle("is-extra-cost", costs);
      });
      var basicSyrR = basicSyrups();
      $$("[data-group='syrup'] .hopecfg__choice").forEach(function (b) {
        var id = b.dataset.id;
        var active = state.syrups.indexOf(id) !== -1;
        b.classList.toggle("is-active", active);
        var costs = active && (isPremium("syrup", id) || basicSyrR.indexOf(id) >= FREE_SYRUPS);
        b.classList.toggle("is-extra-cost", costs);
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
        state.syrups = [];
        state.lastKey = null;
        render();
      });
    }

    // ---- Wizard móvil (paso a paso) ----
    // Solo cambia `data-step`; el mostrar/ocultar por paso lo hace el CSS dentro
    // del media query móvil (en desktop este estado es inerte).
    function setStep(i) {
      var step = Math.max(0, Math.min(STEP_LABELS.length - 1, i));
      root.dataset.step = String(step);
      var bar = $("[data-step-indicator]");
      if (bar) {
        bar.hidden = false;
        var nameEl = bar.querySelector("[data-step-name]");
        bar.firstChild.textContent = "Paso " + (step + 1) + " de " + STEP_LABELS.length + " · ";
        if (nameEl) nameEl.textContent = STEP_LABELS[step];
      }
      var scroller = $(".hopecfg__config-scroll");
      if (scroller) scroller.scrollTop = 0;
    }
    function currentStep() { return parseInt(root.dataset.step || "0", 10) || 0; }
    var stepNextBtn = $("[data-step-next]");
    if (stepNextBtn) stepNextBtn.addEventListener("click", function () { setStep(currentStep() + 1); });
    var stepPrevBtn = $("[data-step-prev]");
    if (stepPrevBtn) stepPrevBtn.addEventListener("click", function () { setStep(currentStep() - 1); });

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

    function buildMainProperties() {
      var props = {};
      var bTop = basicToppings();
      var inclT = bTop.slice(0, FREE_TOPPINGS).map(function (id) { return readLabel("topping", id); });
      var addT = bTop.slice(FREE_TOPPINGS).map(function (id) { return readLabel("topping", id); });
      var premT = premiumToppings().map(function (id) { return readLabel("topping", id); });
      if (inclT.length) props["Toppings incluidos"] = inclT.join(", ");
      if (addT.length) props["Toppings adicionales"] = addT.join(", ") + " (+" + formatMoney(addT.length * EXTRA_UNIT_CENTS) + ")";
      if (premT.length) props["Toppings premium"] = premT.join(", ") + " (+" + formatMoney(premT.length * PREMIUM_CENTS) + ")";

      var bSyr = basicSyrups();
      var inclS = bSyr.slice(0, FREE_SYRUPS).map(function (id) { return readLabel("syrup", id); });
      var addS = bSyr.slice(FREE_SYRUPS).map(function (id) { return readLabel("syrup", id); });
      var premS = premiumSyrups().map(function (id) { return readLabel("syrup", id); });
      if (inclS.length) props["Sirope incluido"] = inclS.join(", ");
      if (addS.length) props["Siropes adicionales"] = addS.join(", ") + " (+" + formatMoney(addS.length * EXTRA_UNIT_CENTS) + ")";
      if (premS.length) props["Siropes premium"] = premS.join(", ") + " (+" + formatMoney(premS.length * PREMIUM_CENTS) + ")";
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

        var product = PRODUCTS.helado || null;

        // Línea del helado (básicos ya bakeados en la variante). Si hay premium,
        // se añade una 2ª línea add-on ("Extras personalizados", qty = nº premium
        // @ PREMIUM_CENTS), vinculada por `_hope_ext` (cleanup/badge en
        // toppings-customizer.js). Si no hay premium, 1 sola línea nativa.
        var mainProps = buildMainProperties();
        var pCount = premiumCount();
        var items;
        if (pCount > 0 && EXTRAS_VARIANT_ID) {
          var groupId = "hope-" + Date.now() + "-" + Math.floor(Math.random() * 1e6);
          mainProps["_hope_ext"] = groupId;
          items = [
            { id: variant.id, quantity: 1, properties: mainProps },
            {
              id: EXTRAS_VARIANT_ID,
              quantity: pCount,
              properties: { "Para": (product && product.title) || "Helado Hope", "_hope_ext": groupId },
            },
          ];
        } else {
          items = [{ id: variant.id, quantity: 1, properties: mainProps }];
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

    // ---- Indicador de scroll (móvil): mostrar ~4 opciones y avisar "desliza para ver más" ----
    function setupScrollIndicators() {
      var groups = [
        { box: $("#topping-options"), scroller: root.querySelector("#topping-options .topping-grid") },
        { box: $("#syrup-options"), scroller: root.querySelector("#syrup-options > .hopecfg__chips") }
      ];
      groups.forEach(function (g) {
        if (!g.box || !g.scroller) return;
        function update() {
          var sc = g.scroller;
          var scrollable = sc.scrollHeight - sc.clientHeight > 4;
          g.box.classList.toggle("hope2__scrollmore", scrollable);
          var atBottom = sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 4;
          g.box.classList.toggle("is-scroll-bottom", atBottom);
        }
        g.scroller.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        update();
      });
    }

    // ---- Arranque ----
    var cupEl = $("#product-preview");
    if (cupEl) {
      var stageEl = cupEl.closest(".hopecfg__stage");
      function revealCup() {
        cupEl.classList.add("is-loaded");
        if (stageEl) stageEl.classList.remove("is-loading");
      }
      cupEl.addEventListener("load", revealCup);
      cupEl.addEventListener("error", revealCup);
      if (!cupEl.getAttribute("src")) {
        if (stageEl) stageEl.classList.add("is-loading");
        cupEl.src = catalogUrl(BASE_ASSET);
      }
      // Si ya estaba en caché y cargó antes de enganchar el evento.
      if (cupEl.complete && cupEl.naturalWidth > 0) revealCup();
    }
    render();
    setupScrollIndicators();
    setStep(0);
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
