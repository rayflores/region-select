// Overlay entry — small vanilla JS module built via wp-scripts so it shares Tailwind/PostCSS output
import "./styles/region-select.scss";

(function () {
  "use strict";

  var data = window.regionOverlayData || {};
  var cookieName = data.cookieName || "selectedRegion";
  var cookieDays = parseInt(data.cookieDays, 10) || 30;
  var homeUrl = data.homeUrl || "/";

  function readCookie(name) {
    var match = document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)");
    return match ? match.pop() : "";
  }

  function setCookie(name, value, days) {
    var maxAge = days * 24 * 60 * 60;
    var cookie =
      name +
      "=" +
      encodeURIComponent(value) +
      "; path=/; max-age=" +
      maxAge +
      "; samesite=lax";
    if (location.protocol === "https:") cookie += "; Secure";
    document.cookie = cookie;
  }

  if (readCookie(cookieName)) return; // already selected

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function makeBtn(label, regionCode, params) {
    var btn = el("button", "rs-btn");
    btn.type = "button";
    btn.textContent = label;
    btn.addEventListener("click", function () {
      setCookie(cookieName, regionCode, cookieDays);

      // Prefer explicit mapping from PHP if available (for exact destination domains/paths).
      var href =
        data && data.destinations && data.destinations[regionCode]
          ? data.destinations[regionCode]
          : null;

      if (!href) {
        // Fallback behavior: homeUrl + lang param if provided.
        href = homeUrl;
        if (params && params.lang) {
          href =
            href +
            (href.indexOf("?") === -1 ? "?" : "&") +
            "lang=" +
            encodeURIComponent(params.lang);
        }
      }

      window.location.href = href;
    });
    return btn;
  }

  function showOverlay() {
    var overlay = el("div", "rs-overlay");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");

    var card = el("div", "rs-card");

    // Top/title
    var top = el("div", "rs-top");
    var inner = el("div", "rs-inner");

    var titleWrap = el("div", "rs-title-wrap");
    var titleIcon = el("div", "rs-icon");
    titleWrap.appendChild(titleIcon);
    var title = el("h2", "rs-title", "Select Region/Language");
    titleWrap.appendChild(title);
    inner.appendChild(titleWrap);

    // Grid with two columns: Americas and Europe
    var grid = el("div", "rs-grid");

    var colAmericas = el("div", "rs-col rs-americas");
    var amerHeader = el("div", "rs-col-header", "Americas");
    colAmericas.appendChild(amerHeader);
    var amerBtn = makeBtn("English", "na", { lang: "na" });
    amerBtn.className = "rs-btn rs-region-btn rs-america-btn";
    colAmericas.appendChild(amerBtn);

    var colEurope = el("div", "rs-col rs-europe");
    var euHeader = el("div", "rs-col-header", "Europe");
    colEurope.appendChild(euHeader);

    var regions = [
      { id: "uk", label: "English" },
      { id: "fr", label: "French / Français" },
      { id: "de", label: "German / Deutsch" },
      { id: "it", label: "Italian / Italiano" },
      { id: "es", label: "Spanish / Español" },
    ];

    regions.forEach(function (r) {
      var b = makeBtn(r.label, r.id, { lang: r.id });
      b.className = "rs-btn rs-region-btn";
      colEurope.appendChild(b);
    });

    grid.appendChild(colAmericas);
    grid.appendChild(colEurope);
    inner.appendChild(grid);

    var hint = el("p", "rs-hint", "All other regions, select Americas.");
    inner.appendChild(hint);

    top.appendChild(inner);
    card.appendChild(top);

    // Bottom contact blocks
    var bottom = el("div", "rs-bottom");
    var contactInner = el("div", "rs-contact-inner");

    var left = el("div", "rs-contact rs-contact-left");
    var leftTitle = el("div", "rs-contact-title", "Global Headquarters");
    var leftBody = el("div", "rs-contact-body");
    leftBody.innerHTML =
      "BARTON International<br/>6 Warren Street<br/>Glens Falls, NY 12801 USA<br/>+1-800-741-7756<br/>+1-518-798-5462";
    left.appendChild(leftTitle);
    left.appendChild(leftBody);

    var divider = el("div", "rs-divider");

    var right = el("div", "rs-contact rs-contact-right");
    var rightTitle = el("div", "rs-contact-title", "European Headquarters");
    var rightBody = el("div", "rs-contact-body");
    rightBody.innerHTML =
      "BARTON International<br/>Lindenstrasse 39<br/>61250 Usingen<br/>Wernborn, Germany<br/>+49 6081 4468343";
    right.appendChild(rightTitle);
    right.appendChild(rightBody);

    contactInner.appendChild(left);
    contactInner.appendChild(divider);
    contactInner.appendChild(right);
    bottom.appendChild(contactInner);
    card.appendChild(bottom);

    // Close control (small X)
    var close = el("button", "rs-close");
    close.type = "button";
    close.setAttribute("aria-label", "Close region selector");
    close.textContent = "×";
    close.addEventListener("click", function () {
      setCookie(cookieName, "dismissed", 1);
      overlay.parentNode && overlay.parentNode.removeChild(overlay);
    });
    card.appendChild(close);

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        setCookie(cookieName, "dismissed", 1);
        overlay.parentNode && overlay.parentNode.removeChild(overlay);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", showOverlay);
  } else {
    showOverlay();
  }
})();

