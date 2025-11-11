// Overlay entry — small vanilla JS module built via wp-scripts so it shares Tailwind/PostCSS output
import "./styles/region-select.scss";

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
    var overlay = el(
      "div",
      "rs-overlay fixed inset-0 bg-black/60 flex items-center justify-center"
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

    // Insert the same markup and classes used by the React `index.js` so
    // the overlay uses the exact same styling. Each selectable region has
    // a `lang-select` element with a `data-region` attribute we can bind to.
    var contentHTML = `
      <div id="region-select-root" class="block">
        <div class="top">
          <div class="flex items-center justify-center ">
            <div class="p-4">
              <div class="p-4">
                <div class="flex items-center justify-center gap-2 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-gray-500" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="2" x2="22" y1="12" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                  <h2 class="text-xxl font-semibold text-gray-500 m-0 fusion-responsive-typography-calculated" data-fontsize="24" style="--fontSize: 24; line-height: 1.17; --minFontSize: 24;" data-lineheight="28.08px">Select Region/Language</h2>
                </div>
              </div>
              <div class="grid sm:grid-cols-1 md:grid-cols-2 gap-0 justify-center md:justify-end">
                <div class="grid grid-cols-1 gap-4 md:border-r-2 md:border-gray-600">
                  <div class="h-auto pe-0 md:pe-5 flex flex-col gap-2 pe-4 md:text-end">
                    <div class="font-semibold">Americas</div>
                    <div class="h-auto pe-0 p-2 flex flex-col gap-2 lang-select text-center md:text-end cursor-pointer transition-all duration-200 md:hover:bg-gray-100 md:hover:font-semibold md:hover:shadow-md md:hover:rounded-lg md:hover:scale-105 relative" data-region="na" style="--hover-color: #c20430;"><div class="flex items-center justify-center md:justify-end gap-2">English</div></div>
                  </div>
                </div>
                <div class="grid grid-cols-1 gap-4 border-t-2 border-gray-600 md:border-none">
                  <div class="h-auto ps-0 md:ps-5 flex flex-col gap-2 ps-4 md:text-start">
                    <div class="font-semibold">Europe</div>
                    <div class="h-auto md:ps-0 p-2 flex flex-col gap-2 lang-select text-center md:text-start cursor-pointer transition-all duration-200 md:hover:bg-gray-100 md:hover:font-semibold md:hover:shadow-md md:hover:rounded-lg md:hover:scale-105 relative" data-region="uk" style="--hover-color: #c20430; color: rgb(194, 4, 48);"><div class="flex items-center justify-center md:justify-start gap-2">English</div></div>
                    <div class="h-auto md:ps-0 p-2 flex flex-col gap-2 lang-select text-center md:text-start cursor-pointer transition-all duration-200 md:hover:bg-gray-100 md:hover:font-semibold md:hover:shadow-md md:hover:rounded-lg md:hover:scale-105 relative" data-region="fr" style="--hover-color: #c20430;"><div class="flex items-center justify-center md:justify-start gap-2">French / Français</div></div>
                    <div class="h-auto md:ps-0 p-2 flex flex-col gap-2 lang-select text-center md:text-start cursor-pointer transition-all duration-200 md:hover:bg-gray-100 md:hover:font-semibold md:hover:shadow-md md:hover:rounded-lg md:hover:scale-105 relative" data-region="de" style="--hover-color: #c20430;"><div class="flex items-center justify-center md:justify-start gap-2">German / Deutsch</div></div>
                    <div class="h-auto md:ps-0 p-2 flex flex-col gap-2 lang-select text-center md:text-start cursor-pointer transition-all duration-200 md:hover:bg-gray-100 md:hover:font-semibold md:hover:shadow-md md:hover:rounded-lg md:hover:scale-105 relative" data-region="it" style="--hover-color: #c20430;"><div class="flex items-center justify-center md:justify-start gap-2">Italian / Italiano</div></div>
                    <div class="h-auto md:ps-0 p-2 flex flex-col gap-2 lang-select text-center md:text-start cursor-pointer transition-all duration-200 md:hover:bg-gray-100 md:hover:font-semibold md:hover:shadow-md md:hover:rounded-lg md:hover:scale-105 relative" data-region="es" style="--hover-color: #c20430;"><div class="flex items-center justify-center md:justify-start gap-2">Spanish / Español</div></div>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-1 gap-4"><p class="text-black p-4 m-4 text-center">All other regions, select Americas.</p></div>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom bg-gray-900 bg-opacity-75">
        <div class="flex items-center justify-center ">
          <div class="p-4">
            <div class="grid grid-cols-3 gap-4">
              <div class="grid grid-cols-1 gap-4 text-end text-white">
                <div class="font-semibold">Global Headquarters</div>
                <div class="text-sm text-white"><p>BARTON International<br/>6 Warren Street<br/>Glens Falls, NY 12801 USA<br/>+1-800-741-7756<br/>+1-518-798-5462</p></div>
              </div>
              <div class="grid grid-cols-1 gap-4 m-auto h-full"><div class="inline-block h-full min-h-[1em] w-0.5 self-stretch bg-neutral-100 dark:bg-white/10"></div></div>
              <div class="grid grid-cols-1 gap-4 text-start text-white">
                <div class="font-semibold">European Headquarters</div>
                <div class="text-sm text-white"><p>BARTON International<br/>Lindenstrasse 39<br/>61250 Usingen<br/>Wernborn, Germany<br/>+49 6081 4468343</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    inner.insertAdjacentHTML("beforeend", contentHTML);

    // Bind click handlers to region items generated above; use data-region attribute
    var selects = inner.querySelectorAll(".lang-select[data-region]");
    selects.forEach(function (elm) {
      elm.addEventListener("click", function () {
        var regionCode = elm.getAttribute("data-region");
        setCookie(cookieName, regionCode, cookieDays);
        var href =
          data && data.destinations && data.destinations[regionCode]
            ? data.destinations[regionCode]
            : null;
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
    // card.appendChild(bottom);

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

