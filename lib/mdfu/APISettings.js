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
exports.createCAEndpoint = exports.datasetEndpoint = undefined;

var _FeedUploaderConstants = require('./FeedUploaderConstants');

var _ErrorTypes = require('./ErrorTypes');

var GRAPH_API_BASE_URL = 'https://graph.facebook.com';


var getApiVersion = function getApiVersion(configs) {
  return configs.apiVersion ? configs.apiVersion : _FeedUploaderConstants.MARKETING_API_VER;
};

var datasetEndpoint = exports.datasetEndpoint = function datasetEndpoint(configs) {
  var id = void 0,
      edge = void 0;
  switch (configs.mode) {
    case _FeedUploaderConstants.MODE_CA:
      id = configs.customAudienceId;
      edge = 'users';
      break;
    case _FeedUploaderConstants.MODE_OC:
      id = configs.dataSetId;
      edge = 'events';
      break;
    default:
      throw new Error(_ErrorTypes.UNSUPPORTED_MODE.description);
  }
  return GRAPH_API_BASE_URL + '/v' + getApiVersion(configs) + '/' + id + '/' + edge;
};

var createCAEndpoint = exports.createCAEndpoint = function createCAEndpoint(configs) {
  var id = configs.adAccountId;

  if (!id.match(/act_\d+/)) {
    id = 'act_' + id;
  }
  return GRAPH_API_BASE_URL + '/v' + getApiVersion(configs) + '/' + id + '/customaudiences';
};