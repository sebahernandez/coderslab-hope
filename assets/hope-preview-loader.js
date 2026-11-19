/**
 * hope-preview-loader.js — Carga de la vista previa de los armadores Hope
 *
 * Contrato:
 *   var ctl = window.HopePreview.create(stageEl, imgEl, { timeoutMs, errorText });
 *   ctl.show(url);     // pide una imagen; la anterior sigue visible hasta que llegue la nueva
 *   ctl.getState();    // "idle" | "loading" | "loaded" | "error"
 *
 * Clases: is-loading / is-error en el ESCENARIO, is-loaded en la IMAGEN.
 * aria-busy="true" en el escenario solo mientras carga. El mensaje de error
 * vive en .hopecfg__stage-status (role="status"), dueño único del anuncio.
 *
 * Lo usan: toppings-customizer.js (v1), hope-customizer-v2.js,
 * milkshake-customizer.js y barquillo-customizer.js. Se carga global desde
 * theme.liquid, antes de toppings-customizer.js. Sin dependencias.
 */
(function () {
  "use strict";

  // Tiempo límite único de carga (ms) antes de tratar la imagen como fallida.
  var DEFAULT_TIMEOUT_MS = 15000;
  var DEFAULT_ERROR_TEXT = "Imagen no disponible en este momento";

  function create(stage, img, options) {
    options = options || {};
    var timeoutMs = options.timeoutMs || DEFAULT_TIMEOUT_MS;

    // Elemento de estado: se reutiliza el que renderiza el snippet o se crea.
    var statusEl = stage.querySelector(".hopecfg__stage-status");
    if (!statusEl) {
      statusEl = document.createElement("p");
      statusEl.className = "hopecfg__stage-status";
      statusEl.setAttribute("role", "status");
      statusEl.setAttribute("aria-live", "polite");
      statusEl.hidden = true;
      stage.appendChild(statusEl);
    }
    var errorText = options.errorText ||
      statusEl.getAttribute("data-error-text") ||
      DEFAULT_ERROR_TEXT;

    var state = "idle";
    var token = 0;
    var pending = null; // Image en vuelo
    var pendingUrl = null; // URL que se está cargando
    var timer = null;
    var shownUrl = null; // URL que el <img> muestra tras una carga correcta

    function cancelPending() {
      if (timer) { clearTimeout(timer); timer = null; }
      if (pending) {
        pending.onload = null;
        pending.onerror = null;
        pending = null;
      }
      pendingUrl = null;
    }

    function setLoading() {
      state = "loading";
      stage.classList.add("is-loading");
      stage.classList.remove("is-error");
      stage.setAttribute("aria-busy", "true");
      statusEl.textContent = "";
      statusEl.hidden = true;
    }

    function setLoaded() {
      state = "loaded";
      img.classList.add("is-loaded");
      stage.classList.remove("is-loading");
      stage.classList.remove("is-error");
      stage.removeAttribute("aria-busy");
    }

    function setError() {
      state = "error";
      stage.classList.remove("is-loading");
      stage.classList.add("is-error");
      stage.removeAttribute("aria-busy");
      statusEl.textContent = errorText;
      statusEl.hidden = false;
    }

    function show(url) {
      // Misma imagen ya en camino: no se reinicia la carga ni su tiempo límite
      // (los armadores llaman a show() en cada render).
      if (url && state === "loading" && url === pendingUrl) return;

      var mine = ++token;
      var wasError = state === "error";
      cancelPending();

      if (!url) { setError(); return; }
      // La imagen pedida es la que ya está a la vista (p. ej. se volvió a la opción
      // anterior antes de que cargara la nueva). Tras un error siempre se reintenta.
      if (!wasError && url === shownUrl && img.getAttribute("src") === url) {
        setLoaded();
        return;
      }

      setLoading();
      pendingUrl = url;

      // Mismo pedido que hará el <img> real (sin crossOrigin) para reutilizar caché.
      var probe = new Image();
      pending = probe;
      probe.onload = function () {
        if (mine !== token) return;
        cancelPending();
        if (img.getAttribute("src") !== url) img.src = url;
        shownUrl = url;
        setLoaded();
      };
      probe.onerror = function () {
        if (mine !== token) return;
        cancelPending();
        setError();
      };
      timer = setTimeout(function () {
        if (mine !== token) return;
        cancelPending();
        setError();
      }, timeoutMs);
      probe.src = url;
    }

    return {
      show: show,
      getState: function () { return state; }
    };
  }

  window.HopePreview = { create: create };
})();
