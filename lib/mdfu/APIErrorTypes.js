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

Object.defineProperty(exports, "__esModule", {
  value: true
});

var API_ERROR_SUBCODE_OVERLAPPED_PROGRESS = exports.API_ERROR_SUBCODE_OVERLAPPED_PROGRESS = 2044011;

var get = function get(path) {
  return function (object) {
    return path.reduce(function (xs, x) {
      return xs && xs[x] ? xs[x] : null;
    }, object);
  };
};

var getErrorSubcode = exports.getErrorSubcode = get(['error', 'error_subcode']);