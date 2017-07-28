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
exports.ERROR_NO_CA_ID_OR_ACT_ID = exports.ERROR_SAMPLE_NORMALIZATION_ERRORS = exports.ERROR_SAMPLE_MATCH_RATE_TOO_LOW = exports.ERROR_UNKNOWN_CONFIG_OPTION = exports.ERROR_REQUIRED_CONFIG_VALUE_INVALID = exports.ERROR_REQUIRED_CONFIG_OPTION_MISSING = exports.ERROR_CANNOT_PARSE_CONFIG_FILE = exports.UNSUPPORTED_MODE = exports.ERROR_NO_MODE = undefined;

var _FeedUploaderConstants = require('./FeedUploaderConstants');

var ERROR_NO_MODE = exports.ERROR_NO_MODE = {
  type: 'ERROR_NO_MODE',
  description: 'Command is not specified. Avaialbe ones are:\n' + _FeedUploaderConstants.SUPPORTED_MODES.join('\n') + '\n\nExample:\n\n' + 'marketing-data-file-uploader offline-conversions ' + '--columnMappingFilePath oca_column_mapping.json.example ' + '--configFilePath oca_file_uploader.conf.yml.example'
};
var UNSUPPORTED_MODE = exports.UNSUPPORTED_MODE = {
  type: 'UNSUPPORTED_MODE',
  description: 'Operation is unsupported in the current mode.' + ' This is likely due to a bug in the tool.'
};
var ERROR_CANNOT_PARSE_CONFIG_FILE = exports.ERROR_CANNOT_PARSE_CONFIG_FILE = {
  type: 'ERROR_CANNOT_PARSE_CONFIG_FILE',
  description: 'Failed to parse the configuration file'
};
var ERROR_REQUIRED_CONFIG_OPTION_MISSING = exports.ERROR_REQUIRED_CONFIG_OPTION_MISSING = {
  type: 'ERROR_REQUIRED_CONFIG_OPTION_MISSING',
  description: 'required config option not provided'
};
var ERROR_REQUIRED_CONFIG_VALUE_INVALID = exports.ERROR_REQUIRED_CONFIG_VALUE_INVALID = {
  type: 'ERROR_REQUIRED_CONFIG_VALUE_INVALID',
  description: 'config value provided is invalid'
};
var ERROR_UNKNOWN_CONFIG_OPTION = exports.ERROR_UNKNOWN_CONFIG_OPTION = {
  type: 'ERROR_UNKNOWN_CONFIG_OPTION',
  description: 'Unknown config option'
};
var ERROR_SAMPLE_MATCH_RATE_TOO_LOW = exports.ERROR_SAMPLE_MATCH_RATE_TOO_LOW = {
  type: 'ERROR_SAMPLE_MATCH_RATE_TOO_LOW',
  description: 'Match rate for sampled events is too low\n' + 'Please fix column mapping settings before trying again\n' + 'For additional information, please visit http://someurl.com'
};
var ERROR_SAMPLE_NORMALIZATION_ERRORS = exports.ERROR_SAMPLE_NORMALIZATION_ERRORS = {
  type: 'ERROR_SAMPLE_NORMALIZATION_ERRORS',
  description: 'Too many issues found in the sampled set of events'
};
var ERROR_NO_CA_ID_OR_ACT_ID = exports.ERROR_NO_CA_ID_OR_ACT_ID = {
  type: 'ERROR_NO_CA_ID_OR_ACT_ID',
  description: 'To upload a custom audience, either a custom audience id (for updating) ' + 'or an ad account id (for creating) is required'
};