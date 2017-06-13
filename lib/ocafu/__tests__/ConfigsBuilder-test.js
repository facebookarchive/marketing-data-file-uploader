'use strict';

var _ConfigsBuilder = require('../ConfigsBuilder');

var _FeedUploaderConstants = require('../FeedUploaderConstants');

/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */
var path = require('path');

var TEST_CONFIG_FILE_PATH = path.join(__dirname, 'test_config_reader.yml');
var TEST_COL_MAPPING_FILE_PATH = path.join(__dirname, 'test_column_mapping_file.json');

var TEST_SAMPLE_CONFIG = {
  mode: 'offline-conversions',
  accessToken: 'ABCDE',
  dataSetId: 38373873832838,
  inputFilePath: '/PATH/TO/FEED/FILE',
  fileDelimiter: ',',
  fileHasHeader: true,
  uploadTag: 'Offline Sales',
  uploadTagPrefix: 'Offline Conversions',
  batchSize: _FeedUploaderConstants.DEFAULT_APP_CONFIGS.batchSize,
  configFilePath: TEST_CONFIG_FILE_PATH,
  columnMappingFilePath: TEST_COL_MAPPING_FILE_PATH,
  colMappingInfo: {
    mapping: {
      0: 'match_keys.email',
      13: 'match_keys.dob',
      17: 'event_name',
      18: 'event_time',
      19: 'value',
      20: 'currency',
      21: 'custom_data.store_num'
    },
    infoForNormalization: {
      dob: 'MM/DD/YY',
      event_time: {
        timeFormat: 'ISO8601'
      }
    },
    customTypeInfo: {
      store_num: {
        key: 'store_num',
        baseType: 'number'
      }
    }
  },
  logging: 'info'
};

describe('buildConfigs', function () {
  it('should read config values from sources and merge them', function () {
    var _buildConfigs = (0, _ConfigsBuilder.buildConfigs)(['node', 'OfflinConversionsFeedUploader.js', 'offline-conversions', '--configFilePath', TEST_CONFIG_FILE_PATH, '--accessToken', 'ABCDE', '--columnMappingFilePath', TEST_COL_MAPPING_FILE_PATH]),
        configs = _buildConfigs.configs,
        err = _buildConfigs.err;

    expect(err).toBeNull();
    expect(configs).toEqual(TEST_SAMPLE_CONFIG);
  });

  it('should override values in file with command line args', function () {
    var _buildConfigs2 = (0, _ConfigsBuilder.buildConfigs)(['node', 'OfflinConversionsFeedUploader.js', 'offline-conversions', '--configFilePath', TEST_CONFIG_FILE_PATH, '--accessToken', 'ABCDE', '--inputFilePath', '/NEW/FILE/PATH']),
        configs = _buildConfigs2.configs,
        err = _buildConfigs2.err;

    expect(err).toBeNull();
    expect(configs.inputFilePath).toEqual('/NEW/FILE/PATH');
  });

  it('should ignore random arguments', function () {
    var _buildConfigs3 = (0, _ConfigsBuilder.buildConfigs)(['node', 'OfflinConversionsFeedUploader.js', 'offline-conversions', '--configFilePath', TEST_CONFIG_FILE_PATH, '--accessToken', 'ABCDE', '--inputFilePath', '/NEW/FILE/PATH', '--randomArg', 'randomArgValue']),
        configs = _buildConfigs3.configs,
        err = _buildConfigs3.err;

    expect(err).toBeNull();
    expect(configs.randomArg).toBeUndefined();
    expect(configs.unKnownOption).toBeUndefined();
  });
});