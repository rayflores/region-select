// Overlay entry — small vanilla JS module built via wp-scripts so it shares Tailwind/PostCSS output
import "./styles/region-select.scss";
// Ensure overlay-specific rules are included in the bundle. `overlay.scss`
// contains `.rs-overlay` and related selectors and must be imported so the
// compiled `build/overlay.css` contains those rules.
import "./overlay.scss";

(function () {
  "use strict";

  var data = window.regionOverlayData || {};
  var cookieName = data.cookieName || "selectedRegion";
  var cookieDays = parseInt(data.cookieDays, 10) || 30;
  var homeUrl = data.homeUrl || "/";
  // Allow overriding logo via localized data; fallback to provided Barton URL
  var logoUrl =
    (data && data.logoUrl) ||
    "https://www.barton.com/wp-content/uploads/2021/02/BartonLogo_500.png";
  var logoAlt = (data && data.logoAlt) || "Barton";

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
    // Use a solid white fullscreen overlay so the overlay covers page content
    // with a white background (helps match the site's modal/panel look).
    // If you prefer a dim backdrop instead, use `bg-black/60` or another value.
    var overlay = el(
      "div",
      "rs-overlay fixed inset-0 bg-white flex items-center justify-center"
    );
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");

    var card = el("div", "rs-card bg-white w-full h-full overflow-auto");

    // Top/title
    var top = el("div", "rs-top w-full");
    var inner = el("div", "rs-inner mx-auto w-full");

    // Site-like header (logo + spacing) — keep markup minimal to reproduce look
    var header = el("header", "fusion-header-wrapper rs-fusion-header");
    header.innerHTML =
      '<div class="fusion-header-v3">' +
      '  <div class="fusion-row p-8 md:p-12">' +
      '    <div class="fusion-logo" style="padding:10px 0;">' +
      '      <a class="fusion-logo-link" href="' +
      homeUrl +
      '">' +
      '        <img src="' +
      logoUrl +
      '" alt="' +
      logoAlt +
      '" class="fusion-standard-logo" style="max-height:45px;" />' +
      "      </a>" +
      "    </div>" +
      "  </div>" +
      "</div>";
    inner.appendChild(header);

    // Build the selectable region items dynamically from localized `data.countries`.
    var countries = (data && data.countries) || [];

    // Header + title area
    var titleWrap = el("div", "p-4");
    titleWrap.innerHTML =
      '<div class="p-4"><div class="flex items-center justify-center gap-2 mb-6"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-gray-500" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="2" x2="22" y1="12" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg><h2 class="text-xxl font-semibold text-gray-500 m-0 fusion-responsive-typography-calculated" data-fontsize="24" style="--fontSize: 24; line-height: 1.17; --minFontSize: 24;" data-lineheight="28.08px">Select Region/Language</h2></div></div>';
    inner.appendChild(titleWrap);

    // Grid container removed — countries are rendered as tabs with their own layouts.

    // Render countries into two columns (left/right). Keep two columns on mobile as requested.
    // Left column text is right-aligned; right column text is left-aligned.
    var mid = Math.ceil(countries.length / 2);
    var leftCountries = countries.slice(0, mid);
    var rightCountries = countries.slice(mid);

    var container = el(
      "div",
      "rs-countries-two-col flex flex-row items-start justify-center w-full p-4"
    );
    // enforce 20px gap
    container.style.gap = "20px";

    var leftCol = el("div", "rs-left-col flex-1");
    leftCol.style.textAlign = "right";

    var dividerEl = el("div", "rs-col-divider");
    dividerEl.style.width = "1px";
    dividerEl.style.background = "#444";
    dividerEl.style.opacity = "0.25";
    dividerEl.style.margin = "0 10px";
    dividerEl.style.alignSelf = "stretch";

    var rightCol = el("div", "rs-right-col flex-1");
    rightCol.style.textAlign = "left";

    function renderCountryInto(parent, country, alignRight) {
      var wrapper = el("div", "rs-country p-2");
      var heading = el(
        "h3",
        "text-lg font-semibold mb-4",
        country.label || country.code || "Country"
      );
      if (alignRight) heading.style.textAlign = "right";
      wrapper.appendChild(heading);

      var dests = Array.isArray(country.destinations)
        ? country.destinations
        : [];
      dests.forEach(function (r) {
        var label = r.label || r.code;
        var item = el(
          "div",
          "h-auto p-2 mb-2 lang-select cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:font-semibold hover:shadow-md rounded-lg relative",
          ""
        );
        item.setAttribute("data-region", r.code || "");
        item.style.setProperty("--hover-color", "#c20430");
        item.style.textAlign = alignRight ? "right" : "left";
        var innerLabel = el("div", "flex items-center gap-2", label);
        innerLabel.style.justifyContent = alignRight
          ? "flex-end"
          : "flex-start";
        item.appendChild(innerLabel);
        wrapper.appendChild(item);
      });
      parent.appendChild(wrapper);
    }

    leftCountries.forEach(function (c) {
      renderCountryInto(leftCol, c, true);
    });
    rightCountries.forEach(function (c) {
      renderCountryInto(rightCol, c, false);
    });

    container.appendChild(leftCol);
    container.appendChild(dividerEl);
    container.appendChild(rightCol);
    inner.appendChild(container);

    // (previous two-column grid removed — content is in `contentWrap`).

    // Informational hint
    var hint = el("div", "grid grid-cols-1 gap-4");
    hint.innerHTML =
      '<p class="text-black p-4 m-4 text-center">All other regions, select Americas.</p>';
    inner.appendChild(hint);

    // Bind click handlers to generated region items and tabs
    inner.querySelectorAll(".lang-select[data-region]").forEach(function (elm) {
      elm.addEventListener("click", function () {
        var regionCode = elm.getAttribute("data-region");
        setCookie(cookieName, regionCode, cookieDays);
        // Find matching region across countries
        var target = null;
        for (var ci = 0; ci < countries.length; ci++) {
          var ds = countries[ci].destinations || [];
          for (var j = 0; j < ds.length; j++) {
            if (ds[j].code === regionCode) {
              target = ds[j];
              break;
            }
          }
          if (target) break;
        }
        var href = target && target.url ? target.url : null;
        if (!href) {
          href = homeUrl;
          if (regionCode)
            href =
              href +
              (href.indexOf("?") === -1 ? "?" : "&") +
              "lang=" +
              encodeURIComponent(regionCode);
        }
        window.location.href = href;
      });
    });

    // No tabs UI anymore — countries render as columns with headings.

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
    // Append footer block (full width) below the hint area.
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
    // Append the fixed-position close control to the overlay wrapper rather
    // than the internal card. The visual position is fixed via CSS so this
    // keeps the close control at the top-level overlay for clearer semantics.
    overlay.appendChild(close);

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
