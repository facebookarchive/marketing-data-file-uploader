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
export const DEFAULT_COLUMN_MAPPING_FILE = 'oca_column_mapping.json';

export const DEFAULT_CONFIG_FILE = 'oca_file_uploader.conf.yml';

export const DEFAULT_DELIMITER_DETECT_SIZE = 20;

export const FILE_DELIMITERS = [',', '\t', ' ', '|', ';'];

export const SUPPORTED_API_VERSIONS = ['2.8', '2.9'];

export const DEFAULT_APP_CONFIGS = {
  batchSize: 500,
  logging: 'info',
  uploadTagPrefix: 'Offline Conversions'
};

export const MIN_TEST_SAMPLE_SIZE = 100;

export const LINE_BREAK = /\r\n?|\n/;

export const NORMALIZATION_ERROR_THRESHOLD = 0.1;
