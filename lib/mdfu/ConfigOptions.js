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
exports.CONFIG_OPTIONS = undefined;

var _FeedUploaderConstants = require('./FeedUploaderConstants');

var winston = require('winston');

var CONFIG_OPTIONS = exports.CONFIG_OPTIONS = [{
  field: 'accessToken',
  description: 'Access token for API call',
  optional: [_FeedUploaderConstants.MODE_VER],
  skip: [_FeedUploaderConstants.MODE_VER]
}, {
  field: 'dataSetId',
  validator: function validator(dataSetId) {
    return typeof dataSetId === 'string' ? dataSetId.match(/^\d+$/) : true;
  },
  description: 'ID of your offline event data set',
  optional: [_FeedUploaderConstants.MODE_VER, _FeedUploaderConstants.MODE_CA],
  skip: [_FeedUploaderConstants.MODE_VER, _FeedUploaderConstants.MODE_CA]
}, {
  field: 'customAudienceId',
  validator: function validator(customAudienceId) {
    return typeof customAudienceId === 'string' ? customAudienceId.match(/^\d+$/) : true;
  },
  description: 'ID of your custom audience',
  optional: [_FeedUploaderConstants.MODE_VER, _FeedUploaderConstants.MODE_OC, _FeedUploaderConstants.MODE_CA],
  skip: [_FeedUploaderConstants.MODE_VER, _FeedUploaderConstants.MODE_OC]
}, {
  field: 'adAccountId',
  validator: function validator(adAccountId) {
    return typeof adAccountId === 'string' ? adAccountId.match(/^\d+$/) : true;
  },
  description: 'ID of the ad account for which to create new custom audience',
  optional: [_FeedUploaderConstants.MODE_VER, _FeedUploaderConstants.MODE_OC, _FeedUploaderConstants.MODE_CA],
  skip: [_FeedUploaderConstants.MODE_VER, _FeedUploaderConstants.MODE_OC]
}, {
  field: 'fileDelimiter',
  validator: function validator(delim) {
    return _FeedUploaderConstants.FILE_DELIMITERS.find(function (supportedDelim) {
      return supportedDelim === delim;
    });
  },
  description: 'delimiter of your file. ex) comma(,) for CSV',
  optional: [_FeedUploaderConstants.MODE_VER],
  skip: [_FeedUploaderConstants.MODE_VER]
}, {
  field: 'uploadTag',
  description: 'Tag to identify the events uploaded ex) monthly in store uploads',
  optional: [_FeedUploaderConstants.MODE_OC, _FeedUploaderConstants.MODE_CA, _FeedUploaderConstants.MODE_VER],
  skip: [_FeedUploaderConstants.MODE_VER]
}, {
  field: 'uploadTagPrefix',
  description: 'If uploadTag is not provided, filename/timestamp is appended to' + ' uploadTagPrefix to identify each unique upload session.',
  optional: [_FeedUploaderConstants.MODE_OC, _FeedUploaderConstants.MODE_CA, _FeedUploaderConstants.MODE_VER],
  skip: [_FeedUploaderConstants.MODE_VER]
}, {
  field: 'columnMappingFilePath',
  description: 'File containing column mapping info',
  optional: [_FeedUploaderConstants.MODE_OC, _FeedUploaderConstants.MODE_CA, _FeedUploaderConstants.MODE_VER],
  skip: [_FeedUploaderConstants.MODE_VER]
}, {
  field: 'inputFilePath',
  description: 'File containing offline conversions data',
  optional: [_FeedUploaderConstants.MODE_VER],
  skip: [_FeedUploaderConstants.MODE_VER]
}, {
  field: 'configFilePath',
  description: 'File containing offline conversions data',
  optional: [_FeedUploaderConstants.MODE_OC, _FeedUploaderConstants.MODE_CA, _FeedUploaderConstants.MODE_VER],
  skip: [_FeedUploaderConstants.MODE_VER]
}, {
  field: 'silent',
  description: 'Silently process files without interacting externally',
  optional: [_FeedUploaderConstants.MODE_OC, _FeedUploaderConstants.MODE_CA, _FeedUploaderConstants.MODE_VER],
  skip: [_FeedUploaderConstants.MODE_VER]
}, {
  field: 'logging',
  validator: function validator(logging) {
    return typeof logging === 'string' && logging in winston.config.npm.levels;
  },
  description: 'Control the logging level of program',
  optional: [_FeedUploaderConstants.MODE_OC, _FeedUploaderConstants.MODE_CA, _FeedUploaderConstants.MODE_VER],
  skip: [_FeedUploaderConstants.MODE_VER]
}, {
  field: 'batchSize',
  description: 'Number of events included in each API request (1-2000)',
  optional: [_FeedUploaderConstants.MODE_OC, _FeedUploaderConstants.MODE_CA, _FeedUploaderConstants.MODE_VER],
  skip: [_FeedUploaderConstants.MODE_VER]
}, {
  field: 'testOnly',
  description: 'Run in test mode.  Check error rate on sampled data. Stop error rate is too high',
  optional: [_FeedUploaderConstants.MODE_OC, _FeedUploaderConstants.MODE_CA, _FeedUploaderConstants.MODE_VER],
  noValue: true,
  skip: [_FeedUploaderConstants.MODE_VER]
}];