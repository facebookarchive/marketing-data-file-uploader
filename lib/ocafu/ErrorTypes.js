'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * 
 */

var ERROR_CANNOT_PARSE_CONFIG_FILE = exports.ERROR_CANNOT_PARSE_CONFIG_FILE = 'Failed to parse the configuration file';
var ERROR_REQUIRED_CONFIG_OPTION_MISSING = exports.ERROR_REQUIRED_CONFIG_OPTION_MISSING = 'required config option not provided';
var ERROR_REQUIRED_CONFIG_VALUE_INVALID = exports.ERROR_REQUIRED_CONFIG_VALUE_INVALID = 'config value provided is invalid';
var ERROR_UNKNOWN_CONFIG_OPTION = exports.ERROR_UNKNOWN_CONFIG_OPTION = 'Unknown config option';
var ERROR_SAMPLE_MATCH_RATE_TOO_LOW = exports.ERROR_SAMPLE_MATCH_RATE_TOO_LOW = 'Match rate for sampled events is too low\n' + 'Please fix column mapping settings before trying again\n' + 'For additional information, please visit http://someurl.com';
var ERROR_SAMPLE_NORMALIZATION_ERRORS = exports.ERROR_SAMPLE_NORMALIZATION_ERRORS = 'Too many issues found in the sampled set of events';