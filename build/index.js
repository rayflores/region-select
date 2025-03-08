/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs":
/*!*****************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/createLucideIcon.mjs ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createLucideIcon$1),
/* harmony export */   toKebabCase: () => (/* binding */ toKebabCase)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _defaultAttributes_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./defaultAttributes.mjs */ "./node_modules/lucide-react/dist/esm/defaultAttributes.mjs");
/**
 * lucide-react v0.0.1 - ISC
 */




const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const createLucideIcon = (iconName, iconNode) => {
  const Component = (0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(
    ({ color = "currentColor", size = 24, strokeWidth = 2, absoluteStrokeWidth, children, ...rest }, ref) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(
      "svg",
      {
        ref,
        ..._defaultAttributes_mjs__WEBPACK_IMPORTED_MODULE_1__["default"],
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: `lucide lucide-${toKebabCase(iconName)}`,
        ...rest
      },
      [
        ...iconNode.map(([tag, attrs]) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(tag, attrs)),
        ...(Array.isArray(children) ? children : [children]) || []
      ]
    )
  );
  Component.displayName = `${iconName}`;
  return Component;
};
var createLucideIcon$1 = createLucideIcon;


//# sourceMappingURL=createLucideIcon.mjs.map


/***/ }),

/***/ "./node_modules/lucide-react/dist/esm/defaultAttributes.mjs":
/*!******************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/defaultAttributes.mjs ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ defaultAttributes)
/* harmony export */ });
/**
 * lucide-react v0.0.1 - ISC
 */

var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};


//# sourceMappingURL=defaultAttributes.mjs.map


/***/ }),

/***/ "./node_modules/lucide-react/dist/esm/icons/globe.mjs":
/*!************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/globe.mjs ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Globe)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.mjs */ "./node_modules/lucide-react/dist/esm/createLucideIcon.mjs");
/**
 * lucide-react v0.0.1 - ISC
 */



const Globe = (0,_createLucideIcon_mjs__WEBPACK_IMPORTED_MODULE_0__["default"])("Globe", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "2", x2: "22", y1: "12", y2: "12", key: "1dnqot" }],
  [
    "path",
    {
      d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
      key: "nb9nel"
    }
  ]
]);


//# sourceMappingURL=globe.mjs.map


/***/ }),

/***/ "./node_modules/react-dom/client.js":
/*!******************************************!*\
  !*** ./node_modules/react-dom/client.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



var m = __webpack_require__(/*! react-dom */ "react-dom");
if (false) {} else {
  var i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  exports.createRoot = function(c, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.createRoot(c, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
  exports.hydrateRoot = function(c, h, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.hydrateRoot(c, h, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
}


/***/ }),

/***/ "./src/styles/region-select.scss":
/*!***************************************!*\
  !*** ./src/styles/region-select.scss ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "react-dom":
/*!***************************!*\
  !*** external "ReactDOM" ***!
  \***************************/
/***/ ((module) => {

module.exports = window["ReactDOM"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_dom_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react-dom/client */ "./node_modules/react-dom/client.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/globe.mjs");
/* harmony import */ var _styles_region_select_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./styles/region-select.scss */ "./src/styles/region-select.scss");





const RegionSelect = () => {
  //   console.log("RegionSelect");
  const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [showDiv, setShowDiv] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    // check url for region query param
    const urlParams = new URLSearchParams(window.location.search);
    const region = urlParams.get("region-select");
    if (region) {
      console.log("region", region);
      setShowDiv(true);
    } else {
      setShowDiv(false);
    }
  });
  const regions = [{
    id: "uk",
    name: "United Kingdom",
    languages: ["English"]
  }, {
    id: "fr",
    name: "France",
    languages: ["French"]
  }, {
    id: "de",
    name: "Germany",
    languages: ["German"]
  }, {
    id: "it",
    name: "Italy",
    languages: ["Italian"]
  }, {
    id: "es",
    name: "Spain",
    languages: ["Spanish"]
  }];
  const handleRegionSelect = async regionId => {
    setLoading(true);
    try {
      const response = await fetch(`${wpData.restUrl}region-select/v1/set-region`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": wpData.nonce
        },
        body: JSON.stringify({
          region: regionId
        })
      });
      if (response.ok) {
        if (regionId === "na") {
          // Redirect to home page after setting cookie
          window.location.href = wpData.homeUrl;
        } else if (regionId === "uk") {
          window.location.href = "https://www.bartongarnet.com/?lang=en";
        } else {
          // Redirect to home page after setting cookie
          window.location.href = "https://staging2.bartongarnet.com/?lang=" + regionId;
        }
      }
    } catch (error) {
      console.error("Error setting region:", error);
    }
    setLoading(false);
  };
  if (!showDiv) {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      className: "hidden"
    });
  }
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "top"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "flex items-center justify-center "
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "p-4"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "p-8"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "flex items-center justify-center gap-2 mb-6"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(lucide_react__WEBPACK_IMPORTED_MODULE_3__["default"], {
    className: "h-6 w-6 text-gray-500"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", {
    className: "text-xxl font-semibold text-gray-500 m-0"
  }, "Select Region/Language"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "grid sm:grid-cols-1 md:grid-cols-2 gap-4"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "grid grid-cols-1 gap-4 md:border-r-2 md:border-gray-600"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    key: "na",
    variant: "outline",
    className: "h-auto pe-5 flex flex-col gap-2 text-end"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "font-semibold"
  }, "Americas"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "h-auto pe-0 p-2 flex flex-col gap-2 lang-select text-end",
    onClick: () => handleRegionSelect("na")
  }, "English"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "grid grid-cols-1 gap-4 border-t-2 border-gray-600 md:border-none"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "h-auto ps-5 flex flex-col gap-2 text-start"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "font-semibold"
  }, "Europe"), regions.map(region => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    key: region.id,
    variant: "outline",
    className: "h-auto ps-0 p-2 flex flex-col gap-2 lang-select text-start"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "text-sm",
    onClick: () => handleRegionSelect(region.id)
  }, region.languages.join(", "))))))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "grid grid-cols-1 gap-4"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", {
    className: "text-sm text-gray-500 p-4 m-4 text-center"
  }, "All other regions, select Americas."))))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "bottom bg-gray-900 bg-opacity-75"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "flex items-center justify-center "
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "p-4"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "grid grid-cols-3 gap-4"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "grid grid-cols-1 gap-4 text-end text-white"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "font-semibold"
  }, "Global Headquarters"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "text-sm text-white"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "BARTON International", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), "6 Warren Street", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), "Glens Falls, NY 12801 USA", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), "+1-800-741-7756", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), "+1-518-798-5462"))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "grid grid-cols-1 gap-4 m-auto h-full"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    class: "inline-block h-full min-h-[1em] w-0.5 self-stretch bg-neutral-100 dark:bg-white/10"
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "grid grid-cols-1 gap-4 text-start text-white"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "font-semibold"
  }, "European Headquarters"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "text-sm text-white"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "BARTON International", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), "Lindenstrasse 39", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), "61250 Usingen", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), "Wernborn, Germany", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("br", null), "+49 6081 4468343"))))))));
};

// Initialize the React app
const container = document.getElementById("region-select-root");
if (container) {
  const root = (0,react_dom_client__WEBPACK_IMPORTED_MODULE_1__.createRoot)(container);
  root.render((0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(RegionSelect, null));
}
})();

/******/ })()
;
//# sourceMappingURL=index.js.map