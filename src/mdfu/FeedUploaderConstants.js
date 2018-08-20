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

export const DEFAULT_DELIMITER_DETECT_SIZE = 20;

export const FILE_DELIMITERS = [',', '\t', ' ', '|', ';'];

export const MODE_OC = 'offline-conversions';
export const MODE_CA = 'custom-audiences';
export const MODE_VER = 'version';

export const SUPPORTED_MODES = [MODE_OC, MODE_CA, MODE_VER];

export const MODE_ROW_NAMES = {};
MODE_ROW_NAMES[MODE_OC] = 'events';
MODE_ROW_NAMES[MODE_CA] = 'customer profiles';

export const DEFAULT_COLUMN_MAPPING_FILE = {};
DEFAULT_COLUMN_MAPPING_FILE[MODE_OC] = 'oca_column_mapping.json';
DEFAULT_COLUMN_MAPPING_FILE[MODE_CA] = 'ca_column_mapping.json';

export const DEFAULT_CONFIG_FILE = {};
DEFAULT_CONFIG_FILE[MODE_OC] = 'oca_file_uploader.conf.yml';
DEFAULT_CONFIG_FILE[MODE_CA] = 'ca_file_uploader.conf.yml';

export const DEFAULT_APP_CONFIGS = {
  batchSize: 500,
  logging: 'info',
  uploadTagPrefix: 'MDFU'
};

export const MIN_TEST_SAMPLE_SIZE = 100;

export const LINE_BREAK_REGEX = /\r\n?|\n/;

export const NORMALIZATION_ERROR_THRESHOLD = 0.1;

export const MARKETING_API_VER = '3.1';
