/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 * @typechecks
 *
 */

'use strict';

const STRIP_MODES = {
  'WHITESPACE_ONLY': 'whitespace_only',
  'WHITESPACE_AND_PUNCTUATION': 'whitespace_and_punctuation',
  'ALL_NON_LATIN_ALPHA_NUMERIC': 'all_non_latin_alpha_numeric'
};

const SHA_256_REGEX = /^[a-f0-9]{64}$/i;
const TRIM_REGEX = /^\s+|\s+$/g;

const STRIP_WHITESPACE_REGEX = /\s+/g;
// Punctuation characters: !'#$%&'()*+,-./:;<=>?@ [\]^_`{|}~
const STRIP_WHITESPACE_AND_PUNCTUATION_REGEX = /[!'#\$%&'\(\)\*\+,\-\.\/:;<=>\?@ \[\\\]\^_`\{\|\}~\s]+/g;
const STRIP_NON_LATIN_ALPHA_NUMERIC_REGEX = /\W+/g;

function isArray(obj: any): boolean {
  return obj != null && obj.constructor === Array;
}

function isString(obj: any): boolean {
  return typeof obj === 'string';
}

/**
 * Type-tolerating trimmer. Also, removes not just space-whitespace.
 */
function trim(obj: any): any {
  return (typeof obj === 'string')
    ? obj.replace(TRIM_REGEX, '')
    : undefined;
}

/**
 * Type-tolerating strip.
 */
function strip(
  obj: any,
  mode: string = STRIP_MODES.WHITESPACE_ONLY,
): any {
  let result;
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
function lower(obj: any): any {
  return typeof obj === 'string'
    ? obj.toLowerCase()
    : undefined;
}

function arrayDelete(arr: Array<any>, obj: any): Array<any> {
  const index = arr.indexOf(obj);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function addToArray(base: any, extension: any): Array<any> {
  if (isArray(extension)) {
    return isArray(base)
      ? base.push(...extension)
      : extension;
  } else {
    return isArray(base)
      ? base
      : [];
  }
}

function isObject(obj: any): boolean {
  return (
    Object.prototype.toString.call(obj) === '[object Object]'
  );
}

function hasProp(obj: any, key: string): boolean {
  return isObject(obj) && Object.prototype.hasOwnProperty.call(obj, key);
}


/**
 * Adds a value to head at path if value is not null or undefined.
 * If valu already existed at path, turn it into array and concat
 */
function addValueAtPath(head: Object, path: string, value: any): Object {
  const stack = path.split('.');

  if (value === undefined) {
    value = null;
  }

  for (let i = 0; i < stack.length - 1; i++) {
    const parentKey = stack.shift();
    head = head[parentKey] || (head[parentKey] = {});
  }
  const leafKey = stack[0];

  if (!hasProp(head, leafKey)) {
    head[leafKey] = value;
  } else {

    const currentValue = head[leafKey];

    if (isArray(currentValue)) {
      currentValue.push(value);
    } else {
      head[leafKey] = [currentValue, value];
    }
  }

  return head;
}

function looksLikeHashed(str: string): boolean {
  return SHA_256_REGEX.test(str);
}

function isFile(source: any): boolean {
  return (global.File && source instanceof File) || source instanceof Object;
}

function throwFatalError(
  message: string,
  detail: ?Object = null,
): void {
  throw new Error(`Fatal: ${message}, detail=${JSON.stringify(detail)}`);
}

module.exports = {
  addToArray,
  addValueAtPath,
  arrayDelete,
  hasProp,
  isArray,
  isFile,
  isObject,
  isString,
  looksLikeHashed,
  lower,
  strip,
  throwFatalError,
  trim,
  STRIP_MODES,
};
