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

Object.defineProperty(exports, "__esModule", {
  value: true
});

var GRAPH_API_BASE_URL = 'http://graph.facebook.com';

var datasetEndpoint = exports.datasetEndpoint = function datasetEndpoint(dataSetId, apiVer) {
  return GRAPH_API_BASE_URL + '/v' + apiVer + '/' + dataSetId;
};
