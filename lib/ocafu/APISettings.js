'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.datasetEndpoint = undefined;

var _FeedUploaderConstants = require('./FeedUploaderConstants');

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

var GRAPH_API_BASE_URL = 'https://graph.facebook.com';
var datasetEndpoint = exports.datasetEndpoint = function datasetEndpoint(dataSetId) {
  return GRAPH_API_BASE_URL + '/v' + _FeedUploaderConstants.MARKETING_API_VER + '/' + dataSetId;
};