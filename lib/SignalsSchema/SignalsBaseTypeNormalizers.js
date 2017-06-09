'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @nolint
 */
module.exports =
/******/function (modules) {
  // webpackBootstrap
  /******/ // The module cache
  /******/var installedModules = {};
  /******/
  /******/ // The require function
  /******/function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/if (installedModules[moduleId])
      /******/return installedModules[moduleId].exports;
    /******/
    /******/ // Create a new module (and put it into the cache)
    /******/var module = installedModules[moduleId] = {
      /******/i: moduleId,
      /******/l: false,
      /******/exports: {}
      /******/ };
    /******/
    /******/ // Execute the module function
    /******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    /******/
    /******/ // Flag the module as loaded
    /******/module.l = true;
    /******/
    /******/ // Return the exports of the module
    /******/return module.exports;
    /******/
  }
  /******/
  /******/
  /******/ // expose the modules object (__webpack_modules__)
  /******/__webpack_require__.m = modules;
  /******/
  /******/ // expose the module cache
  /******/__webpack_require__.c = installedModules;
  /******/
  /******/ // identity function for calling harmony imports with the correct context
  /******/__webpack_require__.i = function (value) {
    return value;
  };
  /******/
  /******/ // define getter function for harmony exports
  /******/__webpack_require__.d = function (exports, name, getter) {
    /******/if (!__webpack_require__.o(exports, name)) {
      /******/Object.defineProperty(exports, name, {
        /******/configurable: false,
        /******/enumerable: true,
        /******/get: getter
        /******/ });
      /******/
    }
    /******/
  };
  /******/
  /******/ // getDefaultExport function for compatibility with non-harmony modules
  /******/__webpack_require__.n = function (module) {
    /******/var getter = module && module.__esModule ?
    /******/function getDefault() {
      return module['default'];
    } :
    /******/function getModuleExports() {
      return module;
    };
    /******/__webpack_require__.d(getter, 'a', getter);
    /******/return getter;
    /******/
  };
  /******/
  /******/ // Object.prototype.hasOwnProperty.call
  /******/__webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };
  /******/
  /******/ // __webpack_public_path__
  /******/__webpack_require__.p = "";
  /******/
  /******/ // Load entry module and return exports
  /******/return __webpack_require__(__webpack_require__.s = 27);
  /******/
}(
/************************************************************************/
/******/[
/* 0 */
/***/function (module, exports, __webpack_require__) {

  "use strict";
  /* WEBPACK VAR INJECTION */
  (function (global) {
    /**
    * Copyright (c) 2004-present, Facebook, Inc.
    * All rights reserved.
    *
    * This source code is licensed under the BSD-style license found in the
    * LICENSE file in the root directory of this source tree. An additional grant
    * of patent rights can be found in the PATENTS file in the same directory.
    *
    * @providesModule SignalsValidationUtils
    * @emails oncall+ads_signals_offline
    *
    * @typechecks
    *
    */

    var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
      return typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
    } : function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
    };

    var STRIP_MODES = __webpack_require__(1);

    var SHA_256_REGEX = /^[a-f0-9]{64}$/i;
    var TRIM_REGEX = /^\s+|\s+$/g;

    var STRIP_WHITESPACE_REGEX = /\s+/g;
    // Punctuation characters: !"#$%&'()*+,-./:;<=>?@ [\]^_`{|}~
    var STRIP_WHITESPACE_AND_PUNCTUATION_REGEX = /[!"#\$%&'\(\)\*\+,\-\.\/:;<=>\?@ \[\\\]\^_`\{\|\}~\s]+/g;
    var STRIP_NON_LATIN_ALPHA_NUMERIC_REGEX = /\W+/g;

    /**
     * Type-tolerating trimmer. Also, removes not just space-whitespace.
     */
    function trim(obj) {
      return typeof obj === 'string' ? obj.replace(TRIM_REGEX, '') : '';
    }

    /**
     * Type-tolerating strip.
     */
    function strip(obj) {
      var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : STRIP_MODES.WHITESPACE_ONLY;

      var result = '';
      if (typeof obj === 'string') {
        switch (mode) {
          case STRIP_MODES.WHITESPACE_ONLY:
            result = obj.replace(STRIP_WHITESPACE_REGEX, '');
            break;
          case STRIP_MODES.WHITESPACE_AND_PUNCTUATION:
            result = obj.replace(STRIP_WHITESPACE_AND_PUNCTUATION_REGEX, '');
            break;
          case STRIP_MODES.ALL_NON_LATIN_ALPHA_NUMERIC:
            result = obj.replace(STRIP_NON_LATIN_ALPHA_NUMERIC_REGEX, '');
            break;
        }
      }
      return result;
    }

    function hasProp(obj, key) {
      return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && Object.prototype.hasOwnProperty.call(obj, key);
    }

    /**
     * Adds a value to head at path if value is not null or undefined.
     * If value already existed at path, turn it into array and concat.
     */
    function addValueAtPath(head, path, value) {
      var stack = path.split('.');

      if (value === undefined) {
        value = null;
      }

      for (var i = 0; i < stack.length - 1; i++) {
        var parentKey = stack.shift();
        head = head[parentKey] || (head[parentKey] = {});
      }
      var leafKey = stack[0];

      if (!hasProp(head, leafKey)) {
        head[leafKey] = value;
      } else {
        var currentValue = head[leafKey];

        if (Array.isArray(currentValue)) {
          currentValue.push(value);
        } else {
          head[leafKey] = [currentValue, value];
        }
      }

      return head;
    }

    function looksLikeHashed(input) {
      return typeof input === 'string' && SHA_256_REGEX.test(input);
    }

    function isFile(source) {
      return global.File && source instanceof File || source instanceof Object;
    }

    function throwFatalError(message) {
      var detail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      throw new Error('Fatal: ' + message + ', detail=' + JSON.stringify(detail));
    }

    module.exports = {
      addValueAtPath: addValueAtPath,
      hasProp: hasProp,
      isFile: isFile,
      looksLikeHashed: looksLikeHashed,
      strip: strip,
      throwFatalError: throwFatalError,
      trim: trim,
      STRIP_MODES: STRIP_MODES
    };
    /* WEBPACK VAR INJECTION */
  }).call(exports, __webpack_require__(2));

  /***/
},
/* 1 */
/***/function (module, exports, __webpack_require__) {

  "use strict";

  /**
   * Generated by:
   *   scripts/static_resources/mock_staticjsmodules.php SignalsStringStripModes
   * @nolint
   *
   * @generated SignedSource<<2877232c9576a649011bdbad11126f03>>
   */

  module.exports = {
    "WHITESPACE_ONLY": "whitespace_only",
    "WHITESPACE_AND_PUNCTUATION": "whitespace_and_punctuation",
    "ALL_NON_LATIN_ALPHA_NUMERIC": "all_non_latin_alpha_numeric"
  };

  /***/
},
/* 2 */
/***/function (module, exports) {

  var g;

  // This works in non-strict mode
  g = function () {
    return this;
  }();

  try {
    // This works if eval is allowed (see CSP)
    g = g || Function("return this")() || (1, eval)("this");
  } catch (e) {
    // This works if the window reference is available
    if ((typeof window === 'undefined' ? 'undefined' : _typeof2(window)) === "object") g = window;
  }

  // g can still be undefined, but nothing to do about it...
  // We return undefined, instead of nothing here, so it's
  // easier to handle this case. if(!global) { ...}

  module.exports = g;

  /***/
},
/* 3 */
/***/function (module, exports, __webpack_require__) {

  "use strict";
  /**
   * Copyright (c) 2004-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule normalizeSignalsNumberType
   * @emails oncall+ads_signals_offline
   *
   * @typechecks
   *
   */

  var _require = __webpack_require__(0),
      looksLikeHashed = _require.looksLikeHashed,
      trim = _require.trim;

  function normalize(input) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var result = null;

    if (input != null && typeof input === 'string' || typeof input === 'number') {
      if (looksLikeHashed(input) && !params.rejectHashed) {
        result = input;
      } else {

        if (typeof input === 'string') {
          input = trim(input);
        }

        var maybeNum = parseFloat(input);

        // This is for preventing too flexible conversion, eg:
        // converting "12.xy" to 12.
        // $FlowFixMe
        if (!isNaN(input - maybeNum)) {
          if (params.round) {
            maybeNum = Math.round(maybeNum);
          }

          var valid = true;

          if (params.integer && Math.floor(maybeNum) !== maybeNum) {
            valid = false;
          }

          if (valid && params.min != null && maybeNum < params.min) {
            valid = false;
          }

          if (valid && params.max != null && maybeNum > params.max) {
            valid = false;
          }

          if (valid && params.lessThan != null && maybeNum >= params.lessThan) {
            valid = false;
          }

          if (valid && params.moreThan != null && maybeNum <= params.moreThan) {
            valid = false;
          }

          if (valid) {
            result = maybeNum;
          }
        }
      }
    }

    return { normalizedValue: result };
  }

  module.exports = normalize;

  /***/
},
/* 4 */
/***/function (module, exports, __webpack_require__) {

  "use strict";
  /**
   * Copyright (c) 2004-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule normalizeSignalsDateType
   * @emails oncall+ads_signals_offline
   *
   * @typechecks
   *
   */

  var SignalDateFormats = __webpack_require__(9);
  var SignalDateMonthFormats = __webpack_require__(29);
  var SignalsValidationUtils = __webpack_require__(0);

  var normalizeSignalsEnumType = __webpack_require__(5);

  var looksLikeHashed = SignalsValidationUtils.looksLikeHashed,
      trim = SignalsValidationUtils.trim;

  var ONLY_DIGITS_CHECKER = /^[0-9]*$/;
  var ONLY_DIGITS_NORMALIZER = /[^0-9]/g;
  var ONLY_LETTERS_NORMALIZER = /[^a-zA-Z]/g;
  var EXACTLY_4_DIGITS_CHECKER = /^[0-9]{4,4}$/;

  // Expects date in the format 'YYYYMMDD'
  function validateDate(dateStr) {
    var y = parseInt(dateStr.slice(0, 4), 10);
    var m = parseInt(dateStr.slice(4, 6), 10) - 1;
    var d = parseInt(dateStr.slice(6, 8), 10);
    var date = new Date(y, m, d);
    return date.getFullYear() === y && date.getMonth() === m && date.getDate() === d;
  }

  function validateDateFormat(dateStr) {
    var dateFormat = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : SignalDateFormats[0];

    switch (dateFormat) {
      case 'DD/MM/YYYY':
      case 'MM/DD/YYYY':
        return (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)
        );
      case 'DD-MM-YYYY':
      case 'MM-DD-YYYY':
        return (/^\d{1,2}-\d{1,2}-\d{4}$/.test(dateStr)
        );
      case 'YYYY/MM/DD':
        return (/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(dateStr)
        );
      case 'YYYY-MM-DD':
        return (/^\d{4}-\d{1,2}-\d{1,2}$/.test(dateStr)
        );
      case 'DD/MM/YY':
      case 'MM/DD/YY':
        return (/^\d{1,2}\/\d{1,2}\/\d{2}$/.test(dateStr)
        );
      case 'DD-MM-YY':
      case 'MM-DD-YY':
        return (/^\d{1,2}-\d{1,2}-\d{2}$/.test(dateStr)
        );
      case 'YY/MM/DD':
        return (/^\d{2}\/\d{1,2}\/\d{1,2}$/.test(dateStr)
        );
      case 'YY-MM-DD':
        return (/^\d{2}-\d{1,2}-\d{1,2}$/.test(dateStr)
        );
      case 'YY-MM':
      case 'MM-YY':
        return (/^\d{2}-\d{2}$/.test(dateStr)
        );
      case 'YYYY-MM':
        return (/^\d{4}-\d{2}$/.test(dateStr)
        );
      case 'MM-YYYY':
        return (/^\d{2}-\d{4}$/.test(dateStr)
        );
      case 'YY/MM':
      case 'MM/YY':
        return (/^\d{2}\/\d{2}$/.test(dateStr)
        );
      case 'MM/YYYY':
        return (/^\d{2}\/\d{4}$/.test(dateStr)
        );
      case 'YYYY/MM':
        return (/^\d{4}\/\d{2}$/.test(dateStr)
        );
      case 'MMYY':
      case 'YYMM':
        return dateStr.length === 4 && ONLY_DIGITS_CHECKER.test(dateStr);
      case 'YYYYMM':
      case 'MMYYYY':
        return dateStr.length === 6 && ONLY_DIGITS_CHECKER.test(dateStr);
      case 'DDMMYYYY':
      case 'MMDDYYYY':
      case 'YYYYMMDD':
        return dateStr.length === 8 && ONLY_DIGITS_CHECKER.test(dateStr);
      case 'DDMMYY':
      case 'MMDDYY':
      case 'YYMMDD':
      default:
        return dateStr.length === 6 && ONLY_DIGITS_CHECKER.test(dateStr);
    }
  }

  // Pad the year if only 2 digits are specified (e.g. DDMMYY) as follows:
  //  - If YY <= (current_year % 100) then prepend '20'
  //  - Otherwise prepend '19'
  function padYear(dateStr, dateFormat) {
    var currYear = new Date().getFullYear() % 100;
    switch (dateFormat) {
      case 'DD-MM-YY':
      case 'MM-DD-YY':
      case 'DD/MM/YY':
      case 'MM/DD/YY':
      case 'DDMMYY':
      case 'MMDDYY':
      case 'MM-YY':
      case 'MM/YY':
      case 'MMYY':
        return dateStr.slice(0, -2) + (parseInt(dateStr.slice(-2), 10) <= currYear ? '20' : '19') + dateStr.slice(-2);
      case 'YY-MM-DD':
      case 'YY/MM/DD':
      case 'YYMMDD':
      case 'YY-MM':
      case 'YY/MM':
      case 'YYMM':
        return (parseInt(dateStr.substr(0, 2), 10) <= currYear ? '20' : '19') + dateStr;
      default:
        return dateStr;
    }
  }

  // Pad DD and MM with leading 0s if format contains a delimiter
  function padDate(dateStr, dateFormat) {
    var delim = null;
    switch (dateFormat) {
      case 'DD-MM-YYYY':
      case 'MM-DD-YYYY':
      case 'YYYY-MM-DD':
      case 'DD-MM-YY':
      case 'MM-DD-YY':
      case 'YY-MM-DD':
        delim = '-';
        break;
      case 'DD/MM/YYYY':
      case 'MM/DD/YYYY':
      case 'YYYY/MM/DD':
      case 'DD/MM/YY':
      case 'MM/DD/YY':
      case 'YY/MM/DD':
        delim = '/';
        break;
      default:
        break;
    }
    if (delim != null) {
      var dates = dateStr.split(delim);
      var paddedDateStr = '';
      dates.forEach(function (elem) {
        paddedDateStr += elem.length === 1 ? '0' + elem : elem;
      });
      dateStr = paddedDateStr;
    }
    return padYear(dateStr, dateFormat);
  }

  function normalize(input) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var additionalInfo = arguments[2];

    var result = null;
    var dateFormat = additionalInfo;

    if (input != null && typeof input === 'string') {
      if (looksLikeHashed(input)) {
        if (!(params && params.rejectHashed)) {
          result = input;
        }
      } else {
        // Removing surrounding whitespace
        input = trim(input) || '';

        // If partial value, we consider it to be year only and extend it
        // to first day of year.
        if (EXACTLY_4_DIGITS_CHECKER.test(input) && !params.allowMonthOnly) {
          result = input + '0101';
        } else {
          dateFormat = normalizeSignalsEnumType(dateFormat, {
            uppercase: true,
            options: params.allowMonthOnly ? SignalDateMonthFormats : SignalDateFormats
          }).normalizedValue;

          result = input;

          if (dateFormat == null || !validateDateFormat(result, dateFormat)) {
            result = null;
          } else {
            result = padDate(result, dateFormat);
            dateFormat = dateFormat.replace(ONLY_LETTERS_NORMALIZER, '');
            result = result.replace(ONLY_DIGITS_NORMALIZER, '');
            switch (dateFormat) {
              case 'DDMMYYYY':
              case 'DDMMYY':
                result = result.slice(4, 8) + result.slice(2, 4) + result.slice(0, 2);
                break;
              case 'MMDDYYYY':
              case 'MMDDYY':
                result = result.slice(4, 8) + result.slice(0, 2) + result.slice(2, 4);
                break;
              case 'YYYYMM':
              case 'YYMM':
                result += '01';
                break;
              case 'MMYY':
              case 'MMYYYY':
                result = result.slice(2, 6) + result.slice(0, 2) + '01';
                break;
              case 'YYYYMMDD':
              case 'YYMMDD':
              default:
                break;
            }

            if (result !== null && !validateDate(result)) {
              result = null;
            }
          }
        }
      }
    }
    return { normalizedValue: result };
  }

  module.exports = normalize;

  /***/
},
/* 5 */
/***/function (module, exports, __webpack_require__) {

  "use strict";
  /**
   * Copyright (c) 2004-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule normalizeSignalsEnumType
   * @emails oncall+ads_signals_offline
   *
   * @typechecks
   *
   */

  var SignalsValidationUtils = __webpack_require__(0);

  var looksLikeHashed = SignalsValidationUtils.looksLikeHashed,
      trim = SignalsValidationUtils.trim;

  function normalize(input) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var result = null;

    var caseInsensitive = params.caseInsensitive,
        lowercase = params.lowercase,
        options = params.options,
        truncate = params.truncate,
        uppercase = params.uppercase;

    if (input != null && options != null && Array.isArray(options) && options.length) {
      if (typeof input === 'string' && looksLikeHashed(input)) {
        result = input;
      } else {
        var str = trim(String(input));

        if (lowercase) {
          str = str.toLowerCase();
        }

        if (uppercase) {
          str = str.toUpperCase();
        }

        if (truncate) {
          str = str.substring(0, truncate);
        }

        if (caseInsensitive) {
          var lowercasedStr = str.toLowerCase();
          for (var i = 0; i < options.length; ++i) {
            if (lowercasedStr === options[i].toLowerCase()) {
              str = options[i];
              break;
            }
          }
        }

        result = options.indexOf(str) > -1 ? str : null;
      }
    }

    return { normalizedValue: result };
  }

  module.exports = normalize;

  /***/
},,,
/* 6 */
/* 7 */
/* 8 */
/***/function (module, exports, __webpack_require__) {

  "use strict";
  /**
   * Copyright (c) 2004-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule normalizeSignalsTimestampType
   * @emails oncall+ads_signals_offline
   *
   * @typechecks
   *
   */

  var normalizeSignalsDateType = __webpack_require__(4);
  var normalizeSignalsNumberType = __webpack_require__(3);

  var ONE_HOUR_IN_MS = 1 * 60 * 60 * 1000;
  var ISO_WITH_TZ_REGEX = /[+-]\d{2}:\d{2}|Z$/;

  // This normalizer won't eat hashed input.
  function normalize(input) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var additionalInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var result = null;
    var wasImplicitTimezone = false;

    var rejectTimeBefore = params.rejectTimeBefore;
    var timeFormat = additionalInfo.timeFormat,
        timeZone = additionalInfo.timeZone,
        allowFutureTimes = additionalInfo.allowFutureTimes;

    if (input != null && (typeof input === 'string' || typeof input === 'number')) {
      if (timeFormat == null || timeFormat === 'unix_time') {
        var maybeNum = normalizeSignalsNumberType(input, {
          rejectHashed: true
        }).normalizedValue;

        if (maybeNum != null && typeof maybeNum !== 'string') {
          if (timeFormat === 'unix_time') {
            maybeNum *= 1000;
          }
          result = new Date(maybeNum).getTime();
        }
      } else if (timeFormat === 'ISO8601' && typeof input === 'string') {
        // Valid examples:
        // 2016-06-22T03:21:48+00:00
        // 2016-06-21T19:00:22Z
        // 2016-06-21T19:00:22

        result = new Date(input).getTime();

        // Should not offset with specified timezone if it was part of time string
        wasImplicitTimezone = ISO_WITH_TZ_REGEX.test(input);
      } else {
        // check if input is a date format
        var tmpResult = normalizeSignalsDateType(input, { rejectHashed: true }, timeFormat).normalizedValue;

        if (tmpResult != null) {
          // result is of format YYYYMMDD
          var y = tmpResult.slice(0, 4);
          var m = tmpResult.slice(4, 6);
          var d = tmpResult.slice(6, 8);

          result = new Date(y + '-' + m + '-' + d).getTime();
        }
      }
    }

    var now = Date.now();
    if (result != null && (isNaN(result) || allowFutureTimes !== true && result > now || rejectTimeBefore != null && result < now - rejectTimeBefore || result % 1 !== 0) // checking if int
    ) {
        result = null;
      } else if (result != null && timeZone != null &&
    // Overriding timzone only if was not part of ISO date
    !wasImplicitTimezone) {
      var timeZoneOffset = normalizeSignalsNumberType(timeZone, {
        rejectHashed: true
      }).normalizedValue;

      // If valid number, offsetting with timezone
      if (timeZoneOffset != null && typeof timeZoneOffset === 'number') {
        result -= timeZoneOffset * ONE_HOUR_IN_MS;
      }
    }

    return { normalizedValue: result };
  }

  module.exports = normalize;

  /***/
},
/* 9 */
/***/function (module, exports, __webpack_require__) {

  "use strict";
  /**
   * Copyright (c) 2004-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule SignalDateFormats
   * @emails oncall+ads_signals_offline
   *
   * @typechecks
   *
   */

  // It would have been nicer to have this defined in Hack and exported as
  // JSModule, but unfortunately the JSModule export escapes '/'s.

  module.exports = ['MM-DD-YYYY', 'MM/DD/YYYY', 'MMDDYYYY', 'DD-MM-YYYY', 'DD/MM/YYYY', 'DDMMYYYY', 'YYYY-MM-DD', 'YYYY/MM/DD', 'YYYYMMDD', 'MM-DD-YY', 'MM/DD/YY', 'MMDDYY', 'DD-MM-YY', 'DD/MM/YY', 'DDMMYY', 'YY-MM-DD', 'YY/MM/DD', 'YYMMDD'];

  /***/
},
/* 10 */
/***/function (module, exports, __webpack_require__) {

  "use strict";

  /**
   * Generated by:
   *   scripts/static_resources/mock_staticjsmodules.php SignalBaseTypes
   * @nolint
   *
   * @generated SignedSource<<6e49cae452f7adcfdf8b715383a62448>>
   */

  module.exports = {
    "CURRENCY_CODE": "currency_code",
    "DATE": "date",
    "DATE_MONTH": "date_month",
    "EMAIL": "email",
    "ENUM": "enum",
    "NUMBER": "number",
    "STRING": "string",
    "TIMESTAMP": "timestamp",
    "UNIX_TIME": "unix_time",
    "PHONE_NUMBER": "phone_number",
    "POSTAL_CODE": "postal_code",
    "ANY": "any",
    "LIST": "LIST",
    "BOOL": "bool",
    "FBID": "fbid",
    "VALUE": "value"
  };

  /***/
},,
/* 11 */
/* 12 */
/***/function (module, exports, __webpack_require__) {

  "use strict";
  /**
   * Copyright (c) 2004-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule normalizeSignalsAnyType
   * @emails oncall+ads_signals_offline
   *
   * @typechecks
   *
   */

  function normalize(input) {
    return { normalizedValue: input };
  }

  module.exports = normalize;

  /***/
},
/* 13 */
/***/function (module, exports, __webpack_require__) {

  "use strict";
  /**
   * Copyright (c) 2004-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule normalizeSignalsBoolType
   * @emails oncall+ads_signals_offline
   *
   * @typechecks
   *
   */

  var SignalsValidationUtils = __webpack_require__(0);

  var looksLikeHashed = SignalsValidationUtils.looksLikeHashed;

  function normalize(input) {
    if (input == null) {
      return { normalizedValue: null };
    }

    if (typeof input === 'boolean') {
      return { normalizedValue: input };
    }

    if (typeof input === 'string') {
      var inputLowerCase = input.toLowerCase();
      if (inputLowerCase === 'true' || inputLowerCase === 'yes' || inputLowerCase === '1') {
        return { normalizedValue: true };
      }
      if (inputLowerCase === 'false' || inputLowerCase === 'no' || inputLowerCase === '0') {
        return { normalizedValue: false };
      }
      if (looksLikeHashed(input)) {
        return { normalizedValue: input };
      }
      return { normalizedValue: null };
    }

    if (typeof input === 'number') {
      if (input === 1) {
        return { normalizedValue: true };
      }
      if (input === 0) {
        return { normalizedValue: false };
      }
      return { normalizedValue: null };
    }

    return { normalizedValue: null };
  }

  module.exports = normalize;

  /***/
},
/* 14 */
/***/function (module, exports, __webpack_require__) {

  "use strict";
  /**
   * Copyright (c) 2004-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule normalizeSignalsCurrencyCodeType
   * @emails oncall+ads_signals_offline
   *
   * @typechecks
   *
   */

  var SignalsCurrencyCodes = __webpack_require__(28);

  var normalizeSignalsEnumType = __webpack_require__(5);

  var VALID_CURRENCY_CODES = SignalsCurrencyCodes.VALID_CURRENCY_CODES;

  function normalize(input) {
    return normalizeSignalsEnumType(input, {
      uppercase: true,
      options: VALID_CURRENCY_CODES
    });
  }

  module.exports = normalize;

  /***/
},
/* 15 */
/***/function (module, exports, __webpack_require__) {

  "use strict";
  /**
   * Copyright (c) 2004-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule normalizeSignalsDateMonthType
   * @emails oncall+ads_signals_offline
   *
   * @typechecks
   *
   */

  var normalizeSignalsDateType = __webpack_require__(4);

  function normalizeSignalsDateMonthType(input) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var additionalInfo = arguments[2];

    params.allowMonthOnly = true;
    return normalizeSignalsDateType(input, params, additionalInfo);
  }

  module.exports = normalizeSignalsDateMonthType;

  /***/
},
/* 16 */
/***/function (module, exports, __webpack_require__) {

  "use strict";
  /**
   * Copyright (c) 2004-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule normalizeSignalsEmailType
   * @emails oncall+ads_signals_offline
   *
   * @typechecks
   *
   */

  var SignalsValidationUtils = __webpack_require__(0);

  var looksLikeHashed = SignalsValidationUtils.looksLikeHashed,
      trim = SignalsValidationUtils.trim;

  // good approximation of RFC 2822

  var EMAIL_RE = /^[\w!#\$%&'\*\+\/\=\?\^`\{\|\}~\-]+(:?\.[\w!#\$%&'\*\+\/\=\?\^`\{\|\}~\-]+)*@(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?$/i;

  function isEmail(email) {
    return EMAIL_RE.test(email);
  }

  function normalize(input) {
    var result = null;

    if (input != null) {
      if (looksLikeHashed(input)) {
        result = input;
      } else if (typeof input === 'string') {
        var cleanedUp = trim(input.toLowerCase());
        result = isEmail(cleanedUp) ? cleanedUp : null;
      }
    }

    return { normalizedValue: result };
  }

  module.exports = normalize;

  /***/
},
/* 17 */
/***/function (module, exports, __webpack_require__) {

  "use strict";
  /**
   * Copyright (c) 2004-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule normalizeSignalsFBIDType
   * @emails oncall+ads_signals_offline
   *
   * @typechecks
   *
   */

  var normalizeSignalsNumberType = __webpack_require__(3);

  // Excel will truncate columns of lead_ids presented as numbers; a workaround
  // is to prefix the values with l: to coerce the column type to string.
  var LEAD_ID_PREFIX = 'l:';

  function normalize(input) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var additionalInfo = arguments[2];

    var result = null;

    var rejectHashed = params.rejectHashed,
        stripPrefix = params.stripPrefix;

    var nonPrefixedInput = input;
    if (stripPrefix && typeof nonPrefixedInput === 'string' && nonPrefixedInput.slice(0, LEAD_ID_PREFIX.length) === LEAD_ID_PREFIX) {
      nonPrefixedInput = nonPrefixedInput.substring(LEAD_ID_PREFIX.length);
    }

    var maybeNum = normalizeSignalsNumberType(nonPrefixedInput, { rejectHashed: rejectHashed }).normalizedValue;

    if (typeof maybeNum === 'number' && maybeNum != null && maybeNum > 0) {
      var appIDs = additionalInfo;
      var _scoped = params && params.scoped || null;

      if (!_scoped) {
        result = maybeNum;
      }

      if (_scoped && appIDs != null && Array.isArray(appIDs) && appIDs.length) {
        appIDs = appIDs.filter(function (appID) {
          return normalizeSignalsNumberType(appID, { rejectHashed: rejectHashed }) == null;
        });

        if (appIDs.length === 0) {
          result = maybeNum;
        }
      }
    }

    return { normalizedValue: result };
  }

  module.exports = normalize;

  /***/
},
/* 18 */
/***/function (module, exports, __webpack_require__) {

  "use strict";
  /**
   * Copyright (c) 2004-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule normalizeSignalsListType
   * @emails oncall+ads_signals_offline
   *
   * @typechecks
   *
   */

  var SignalsValidationUtils = __webpack_require__(0);

  var looksLikeHashed = SignalsValidationUtils.looksLikeHashed;

  function normalize(input) {
    var result = null;

    if (Array.isArray(input)) {
      result = input;
    } else if (typeof input === 'string') {
      if (looksLikeHashed(input)) {
        result = input;
      } else {
        input = input.trim();
        if (input.length === 0) {
          result = [];
        } else {
          if (input.length >= 2 && input[0] === '[' && input[input.length - 1] === ']') {
            input = input.slice(1, input.length - 1);
          }

          result = input.split(',').map(function (segment) {
            return segment.trim();
          });
        }
      }
    }

    return { normalizedValue: result };
  }

  module.exports = normalize;

  /***/
},
/* 19 */
/***/function (module, exports, __webpack_require__) {

  "use strict";
  /**
   * Copyright (c) 2004-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule normalizeSignalsPhoneNumberType
   * @emails oncall+ads_signals_offline
   *
   * @typechecks
   *
   */

  var SignalsValidationUtils = __webpack_require__(0);

  var isInternationalPhoneNumber = __webpack_require__(32);
  var looksLikeHashed = SignalsValidationUtils.looksLikeHashed;

  var PHONE_DROP_PREFIX_ZEROS = /^0*/;
  var PHONE_IGNORE_CHAR_SET = /[\-@#<>'",; ]|\(|\)|\+|[a-z]/gi;

  function normalize(input) {
    var result = null;

    if (input != null) {
      if (looksLikeHashed(input)) {
        result = input;
      } else {
        var str = String(input);
        if (isInternationalPhoneNumber(str)) {
          result = str.replace(PHONE_IGNORE_CHAR_SET, '').replace(PHONE_DROP_PREFIX_ZEROS, '');
        }
      }
    }

    return { normalizedValue: result };
  }

  module.exports = normalize;

  /***/
},
/* 20 */
/***/function (module, exports, __webpack_require__) {

  "use strict";
  /**
   * Copyright (c) 2004-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule normalizeSignalsPostalCodeType
   * @emails oncall+ads_signals_offline
   *
   * @typechecks
   *
   */

  var SignalsValidationUtils = __webpack_require__(0);

  var looksLikeHashed = SignalsValidationUtils.looksLikeHashed,
      trim = SignalsValidationUtils.trim;

  function normalize(input) {
    var result = null;

    if (input != null && typeof input === 'string') {
      if (looksLikeHashed(input)) {
        result = input;
      } else {
        var maybeZIP = trim(String(input).toLowerCase().split('-', 1)[0]);

        if (maybeZIP.length >= 2) {
          result = maybeZIP;
        }
      }
    }

    return { normalizedValue: result };
  }

  module.exports = normalize;

  /***/
},
/* 21 */
/***/function (module, exports, __webpack_require__) {

  "use strict";
  /**
   * Copyright (c) 2004-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule normalizeSignalsStringType
   * @emails oncall+ads_signals_offline
   *
   * @typechecks
   *
   */

  var SignalsValidationUtils = __webpack_require__(0);

  var looksLikeHashed = SignalsValidationUtils.looksLikeHashed,
      strip = SignalsValidationUtils.strip;

  function normalize(input) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var result = null;

    if (input != null) {
      if (looksLikeHashed(input) && typeof input === 'string') {
        if (!params.rejectHashed) {
          result = input;
        }
      } else {
        var str = String(input);

        if (params.strip != null) {
          str = strip(str, params.strip);
        }

        if (params.lowercase) {
          str = str.toLowerCase();
        } else if (params.uppercase) {
          str = str.toUpperCase();
        }

        if (params.truncate) {
          str = str.substring(0, params.truncate);
        }

        if (params.test) {
          result = new RegExp(params.test).test(str) ? str : null;
        } else {
          result = str;
        }
      }
    }
    return { normalizedValue: result };
  }

  module.exports = normalize;

  /***/
},
/* 22 */
/***/function (module, exports, __webpack_require__) {

  "use strict";
  /**
   * Copyright (c) 2004-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule normalizeSignalsUnixTimeType
   * @emails oncall+ads_signals_offline
   *
   * @typechecks
   *
   */

  var normalizeSignalsTimestampType = __webpack_require__(8);

  // This normalizer won't eat hashed input.
  function normalize(input) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var additionalInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var result = null;

    if (input != null) {
      var newAdditionalInfo = additionalInfo;

      newAdditionalInfo.timeFormat = newAdditionalInfo.timeFormat || 'unix_time';

      var tmpResult = normalizeSignalsTimestampType(input, params, newAdditionalInfo).normalizedValue;

      if (tmpResult != null) {
        result = Math.round(tmpResult / 1000);
      }
    }

    return { normalizedValue: result };
  }

  module.exports = normalize;

  /***/
},
/* 23 */
/***/function (module, exports, __webpack_require__) {

  "use strict";
  /**
   * Copyright (c) 2004-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule normalizeSignalsValueType
   * @emails oncall+ads_signals_offline
   *
   * @typechecks
   *
   */

  var SignalsValidationUtils = __webpack_require__(0);

  var normalizeSignalsNumberType = __webpack_require__(3);

  var trim = SignalsValidationUtils.trim;

  // A set of valid currency codes and symbols according to iso4217

  var CURRENCY_CODES_AND_SYMBOLS = ['ALL', 'AFN', 'ARS', 'AWG', 'AUD', 'AZN', 'BSD', 'BBD', 'BYR', 'BZD', 'BMD', 'BOB', 'BAM', 'BWP', 'BGN', 'BRL', 'BND', 'KHR', 'CAD', 'KYD', 'CLP', 'CNY', 'COP', 'CRC', 'HRK', 'CUP', 'CZK', 'DKK', 'DOP', 'XCD', 'EGP', 'SVC', 'EEK', 'EUR', 'FKP', 'FJD', 'GHC', 'GIP', 'GTQ', 'GGP', 'GYD', 'HNL', 'HKD', 'HUF', 'ISK', 'INR', 'IDR', 'IRR', 'IMP', 'ILS', 'JMD', 'JPY', 'JEP', 'KES', 'KZT', 'KPW', 'KRW', 'KGS', 'LAK', 'LVL', 'LBP', 'LRD', 'LTL', 'MKD', 'MYR', 'MUR', 'MXN', 'MNT', 'MZN', 'NAD', 'NPR', 'ANG', 'NZD', 'NIO', 'NGN', 'NOK', 'OMR', 'PKR', 'PAB', 'PYG', 'PEN', 'PHP', 'PLN', 'QAR', 'RON', 'RUB', 'RMB', 'SHP', 'SAR', 'RSD', 'SCR', 'SGD', 'SBD', 'SOS', 'ZAR', 'LKR', 'SEK', 'CHF', 'SRD', 'SYP', 'TZS', 'TWD', 'THB', 'TTD', 'TRY', 'TRL', 'TVD', 'UGX', 'UAH', 'GBP', 'USD', 'UYU', 'UZS', 'VEF', 'VND', 'YER', 'ZWD', 'L', '\u060B', '$', '\u0192', '\u20BC', 'p.', 'BZ$', 'Bs.', 'KM', 'P', '\u043B\u0432', 'R$', '\u17DB', '\xA5', '\u20A1', 'kn', '\u20B1', 'K\u010D', 'kr', 'RD$', '\xA3', '\u20AC', '\u20B5', 'Q', 'Ft', '\u20B9', 'Rp', '\uFDFC', '\u20AA', 'J$', 'KSh', '\u20A9', '\u20AD', 'Ls', 'Lt', '\u0434\u0435\u043D', 'RM', '\u20A8', '\u20AE', 'MT', 'C$', '\u20A6', 'B/.', 'Gs', 'S/.', 'z\u0142', 'lei', '\u20BD', '\uFFE5', '\u0414\u0438\u043D.', 'S', 'R', 'TSh', 'NT$', '\u0E3F', 'TT$', '\u20BA', '\u20A4', 'USh', '\u20B4', '$U', 'Bs', '\u20AB', 'Z$'];

  function replaceCharAt(str, index, newChar) {
    if (index < 0 || index >= str.length) {
      return str;
    }
    return str.substr(0, index) + newChar + str.substr(index + 1);
  }

  function i18nNumberNormalize(maybeNumber) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var additionalInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var decimalPointChar = additionalInfo.decimalPointChar != null ? additionalInfo.decimalPointChar : '.';
    var standizedNumber = maybeNumber;
    if (decimalPointChar === ',') {
      if (maybeNumber.indexOf('.') !== -1) {
        return { normalizedValue: null };
      }
      var decimalPointIdx = maybeNumber.lastIndexOf(',');
      standizedNumber = replaceCharAt(maybeNumber, decimalPointIdx, '.');
    }
    return normalizeSignalsNumberType(standizedNumber, params);
  }

  function normalize(input) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var additionalInfo = arguments[2];

    var result = null;

    if (typeof input === 'string') {

      result = i18nNumberNormalize(input, params, additionalInfo).normalizedValue;

      if (result == null) {

        var trimmedInput = trim(input);

        if (typeof trimmedInput === 'string') {

          var maybeNumberStartsWithCurrency = CURRENCY_CODES_AND_SYMBOLS.map(function (currency) {
            if (trimmedInput.startsWith(currency) || trimmedInput.toUpperCase().startsWith(currency)) {
              var maybeNumber = trimmedInput.substring(currency.length);
              return i18nNumberNormalize(maybeNumber, params, additionalInfo).normalizedValue;
            }
            return null;
          });

          var maybeNumberEndsWithCurrency = CURRENCY_CODES_AND_SYMBOLS.map(function (currency) {
            if (trimmedInput.endsWith(currency) || trimmedInput.toUpperCase().endsWith(currency)) {
              var maybeNumber = trimmedInput.substring(0, trimmedInput.length - currency.length);
              return i18nNumberNormalize(maybeNumber, params, additionalInfo).normalizedValue;
            }
            return null;
          });

          result = maybeNumberStartsWithCurrency.concat(maybeNumberEndsWithCurrency).filter(function (x) {
            return x != null;
          }).shift() || null;
        }
      }
    }

    return { normalizedValue: result };
  }

  module.exports = normalize;

  /***/
},,,,
/* 24 */
/* 25 */
/* 26 */
/* 27 */
/***/function (module, exports, __webpack_require__) {

  "use strict";
  /**
   * Copyright (c) 2004-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
  
   * @providesModule SignalsBaseTypeNormalizers
   * @emails oncall+ads_signals_offline
   *
   * @typechecks
   *
   */

  var _module$exports;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }return obj;
  }

  var SignalBaseTypes = __webpack_require__(10);

  module.exports = (_module$exports = {}, _defineProperty(_module$exports, SignalBaseTypes.ANY, __webpack_require__(12)), _defineProperty(_module$exports, SignalBaseTypes.BOOL, __webpack_require__(13)), _defineProperty(_module$exports, SignalBaseTypes.CURRENCY_CODE, __webpack_require__(14)), _defineProperty(_module$exports, SignalBaseTypes.DATE, __webpack_require__(4)), _defineProperty(_module$exports, SignalBaseTypes.DATE_MONTH, __webpack_require__(15)), _defineProperty(_module$exports, SignalBaseTypes.EMAIL, __webpack_require__(16)), _defineProperty(_module$exports, SignalBaseTypes.ENUM, __webpack_require__(5)), _defineProperty(_module$exports, SignalBaseTypes.LIST, __webpack_require__(18)), _defineProperty(_module$exports, SignalBaseTypes.NUMBER, __webpack_require__(3)), _defineProperty(_module$exports, SignalBaseTypes.PHONE_NUMBER, __webpack_require__(19)), _defineProperty(_module$exports, SignalBaseTypes.POSTAL_CODE, __webpack_require__(20)), _defineProperty(_module$exports, SignalBaseTypes.STRING, __webpack_require__(21)), _defineProperty(_module$exports, SignalBaseTypes.TIMESTAMP, __webpack_require__(8)), _defineProperty(_module$exports, SignalBaseTypes.UNIX_TIME, __webpack_require__(22)), _defineProperty(_module$exports, SignalBaseTypes.FBID, __webpack_require__(17)), _defineProperty(_module$exports, SignalBaseTypes.VALUE, __webpack_require__(23)), _module$exports);

  /***/
},
/* 28 */
/***/function (module, exports, __webpack_require__) {

  "use strict";
  /**
   * Copyright (c) 2004-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule SignalsCurrencyCodes
   * @emails oncall+ads_signals_offline
   *
   * @typechecks
   *
   */

  var VALID_CURRENCY_CODES = ['AED', 'ARS', 'AUD', 'BOB', 'BRL', 'CAD', 'CHF', 'CLP', 'CNY', 'COP', 'CRC', 'CZK', 'DKK', 'EUR', 'GBP', 'GTQ', 'HKD', 'HNL', 'HUF', 'IDR', 'ILS', 'INR', 'ISK', 'JPY', 'KRW', 'MOP', 'MXN', 'MYR', 'NIO', 'NOK', 'NZD', 'PEN', 'PHP', 'PLN', 'PYG', 'QAR', 'RON', 'RUB', 'SAR', 'SEK', 'SGD', 'THB', 'TRY', 'TWD', 'USD', 'UYU', 'VEF', 'VND', 'ZAR'];

  module.exports = { VALID_CURRENCY_CODES: VALID_CURRENCY_CODES };

  /***/
},
/* 29 */
/***/function (module, exports, __webpack_require__) {

  "use strict";

  /**
   * Copyright (c) 2004-present, Facebook, Inc.
   * All rights reserved.
   *
   * This source code is licensed under the BSD-style license found in the
   * LICENSE file in the root directory of this source tree. An additional grant
   * of patent rights can be found in the PATENTS file in the same directory.
   *
   * @providesModule SignalDateMonthFormats
   * @emails oncall+ads_signals_offline
   *
   * @typechecks
   *
   */

  var SignalDateFormats = __webpack_require__(9);

  module.exports = SignalDateFormats.concat(['YYMM', 'MMYY', 'YYYYMM', 'MMYYYY', 'YYYY-MM', 'MM-YYYY', 'YY-MM', 'MM-YY', 'YYYY/MM', 'MM/YYYY', 'YY/MM', 'MM/YY']);

  /***/
},,,
/* 30 */
/* 31 */
/* 32 */
/***/function (module, exports, __webpack_require__) {

  "use strict";

  /**
   * Copyright 2004-present Facebook. All Rights Reserved.
   *
   * @providesModule isInternationalPhoneNumber
   *
   * Simple client-side validation of international phone numbers
   */

  var US_NUMBER_RE = /^1\(?\d{3}\)?\d{7}$/;
  var NORWAY_NUMBER_RE = /^47\d{8}$/;
  var INTL_NUMBER_RE = /^\d{1,4}\(?\d{2,3}\)?\d{4,}$/;

  function isInternationalPhoneNumber(number) {
    number = number.replace(/[\-\s]+/g, '' // strip all spaces and hyphens
    ).replace(/^\+?0{0,2}/, ''); // strip up to 2 leading 0s and +

    if (number.startsWith('0')) {
      return false;
    }

    if (number.startsWith('1')) {
      return US_NUMBER_RE.test(number);
    }

    if (number.startsWith('47')) {
      return NORWAY_NUMBER_RE.test(number);
    }

    return INTL_NUMBER_RE.test(number);
  }

  module.exports = isInternationalPhoneNumber;

  /***/
}]);