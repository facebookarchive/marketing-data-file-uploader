/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */
const path = require('path');

import { buildConfigs } from '../ConfigsBuilder';
import { DEFAULT_APP_CONFIGS } from '../FeedUploaderConstants';

const TEST_CONFIG_FILE_PATH = path.join(__dirname, 'test_config_reader.yml');
const TEST_COL_MAPPING_FILE_PATH
  = path.join(__dirname, 'test_column_mapping_file.json');

const TEST_SAMPLE_CONFIG = {
  mode: 'offline-conversions',
  accessToken: 'ABCDE',
  dataSetId: 38373873832838,
  inputFilePath: '/PATH/TO/FEED/FILE',
  fileDelimiter: ',',
  fileHasHeader: true,
  uploadTag: 'Offline Sales',
  uploadTagPrefix: 'Offline Conversions',
  batchSize: DEFAULT_APP_CONFIGS.batchSize,
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
  logging: 'info',
};

describe('buildConfigs', () => {
  it('should read config values from sources and merge them', () => {
    const {configs, err} = buildConfigs([
      'node',
      'OfflinConversionsFeedUploader.js',
      'offline-conversions',
      '--configFilePath', TEST_CONFIG_FILE_PATH,
      '--accessToken', 'ABCDE',
      '--columnMappingFilePath', TEST_COL_MAPPING_FILE_PATH,
    ]);
    expect(err).toBeNull();
    expect(configs).toEqual(TEST_SAMPLE_CONFIG);
  });

  it('should override values in file with command line args', () => {
    const {configs, err} = buildConfigs([
      'node',
      'OfflinConversionsFeedUploader.js',
      'offline-conversions',
      '--configFilePath', TEST_CONFIG_FILE_PATH,
      '--accessToken', 'ABCDE',
      '--inputFilePath', '/NEW/FILE/PATH'
    ]);
    expect(err).toBeNull();
    expect(configs.inputFilePath).toEqual('/NEW/FILE/PATH');
  });

  it('should ignore random arguments', () => {
    const {configs, err} = buildConfigs([
      'node',
      'OfflinConversionsFeedUploader.js',
      'offline-conversions',
      '--configFilePath', TEST_CONFIG_FILE_PATH,
      '--accessToken', 'ABCDE',
      '--inputFilePath', '/NEW/FILE/PATH',
      '--randomArg', 'randomArgValue',
    ]);
    expect(err).toBeNull();
    expect(configs.randomArg).toBeUndefined();
    expect(configs.unKnownOption).toBeUndefined();
  });
});
