(function () {
  "use strict";

  function qs(selector, ctx) {
    return (ctx || document).querySelector(selector);
  }
  function qsa(selector, ctx) {
    return Array.prototype.slice.call(
      (ctx || document).querySelectorAll(selector)
    );
  }

  function reindexCountries() {
    var countries = qsa(".rs-country-block");
    countries.forEach(function (countryEl, ci) {
      countryEl.setAttribute("data-country-index", ci);
      // country inputs
      var codeInput = countryEl.querySelector('input[name$="[code]"]');
      var labelInput = countryEl.querySelector('input[name$="[label]"]');
      if (codeInput)
        codeInput.name = "region_select_destinations[" + ci + "][code]";
      if (labelInput)
        labelInput.name = "region_select_destinations[" + ci + "][label]";

      // destinations
      var destContainer = countryEl.querySelector(".rs-destinations");
      if (!destContainer) return;
      var destRows = qsa(".rs-destination-row", destContainer);
      destRows.forEach(function (row, di) {
        var inputs = row.querySelectorAll("input");
        if (inputs[0])
          inputs[0].name =
            "region_select_destinations[" +
            ci +
            "][destinations][" +
            di +
            "][code]";
        if (inputs[1])
          inputs[1].name =
            "region_select_destinations[" +
            ci +
            "][destinations][" +
            di +
            "][label]";
        if (inputs[2])
          inputs[2].name =
            "region_select_destinations[" +
            ci +
            "][destinations][" +
            di +
            "][url]";
      });
    });
  }

  function createDestinationRow(code, label, url) {
    var row = document.createElement("div");
    row.className = "rs-destination-row";
    row.draggable = true;
    row.innerHTML =
      "" +
      '<input type="text" value="' +
      (code || "") +
      '" placeholder="code" style="width:100px;margin-right:8px;" />' +
      '<input type="text" value="' +
      (label || "") +
      '" placeholder="Label (shown in overlay)" style="width:260px;margin-right:8px;" />' +
      '<input type="url" value="' +
      (url || "") +
      '" placeholder="https://example.com" style="width:240px;margin-right:8px;" />' +
      '<button type="button" class="button rs-destination-remove">Remove</button>';
    return row;
  }

  function createCountryBlock(code, label, destinations) {
    var block = document.createElement("div");
    block.className = "rs-country-block";
    block.draggable = true;
    block.setAttribute("data-country-index", "0");

    var header = document.createElement("div");
    header.style.cssText =
      "display:flex;gap:8px;align-items:center;margin-bottom:6px;";
    header.innerHTML =
      '<span class="rs-drag-handle" style="cursor:move;padding:6px;border:1px solid #ccc;background:#fafafa;">≡</span>';

    var countryCode = document.createElement("input");
    countryCode.type = "text";
    countryCode.placeholder = "country code (optional)";
    countryCode.style.cssText = "width:160px;margin-right:8px;";
    countryCode.value = code || "";

    var countryLabel = document.createElement("input");
    countryLabel.type = "text";
    countryLabel.placeholder = "Country label (shown as tab)";
    countryLabel.style.cssText = "width:320px;margin-right:8px;";
    countryLabel.value = label || "";

    var removeCountry = document.createElement("button");
    removeCountry.type = "button";
    removeCountry.className = "button rs-country-remove";
    removeCountry.textContent = "Remove Country";

    header.appendChild(countryCode);
    header.appendChild(countryLabel);
    header.appendChild(removeCountry);

    var destContainer = document.createElement("div");
    destContainer.className = "rs-destinations";
    destContainer.setAttribute("data-country-index", "0");

    (destinations || []).forEach(function (d) {
      var row = createDestinationRow(d.code, d.label, d.url);
      destContainer.appendChild(row);
    });

    var addDestWrap = document.createElement("p");
    var addDest = document.createElement("button");
    addDest.type = "button";
    addDest.className = "button rs-add-destination";
    addDest.textContent = "Add destination";
    addDestWrap.appendChild(addDest);

    block.appendChild(header);
    block.appendChild(destContainer);
    block.appendChild(addDestWrap);
    return block;
  }

  function init() {
    var container = qs("#rs-countries");
    if (!container) return;

    // Add country button
    var addCountry = qs("#rs-add-country");
    addCountry.addEventListener("click", function (e) {
      e.preventDefault();
      var block = createCountryBlock("", "", []);
      container.appendChild(block);
      reindexCountries();
    });

    // Delegate clicks for add destination and removes
    container.addEventListener("click", function (e) {
      if (e.target.classList.contains("rs-add-destination")) {
        var countryEl = e.target.closest(".rs-country-block");
        if (!countryEl) return;
        var destContainer = countryEl.querySelector(".rs-destinations");
        var row = createDestinationRow("", "", "");
        destContainer.appendChild(row);
        reindexCountries();
        return;
      }
      if (e.target.classList.contains("rs-destination-remove")) {
        var row = e.target.closest(".rs-destination-row");
        if (row) {
          row.parentNode.removeChild(row);
          reindexCountries();
        }
        return;
      }
      if (e.target.classList.contains("rs-country-remove")) {
        var country = e.target.closest(".rs-country-block");
        if (country) {
          country.parentNode.removeChild(country);
          reindexCountries();
        }
        return;
      }
    });

    // Drag and drop for countries and destinations (basic)
    var dragSrc = null;
    container.addEventListener("dragstart", function (e) {
      var el = e.target.closest(".rs-country-block, .rs-destination-row");
      if (!el) return;
      dragSrc = el;
      e.dataTransfer.effectAllowed = "move";
      try {
        e.dataTransfer.setData("text/plain", "dragging");
      } catch (ex) {}
    });
    container.addEventListener("dragover", function (e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    });
    container.addEventListener("drop", function (e) {
      e.preventDefault();
      var target = e.target.closest(".rs-country-block, .rs-destination-row");
      if (!dragSrc || !target || dragSrc === target) return;

      // If dragging a country block, only allow dropping on country blocks
      if (
        dragSrc.classList.contains("rs-country-block") &&
        target.classList.contains("rs-country-block")
      ) {
        var parent = container;
        parent.insertBefore(
          dragSrc,
          dragSrc.compareDocumentPosition(target) &
            Node.DOCUMENT_POSITION_FOLLOWING
            ? target.nextSibling
            : target
        );
      }

      // If dragging a destination row, only allow dropping inside destination containers
      if (dragSrc.classList.contains("rs-destination-row")) {
        var destTarget = target.classList.contains("rs-destination-row")
          ? target.parentNode
          : target.classList.contains("rs-destinations")
          ? target
          : null;
        if (destTarget && destTarget.classList.contains("rs-destinations")) {
          destTarget.insertBefore(
            dragSrc,
            dragSrc.compareDocumentPosition(target) &
              Node.DOCUMENT_POSITION_FOLLOWING
              ? target.nextSibling
              : target
          );
        }
      }

      reindexCountries();
      dragSrc = null;
    });

    // On form submit, reindex and validate
    var form = container.closest("form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      reindexCountries();
      // Validate codes & urls, and uniqueness across all destinations
      var destInputs = qsa(".rs-destination-row", container);
      var seen = {};
      for (var i = 0; i < destInputs.length; i++) {
        var inputs = destInputs[i].querySelectorAll("input");
        var code = (inputs[0] && inputs[0].value.trim()) || "";
        var url = (inputs[2] && inputs[2].value.trim()) || "";
        if (!code) {
          alert(
            "Please provide a region code for all destination rows. Example: na, uk, fr"
          );
          e.preventDefault();
          return false;
        }
        code = code.toLowerCase();
        if (!/^[a-z0-9_-]{1,20}$/.test(code)) {
          alert(
            "Region codes may only contain letters, numbers, underscore and dash (max 20 chars)."
          );
          e.preventDefault();
          return false;
        }
        if (!url) {
          alert("Please provide a destination URL for region: " + code);
          e.preventDefault();
          return false;
        }
        if (seen[code]) {
          alert("Duplicate region code: " + code);
          e.preventDefault();
          return false;
        }
        seen[code] = true;
      }
      return true;
    });

    // Initial reindex to ensure names are correct
    reindexCountries();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
