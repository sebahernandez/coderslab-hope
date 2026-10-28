/**
 * barquillo-customizer.js — Configurador del Barquillo ("Crea tu Barquillo")
 *
 * Clon mínimo de hope-customizer-v2.js (misma vista previa con burbuja, aviso de
 * disponibilidad y pipeline de carrito), sin tamaño ni toppings.
 *
 * Reglas de negocio:
 *  - El cliente elige 1 sirope (selección única). Estándar incluido; premium (★) +$1.00.
 *  - Precio 100% nativo por variante de la opción "Extras premium":
 *    option1 "0" ($1.50, estándar o sin elegir) / "1" ($2.50, premium).
 *  - Se agrega UNA sola línea al carrito con la property "Sirope".
 *
 * Es idempotente y solo actúa sobre raíces [data-hopecfg-barq] (así el JS global
 * toppings-customizer.js, que inicializa sobre [data-hopecfg], no la captura).
 */

(function () {
  "use strict";

  // Posición (en % del escenario) donde cae la burbuja del sirope sobre el cono.
  var BUBBLE_ANCHOR = { top: 32, left: 50 };
  var PREMIUM_EXTRA_CENTS = 100; // diferencia visible del sirope premium (+$1.00)

  function initConfigurator(root) {
    if (root.dataset.hopecfgBarqInit === "true") return;
    root.dataset.hopecfgBarqInit = "true";

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

    var MONEY_FORMAT = root.dataset.moneyFormat || "${{amount}}";
    var BASE_IMAGE = root.dataset.baseImage || "";

    var deliveryAvailability = { status: "loading", request: null, dismissed: false };
    var addingToCart = false;
    var availabilityDialog = $(".hope2__availability-modal");
    var toastTimer = null;
    var flyTimer = null;
    var cartAbort = null;
    // Cancela listeners de documento/ventana al desmontar o reconectar.
    var lifecycle = new AbortController();

    // ---- Diálogo de disponibilidad (copiado de hope-customizer-v2.js) ----
    if (availabilityDialog) {
      var acceptAvailability = availabilityDialog.querySelector("[data-availability-accept]");
      if (acceptAvailability) {
        acceptAvailability.addEventListener("click", function () { availabilityDialog.close(); });
      }
      availabilityDialog.addEventListener("click", function (event) {
        if (event.target !== availabilityDialog) return;
        var bounds = availabilityDialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom) {
          availabilityDialog.close();
        }
      });
      availabilityDialog.addEventListener("close", function () {
        if (deliveryAvailability.status === "blocked") deliveryAvailability.dismissed = true;
      });
    }

    function syncDeliveryAvailability() {
      if (deliveryAvailability.request) return deliveryAvailability.request;

      var notice = $(".hope2__delivery-notice span");
      var endpoint = root.dataset.deliveryAvailabilityUrl;
      var shopDomain = root.dataset.shopDomain;
      var url;

      try {
        if (!endpoint || !shopDomain) throw new Error("Falta la configuración de disponibilidad");
        url = new URL(endpoint, window.location.origin);
        url.searchParams.set("shopDomain", shopDomain);
      } catch (error) {
        deliveryAvailability.status = "error";
        if (notice) notice.textContent = "No pudimos verificar la disponibilidad. Intenta más tarde.";
        updatePrice();
        return Promise.resolve();
      }

      deliveryAvailability.request = fetch(url.toString(), { cache: "no-store", credentials: "omit" })
        .then(function (response) {
          if (!response.ok) throw new Error("Disponibilidad: " + response.status);
          return response.json();
        })
        .then(function (result) {
          if (typeof result.shippingEnabled !== "boolean" || typeof result.pickupEnabled !== "boolean") {
            throw new Error("Respuesta de disponibilidad inválida");
          }

          var shipping = result.shippingEnabled;
          var pickup = result.pickupEnabled;
          var blocked = !shipping && !pickup;
          deliveryAvailability.status = blocked ? "blocked" : "available";

          if (notice) {
            notice.textContent = shipping && pickup
              ? "Disponible para delivery y compra presencial"
              : shipping
                ? "Disponible solo para delivery"
                : pickup
                  ? "Disponible solo para compra presencial"
                  : "Delivery y compra presencial no disponibles";
          }

          root.classList.toggle("is-delivery-unavailable", blocked);
          if (blocked) {
            if (availabilityDialog && !availabilityDialog.open && !deliveryAvailability.dismissed) {
              availabilityDialog.showModal();
            }
          } else {
            if (availabilityDialog && availabilityDialog.open) availabilityDialog.close();
            deliveryAvailability.dismissed = false;
          }
          updatePrice();
        })
        .catch(function (error) {
          if (deliveryAvailability.status === "loading") deliveryAvailability.status = "error";
          if (notice) notice.textContent = "No pudimos verificar la disponibilidad. Reintentaremos pronto.";
          updatePrice();
          console.error("hope-delivery-availability", error);
        })
        .then(function () { deliveryAvailability.request = null; });

      return deliveryAvailability.request;
    }

    // ---- Formato de dinero (copiado de hope-customizer-v2.js) ----
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
      syrup: null, // id del sirope elegido o null
      hasInteracted: false,
    };

    // ---- Lectura de datos de los chips ----
    function chipFor(id) {
      var chips = $$("[data-group='syrup'] [data-id]");
      for (var i = 0; i < chips.length; i++) {
        if (chips[i].dataset.id === id) return chips[i];
      }
      return null;
    }
    function readLabel(id) { var el = chipFor(id); return el ? (el.dataset.label || id) : id; }
    function readEmoji(id) { var el = chipFor(id); return el ? (el.dataset.emoji || "") : ""; }
    function readImage(id) { var el = chipFor(id); return el ? (el.dataset.image || "") : ""; }
    function isPremium(id) { var el = chipFor(id); return !!(el && el.dataset.premium === "true"); }

    // ---- Variante nativa (opción "Extras premium": "0" estándar / "1" premium) ----
    function variantForState() {
      var p = PRODUCTS.barquillo;
      if (!p || !p.variants) return null;
      var target = state.syrup && isPremium(state.syrup) ? "1" : "0";
      for (var i = 0; i < p.variants.length; i++) {
        if (String(p.variants[i].option1) === target) return p.variants[i];
      }
      return null;
    }

    function isValidSelection() { return !!state.syrup; }

    function escapeHtml(str) {
      return String(str).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    }

    // ---- Burbuja flotante del sirope sobre el cono ----
    function renderBubbles() {
      var layer = $("#hope-bubbles");
      if (!layer) return;
      if (!state.syrup) { layer.innerHTML = ""; return; }
      var label = escapeHtml(readLabel(state.syrup));
      var emoji = readEmoji(state.syrup);
      var img = readImage(state.syrup);
      var inner = img
        ? '<img class="hope2__bubble-img" src="' + escapeHtml(img) + '" alt="' + label + '" loading="lazy">'
        : '<span class="hope2__bubble-emoji">' + escapeHtml(emoji) + "</span>";
      layer.innerHTML =
        '<span class="hope2__bubble is-last"' +
        ' style="top:' + BUBBLE_ANCHOR.top + "%;left:" + BUBBLE_ANCHOR.left + '%"' +
        ' title="' + label + '">' +
        inner +
        '<span class="hope2__bubble-badge">+1</span>' +
        "</span>";
    }

    // ---- Mini-stack bajo la vista previa ----
    function renderStack() {
      var stack = $("#hope-stack");
      var label = $("#hope-extras-label");
      if (stack) {
        if (!state.syrup) {
          stack.innerHTML = "";
        } else {
          var lbl = escapeHtml(readLabel(state.syrup));
          var img = readImage(state.syrup);
          stack.innerHTML = img
            ? '<span title="' + lbl + '"><img src="' + escapeHtml(img) + '" alt="' + lbl + '"></span>'
            : '<span title="' + lbl + '">' + escapeHtml(readEmoji(state.syrup)) + "</span>";
        }
      }
      if (label) label.textContent = state.syrup ? readLabel(state.syrup) : "Aún sin sirope";
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
      $$("[data-group='syrup'] .hopecfg__choice").forEach(function (b) {
        var id = b.dataset.id;
        if (state.syrup !== id) { setChipPrice(b, "", false); return; }
        if (isPremium(id)) setChipPrice(b, "+" + formatMoney(PREMIUM_EXTRA_CENTS), true);
        else setChipPrice(b, "Incluido", false);
      });
    }

    // ---- Precio y gating del botón ----
    function updatePrice() {
      var priceEl = $("#price");
      var variant = variantForState();
      if (priceEl) priceEl.textContent = variant ? formatMoney(variant.price) : "—";

      var countEl = $("[data-syrup-count]");
      if (countEl) countEl.textContent = (state.syrup ? 1 : 0) + "/1";

      var breakEl = $("#extras-breakdown");
      if (breakEl) {
        breakEl.textContent = state.syrup && isPremium(state.syrup)
          ? "Incluye " + formatMoney(PREMIUM_EXTRA_CENTS) + " en sirope premium"
          : "";
      }

      var buyBtn = $("#buy");
      var hintEl = $("#buy-hint");
      var buyLabel = $("[data-buy-label]");
      if (buyBtn) {
        var valid = isValidSelection();
        var ok = valid && !!variant && !addingToCart;
        buyBtn.disabled = !ok;
        buyBtn.classList.toggle("is-disabled", !ok);
        if (buyLabel) {
          if (!buyLabel.dataset.defaultText) buyLabel.dataset.defaultText = buyLabel.textContent;
          buyLabel.textContent = valid ? buyLabel.dataset.defaultText : "Elige 1 sirope";
        }
        if (hintEl) {
          hintEl.textContent = valid
            ? (variant ? "" : "Combinación no disponible")
            : (state.hasInteracted ? "Falta: elige 1 sirope" : "");
        }
      }
    }

    // ---- Render general ----
    function render() {
      $$("[data-group='syrup'] .hopecfg__choice").forEach(function (b) {
        var active = state.syrup === b.dataset.id;
        b.classList.toggle("is-active", active);
        b.setAttribute("aria-pressed", String(active));
        b.classList.toggle("is-extra-cost", active && isPremium(b.dataset.id));
      });
      renderChipPrices();
      renderBubbles();
      renderStack();
      updatePrice();
    }

    // ---- Eventos de selección: único sirope, el activo se deselecciona ----
    var optionsRoot = $("#hope-options");
    if (optionsRoot) {
      optionsRoot.addEventListener("click", function (e) {
        var b = e.target.closest("button[data-id]");
        if (!b || !optionsRoot.contains(b)) return;
        state.syrup = state.syrup === b.dataset.id ? null : b.dataset.id;
        state.hasInteracted = true;
        render();
      });
    }

    var resetBtn = $("#reset-view");
    if (resetBtn) {
      resetBtn.addEventListener("click", function () {
        state.syrup = null;
        state.hasInteracted = false;
        render();
      });
    }

    // ---- Carrito real (pipeline copiado de hope-customizer-v2.js) ----
    var buyBtn = $("#buy");

    function showToast(msg, isError) {
      var toast = $("#toast");
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.toggle("is-error", !!isError);
      toast.classList.add("is-visible");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { toast.classList.remove("is-visible"); }, 2200);
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
        else { fly.style.opacity = "0"; flyTimer = setTimeout(function () { fly.remove(); }, 200); }
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
        if (addingToCart) return;
        if (!isValidSelection()) { showToast("Falta: elige 1 sirope", true); return; }
        var variant = variantForState();
        if (!variant) { showToast("Este producto aún no está vinculado. Configúralo en el tema.", true); return; }
        if (variant.available === false) { showToast("Sin stock para esta opción.", true); return; }

        var product = PRODUCTS.barquillo || null;

        // UNA sola línea nativa: el premium ya va bakeado en la variante ("Extras premium" = 1).
        var label = readLabel(state.syrup) + (isPremium(state.syrup) ? " ★" : "");
        var items = [{ id: variant.id, quantity: 1, properties: { "Sirope": label } }];

        var routes = (window.Theme && window.Theme.routes) || {};
        var addUrl = routes.cart_add_url || "/cart/add.js";
        var payload = { items: items };
        var sectionIds = cartSectionIds();
        if (sectionIds.length) {
          payload.sections = sectionIds.join(",");
          payload.sections_url = window.location.pathname;
        }

        addingToCart = true;
        buyBtn.disabled = true;
        flyToCart();

        if (cartAbort) cartAbort.abort();
        cartAbort = new AbortController();

        fetch(addUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
          signal: cartAbort.signal,
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
                sourceId: root.id || "hopecfg-barquillo",
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
          .catch(function (error) {
            if (error && error.name === "AbortError") return;
            showToast("No se pudo añadir al carrito. Inténtalo de nuevo.", true);
          })
          .then(function () {
            addingToCart = false;
            updatePrice();
          });
      });
    }

    // ---- Arranque: imagen base del cono ----
    var cupEl = $("#product-preview");
    if (cupEl) {
      var stageEl = cupEl.closest(".hopecfg__stage");
      var revealCup = function () {
        cupEl.classList.add("is-loaded");
        if (stageEl) stageEl.classList.remove("is-loading");
      };
      cupEl.addEventListener("load", revealCup);
      cupEl.addEventListener("error", revealCup);
      if (!cupEl.getAttribute("src") && BASE_IMAGE) {
        if (stageEl) stageEl.classList.add("is-loading");
        cupEl.src = BASE_IMAGE;
      }
      // Si ya estaba en caché y cargó antes de enganchar el evento.
      if (cupEl.complete && cupEl.naturalWidth > 0) revealCup();
    }
    render();
    syncDeliveryAvailability();

    // ---- Refresco periódico de disponibilidad y limpieza ----
    function cleanup() {
      clearInterval(availabilityInterval);
      clearTimeout(toastTimer);
      clearTimeout(flyTimer);
      if (cartAbort) cartAbort.abort();
      lifecycle.abort();
    }

    function refreshAvailabilityIfVisible() {
      if (!root.isConnected) { cleanup(); return; }
      if (!document.hidden) syncDeliveryAvailability();
    }

    function onSectionUnload(event) {
      if (!event.target || !event.target.contains(root)) return;
      if (availabilityDialog && availabilityDialog.open) availabilityDialog.close();
      cleanup();
    }

    var availabilityInterval = window.setInterval(refreshAvailabilityIfVisible, 60000);
    document.addEventListener("visibilitychange", refreshAvailabilityIfVisible, { signal: lifecycle.signal });
    window.addEventListener("focus", refreshAvailabilityIfVisible, { signal: lifecycle.signal });
    document.addEventListener("shopify:section:unload", onSectionUnload, { signal: lifecycle.signal });
  }

  function initAll() {
    Array.prototype.slice.call(document.querySelectorAll("[data-hopecfg-barq]")).forEach(initConfigurator);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
  document.addEventListener("shopify:section:load", initAll);
})();
