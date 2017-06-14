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

var DEFAULT_COLUMN_MAPPING_FILE = exports.DEFAULT_COLUMN_MAPPING_FILE = 'oca_column_mapping.json';

var DEFAULT_CONFIG_FILE = exports.DEFAULT_CONFIG_FILE = 'oca_file_uploader.conf.yml';

var DEFAULT_DELIMITER_DETECT_SIZE = exports.DEFAULT_DELIMITER_DETECT_SIZE = 20;

var FILE_DELIMITERS = exports.FILE_DELIMITERS = [',', '\t', ' ', '|', ';'];

var MODE_OC = exports.MODE_OC = 'offline-conversions';

var MODE_CA = exports.MODE_CA = 'custom-audiences';

var SUPPORTED_MODES = exports.SUPPORTED_MODES = [MODE_OC, MODE_CA];

var MODE_ROW_NAMES = exports.MODE_ROW_NAMES = {};
MODE_ROW_NAMES[MODE_OC] = 'events';
MODE_ROW_NAMES[MODE_CA] = 'customer profiles';

var DEFAULT_APP_CONFIGS = exports.DEFAULT_APP_CONFIGS = {
  batchSize: 500,
  logging: 'info',
  uploadTagPrefix: 'Offline Conversions'
};

var MIN_TEST_SAMPLE_SIZE = exports.MIN_TEST_SAMPLE_SIZE = 100;

var LINE_BREAK_REGEX = exports.LINE_BREAK_REGEX = /\r\n?|\n/;

var NORMALIZATION_ERROR_THRESHOLD = exports.NORMALIZATION_ERROR_THRESHOLD = 0.1;

var MARKETING_API_VER = exports.MARKETING_API_VER = '2.9';