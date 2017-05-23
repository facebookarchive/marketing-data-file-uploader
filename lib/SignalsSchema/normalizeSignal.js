/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 *
 */

'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
  /******/return __webpack_require__(__webpack_require__.s = 26);
  /******/
}(
/************************************************************************/
/******/{

  /***/0:
  /***/function _(module, exports, __webpack_require__) {

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

  /***/1:
  /***/function _(module, exports, __webpack_require__) {

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

  /***/11:
  /***/function _(module, exports, __webpack_require__) {

    "use strict";

    /**
     * Generated by:
     *   scripts/static_resources/mock_staticjsmodules.php SignalsNormalizationPropError
     * @nolint
     *
     * @generated SignedSource<<b4ce3a06b8b42c1442f7dd58ce180dc8>>
     */

    module.exports = {
      "INVALID": "invalid",
      "TOO_MANY": "too-many",
      "SOME_INVALID": "some-invalid"
    };

    /***/
  },

  /***/2:
  /***/function _(module, exports) {

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

  /***/24:
  /***/function _(module, exports, __webpack_require__) {

    "use strict";
    /**
     * Copyright (c) 2004-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * @providesModule signalsSchemaRuleChecker
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

    var _slicedToArray = function () {
      function sliceIterator(arr, i) {
        var _arr = [];var _n = true;var _d = false;var _e = undefined;try {
          for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);if (i && _arr.length === i) break;
          }
        } catch (err) {
          _d = true;_e = err;
        } finally {
          try {
            if (!_n && _i["return"]) _i["return"]();
          } finally {
            if (_d) throw _e;
          }
        }return _arr;
      }return function (arr, i) {
        if (Array.isArray(arr)) {
          return arr;
        } else if (Symbol.iterator in Object(arr)) {
          return sliceIterator(arr, i);
        } else {
          throw new TypeError("Invalid attempt to destructure non-iterable instance");
        }
      };
    }();

    var SignalsValidationUtils = __webpack_require__(0);
    var SignalsNormalizationErrorLevel = __webpack_require__(6);
    var SignalsNormalizationErrorScope = __webpack_require__(7);

    var getByPath = __webpack_require__(31);
    var nullthrows = __webpack_require__(35);

    var throwFatalError = SignalsValidationUtils.throwFatalError;

    function hasError(result) {
      return result.length > 0;
    }

    function makeRuleError(ruleSpecs, details) {
      return {
        level: ruleSpecs.warnOnFail === true ? SignalsNormalizationErrorLevel.WARNING : SignalsNormalizationErrorLevel.REJECT,
        where: SignalsNormalizationErrorScope.RULE,
        ruleError: {
          ruleSpecs: ruleSpecs,
          details: details
        }
      };
    }

    function checkPropValid(value, prop) {
      // dotAccess returns undefined for 0, use getByPath instead
      var path = prop.split('.');
      return getByPath(value, path) != null;
    }

    function checkPropValueIs(value, prop, targetValue) {
      return checkPropValid(value, prop) && getByPath(value, prop.split('.')) === targetValue;
    }

    // Rule checkers below:
    // All rule checkers should take 3 params:
    // result: the result of the signal normalization
    // schema: the schema of current value
    // ruleSpecs: more details for the rule checker

    function propValid(value, schema, ruleSpecs) {
      var prop = ruleSpecs.args;
      if (prop == null || typeof prop !== 'string') {
        throwFatalError('invalid ruleSpecs', { ruleSpecs: ruleSpecs });
      }
      return checkPropValid(value, nullthrows(prop)) ? [] : [makeRuleError(ruleSpecs)];
    }

    function propValueIs(value, schema, ruleSpecs) {
      var args = ruleSpecs.args;

      if (args == null || !Array.isArray(args) || args.length !== 2 || typeof args[0] !== 'string') {
        throwFatalError('invalid ruleSpecs', { ruleSpecs: ruleSpecs });
      }

      var _nullthrows = nullthrows(args),
          _nullthrows2 = _slicedToArray(_nullthrows, 2),
          prop = _nullthrows2[0],
          targetValue = _nullthrows2[1];

      return checkPropValueIs(value, prop, targetValue) ? [] : [makeRuleError(ruleSpecs)];
    }

    function dependentProps(value, schema, ruleSpecs) {
      var args = ruleSpecs.args;

      if (args == null || args.length !== 2 || _typeof(args[0]) !== 'object' || !Array.isArray(args[1])) {
        throwFatalError('invalid ruleSpecs', { ruleSpecs: ruleSpecs });
      }

      var _nullthrows3 = nullthrows(args),
          _nullthrows4 = _slicedToArray(_nullthrows3, 2),
          conditionRule = _nullthrows4[0],
          props = _nullthrows4[1];

      if (props.length === 0 || props.find(function (prop) {
        return typeof prop !== 'string';
      })) {
        throwFatalError('invalid ruleSpecs', { ruleSpecs: ruleSpecs });
      }

      var conditionResult = checkRule(value, schema, conditionRule);

      // Does not pass the condition check, this rule does not apply.
      // For example, a rule may require valid props `currency` and `value` if
      // `event_name` is 'Purchase'. We don't check the props if current result
      // does not satisfy the `event_name === 'Purchase'` condition.
      if (hasError(conditionResult)) {
        return [];
      }

      var invalidProps = [];
      props.forEach(function (prop) {
        if (!checkPropValid(value, prop)) {
          invalidProps.push(prop);
        }
      });
      return invalidProps.length > 0 ? [makeRuleError(ruleSpecs, { invalidProps: invalidProps })] : [];
    }

    function minValidProps(value, schema, ruleSpecs) {
      var count = parseInt(ruleSpecs.args, 10);
      if (isNaN(count)) {
        throwFatalError('invalid ruleSpecs', { ruleSpecs: ruleSpecs });
      }
      return Object.keys(value).length >= count ? [] : [makeRuleError(ruleSpecs)];
    }

    function meetAll(value, schema, ruleSpecs) {
      var subRules = ruleSpecs.args;
      if (subRules == null || !Array.isArray(subRules)) {
        throwFatalError('invalid ruleSpecs', { ruleSpecs: ruleSpecs });
      }
      var aggregatedResult = nullthrows(subRules).reduce(function (aggregatedResult, subRule) {
        var subRuleResult = checkRule(value, schema, subRule);
        return aggregatedResult.concat(subRuleResult);
      }, []);
      if (hasError(aggregatedResult)) {
        aggregatedResult.push(makeRuleError(ruleSpecs));
      }
      return aggregatedResult;
    }

    function meetAny(value, schema, ruleSpecs) {
      var subRules = ruleSpecs.args;
      if (subRules == null || !Array.isArray(subRules)) {
        throwFatalError('invalid ruleSpecs', { ruleSpecs: ruleSpecs });
      }
      var aggregatedResult = nullthrows(subRules).reduce(function (aggregatedResult, subRule) {
        var subRuleResult = checkRule(value, schema, subRule);
        return {
          errors: aggregatedResult.errors.concat(subRuleResult),
          passed: aggregatedResult.passed || !hasError(subRuleResult)
        };
      }, { errors: [], passed: false });

      return aggregatedResult.passed ? [] : [makeRuleError(ruleSpecs)];
    }

    function rejectExtraProps(value, schema, ruleSpecs) {
      var unidentifiedProps = Object.keys(value).filter(function (prop) {
        return (schema.props || []).find(function (propSchema) {
          return propSchema.key === prop;
        }) == null;
      });
      return unidentifiedProps.length > 0 ? [makeRuleError(ruleSpecs, { unidentifiedProps: unidentifiedProps })] : [];
    }

    var availableRules = {
      dependentProps: dependentProps,
      meetAll: meetAll,
      meetAny: meetAny,
      minValidProps: minValidProps,
      propValid: propValid,
      propValueIs: propValueIs,
      rejectExtraProps: rejectExtraProps
    };

    function checkRule(value, schema, ruleSpecs) {
      if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') {
        return [makeRuleError(ruleSpecs)];
      }
      var ruleFunc = (typeof ruleSpecs === 'undefined' ? 'undefined' : _typeof(ruleSpecs)) === 'object' && availableRules[ruleSpecs.rule] || null;
      if (ruleFunc == null) {
        throwFatalError('cannot find rule function', { ruleSpecs: ruleSpecs });
      }
      return nullthrows(ruleFunc)(value, schema, ruleSpecs);
    }

    module.exports = checkRule;

    /***/
  },

  /***/26:
  /***/function _(module, exports, __webpack_require__) {

    "use strict";
    /**
     * Copyright (c) 2004-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     * @providesModule normalizeSignal
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

    function _toConsumableArray(arr) {
      if (Array.isArray(arr)) {
        for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
          arr2[i] = arr[i];
        }return arr2;
      } else {
        return Array.from(arr);
      }
    }

    var SignalsNormalizationErrorLevel = __webpack_require__(6);
    var SignalsNormalizationErrorScope = __webpack_require__(7);
    var SignalsNormalizationPropError = __webpack_require__(11);
    var SignalsValidationUtils = __webpack_require__(0);

    var ruleChecker = __webpack_require__(24);

    var addValueAtPath = SignalsValidationUtils.addValueAtPath,
        hasProp = SignalsValidationUtils.hasProp,
        throwFatalError = SignalsValidationUtils.throwFatalError;

    // TODO(ytx): t12818545
    // Future updates:
    // Make customTypeInfo and infoForNormalization hierarchical.
    // Let infoForNormalization accept array to support multi props.
    // Simplify fatal error in rule checker.

    /**
     * Remap to a flat signal based on provided map. Also returns a reverse mapping
     * contains where a value comes from.
     */
    function _remapSignal(signal, schema, mapping) {
      var newSignal = {};
      var reverseMapping = {};

      for (var p in mapping) {
        if (hasProp(mapping, p)) {
          if (Array.isArray(signal)) {
            addValueAtPath(newSignal, mapping[p], signal[Number(p)]);
          } else {
            addValueAtPath(newSignal, mapping[p], signal[p]);
          }
          addValueAtPath(reverseMapping, mapping[p], p);
        }
      }
      return { newSignal: newSignal, reverseMapping: reverseMapping };
    }

    function _constructTree(signal, propSchema, infoForNormalization, reverseMapping, customTypeInfo) {
      if ((typeof propSchema === 'undefined' ? 'undefined' : _typeof(propSchema)) !== 'object') {
        throwFatalError('propSchema is not an object', { propSchema: propSchema });
      }

      var typeSchema = propSchema.type;
      if ((typeof typeSchema === 'undefined' ? 'undefined' : _typeof(typeSchema)) === 'object') {
        var nodes = {};
        if ((typeof signal === 'undefined' ? 'undefined' : _typeof(signal)) === 'object') {
          var _loop = function _loop(propKey) {
            var props = typeSchema.props;

            var subPropSchema = (props != null && Array.isArray(props) ? props : []).find(function (subPropSchema) {
              return subPropSchema.key === propKey;
            });

            if (subPropSchema == null) {
              var customType = customTypeInfo && customTypeInfo[propKey] || {};
              subPropSchema = {
                type: customType.baseType,
                typeParams: customType.typeParams,
                maxOccurrence: customType.maxOccurrence,
                key: propKey,
                customType: true
              };
            }

            nodes[propKey] = _constructTree(signal[propKey], subPropSchema, infoForNormalization, reverseMapping != null && (typeof reverseMapping === 'undefined' ? 'undefined' : _typeof(reverseMapping)) === 'object' ? reverseMapping[propKey] : undefined, customTypeInfo);
          };

          for (var propKey in signal) {
            _loop(propKey);
          }
        }

        return {
          type: 'compound',
          nodes: nodes,
          propSchema: propSchema,
          errors: [],

          rawValue: signal,

          infoForNormalization: infoForNormalization || undefined,
          reverseMapping: reverseMapping || undefined
        };
      }

      return {
        type: 'prop',
        propSchema: propSchema,
        errors: [],

        rawValue: signal,

        infoForNormalization: infoForNormalization || undefined,
        reverseMapping: reverseMapping || undefined
      };
    }

    function _makePropError(error, badValues) {
      return {
        level: SignalsNormalizationErrorLevel.WARNING,
        where: SignalsNormalizationErrorScope.PROP,
        propError: { error: error, badValues: badValues }
      };
    }

    function _normalizeCompoundNode(node, normalizers, transformers) {
      var nodes = node.nodes,
          errors = node.errors,
          propSchema = node.propSchema,
          rawValue = node.rawValue,
          reverseMapping = node.reverseMapping;

      if ((typeof nodes === 'undefined' ? 'undefined' : _typeof(nodes)) !== 'object') {
        throwFatalError('compound node node.nodes is not Object', { node: node });
        return;
      }

      var normalizedValue = {};
      for (var propKey in nodes) {
        var subNode = nodes[propKey];
        _normalizeNode(subNode, normalizers, transformers);
        if (subNode.normalizedValue != null) {
          normalizedValue[propKey] = subNode.normalizedValue;
        }
      }

      var typeSchema = propSchema.type;
      if ((typeof typeSchema === 'undefined' ? 'undefined' : _typeof(typeSchema)) !== 'object') {
        throwFatalError('propSchema.type is not Object', { propSchema: propSchema });
        return;
      }
      if (typeSchema.validIf != null) {
        errors.push.apply(errors, _toConsumableArray(ruleChecker(normalizedValue, typeSchema, typeSchema.validIf)));
      }

      // Check extra props.
      errors.push.apply(errors, _toConsumableArray(ruleChecker(normalizedValue, typeSchema, {
        rule: 'rejectExtraProps',
        warnOnFail: typeSchema.canHaveExtraProps === true
      })));

      var valid = (typeof rawValue === 'undefined' ? 'undefined' : _typeof(rawValue)) === 'object' && errors.find(function (error) {
        return error.level !== SignalsNormalizationErrorLevel.WARNING;
      }) == null;
      if (valid) {
        if (transformers && Array.isArray(typeSchema.transform)) {
          typeSchema.transform.forEach(function (transformer) {
            var transformerFunc = transformers && transformers[transformer];
            if (transformerFunc != null) {
              normalizedValue = transformerFunc(normalizedValue, typeSchema);
            }
          });
        }
        node.normalizedValue = normalizedValue;
      } else {
        node.errors.push(_makePropError(SignalsNormalizationPropError.INVALID, [{
          value: rawValue,
          rawPosition: reverseMapping || undefined
        }]));
      }
    }

    function _normalizePropNode(node, normalizers) {
      var propSchema = node.propSchema,
          rawValue = node.rawValue,
          reverseMapping = node.reverseMapping;

      var normalizer = normalizers[propSchema.type];
      // No normalizer. Just pass the raw value.
      if (normalizer == null) {
        node.normalizedValue = rawValue;
        return;
      }

      var infoForNormalization = node.infoForNormalization && node.infoForNormalization[propSchema.key] || undefined;

      // Support single occurence only.
      if (propSchema.maxOccurrence == null) {
        var _normalizer = normalizer(rawValue, propSchema.typeParams, infoForNormalization),
            normalizedValue = _normalizer.normalizedValue;

        if (normalizedValue != null) {
          node.normalizedValue = normalizedValue;
        } else {
          node.errors.push(_makePropError(SignalsNormalizationPropError.INVALID, [{
            value: rawValue,
            rawPosition: reverseMapping || undefined
          }]));
        }
        return;
      }

      // Multiple occurences allowed.

      var actuallyHadMultipleOccurances = rawValue != null && Array.isArray(rawValue);

      var values = actuallyHadMultipleOccurances ? rawValue || [] : [rawValue];

      var reverseMappings = actuallyHadMultipleOccurances ? reverseMapping || [] : [reverseMapping];

      // Too many occurences.
      if (values.length > propSchema.maxOccurrence) {
        node.errors.push(_makePropError(SignalsNormalizationPropError.TOO_MANY, values.map(function (value, i) {
          return {
            value: value,
            rawPosition: reverseMappings != null ? reverseMappings[i] : undefined
          };
        })));
        return;
      }

      var badValues = [];
      var goodValues = [];
      values.forEach(function (value, i) {
        var _normalizer2 = normalizer(value, propSchema.typeParams, infoForNormalization && infoForNormalization[i] || undefined),
            normalizedValue = _normalizer2.normalizedValue;

        if (normalizedValue != null) {
          goodValues.push(normalizedValue);
        } else {
          badValues.push({
            value: value,
            rawPosition: reverseMappings != null ? reverseMappings[i] : undefined
          });
        }
      });
      if (badValues.length > 0) {
        node.errors.push(_makePropError(goodValues.length === 0 ? SignalsNormalizationPropError.INVALID : SignalsNormalizationPropError.SOME_INVALID, badValues));
      }
      if (goodValues.length > 0) {
        node.normalizedValue = goodValues.length === 1 ? goodValues[0] : goodValues;
      }
    }

    function _normalizeNode(node, normalizers, transformers) {
      switch (node.type) {
        case 'compound':
          _normalizeCompoundNode(node, normalizers, transformers);
          return;
        case 'prop':
          _normalizePropNode(node, normalizers);
          return;
      }
    }

    function _normalizeSignal(signal, schema, normalizers, transformers, infoForNormalization, customTypeInfo, reverseMapping) {
      var tree = _constructTree(signal, {
        type: schema
      }, infoForNormalization, reverseMapping, customTypeInfo);

      _normalizeNode(tree, normalizers, transformers || {});
      return tree;
    }

    function _pushPropIfNotExist(props, prop) {
      if (props.indexOf(prop) === -1) {
        props.push(prop);
      }
    }

    function _appendPath(path, key) {
      return path.length > 0 ? path + '.' + key : key;
    }

    function _deriveLegacyMetadata(node, path, invalidProps, missingRequiredProps, notFoundProps, unidentifiedProps, notAllowedProps) {
      var errors = node.errors,
          nodes = node.nodes,
          type = node.type,
          normalizedValue = node.normalizedValue,
          propSchema = node.propSchema;

      if (type === 'compound') {
        for (var propKey in nodes) {
          _deriveLegacyMetadata(nodes[propKey], _appendPath(path, propKey), invalidProps, missingRequiredProps, notFoundProps, unidentifiedProps, notAllowedProps);
        }
        (propSchema.type.props || []).forEach(function (subPropSchema) {
          if (nodes == null || nodes[subPropSchema.key] == null) {
            var propPath = _appendPath(path, subPropSchema.key);
            _pushPropIfNotExist(notFoundProps, propPath);
          }
        });
      }
      errors.forEach(function (error) {
        if (error.where === SignalsNormalizationErrorScope.RULE) {
          var ruleError = error.ruleError;
          var ruleSpecs = ruleError && ruleError.ruleSpecs;
          var rule = ruleSpecs && ruleSpecs.rule;
          if (rule === 'propValid') {
            var _propKey = ruleSpecs && ruleSpecs.args;
            var propPath = _appendPath(path, String(_propKey));
            _pushPropIfNotExist(invalidProps, propPath);
            _pushPropIfNotExist(missingRequiredProps, propPath);
          } else if (rule === 'dependentProps') {
            var propKeys = ruleError && ruleError.details && ruleError.details.invalidProps || [];
            propKeys.forEach(function (propKey) {
              _pushPropIfNotExist(missingRequiredProps, _appendPath(path, propKey));
            });
          } else if (rule === 'rejectExtraProps') {
            var propPaths = (ruleError && ruleError.details && ruleError.details.unidentifiedProps || []).map(function (propKey) {
              return _appendPath(path, propKey);
            });
            propPaths.forEach(function (propPath) {
              _pushPropIfNotExist(unidentifiedProps, propPath);
              if (error.level === SignalsNormalizationErrorLevel.REJECT) {
                _pushPropIfNotExist(notAllowedProps, propPath);
              }
            });
          }
        }
      });
      if (normalizedValue == null) {
        _pushPropIfNotExist(invalidProps, path);
      }
    }

    /**
     * This method normalizes an input signal provided as a JavaScript object based
     * on a schema definition captured in Signals Schema Language.
     *
     * Read more at: https://fburl.com/199967427
     *
     * @param  {object | array} signal - the signal to normalize, can be array when
     * mapping is defined, otherwise it should be an object
     * @param  {object} schema - the Signals Schema for normalization
     * @param  {object} normalizers - map of normalizer methods, keyed by data type
     * @param  {object} transformers - optional map of transformers
     * @param  {object} mapping - optional schema prop to signal mapping specifying
     * lookup of props. In this is specified, signal should be flat
     * @param  {object} infoForNormalization - optional additional information for
     * normalization, eg. use-specified date format for date types
     * @param  {object} customTypeInfos - map of additional information for
     * specifying types of custom/user defined props, keyed by additional prop key
     *
     *  @param  {string} parentKey - This should not be used normally. It is set to
     * appropriate parent key when normalizing child-schema.
     *
     * @returns {object}
     *
     * It returns an object that contains the normalized value and a valid flag
     * along with various meta information of about the normalization process:
     *
     *  {
     *    failedRules: Array<RuleSpecs>;
     *    fatalError: ?object;
     *    invalidProps: Array<string>;
     *    missingRequiredProps: Array<string>;
     *    normalizedValue: Object;
     *    notAllowedProps: Array<string>;
     *    notFoundProps: Array<string>;
     *    allPropKeysInSchema: Array<string>;
     *    transformedProps: Array<string>;
     *    unidentifiedProps: Array<string>;
     *    ruleCheckerFatalErrors: Array<string>;
     *    valid: ?boolean;
     *    validProps: Array<string>;
     *  }
     *
     */
    function normalizeSignal(signal, schema, normalizers, transformers, mapping, infoForNormalization, customTypeInfo) {
      var tree = null;

      var invalidProps = [];
      var missingRequiredProps = [];
      var notFoundProps = [];
      var unidentifiedProps = [];
      var notAllowedProps = [];

      try {
        if (signal != null && schema != null && normalizers != null && (typeof schema === 'undefined' ? 'undefined' : _typeof(schema)) === 'object' && (typeof normalizers === 'undefined' ? 'undefined' : _typeof(normalizers)) === 'object' && !(mapping == null && Array.isArray(signal))) {
          var reverseMapping = null;
          if (mapping != null && (typeof mapping === 'undefined' ? 'undefined' : _typeof(mapping)) === 'object') {
            var remapResult = _remapSignal(signal, schema, mapping);
            signal = remapResult.newSignal;
            reverseMapping = remapResult.reverseMapping;
          }

          tree = _normalizeSignal(signal, schema, normalizers, transformers || {}, infoForNormalization || undefined, customTypeInfo || undefined, reverseMapping || undefined);

          _deriveLegacyMetadata(tree, '', invalidProps, missingRequiredProps, notFoundProps, unidentifiedProps, notAllowedProps);
        } else {
          throwFatalError('invalid input', { signal: signal, mapping: mapping, schema: schema, normalizers: normalizers });
        }
      } catch (error) {
        return {
          tree: null,

          normalizedValue: null,
          valid: false,
          fatalError: error,

          invalidProps: [],
          missingRequiredProps: [],
          notFoundProps: [],
          unidentifiedProps: [],
          notAllowedProps: []
        };
      }

      return {
        tree: tree,

        normalizedValue: tree && tree.normalizedValue || null,
        valid: tree && tree.normalizedValue != null || false,
        fatalError: null,

        invalidProps: invalidProps,
        missingRequiredProps: missingRequiredProps,
        notFoundProps: notFoundProps,
        unidentifiedProps: unidentifiedProps,
        notAllowedProps: notAllowedProps
      };
    }

    module.exports = normalizeSignal;

    /***/
  },

  /***/31:
  /***/function _(module, exports, __webpack_require__) {

    "use strict";
    /**
     * Copyright 2004-present Facebook. All Rights Reserved.
     *
     * @providesModule getByPath
     * @emails oncall+ads_interfaces_core_experiences
     *
     * @typechecks
     */

    /**
     * Get a value from an object based on the given path
     *
     * Usage example:
     *
     *   var obj = {
     *     a : {
     *       b : 123
     *     }
     *   };
     *
     * var result = getByPath(obj, ['a', 'b']); // 123
     *
     * You may also specify the path using an object with a path field
     *
     * var result = getByPath(obj, {path: ['a', 'b']}); // 123
     *
     * If the path doesn't exist undefined will be returned
     *
     * var result = getByPath(obj, ['x', 'y', 'z']); // undefined
     */

    function getByPath(root /*?Object | Error*/
    , path, fallbackValue) {
      var current = root;
      for (var i = 0; i < path.length; i++) {
        var segment = path[i];
        // Use 'in' to check entire prototype chain since immutable js records
        // use prototypes
        if (current && segment in current) {
          current = current[segment];
        } else {
          return fallbackValue;
        }
      }
      return current;
    }

    module.exports = getByPath;

    /***/
  },

  /***/35:
  /***/function _(module, exports, __webpack_require__) {

    "use strict";

    /**
     * Copyright (c) 2013-present, Facebook, Inc.
     * All rights reserved.
     *
     * This source code is licensed under the BSD-style license found in the
     * LICENSE file in the root directory of this source tree. An additional grant
     * of patent rights can be found in the PATENTS file in the same directory.
     *
     *
     */

    var nullthrows = function nullthrows(x) {
      if (x != null) {
        return x;
      }
      throw new Error("Got unexpected null or undefined");
    };

    module.exports = nullthrows;

    /***/
  },

  /***/6:
  /***/function _(module, exports, __webpack_require__) {

    "use strict";

    /**
     * Generated by:
     *   scripts/static_resources/mock_staticjsmodules.php SignalsNormalizationErrorLevel
     * @nolint
     *
     * @generated SignedSource<<c1ca58f2921b0e7ce7c8c15bcdffd47b>>
     */

    module.exports = {
      "REJECT": "reject",
      "WARNING": "warning"
    };

    /***/
  },

  /***/7:
  /***/function _(module, exports, __webpack_require__) {

    "use strict";

    /**
     * Generated by:
     *   scripts/static_resources/mock_staticjsmodules.php SignalsNormalizationErrorScope
     * @nolint
     *
     * @generated SignedSource<<1fa9180529ec9f0c94ea584c1805c15d>>
     */

    module.exports = {
      "RULE": "rule",
      "PROP": "prop"
    };

    /***/
  }

  /******/ });
