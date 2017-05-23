/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

'use strict';

function arrayToObject(arr: Array<string>): Object {
  const object = {};
  for (let i = 0; i < arr.length; i++) {
    object[i] = arr[i];
  }
  return object;
}

module.exports = {
  arrayToObject,
};
