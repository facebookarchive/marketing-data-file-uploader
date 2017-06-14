/**
*  Copyright (c) 2017-present, Facebook, Inc.
*  All rights reserved.
*  
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree. An additional grant
*  of patent rights can be found in the PATENTS file in the same directory.
*  
*  @generated
**/'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = function (modules) {
  var installedModules = {};
  function __webpack_require__(moduleId) {
    if (installedModules[moduleId]) return installedModules[moduleId].exports;
    var module = installedModules[moduleId] = { i: moduleId,
      l: false,
      exports: {}
    };
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    module.l = true;
    return module.exports;
  }
  __webpack_require__.m = modules;
  __webpack_require__.c = installedModules;
  __webpack_require__.i = function (value) {
    return value;
  };
  __webpack_require__.d = function (exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { configurable: false,
        enumerable: true,
        get: getter
      });
    }
  };
  __webpack_require__.n = function (module) {
    var getter = module && module.__esModule ? function getDefault() {
      return module['default'];
    } : function getModuleExports() {
      return module;
    };
    __webpack_require__.d(getter, 'a', getter);
    return getter;
  };
  __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };
  __webpack_require__.p = "";
  return __webpack_require__(__webpack_require__.s = 30);
}({ 0: function _(module, exports, __webpack_require__) {

    "use strict";

    (function (global) {

      var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
        return typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
      } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
      };

      var STRIP_MODES = __webpack_require__(1);

      var SHA_256_REGEX = /^[a-f0-9]{64}$/i;
      var TRIM_REGEX = /^\s+|\s+$/g;

      var STRIP_WHITESPACE_REGEX = /\s+/g;

      var STRIP_WHITESPACE_AND_PUNCTUATION_REGEX = /[!"#\$%&'\(\)\*\+,\-\.\/:;<=>\?@ \[\\\]\^_`\{\|\}~\s]+/g;
      var STRIP_NON_LATIN_ALPHA_NUMERIC_REGEX = /\W+/g;

      function trim(obj) {
        return typeof obj === 'string' ? obj.replace(TRIM_REGEX, '') : '';
      }

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
    }).call(exports, __webpack_require__(2));
  },

  1: function _(module, exports, __webpack_require__) {

    "use strict";

    module.exports = {
      "WHITESPACE_ONLY": "whitespace_only",
      "WHITESPACE_AND_PUNCTUATION": "whitespace_and_punctuation",
      "ALL_NON_LATIN_ALPHA_NUMERIC": "all_non_latin_alpha_numeric"
    };
  },

  2: function _(module, exports) {

    var g;

    g = function () {
      return this;
    }();

    try {
      g = g || Function("return this")() || (1, eval)("this");
    } catch (e) {
      if ((typeof window === 'undefined' ? 'undefined' : _typeof2(window)) === "object") g = window;
    }

    module.exports = g;
  },

  25: function _(module, exports, __webpack_require__) {

    !function (globals) {
      'use strict';

      var _imports = {};

      if (typeof module !== 'undefined' && module.exports) {
        _imports.bytesToHex = __webpack_require__(33).bytesToHex;
        _imports.convertString = __webpack_require__(34);
        module.exports = sha256;
      } else {
        _imports.bytesToHex = globals.convertHex.bytesToHex;
        _imports.convertString = globals.convertString;
        globals.sha256 = sha256;
      }

      var K = [];

      !function () {
        function isPrime(n) {
          var sqrtN = Math.sqrt(n);
          for (var factor = 2; factor <= sqrtN; factor++) {
            if (!(n % factor)) return false;
          }

          return true;
        }

        function getFractionalBits(n) {
          return (n - (n | 0)) * 0x100000000 | 0;
        }

        var n = 2;
        var nPrime = 0;
        while (nPrime < 64) {
          if (isPrime(n)) {
            K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));
            nPrime++;
          }

          n++;
        }
      }();

      var bytesToWords = function bytesToWords(bytes) {
        var words = [];
        for (var i = 0, b = 0; i < bytes.length; i++, b += 8) {
          words[b >>> 5] |= bytes[i] << 24 - b % 32;
        }
        return words;
      };

      var wordsToBytes = function wordsToBytes(words) {
        var bytes = [];
        for (var b = 0; b < words.length * 32; b += 8) {
          bytes.push(words[b >>> 5] >>> 24 - b % 32 & 0xFF);
        }
        return bytes;
      };

      var W = [];

      var processBlock = function processBlock(H, M, offset) {
        var a = H[0],
            b = H[1],
            c = H[2],
            d = H[3];
        var e = H[4],
            f = H[5],
            g = H[6],
            h = H[7];

        for (var i = 0; i < 64; i++) {
          if (i < 16) {
            W[i] = M[offset + i] | 0;
          } else {
            var gamma0x = W[i - 15];
            var gamma0 = (gamma0x << 25 | gamma0x >>> 7) ^ (gamma0x << 14 | gamma0x >>> 18) ^ gamma0x >>> 3;

            var gamma1x = W[i - 2];
            var gamma1 = (gamma1x << 15 | gamma1x >>> 17) ^ (gamma1x << 13 | gamma1x >>> 19) ^ gamma1x >>> 10;

            W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
          }

          var ch = e & f ^ ~e & g;
          var maj = a & b ^ a & c ^ b & c;

          var sigma0 = (a << 30 | a >>> 2) ^ (a << 19 | a >>> 13) ^ (a << 10 | a >>> 22);
          var sigma1 = (e << 26 | e >>> 6) ^ (e << 21 | e >>> 11) ^ (e << 7 | e >>> 25);

          var t1 = h + sigma1 + ch + K[i] + W[i];
          var t2 = sigma0 + maj;

          h = g;
          g = f;
          f = e;
          e = d + t1 | 0;
          d = c;
          c = b;
          b = a;
          a = t1 + t2 | 0;
        }

        H[0] = H[0] + a | 0;
        H[1] = H[1] + b | 0;
        H[2] = H[2] + c | 0;
        H[3] = H[3] + d | 0;
        H[4] = H[4] + e | 0;
        H[5] = H[5] + f | 0;
        H[6] = H[6] + g | 0;
        H[7] = H[7] + h | 0;
      };

      function sha256(message, options) {
        ;
        if (message.constructor === String) {
          message = _imports.convertString.UTF8.stringToBytes(message);
        }

        var H = [0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19];

        var m = bytesToWords(message);
        var l = message.length * 8;

        m[l >> 5] |= 0x80 << 24 - l % 32;
        m[(l + 64 >> 9 << 4) + 15] = l;

        for (var i = 0; i < m.length; i += 16) {
          processBlock(H, m, i);
        }

        var digestbytes = wordsToBytes(H);
        return options && options.asBytes ? digestbytes : options && options.asString ? _imports.convertString.bytesToString(digestbytes) : _imports.bytesToHex(digestbytes);
      }

      sha256.x2 = function (message, options) {
        return sha256(sha256(message, { asBytes: true }), options);
      };
    }(this);
  },

  30: function _(module, exports, __webpack_require__) {

    "use strict";

    var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
      return typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
    } : function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === 'undefined' ? 'undefined' : _typeof2(obj);
    };

    var sha256 = __webpack_require__(25);
    var SignalsValidationUtils = __webpack_require__(0);

    var hasProp = SignalsValidationUtils.hasProp,
        looksLikeHashed = SignalsValidationUtils.looksLikeHashed;

    function hashIfNotHashed(prop) {
      return !looksLikeHashed(prop) ? sha256(prop) : prop;
    }

    function processPIISignalBeforeUpload(signal, schema) {
      var nonHashableKeys = schema != null && Array.isArray(schema.props) ? schema.props.filter(function (prop) {
        return prop.typeParams && _typeof(prop.typeParams) === 'object' && prop.typeParams.rejectHashed === true;
      }).map(function (prop) {
        return prop.key;
      }) : [];

      for (var key in signal) {
        if (hasProp(signal, key)) {
          var prop = signal[key];
          var propIsToBeRemoved = false;

          switch (key) {
            case 'fn':
              if (typeof prop === 'string' && prop.length) {
                signal.fi = sha256(prop.charAt(0));
                signal.f5first = sha256(prop.substring(0, 5));
              }

              break;

            case 'ln':
              if (typeof prop === 'string' && prop.length) {
                signal.f5last = sha256(prop.substring(0, 5));
              }

              break;

            case 'dob':
              if (typeof prop === 'string' && prop.length >= 4) {
                signal.doby = sha256(prop.substring(0, 4));
              }

              if (typeof prop === 'string' && prop.length >= 6) {
                signal.dobm = sha256(prop.substring(4, 6));
              }

              if (typeof prop === 'string' && prop.length >= 8) {
                signal.dobd = sha256(prop.substring(6, 8));
              }

              propIsToBeRemoved = true;

              break;

            case 'age':
              if (signal.dob == null && signal.doby == null) {
                signal.doby = sha256(String(new Date().getFullYear() - prop));
              }
              propIsToBeRemoved = true;
          }

          if (nonHashableKeys.indexOf(key) === -1 && !propIsToBeRemoved) {
            signal[key] = Array.isArray(prop) ? prop.map(function (v) {
              return hashIfNotHashed(v);
            }) : hashIfNotHashed(prop);
          }

          if (propIsToBeRemoved) {
            delete signal[key];
          }
        }
      }

      return signal;
    }

    module.exports = processPIISignalBeforeUpload;
  },

  33: function _(module, exports) {

    !function (globals) {
      'use strict';

      var convertHex = {
        bytesToHex: function bytesToHex(bytes) {
          return arrBytesToHex(bytes);
        },
        hexToBytes: function hexToBytes(hex) {
          if (hex.length % 2 === 1) throw new Error("hexToBytes can't have a string with an odd number of characters.");
          if (hex.indexOf('0x') === 0) hex = hex.slice(2);
          return hex.match(/../g).map(function (x) {
            return parseInt(x, 16);
          });
        }
      };

      function arrBytesToHex(bytes) {
        return bytes.map(function (x) {
          return padLeft(x.toString(16), 2);
        }).join('');
      }

      function padLeft(orig, len) {
        if (orig.length > len) return orig;
        return Array(len - orig.length + 1).join('0') + orig;
      }

      if (typeof module !== 'undefined' && module.exports) {
        module.exports = convertHex;
      } else {
        globals.convertHex = convertHex;
      }
    }(this);
  },

  34: function _(module, exports) {

    !function (globals) {
      'use strict';

      var convertString = {
        bytesToString: function bytesToString(bytes) {
          return bytes.map(function (x) {
            return String.fromCharCode(x);
          }).join('');
        },
        stringToBytes: function stringToBytes(str) {
          return str.split('').map(function (x) {
            return x.charCodeAt(0);
          });
        }
      };

      convertString.UTF8 = {
        bytesToString: function bytesToString(bytes) {
          return decodeURIComponent(escape(convertString.bytesToString(bytes)));
        },
        stringToBytes: function stringToBytes(str) {
          return convertString.stringToBytes(unescape(encodeURIComponent(str)));
        }
      };

      if (typeof module !== 'undefined' && module.exports) {
        module.exports = convertString;
      } else {
        globals.convertString = convertString;
      }
    }(this);
  }

});