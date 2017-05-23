/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 *
 * @typechecks
 *
 */

'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var STRIP_MODES = {
  'WHITESPACE_ONLY': 'whitespace_only',
  'WHITESPACE_AND_PUNCTUATION': 'whitespace_and_punctuation',
  'ALL_NON_LATIN_ALPHA_NUMERIC': 'all_non_latin_alpha_numeric'
};

var SHA_256_REGEX = /^[a-f0-9]{64}$/i;
var TRIM_REGEX = /^\s+|\s+$/g;

var STRIP_WHITESPACE_REGEX = /\s+/g;
// Punctuation characters: !'#$%&'()*+,-./:;<=>?@ [\]^_`{|}~
var STRIP_WHITESPACE_AND_PUNCTUATION_REGEX = /[!'#\$%&'\(\)\*\+,\-\.\/:;<=>\?@ \[\\\]\^_`\{\|\}~\s]+/g;
var STRIP_NON_LATIN_ALPHA_NUMERIC_REGEX = /\W+/g;

function isArray(obj) {
  return obj != null && obj.constructor === Array;
}

function isString(obj) {
  return typeof obj === 'string';
}

/**
 * Type-tolerating trimmer. Also, removes not just space-whitespace.
 */
function trim(obj) {
  return typeof obj === 'string' ? obj.replace(TRIM_REGEX, '') : undefined;
}

/**
 * Type-tolerating strip.
 */
function strip(obj) {
  var mode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : STRIP_MODES.WHITESPACE_ONLY;

  var result = void 0;
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

/**
 * Type-tolerating lower-case.
 */
function lower(obj) {
  return typeof obj === 'string' ? obj.toLowerCase() : undefined;
}

function arrayDelete(arr, obj) {
  var index = arr.indexOf(obj);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function addToArray(base, extension) {
  if (isArray(extension)) {
    return isArray(base) ? base.push.apply(base, _toConsumableArray(extension)) : extension;
  } else {
    return isArray(base) ? base : [];
  }
}

function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

function hasProp(obj, key) {
  return isObject(obj) && Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * Adds a value to head at path if value is not null or undefined.
 * If valu already existed at path, turn it into array and concat
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

    if (isArray(currentValue)) {
      currentValue.push(value);
    } else {
      head[leafKey] = [currentValue, value];
    }
  }

  return head;
}

function looksLikeHashed(str) {
  return SHA_256_REGEX.test(str);
}

function isFile(source) {
  return global.File && source instanceof File || source instanceof Object;
}

function throwFatalError(message) {
  var detail = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  throw new Error('Fatal: ' + message + ', detail=' + JSON.stringify(detail));
}

module.exports = {
  addToArray: addToArray,
  addValueAtPath: addValueAtPath,
  arrayDelete: arrayDelete,
  hasProp: hasProp,
  isArray: isArray,
  isFile: isFile,
  isObject: isObject,
  isString: isString,
  looksLikeHashed: looksLikeHashed,
  lower: lower,
  strip: strip,
  throwFatalError: throwFatalError,
  trim: trim,
  STRIP_MODES: STRIP_MODES
};
